/* ==========================================
   MEJAVI WAREHOUSE — WEBSITE ADS MANAGER
========================================== */

(function () {
  "use strict";

  const SUPABASE_URL = "https://yqutzzhkuuehvmuqzjvb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_l9pctpDmJMd6xnpZWKwx5g_OhRajIql";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
  const STORAGE_URL = `${SUPABASE_URL}/storage/v1`;
  const SESSION_KEY = "mejavi_admin_session_v1";
  const STORAGE_BUCKET = "product-images";
  const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
  const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

  const state = {
    session: null,
    profile: null,
    ads: [],
    selectedId: null,
    busy: false,
    toastTimer: null
  };

  const $ = (selector) => document.querySelector(selector);

  function showToast(message, type = "success") {
    const toast = $("#toast");
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.className = `toast show${type === "error" ? " error" : ""}`;
    state.toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function setBusy(busy) {
    state.busy = busy;
    ["#loginButton", "#saveAdButton", "#deleteAdButton", "#newAdButton", "#resetFormButton"].forEach((selector) => {
      const button = $(selector);
      if (button) button.disabled = busy;
    });
  }

  function readSession() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      return session?.access_token && session?.refresh_token ? session : null;
    } catch (_error) {
      return null;
    }
  }

  function storeSession(payload) {
    state.session = {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      expires_at: Date.now() + Math.max(30, Number(payload.expires_in || 3600) - 30) * 1000
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(state.session));
  }

  function clearSession() {
    state.session = null;
    state.profile = null;
    localStorage.removeItem(SESSION_KEY);
  }

  async function authRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return fetch(`${AUTH_URL}${path}`, { ...options, headers });
  }

  async function refreshSession() {
    if (!state.session?.refresh_token) return false;
    const response = await authRequest("/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: state.session.refresh_token })
    });
    if (!response.ok) {
      clearSession();
      return false;
    }
    storeSession(await response.json());
    return true;
  }

  async function ensureSession() {
    if (!state.session) return false;
    if (Number(state.session.expires_at || 0) > Date.now()) return true;
    return refreshSession();
  }

  async function apiRequest(path, options = {}, retry = true) {
    if (!(await ensureSession())) throw new Error("Sesi login telah berakhir.");
    const headers = new Headers(options.headers || {});
    headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
    headers.set("Authorization", `Bearer ${state.session.access_token}`);
    headers.set("Accept", "application/json");
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(`${REST_URL}${path}`, { ...options, headers });
    if (response.status === 401 && retry && (await refreshSession())) {
      return apiRequest(path, options, false);
    }
    return response;
  }

  async function signIn(email, password) {
    const response = await authRequest("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.access_token) {
      throw new Error(payload.error_description || payload.msg || "Email atau password tidak sesuai.");
    }
    storeSession(payload);
  }

  function currentUserId() {
    try {
      const segment = state.session.access_token.split(".")[1];
      const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
      return JSON.parse(atob(padded)).sub || "";
    } catch (_error) {
      return "";
    }
  }

  async function loadProfile() {
    const id = currentUserId();
    if (!id) throw new Error("Identitas akun tidak dapat diverifikasi.");
    const response = await apiRequest(`/profiles?id=eq.${encodeURIComponent(id)}&select=id,full_name,email,role,approval_status,is_disabled&limit=1`);
    const rows = await response.json().catch(() => []);
    if (!response.ok) throw new Error(rows.message || "Profil tidak dapat dibaca.");
    const profile = rows[0];
    if (!profile || profile.role !== "head_warehouse" || profile.approval_status !== "active" || profile.is_disabled) {
      throw new Error("Akses iklan hanya untuk Kepala Gudang aktif.");
    }
    state.profile = profile;
  }

  function safeUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin === window.location.origin || url.protocol === "https:") return url.href;
    } catch (_error) {
      return "";
    }
    return "";
  }

  function localDateTimeValue(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
  }

  function isoOrNull(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  }

  function adStatus(ad) {
    if (!ad.is_active) return { live: false, label: "Nonaktif" };
    const now = Date.now();
    if (ad.starts_at && new Date(ad.starts_at).getTime() > now) return { live: false, label: "Terjadwal" };
    if (ad.ends_at && new Date(ad.ends_at).getTime() <= now) return { live: false, label: "Selesai" };
    return { live: true, label: "Tayang" };
  }

  async function loadAds() {
    const response = await apiRequest("/homepage_ads?select=*&order=sort_order.asc,created_at.desc");
    const rows = await response.json().catch(() => []);
    if (!response.ok) throw new Error(rows.message || "Daftar iklan gagal dimuat.");
    state.ads = Array.isArray(rows) ? rows : [];
    renderAdList();
  }

  function renderAdList() {
    const root = $("#adList");
    $("#adCount").textContent = `${state.ads.length} iklan`;
    root.replaceChildren();

    if (!state.ads.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "Belum ada iklan. Buat iklan pertama untuk beranda.";
      root.appendChild(empty);
      return;
    }

    state.ads.forEach((ad) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `ad-item${ad.id === state.selectedId ? " active" : ""}`;
      button.dataset.adId = ad.id;

      const img = document.createElement("img");
      img.className = "ad-thumb";
      img.alt = "";
      const imageUrl = safeUrl(ad.image_url);
      if (imageUrl) img.src = imageUrl;

      const meta = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = ad.title || "Tanpa judul";
      const order = document.createElement("small");
      order.textContent = `Urutan ${Number(ad.sort_order || 0)}`;
      const statusData = adStatus(ad);
      const status = document.createElement("span");
      status.className = `status${statusData.live ? " live" : ""}`;
      const dot = document.createElement("i");
      dot.className = "dot";
      status.append(dot, document.createTextNode(statusData.label));
      meta.append(title, order, status);
      button.append(img, meta);
      root.appendChild(button);
    });
  }

  function selectedAd() {
    return state.ads.find((ad) => ad.id === state.selectedId) || null;
  }

  function updatePreview(url) {
    const root = $("#imagePreview");
    root.replaceChildren();
    const safe = safeUrl(url);
    if (!safe) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "Preview gambar iklan";
      root.appendChild(placeholder);
      return;
    }
    const img = document.createElement("img");
    img.src = safe;
    img.alt = "Preview iklan";
    root.appendChild(img);
  }

  function resetForm({ keepSelection = false } = {}) {
    if (!keepSelection) state.selectedId = null;
    $("#formTitle").textContent = state.selectedId ? "Edit Iklan" : "Iklan Baru";
    $("#saveState").textContent = "Belum disimpan";
    $("#adTitle").value = "";
    $("#adSubtitle").value = "";
    $("#adImageFile").value = "";
    $("#adImageUrl").value = "";
    $("#adAltText").value = "Promo Mejavi Skin+";
    $("#adTargetUrl").value = "";
    $("#adCtaLabel").value = "Lihat promo";
    $("#adSortOrder").value = "0";
    $("#adStartsAt").value = "";
    $("#adEndsAt").value = "";
    $("#adIsActive").checked = false;
    $("#formError").textContent = "";
    $("#deleteAdButton").classList.toggle("hidden", !state.selectedId);
    updatePreview("");
    renderAdList();
  }

  function fillForm(ad) {
    state.selectedId = ad.id;
    $("#formTitle").textContent = "Edit Iklan";
    $("#saveState").textContent = "Tersimpan";
    $("#adTitle").value = ad.title || "";
    $("#adSubtitle").value = ad.subtitle || "";
    $("#adImageFile").value = "";
    $("#adImageUrl").value = ad.image_url || "";
    $("#adAltText").value = ad.alt_text || "Promo Mejavi Skin+";
    $("#adTargetUrl").value = ad.target_url || "";
    $("#adCtaLabel").value = ad.cta_label || "";
    $("#adSortOrder").value = String(ad.sort_order ?? 0);
    $("#adStartsAt").value = localDateTimeValue(ad.starts_at);
    $("#adEndsAt").value = localDateTimeValue(ad.ends_at);
    $("#adIsActive").checked = Boolean(ad.is_active);
    $("#formError").textContent = "";
    $("#deleteAdButton").classList.remove("hidden");
    updatePreview(ad.image_url);
    renderAdList();
  }

  function collectPayload() {
    const title = $("#adTitle").value.trim();
    const imageUrl = safeUrl($("#adImageUrl").value);
    const altText = $("#adAltText").value.trim();
    const targetRaw = $("#adTargetUrl").value.trim();
    const targetUrl = targetRaw ? safeUrl(targetRaw) : "";
    const startsAt = isoOrNull($("#adStartsAt").value);
    const endsAt = isoOrNull($("#adEndsAt").value);

    if (!title) throw new Error("Judul iklan wajib diisi.");
    if (!imageUrl) throw new Error("Upload gambar atau isi URL gambar HTTPS yang valid.");
    if (!altText) throw new Error("Alt text gambar wajib diisi.");
    if (targetRaw && !targetUrl) throw new Error("Link tujuan harus berupa URL HTTPS yang valid.");
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      throw new Error("Tanggal selesai harus setelah tanggal mulai.");
    }

    return {
      title,
      subtitle: $("#adSubtitle").value.trim() || null,
      image_url: imageUrl,
      alt_text: altText,
      target_url: targetUrl || null,
      cta_label: $("#adCtaLabel").value.trim() || null,
      placement: "home",
      sort_order: Math.max(-1000, Math.min(1000, Number($("#adSortOrder").value || 0))),
      is_active: $("#adIsActive").checked,
      starts_at: startsAt,
      ends_at: endsAt
    };
  }

  function encodeStoragePath(path) {
    return path.split("/").map(encodeURIComponent).join("/");
  }

  async function uploadCreative(file) {
    if (!file) return "";
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error("Format gambar harus JPG, PNG, atau WebP.");
    if (file.size > MAX_IMAGE_BYTES) throw new Error("Ukuran gambar maksimal 3 MB.");
    if (!(await ensureSession())) throw new Error("Sesi login telah berakhir.");

    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const objectPath = `ads/${Date.now()}-${id}.${extension}`;
    const response = await fetch(`${STORAGE_URL}/object/${STORAGE_BUCKET}/${encodeStoragePath(objectPath)}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${state.session.access_token}`,
        "Content-Type": file.type,
        "x-upsert": "false"
      },
      body: file
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || "Upload gambar gagal.");
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodeStoragePath(objectPath)}`;
  }

  async function saveAd(event) {
    event.preventDefault();
    if (state.busy) return;
    $("#formError").textContent = "";
    setBusy(true);
    $("#saveState").textContent = "Menyimpan…";

    try {
      const file = $("#adImageFile").files?.[0];
      if (file) {
        const uploadedUrl = await uploadCreative(file);
        $("#adImageUrl").value = uploadedUrl;
        updatePreview(uploadedUrl);
      }

      const payload = collectPayload();
      const editing = Boolean(state.selectedId);
      const path = editing
        ? `/homepage_ads?id=eq.${encodeURIComponent(state.selectedId)}&select=*`
        : "/homepage_ads?select=*";
      const response = await apiRequest(path, {
        method: editing ? "PATCH" : "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(payload)
      });
      const rows = await response.json().catch(() => []);
      if (!response.ok || !rows[0]) throw new Error(rows.message || "Iklan gagal disimpan.");
      state.selectedId = rows[0].id;
      await loadAds();
      fillForm(state.ads.find((ad) => ad.id === state.selectedId) || rows[0]);
      showToast(editing ? "Iklan berhasil diperbarui." : "Iklan berhasil dibuat.");
    } catch (error) {
      $("#saveState").textContent = "Gagal menyimpan";
      $("#formError").textContent = error.message || "Iklan gagal disimpan.";
      showToast(error.message || "Iklan gagal disimpan.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAd() {
    const ad = selectedAd();
    if (!ad || state.busy) return;
    if (!window.confirm(`Hapus iklan “${ad.title}”?`)) return;
    setBusy(true);
    try {
      const response = await apiRequest(`/homepage_ads?id=eq.${encodeURIComponent(ad.id)}`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" }
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Iklan gagal dihapus.");
      }
      state.selectedId = null;
      await loadAds();
      resetForm();
      showToast("Iklan berhasil dihapus.");
    } catch (error) {
      showToast(error.message || "Iklan gagal dihapus.", "error");
    } finally {
      setBusy(false);
    }
  }

  function showLogin() {
    $("#authView").classList.remove("hidden");
    $("#adsApp").classList.add("hidden");
  }

  function showApp() {
    $("#authView").classList.add("hidden");
    $("#adsApp").classList.remove("hidden");
  }

  async function initializeAuthenticatedApp() {
    await loadProfile();
    await loadAds();
    showApp();
    resetForm();
  }

  $("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.busy) return;
    const email = $("#loginEmail").value.trim();
    const password = $("#loginPassword").value;
    $("#loginError").textContent = "";
    setBusy(true);
    try {
      await signIn(email, password);
      await initializeAuthenticatedApp();
      $("#loginPassword").value = "";
    } catch (error) {
      clearSession();
      $("#loginError").textContent = error.message || "Login gagal.";
    } finally {
      setBusy(false);
    }
  });

  $("#logoutButton").addEventListener("click", () => {
    clearSession();
    showLogin();
  });

  $("#newAdButton").addEventListener("click", () => resetForm());
  $("#resetFormButton").addEventListener("click", () => {
    const ad = selectedAd();
    if (ad) fillForm(ad);
    else resetForm();
  });
  $("#deleteAdButton").addEventListener("click", deleteAd);
  $("#adForm").addEventListener("submit", saveAd);
  $("#adImageUrl").addEventListener("input", (event) => updatePreview(event.target.value));
  $("#adImageFile").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
      $("#formError").textContent = "Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 3 MB.";
      event.target.value = "";
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updatePreview(previewUrl);
    window.setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
  });
  $("#adList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-ad-id]");
    if (!button) return;
    const ad = state.ads.find((item) => item.id === button.dataset.adId);
    if (ad) fillForm(ad);
  });

  (async function bootstrap() {
    state.session = readSession();
    if (!state.session) {
      showLogin();
      return;
    }
    try {
      await initializeAuthenticatedApp();
    } catch (_error) {
      clearSession();
      showLogin();
    }
  })();
})();
