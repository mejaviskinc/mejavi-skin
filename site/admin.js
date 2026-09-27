/* ==========================================
   MEJAVI WEBSITE BACKEND
========================================== */

(function () {
  "use strict";

  const SUPABASE_URL = "https://yqutzzhkuuehvmuqzjvb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_l9pctpDmJMd6xnpZWKwx5g_OhRajIql";
  const SESSION_KEY = "mejavi_admin_session_v1";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const AUTH_URL = `${SUPABASE_URL}/auth/v1`;

  const sectionTitles = {
    dashboard: "Ringkasan",
    homepage: "Beranda",
    products: "Produk",
    ingredients: "Ingredients",
    contact: "Kontak",
    "all-text": "Semua Teks",
    publish: "Publikasi"
  };

  const homeGroups = [
    {
      title: "Hero Beranda",
      description: "Pesan pertama yang dilihat pengunjung ketika membuka website.",
      fields: [
        ["heroTag", "Label kecil", "input"],
        ["heroDesc", "Deskripsi utama", "textarea"],
        ["shopNow", "Teks tombol belanja", "input"],
        ["watchVideo", "Teks tombol video", "input"]
      ],
      hero: true
    },
    {
      title: "Tentang Mejavi",
      description: "Ringkasan brand pada bagian awal website.",
      fields: [
        ["aboutTag", "Label bagian", "input"],
        ["aboutTitle", "Judul", "textarea"],
        ["aboutDesc1", "Deskripsi pertama", "textarea"],
        ["aboutDesc2", "Deskripsi kedua", "textarea"],
        ["aboutQuote", "Kutipan brand", "textarea"]
      ]
    },
    {
      title: "Empat Keunggulan",
      description: "Konten kartu Daily Skincare, Skin Comfort, Selected Ingredients, dan Self Care.",
      fields: [
        ["benefit1Title", "Judul keunggulan 1", "input"],
        ["benefit1Desc", "Deskripsi keunggulan 1", "textarea"],
        ["benefit2Title", "Judul keunggulan 2", "input"],
        ["benefit2Desc", "Deskripsi keunggulan 2", "textarea"],
        ["benefit3Title", "Judul keunggulan 3", "input"],
        ["benefit3Desc", "Deskripsi keunggulan 3", "textarea"],
        ["benefit4Title", "Judul keunggulan 4", "input"],
        ["benefit4Desc", "Deskripsi keunggulan 4", "textarea"]
      ]
    },
    {
      title: "BPOM & Referensi Kolagen",
      description: "Informasi keamanan produk dan dokumen edukasi kolagen sapi.",
      fields: [
        ["bpomKicker", "Label BPOM", "input"],
        ["bpomTitle", "Judul BPOM", "input"],
        ["bpomDesc", "Deskripsi BPOM", "textarea"],
        ["collagenKicker", "Label referensi", "input"],
        ["collagenTitle", "Judul referensi", "input"],
        ["collagenDesc", "Deskripsi referensi", "textarea"]
      ]
    },
    {
      title: "Produk, Ingredients & Video",
      description: "Judul dan pengantar untuk bagian konten utama lainnya.",
      fields: [
        ["productTitle", "Judul produk", "textarea"],
        ["productSubtitle", "Deskripsi produk", "textarea"],
        ["ingredientTitle", "Judul ingredients", "textarea"],
        ["ingredientDesc", "Deskripsi ingredients", "textarea"],
        ["videoTitle", "Judul video", "textarea"],
        ["videoDesc", "Deskripsi video", "textarea"]
      ]
    }
  ];

  const state = {
    defaultContent: null,
    content: null,
    record: null,
    session: null,
    profile: null,
    editorLanguage: "id",
    activeSection: "dashboard",
    activeProduct: 0,
    activeIngredient: 0,
    dirty: false,
    busy: false,
    toastTimer: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function mergeContent(base, incoming) {
    if (!isObject(incoming)) return base;
    Object.entries(incoming).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        base[key] = clone(value);
      } else if (isObject(value)) {
        if (!isObject(base[key])) base[key] = {};
        mergeContent(base[key], value);
      } else {
        base[key] = value;
      }
    });
    return base;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function humanizeKey(key) {
    return String(key)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/(\D)(\d+)/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase());
  }

  function getPath(root, path) {
    return String(path)
      .split(".")
      .filter(Boolean)
      .reduce((current, part) => current?.[part], root);
  }

  function setPath(root, path, value) {
    const parts = String(path).split(".").filter(Boolean);
    const finalKey = parts.pop();
    let current = root;
    parts.forEach((part, index) => {
      if (current[part] === undefined || current[part] === null) {
        const nextPart = parts[index + 1] ?? finalKey;
        current[part] = /^\d+$/.test(nextPart || "") ? [] : {};
      }
      current = current[part];
    });
    current[finalKey] = value;
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

  function formatDate(value, includeTime = true) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      ...(includeTime ? { timeStyle: "short" } : {})
    }).format(date);
  }

  function showToast(message, type = "success") {
    const toast = $("#adminToast");
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.className = `toast show${type === "error" ? " error" : ""}`;
    state.toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 3400);
  }

  function setBusy(isBusy) {
    state.busy = isBusy;
    [
      "#saveDraftButton",
      "#publishButton",
      "[data-mobile-save]",
      "[data-mobile-publish]",
      "[data-publish-save]",
      "[data-publish-now]"
    ].forEach((selector) => {
      $$(selector).forEach((button) => {
        button.disabled = isBusy;
      });
    });
  }

  function setDirty(dirty = true) {
    state.dirty = dirty;
    const indicator = $("#saveState");
    indicator.className = `save-state${dirty ? " dirty" : ""}`;
    indicator.innerHTML = `<i></i>${dirty ? "Belum disimpan" : "Tersimpan"}`;
  }

  function setSaveState(label, className = "") {
    const indicator = $("#saveState");
    indicator.className = `save-state ${className}`.trim();
    indicator.innerHTML = `<i></i>${escapeHtml(label)}`;
  }

  function renderField({ label, path, value, type = "input", help = "", full = false, disabled = false, valueType = "string", rows = 4 }) {
    const classes = `field${full ? " field-full" : ""}`;
    const attributes = `data-content-path="${escapeHtml(path)}" data-value-type="${escapeHtml(valueType)}"${disabled ? " disabled" : ""}`;
    const control = type === "textarea"
      ? `<textarea rows="${rows}" ${attributes}>${escapeHtml(value)}</textarea>`
      : `<input type="${type === "number" ? "number" : type === "url" ? "url" : "text"}" value="${escapeHtml(value)}" ${attributes}>`;

    return `<label class="${classes}">
      <span class="field-label">${escapeHtml(label)}</span>
      ${control}
      ${help ? `<small class="field-help">${escapeHtml(help)}</small>` : ""}
    </label>`;
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
    if (!(await ensureSession())) throw new Error("Sesi login telah berakhir. Silakan masuk kembali.");

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

  async function loadProfile() {
    const userId = currentUserId();
    if (!userId) throw new Error("Identitas akun tidak dapat diverifikasi.");
    const response = await apiRequest(
      `/profiles?id=eq.${encodeURIComponent(userId)}&select=id,full_name,email,role,approval_status,is_disabled&limit=1`
    );
    const rows = await response.json().catch(() => []);
    if (!response.ok) throw new Error(rows.message || "Profil admin tidak dapat dibaca.");

    const profile = rows[0];
    if (
      !profile ||
      profile.role !== "head_warehouse" ||
      profile.approval_status !== "active" ||
      profile.is_disabled
    ) {
      throw new Error("Akun ini tidak memiliki izin Kepala Gudang untuk mengelola website.");
    }
    state.profile = profile;
  }

  async function loadContentRecord() {
    const response = await apiRequest(
      "/website_content?key=eq.main&select=key,draft_content,published_content,version,updated_at,published_at,updated_by&limit=1"
    );
    const rows = await response.json().catch(() => []);
    if (!response.ok) throw new Error(rows.message || "Konten backend tidak dapat dimuat.");
    if (!rows[0]) throw new Error("Data website belum tersedia di backend.");

    state.record = rows[0];
    const draft = isObject(state.record.draft_content) && Object.keys(state.record.draft_content).length
      ? state.record.draft_content
      : isObject(state.record.published_content) && Object.keys(state.record.published_content).length
        ? state.record.published_content
        : {};
    state.content = mergeContent(clone(state.defaultContent), draft);
    state.activeProduct = Math.min(state.activeProduct, Math.max(0, state.content.products.length - 1));
    state.activeIngredient = Math.min(state.activeIngredient, Math.max(0, state.content.keyIngredients.length - 1));
  }

  function validateContent() {
    if (!state.content?.products?.length) return "Website harus memiliki minimal satu produk.";
    if (!state.content?.keyIngredients?.length) return "Website harus memiliki minimal satu ingredient.";

    for (const product of state.content.products) {
      if (!String(product.id || "").trim()) return "Setiap produk harus memiliki ID produk.";
      if (!String(product.name?.id || "").trim()) return "Nama Indonesia setiap produk wajib diisi.";
      if (!String(product.name?.en || "").trim()) return "Nama Inggris setiap produk wajib diisi.";
      if (!Array.isArray(product.variants) || !product.variants.length) {
        return `${product.name.id} harus memiliki minimal satu varian.`;
      }
    }

    const duplicateIds = state.content.products
      .map((product) => product.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index);
    if (duplicateIds.length) return `ID produk harus unik: ${duplicateIds[0]}`;
    return "";
  }

  async function saveDraft({ quiet = false } = {}) {
    if (state.busy) return false;
    const validationError = validateContent();
    if (validationError) {
      showToast(validationError, "error");
      return false;
    }

    setBusy(true);
    setSaveState("Menyimpan…", "saving");
    try {
      const response = await apiRequest("/website_content?key=eq.main&select=key,version,updated_at,published_at", {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ draft_content: state.content })
      });
      const rows = await response.json().catch(() => []);
      if (!response.ok || !rows[0]) throw new Error(rows.message || "Draft gagal disimpan.");
      state.record = { ...state.record, ...rows[0], draft_content: clone(state.content) };
      setDirty(false);
      updateDashboard();
      if (!quiet) showToast("Draft berhasil disimpan.");
      return true;
    } catch (error) {
      setSaveState("Gagal menyimpan", "error");
      showToast(error.message || "Draft gagal disimpan.", "error");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function publishContent() {
    if (state.busy) return;
    const validationError = validateContent();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setBusy(true);
    setSaveState("Mempublikasikan…", "saving");
    try {
      const expectedVersion = Number(state.record.version || 0);
      const publishedAt = new Date().toISOString();
      const response = await apiRequest(
        `/website_content?key=eq.main&version=eq.${expectedVersion}&select=key,version,updated_at,published_at`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            draft_content: state.content,
            published_content: state.content,
            version: expectedVersion + 1,
            published_at: publishedAt
          })
        }
      );
      const rows = await response.json().catch(() => []);
      if (!response.ok) throw new Error(rows.message || "Konten gagal dipublikasikan.");
      if (!rows[0]) throw new Error("Versi website berubah. Muat ulang backend lalu coba lagi.");

      state.record = {
        ...state.record,
        ...rows[0],
        draft_content: clone(state.content),
        published_content: clone(state.content)
      };
      setDirty(false);
      updateDashboard();
      showToast("Pembaruan berhasil dipublikasikan ke website.");
    } catch (error) {
      setSaveState("Gagal mempublikasikan", "error");
      showToast(error.message || "Konten gagal dipublikasikan.", "error");
    } finally {
      setBusy(false);
    }
  }

  function showLogin() {
    $("#authView").hidden = false;
    $("#adminApp").hidden = true;
  }

  function showAdmin() {
    $("#authView").hidden = true;
    $("#adminApp").hidden = false;
    const name = state.profile.full_name || "Admin Mejavi";
    $("#sidebarUserName").textContent = name;
    $("#welcomeName").textContent = name.split(" ")[0];
    $("#userInitial").textContent = name.trim().charAt(0).toUpperCase() || "M";
    renderEverything();
  }

  function updateDashboard() {
    if (!state.content || !state.record) return;
    const version = Number(state.record.version || 0);
    $("#dashboardVersion").textContent = version;
    $("#dashboardProducts").textContent = state.content.products.length;
    $("#dashboardIngredients").textContent = state.content.keyIngredients.length;
    $("#dashboardPublishedAt").textContent = state.record.published_at
      ? `Terakhir terbit ${formatDate(state.record.published_at)}`
      : "Belum pernah dipublikasikan dari backend";
    $("#publishVersion").textContent = version;
    $("#publishUpdatedAt").textContent = formatDate(state.record.updated_at);
    $("#publishPublishedAt").textContent = formatDate(state.record.published_at);
  }

  function parseHeroTitle(value) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${String(value || "")}</div>`, "text/html");
    const lead = doc.querySelector(".hero-title-lead")?.textContent || "";
    const main = doc.querySelector(".hero-title-main")?.textContent || doc.body.textContent || "";
    return { lead: lead.trim(), main: main.trim() };
  }

  function renderHomepage() {
    const language = state.editorLanguage;
    const translations = state.content.translations[language];
    const hero = parseHeroTitle(translations.heroTitle);
    const root = $("#homepageEditor");

    root.innerHTML = homeGroups.map((group) => {
      const heroFields = group.hero
        ? `<div class="form-grid">
            <label class="field"><span class="field-label">Baris judul pertama</span><input type="text" value="${escapeHtml(hero.lead)}" data-hero-part="lead"></label>
            <label class="field"><span class="field-label">Baris judul utama</span><input type="text" value="${escapeHtml(hero.main)}" data-hero-part="main"></label>
          </div>`
        : "";

      return `<section class="editor-section">
        <div class="editor-section-heading"><div><h2>${escapeHtml(group.title)}</h2><p>${escapeHtml(group.description)}</p></div></div>
        ${heroFields}
        <div class="form-grid${heroFields ? " hero-following-fields" : ""}">
          ${group.fields.map(([key, label, type]) => renderField({
            label,
            path: `translations.${language}.${key}`,
            value: translations[key] || "",
            type,
            full: type === "textarea"
          })).join("")}
        </div>
      </section>`;
    }).join("");
  }

  function renderProductList() {
    const root = $("#productList");
    root.innerHTML = state.content.products.map((product, index) => `
      <button type="button" class="${index === state.activeProduct ? "active" : ""}" data-select-product="${index}">
        ${product.image ? `<img src="${escapeHtml(product.image)}" alt="">` : `<span class="record-placeholder">P</span>`}
        <span><strong>${escapeHtml(product.name?.id || "Produk tanpa nama")}</strong><small>${escapeHtml(product.variants?.[0]?.sku || product.id || "Belum ada SKU")}</small></span>
      </button>`).join("");
  }

  function ensureProductShape(product) {
    product.category ||= { id: "", en: "" };
    product.name ||= { id: "", en: "" };
    product.description ||= { id: "", en: "" };
    product.benefits ||= { id: "", en: "" };
    product.ingredients ||= { id: "", en: "" };
    product.how ||= { id: "", en: "" };
    product.variants ||= [];
  }

  function renderProductEditor() {
    const root = $("#productEditor");
    const index = state.activeProduct;
    const product = state.content.products[index];
    if (!product) {
      root.innerHTML = `<div class="empty-state">Belum ada produk.</div>`;
      return;
    }
    ensureProductShape(product);
    const base = `products.${index}`;
    const gallery = (product.images || []).join("\n");
    const isBundle = Boolean(product.isBundle);

    root.innerHTML = `
      <div class="record-editor-header">
        <div><h2>${escapeHtml(product.name.id || "Produk Baru")}</h2><p>${escapeHtml(product.id || "ID belum diisi")}</p></div>
        <button class="danger-button" type="button" data-delete-product>Hapus Produk</button>
      </div>

      <section class="editor-section">
        <div class="editor-section-heading"><div><h2>Informasi Dasar</h2><p>ID digunakan website sebagai identitas produk dan harus unik.</p></div></div>
        <div class="form-grid">
          ${renderField({ label: "ID Produk", path: `${base}.id`, value: product.id || "" })}
          ${renderField({ label: "Foto utama", path: `${base}.image`, value: product.image || "", help: "Gunakan path file di folder website atau URL HTTPS." })}
          ${renderField({ label: "Kategori (Indonesia)", path: `${base}.category.id`, value: product.category.id || "" })}
          ${renderField({ label: "Category (English)", path: `${base}.category.en`, value: product.category.en || "" })}
          ${renderField({ label: "Nama produk (Indonesia)", path: `${base}.name.id`, value: product.name.id || "" })}
          ${renderField({ label: "Product name (English)", path: `${base}.name.en`, value: product.name.en || "" })}
          ${renderField({ label: "Galeri foto — satu path per baris", path: `${base}.images`, value: gallery, type: "textarea", valueType: "lines", full: true, help: "Kosongkan bila produk hanya memakai satu foto utama." })}
        </div>
      </section>

      <section class="editor-section">
        <div class="editor-section-heading"><div><h2>Deskripsi Produk</h2><p>Informasi yang tampil pada kartu dan detail produk.</p></div></div>
        <div class="form-grid">
          ${renderField({ label: "Deskripsi (Indonesia)", path: `${base}.description.id`, value: product.description.id || "", type: "textarea", full: true })}
          ${renderField({ label: "Description (English)", path: `${base}.description.en`, value: product.description.en || "", type: "textarea", full: true })}
          ${renderField({ label: "Manfaat (Indonesia)", path: `${base}.benefits.id`, value: product.benefits.id || "", type: "textarea", full: true })}
          ${renderField({ label: "Benefits (English)", path: `${base}.benefits.en`, value: product.benefits.en || "", type: "textarea", full: true })}
          ${renderField({ label: "Ingredients (Indonesia)", path: `${base}.ingredients.id`, value: product.ingredients.id || "", type: "textarea", full: true, rows: 7 })}
          ${renderField({ label: "Ingredients (English)", path: `${base}.ingredients.en`, value: product.ingredients.en || "", type: "textarea", full: true, rows: 7 })}
          ${renderField({ label: "Cara pakai (Indonesia)", path: `${base}.how.id`, value: product.how.id || "", type: "textarea", full: true })}
          ${renderField({ label: "How to use (English)", path: `${base}.how.en`, value: product.how.en || "", type: "textarea", full: true })}
        </div>
      </section>

      <section class="editor-section">
        <div class="editor-section-heading"><div><h2>Varian & Pembelian</h2><p>SKU menghubungkan website dengan harga dan stok Warehouse. Link Lynk.id dapat diubah di sini.</p></div></div>
        <div id="variantEditor">
          ${product.variants.map((variant, variantIndex) => renderVariantEditor(base, variant, variantIndex)).join("")}
        </div>
        <button class="add-inline-button" type="button" data-add-variant>+ Tambah Varian</button>
      </section>

      ${isBundle ? "" : renderBpomEditor(base, product)}
    `;
  }

  function renderVariantEditor(base, variant, index) {
    const variantBase = `${base}.variants.${index}`;
    return `<div class="variant-card">
      <div class="variant-title"><span>Varian ${index + 1}</span><button class="mini-button" type="button" data-remove-variant="${index}">Hapus</button></div>
      <div class="form-grid">
        ${renderField({ label: "Ukuran / Nama Varian", path: `${variantBase}.size`, value: variant.size || "" })}
        ${renderField({ label: "SKU Warehouse", path: `${variantBase}.sku`, value: variant.sku || "", help: "Harus sama dengan SKU di Mejavi Warehouse." })}
        ${renderField({ label: "Harga tampilan bawaan", path: `${variantBase}.price`, value: Number(variant.price || 0), type: "number", valueType: "number", help: "Saat online, harga Warehouse akan menjadi sumber utama." })}
        ${renderField({ label: "Harga sebelum diskon", path: `${variantBase}.originalPrice`, value: Number(variant.originalPrice || 0), type: "number", valueType: "number", help: "Isi 0 jika tidak ada harga coret." })}
        ${renderField({ label: "Link pembelian Lynk.id", path: `${variantBase}.lynk`, value: variant.lynk || "", type: "url", full: true })}
      </div>
    </div>`;
  }

  function renderBpomEditor(base, product) {
    product.bpom ||= {
      number: "",
      registeredName: "",
      manufacturer: "",
      packaging: { id: "", en: "" },
      validity: { id: "", en: "" },
      certificate: "",
      verifyUrl: ""
    };
    product.bpom.packaging ||= { id: "", en: "" };
    product.bpom.validity ||= { id: "", en: "" };

    return `<section class="editor-section">
      <div class="editor-section-heading"><div><h2>Informasi BPOM</h2><p>Samakan data berikut dengan dokumen BPOM resmi produk.</p></div></div>
      <div class="form-grid">
        ${renderField({ label: "Nomor notifikasi", path: `${base}.bpom.number`, value: product.bpom.number || "" })}
        ${renderField({ label: "Nama terdaftar", path: `${base}.bpom.registeredName`, value: product.bpom.registeredName || "" })}
        ${renderField({ label: "Industri kosmetika", path: `${base}.bpom.manufacturer`, value: product.bpom.manufacturer || "" })}
        ${renderField({ label: "File dokumen / QR", path: `${base}.bpom.certificate`, value: product.bpom.certificate || "" })}
        ${renderField({ label: "Kemasan (Indonesia)", path: `${base}.bpom.packaging.id`, value: product.bpom.packaging.id || "", type: "textarea", full: true })}
        ${renderField({ label: "Packaging (English)", path: `${base}.bpom.packaging.en`, value: product.bpom.packaging.en || "", type: "textarea", full: true })}
        ${renderField({ label: "Masa berlaku (Indonesia)", path: `${base}.bpom.validity.id`, value: product.bpom.validity.id || "" })}
        ${renderField({ label: "Validity (English)", path: `${base}.bpom.validity.en`, value: product.bpom.validity.en || "" })}
        ${renderField({ label: "Link Cek BPOM", path: `${base}.bpom.verifyUrl`, value: product.bpom.verifyUrl || "", type: "url", full: true })}
      </div>
    </section>`;
  }

  function renderIngredientList() {
    const root = $("#ingredientList");
    root.innerHTML = state.content.keyIngredients.map((ingredient, index) => `
      <button type="button" class="${index === state.activeIngredient ? "active" : ""}" data-select-ingredient="${index}">
        <span class="record-placeholder">${escapeHtml(ingredient.icon || "◌")}</span>
        <span><strong>${escapeHtml(ingredient.name || "Ingredient baru")}</strong><small>${escapeHtml(ingredient.description?.id?.slice(0, 44) || "Belum ada deskripsi")}</small></span>
      </button>`).join("");
  }

  function ensureIngredientShape(ingredient) {
    ingredient.description ||= { id: "", en: "" };
    ingredient.details ||= {};
    ingredient.details.id ||= { intro: "", benefits: [], suitable: "", note: "" };
    ingredient.details.en ||= { intro: "", benefits: [], suitable: "", note: "" };
    ingredient.sources ||= [];
    state.content.ingredientResearch ||= {};
    state.content.ingredientResearch[ingredient.name] ||= {
      id: { studied: "", findings: "", limits: "" },
      en: { studied: "", findings: "", limits: "" }
    };
  }

  function renderIngredientEditor() {
    const root = $("#ingredientEditor");
    const index = state.activeIngredient;
    const ingredient = state.content.keyIngredients[index];
    if (!ingredient) {
      root.innerHTML = `<div class="empty-state">Belum ada ingredient.</div>`;
      return;
    }
    ensureIngredientShape(ingredient);
    const base = `keyIngredients.${index}`;
    const research = state.content.ingredientResearch[ingredient.name];

    root.innerHTML = `
      <div class="record-editor-header">
        <div><h2>${escapeHtml(ingredient.name || "Ingredient Baru")}</h2><p>Konten edukasi ingredients Mejavi Skin+</p></div>
        <button class="danger-button" type="button" data-delete-ingredient>Hapus Ingredient</button>
      </div>

      <section class="editor-section">
        <div class="editor-section-heading"><div><h2>Informasi Dasar</h2></div></div>
        <div class="form-grid">
          <label class="field"><span class="field-label">Nama ingredient</span><input type="text" value="${escapeHtml(ingredient.name || "")}" data-ingredient-name></label>
          ${renderField({ label: "Ikon singkat", path: `${base}.icon`, value: ingredient.icon || "◌" })}
          ${renderField({ label: "Ringkasan (Indonesia)", path: `${base}.description.id`, value: ingredient.description.id || "", type: "textarea", full: true })}
          ${renderField({ label: "Summary (English)", path: `${base}.description.en`, value: ingredient.description.en || "", type: "textarea", full: true })}
        </div>
      </section>

      ${renderIngredientLanguageSection(base, ingredient, "id", "Bahasa Indonesia")}
      ${renderIngredientLanguageSection(base, ingredient, "en", "English")}

      <section class="editor-section">
        <div class="editor-section-heading"><div><h2>Ringkasan Referensi Ilmiah</h2><p>Gunakan bahasa yang proporsional dan jangan menjanjikan hasil medis.</p></div></div>
        <div class="form-grid">
          ${renderResearchField("Apa yang diteliti (Indonesia)", "id", "studied", research.id.studied)}
          ${renderResearchField("What was studied (English)", "en", "studied", research.en.studied)}
          ${renderResearchField("Temuan utama (Indonesia)", "id", "findings", research.id.findings)}
          ${renderResearchField("Main findings (English)", "en", "findings", research.en.findings)}
          ${renderResearchField("Batasan bukti (Indonesia)", "id", "limits", research.id.limits)}
          ${renderResearchField("Evidence limitations (English)", "en", "limits", research.en.limits)}
        </div>
      </section>

      <section class="editor-section">
        <div class="editor-section-heading"><div><h2>Tautan Referensi</h2><p>Tambahkan judul publikasi dan URL sumber resmi.</p></div></div>
        <div id="sourceEditor">
          ${ingredient.sources.map((source, sourceIndex) => renderSourceEditor(base, source, sourceIndex)).join("")}
        </div>
        <button class="add-inline-button" type="button" data-add-source>+ Tambah Referensi</button>
      </section>
    `;
  }

  function renderIngredientLanguageSection(base, ingredient, language, title) {
    const details = ingredient.details[language];
    return `<section class="editor-section">
      <div class="editor-section-heading"><div><h2>${escapeHtml(title)}</h2><p>Penjelasan lengkap yang tampil saat kartu ingredient dibuka.</p></div></div>
      <div class="form-grid">
        ${renderField({ label: language === "id" ? "Penjelasan lengkap" : "Full explanation", path: `${base}.details.${language}.intro`, value: details.intro || "", type: "textarea", full: true, rows: 7 })}
        ${renderField({ label: language === "id" ? "Daftar manfaat — satu per baris" : "Benefits — one per line", path: `${base}.details.${language}.benefits`, value: (details.benefits || []).join("\n"), type: "textarea", valueType: "lines", full: true })}
        ${renderField({ label: language === "id" ? "Cocok untuk" : "Suitable for", path: `${base}.details.${language}.suitable`, value: details.suitable || "", type: "textarea", full: true })}
        ${renderField({ label: language === "id" ? "Catatan pemakaian" : "Usage note", path: `${base}.details.${language}.note`, value: details.note || "", type: "textarea", full: true })}
      </div>
    </section>`;
  }

  function renderResearchField(label, language, field, value) {
    return `<label class="field field-full"><span class="field-label">${escapeHtml(label)}</span><textarea rows="5" data-research-language="${language}" data-research-field="${field}">${escapeHtml(value || "")}</textarea></label>`;
  }

  function renderSourceEditor(base, source, index) {
    return `<div class="source-card">
      <div class="source-title"><span>Referensi ${index + 1}</span><button class="mini-button" type="button" data-remove-source="${index}">Hapus</button></div>
      <div class="form-grid">
        ${renderField({ label: "Judul publikasi", path: `${base}.sources.${index}.title`, value: source.title || "" })}
        ${renderField({ label: "URL", path: `${base}.sources.${index}.url`, value: source.url || "", type: "url" })}
      </div>
    </div>`;
  }

  function renderContact() {
    const settings = state.content.settings;
    $("#contactEditor").innerHTML = `<div class="form-grid">
      ${renderField({ label: "Nama brand", path: "settings.brandName", value: settings.brandName || "" })}
      ${renderField({ label: "Alamat website", path: "settings.website", value: settings.website || "", help: "Contoh: mejaviskincare.co.id" })}
      ${renderField({ label: "Nomor WhatsApp", path: "settings.whatsapp", value: settings.whatsapp || "", help: "Gunakan format negara tanpa tanda +, contoh 628214570677." })}
      ${renderField({ label: "Email", path: "settings.email", value: settings.email || "" })}
      ${renderField({ label: "Username Instagram", path: "settings.instagram", value: settings.instagram || "", help: "Boleh ditulis dengan atau tanpa @." })}
      ${renderField({ label: "Username TikTok", path: "settings.tiktok", value: settings.tiktok || "", help: "Boleh ditulis dengan atau tanpa @." })}
    </div>`;
  }

  function renderAllText() {
    const language = state.editorLanguage;
    const query = $("#textSearch").value.trim().toLowerCase();
    const entries = Object.entries(state.content.translations[language])
      .filter(([key, value]) => key !== "heroTitle" && typeof value === "string")
      .filter(([key, value]) => !query || `${key} ${value}`.toLowerCase().includes(query))
      .sort(([a], [b]) => a.localeCompare(b));

    $("#allTextEditor").innerHTML = entries.length
      ? entries.map(([key, value]) => `<label class="text-row">
          <span><strong>${escapeHtml(humanizeKey(key))}</strong><small>${escapeHtml(key)}</small></span>
          <textarea data-content-path="translations.${language}.${escapeHtml(key)}" data-value-type="string">${escapeHtml(value)}</textarea>
        </label>`).join("")
      : `<div class="empty-state">Tidak ada teks yang cocok dengan pencarian.</div>`;
  }

  function renderEverything() {
    updateDashboard();
    renderHomepage();
    renderProductList();
    renderProductEditor();
    renderIngredientList();
    renderIngredientEditor();
    renderContact();
    renderAllText();
    setDirty(false);
    showSection(state.activeSection);
  }

  function showSection(section) {
    if (!sectionTitles[section]) return;
    state.activeSection = section;
    $$("[data-section]").forEach((item) => item.classList.toggle("active", item.dataset.section === section));
    $$("[data-section-target]").forEach((button) => button.classList.toggle("active", button.dataset.sectionTarget === section));
    $("#activeSectionTitle").textContent = sectionTitles[section];
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeEditorLanguage(language) {
    if (!state.content.translations[language]) return;
    state.editorLanguage = language;
    $$('[data-editor-language]').forEach((button) => {
      button.classList.toggle("active", button.dataset.editorLanguage === language);
    });
    renderHomepage();
    renderAllText();
  }

  function handleGenericInput(target) {
    const path = target.dataset.contentPath;
    if (!path) return false;
    let value = target.value;
    if (target.dataset.valueType === "number") value = Number(value || 0);
    if (target.dataset.valueType === "lines") {
      value = value.split("\n").map((item) => item.trim()).filter(Boolean);
    }
    setPath(state.content, path, value);
    setDirty(true);
    return true;
  }

  function handleHeroInput() {
    const root = $("#homepageEditor");
    const lead = $('[data-hero-part="lead"]', root)?.value || "";
    const main = $('[data-hero-part="main"]', root)?.value || "";
    state.content.translations[state.editorLanguage].heroTitle =
      `<span class="hero-title-lead">${escapeHtml(lead)}</span>` +
      `<span class="hero-title-main">${escapeHtml(main)}</span>`;
    setDirty(true);
  }

  function addProduct() {
    const timestamp = Date.now().toString().slice(-6);
    state.content.products.push({
      id: `produk-baru-${timestamp}`,
      category: { id: "Skincare", en: "Skincare" },
      name: { id: "Produk Baru", en: "New Product" },
      image: "",
      description: { id: "", en: "" },
      variants: [{ size: "", price: 0, originalPrice: 0, sku: "", lynk: "" }],
      ingredients: { id: "", en: "" },
      benefits: { id: "", en: "" },
      how: { id: "", en: "" },
      bpom: {
        number: "",
        registeredName: "",
        manufacturer: "",
        packaging: { id: "", en: "" },
        validity: { id: "", en: "" },
        certificate: "",
        verifyUrl: ""
      }
    });
    state.activeProduct = state.content.products.length - 1;
    renderProductList();
    renderProductEditor();
    updateDashboard();
    setDirty(true);
  }

  function deleteProduct() {
    if (state.content.products.length <= 1) {
      showToast("Website harus memiliki minimal satu produk.", "error");
      return;
    }
    const product = state.content.products[state.activeProduct];
    if (!window.confirm(`Hapus ${product.name?.id || "produk ini"} dari website?`)) return;
    state.content.products.splice(state.activeProduct, 1);
    state.activeProduct = Math.max(0, state.activeProduct - 1);
    renderProductList();
    renderProductEditor();
    updateDashboard();
    setDirty(true);
  }

  function addVariant() {
    const product = state.content.products[state.activeProduct];
    product.variants.push({ size: "", price: 0, originalPrice: 0, sku: "", lynk: "" });
    renderProductEditor();
    setDirty(true);
  }

  function removeVariant(index) {
    const product = state.content.products[state.activeProduct];
    if (product.variants.length <= 1) {
      showToast("Produk harus memiliki minimal satu varian.", "error");
      return;
    }
    product.variants.splice(index, 1);
    renderProductEditor();
    setDirty(true);
  }

  function addIngredient() {
    const name = `Ingredient Baru ${state.content.keyIngredients.length + 1}`;
    state.content.keyIngredients.push({
      icon: "◌",
      name,
      description: { id: "", en: "" },
      details: {
        id: { intro: "", benefits: [], suitable: "", note: "" },
        en: { intro: "", benefits: [], suitable: "", note: "" }
      },
      sources: []
    });
    state.content.ingredientResearch[name] = {
      id: { studied: "", findings: "", limits: "" },
      en: { studied: "", findings: "", limits: "" }
    };
    state.activeIngredient = state.content.keyIngredients.length - 1;
    renderIngredientList();
    renderIngredientEditor();
    updateDashboard();
    setDirty(true);
  }

  function deleteIngredient() {
    if (state.content.keyIngredients.length <= 1) {
      showToast("Website harus memiliki minimal satu ingredient.", "error");
      return;
    }
    const ingredient = state.content.keyIngredients[state.activeIngredient];
    if (!window.confirm(`Hapus ${ingredient.name || "ingredient ini"} dari website?`)) return;
    delete state.content.ingredientResearch[ingredient.name];
    state.content.keyIngredients.splice(state.activeIngredient, 1);
    state.activeIngredient = Math.max(0, state.activeIngredient - 1);
    renderIngredientList();
    renderIngredientEditor();
    updateDashboard();
    setDirty(true);
  }

  function renameIngredient(newName) {
    const ingredient = state.content.keyIngredients[state.activeIngredient];
    const oldName = ingredient.name;
    const normalized = newName.trim() || oldName;
    ingredient.name = normalized;
    if (oldName !== normalized) {
      state.content.ingredientResearch[normalized] =
        state.content.ingredientResearch[oldName] || {
          id: { studied: "", findings: "", limits: "" },
          en: { studied: "", findings: "", limits: "" }
        };
      delete state.content.ingredientResearch[oldName];
    }
    renderIngredientList();
    setDirty(true);
  }

  function updateResearch(target) {
    const ingredient = state.content.keyIngredients[state.activeIngredient];
    ensureIngredientShape(ingredient);
    state.content.ingredientResearch[ingredient.name][target.dataset.researchLanguage][target.dataset.researchField] = target.value;
    setDirty(true);
  }

  function addSource() {
    state.content.keyIngredients[state.activeIngredient].sources.push({ title: "", url: "" });
    renderIngredientEditor();
    setDirty(true);
  }

  function removeSource(index) {
    state.content.keyIngredients[state.activeIngredient].sources.splice(index, 1);
    renderIngredientEditor();
    setDirty(true);
  }

  function openMobileMenu() {
    $("#adminApp").classList.add("menu-open");
    $("#adminMenuToggle").setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    $("#adminApp").classList.remove("menu-open");
    $("#adminMenuToggle").setAttribute("aria-expanded", "false");
  }

  async function activateAdmin() {
    await loadProfile();
    await loadContentRecord();
    showAdmin();
  }

  async function logout() {
    try {
      if (state.session?.access_token) {
        await authRequest("/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${state.session.access_token}` }
        });
      }
    } catch (_error) {
      // Sesi lokal tetap dihapus meskipun jaringan sedang bermasalah.
    }
    clearSession();
    showLogin();
  }

  function bindEvents() {
    $("#togglePassword").addEventListener("click", () => {
      const input = $("#loginPassword");
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      $("#togglePassword").textContent = isPassword ? "Tutup" : "Lihat";
    });

    $("#loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const errorBox = $("#loginError");
      const button = $("#loginButton");
      errorBox.textContent = "";
      if (!form.reportValidity()) return;
      button.disabled = true;
      button.textContent = "Memeriksa akses…";
      try {
        await signIn($("#loginEmail").value.trim(), $("#loginPassword").value);
        await activateAdmin();
        form.reset();
      } catch (error) {
        clearSession();
        errorBox.textContent = error.message || "Login belum berhasil.";
      } finally {
        button.disabled = false;
        button.textContent = "Masuk ke Backend";
      }
    });

    $("#logoutButton").addEventListener("click", logout);
    $("#adminMenuToggle").addEventListener("click", () => {
      $("#adminApp").classList.contains("menu-open") ? closeMobileMenu() : openMobileMenu();
    });
    $("#sidebarOverlay").addEventListener("click", closeMobileMenu);

    document.addEventListener("click", (event) => {
      const sectionButton = event.target.closest("[data-section-target], [data-section-jump]");
      if (sectionButton) {
        showSection(sectionButton.dataset.sectionTarget || sectionButton.dataset.sectionJump);
        return;
      }

      const languageButton = event.target.closest("[data-editor-language]");
      if (languageButton) {
        changeEditorLanguage(languageButton.dataset.editorLanguage);
        return;
      }

      const productButton = event.target.closest("[data-select-product]");
      if (productButton) {
        state.activeProduct = Number(productButton.dataset.selectProduct);
        renderProductList();
        renderProductEditor();
        return;
      }

      const ingredientButton = event.target.closest("[data-select-ingredient]");
      if (ingredientButton) {
        state.activeIngredient = Number(ingredientButton.dataset.selectIngredient);
        renderIngredientList();
        renderIngredientEditor();
        return;
      }

      if (event.target.closest("[data-delete-product]")) deleteProduct();
      if (event.target.closest("[data-add-variant]")) addVariant();
      if (event.target.closest("[data-remove-variant]")) removeVariant(Number(event.target.closest("[data-remove-variant]").dataset.removeVariant));
      if (event.target.closest("[data-delete-ingredient]")) deleteIngredient();
      if (event.target.closest("[data-add-source]")) addSource();
      if (event.target.closest("[data-remove-source]")) removeSource(Number(event.target.closest("[data-remove-source]").dataset.removeSource));
    });

    $("#addProductButton").addEventListener("click", addProduct);
    $("#addIngredientButton").addEventListener("click", addIngredient);

    $("#adminContent").addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches("[data-hero-part]")) return handleHeroInput();
      if (target.matches("[data-ingredient-name]")) return renameIngredient(target.value);
      if (target.matches("[data-research-field]")) return updateResearch(target);
      handleGenericInput(target);
    });

    $("#textSearch").addEventListener("input", renderAllText);

    $("#saveDraftButton").addEventListener("click", () => saveDraft());
    $$('[data-mobile-save], [data-publish-save]').forEach((button) => button.addEventListener("click", () => saveDraft()));

    const openPublishDialog = () => {
      if (typeof $("#publishDialog").showModal === "function") {
        $("#publishDialog").showModal();
      } else if (window.confirm("Publikasikan perubahan ke website sekarang?")) {
        publishContent();
      }
    };
    $("#publishButton").addEventListener("click", openPublishDialog);
    $$('[data-mobile-publish], [data-publish-now]').forEach((button) => button.addEventListener("click", openPublishDialog));
    $("#confirmPublishButton").addEventListener("click", (event) => {
      event.preventDefault();
      $("#publishDialog").close();
      publishContent();
    });

    window.addEventListener("beforeunload", (event) => {
      if (!state.dirty) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  async function boot() {
    bindEvents();
    try {
      const response = await fetch("content-default.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Data awal website tidak ditemukan.");
      state.defaultContent = await response.json();
    } catch (error) {
      $("#loginError").textContent = `${error.message} Deploy folder website lengkap lalu buka kembali backend.`;
      return;
    }

    state.session = readSession();
    if (!state.session) {
      showLogin();
      return;
    }

    try {
      await activateAdmin();
    } catch (_error) {
      clearSession();
      showLogin();
    }
  }

  boot();
})();
