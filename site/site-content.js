/* ==========================================
   MEJAVI WEBSITE CONTENT — PUBLIC READER
========================================== */

(function () {
  "use strict";

  const SUPABASE_URL = "https://yqutzzhkuuehvmuqzjvb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_l9pctpDmJMd6xnpZWKwx5g_OhRajIql";
  const CACHE_KEY = "mejavi_published_content_v1";
  const ENDPOINT =
    `${SUPABASE_URL}/rest/v1/website_content` +
    "?key=eq.main&select=published_content,published_at,version";
  const OFFICIAL_SOCIAL_HANDLES = Object.freeze({
    instagram: "mejaviskincare",
    tiktok: "mejaviskinc_"
  });

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      return isObject(cached?.content) ? cached.content : null;
    } catch (_error) {
      return null;
    }
  }

  function saveCache(row) {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          content: row.published_content,
          version: row.version,
          publishedAt: row.published_at
        })
      );
    } catch (_error) {
      // Website tetap berjalan menggunakan data bawaan jika cache tidak tersedia.
    }
  }

  async function fetchPublishedContent() {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2200);

    try {
      const response = await fetch(ENDPOINT, {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: "application/json"
        },
        signal: controller.signal
      });

      if (!response.ok) throw new Error("Konten backend belum tersedia.");
      const rows = await response.json();
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!isObject(row?.published_content)) return readCache();

      if (Object.keys(row.published_content).length === 0) {
        return readCache();
      }

      saveCache(row);
      return row.published_content;
    } catch (_error) {
      return readCache();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function cleanHandle(value) {
    const handle = String(value || "").trim().replace(/^@/, "");
    return /^[a-z0-9._]{1,30}$/i.test(handle) ? handle : "";
  }

  function cleanEmail(value) {
    const email = String(value || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
  }

  function applySettings(settings) {
    if (!isObject(settings)) return;

    const instagram = cleanHandle(
      OFFICIAL_SOCIAL_HANDLES.instagram || settings.instagram
    );
    const tiktok = cleanHandle(
      OFFICIAL_SOCIAL_HANDLES.tiktok || settings.tiktok
    );
    const email = cleanEmail(settings.email);
    const whatsapp = String(settings.whatsapp || "").replace(/\D/g, "");

    if (instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
        link.href = `https://www.instagram.com/${instagram}`;
      });
    }

    if (tiktok) {
      document.querySelectorAll('a[href*="tiktok.com"]').forEach((link) => {
        link.href = `https://www.tiktok.com/@${tiktok}`;
      });
    }

    if (email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
        const current = link.getAttribute("href") || "";
        const query = current.includes("?") ? current.slice(current.indexOf("?")) : "";
        link.href = `mailto:${email}${query}`;
        if (link.textContent.includes("@")) link.textContent = email;
      });
    }

    if (whatsapp) {
      document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
        const current = link.getAttribute("href") || "";
        const query = current.includes("?") ? current.slice(current.indexOf("?")) : "";
        link.href = `https://wa.me/${whatsapp}${query}`;
      });
    }

    window.mejaviSiteSettings = { ...settings, instagram, tiktok, email, whatsapp };
  }

  const ready = fetchPublishedContent();
  window.mejaviCMSReady = ready;
  window.mejaviApplySiteSettings = applySettings;

  ready.then((content) => {
    if (!content?.settings) return;
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => applySettings(content.settings),
        { once: true }
      );
    } else {
      applySettings(content.settings);
    }
  });
})();
