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
  const ADS_ENDPOINT =
    `${SUPABASE_URL}/rest/v1/homepage_ads` +
    "?placement=eq.home&is_active=eq.true" +
    "&select=id,title,subtitle,image_url,alt_text,target_url,cta_label,sort_order,starts_at,ends_at" +
    "&order=sort_order.asc,created_at.desc&limit=6";
  const OFFICIAL_SOCIAL_HANDLES = Object.freeze({
    instagram: "mejaviskincare",
    tiktok: "mejaviskinc_"
  });
  const DEFAULT_WHATSAPP_NUMBER = "628113196990";
  const LEGACY_WHATSAPP_NUMBER = "628214570677";

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

  async function fetchHomepageAds() {
    if (document.body?.dataset.page !== "home") return [];

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(ADS_ENDPOINT, {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Accept: "application/json"
        },
        signal: controller.signal
      });
      if (!response.ok) return [];
      const rows = await response.json();
      return Array.isArray(rows) ? rows.filter(isObject) : [];
    } catch (_error) {
      return [];
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

  function safeAdUrl(value, { image = false } = {}) {
    const raw = String(value || "").trim();
    if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return "";
    if (/^(?:javascript|vbscript|data):/i.test(raw.replace(/\s+/g, ""))) return "";

    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin === window.location.origin) return url.href;
      if (url.protocol !== "https:") return "";
      if (image && !/^https:$/i.test(url.protocol)) return "";
      return url.href;
    } catch (_error) {
      return "";
    }
  }

  function ensureAdStyles() {
    if (document.getElementById("mejaviHomepageAdsStyles")) return;
    const style = document.createElement("style");
    style.id = "mejaviHomepageAdsStyles";
    style.textContent = `
      .mejavi-home-ads{padding:28px 0 10px;background:#fff}
      .mejavi-home-ads-inner{width:min(1180px,calc(100% - 32px));margin:0 auto}
      .mejavi-home-ads-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:14px}
      .mejavi-home-ads-head span{font:500 11px/1.2 Poppins,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8d7658}
      .mejavi-home-ads-head strong{display:block;margin-top:5px;font:600 clamp(19px,2.4vw,28px)/1.15 Poppins,sans-serif;color:#151515}
      .mejavi-home-ads-track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(78%,1fr);gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 12px;scrollbar-width:thin}
      .mejavi-home-ad{position:relative;display:block;min-height:230px;border:1px solid rgba(17,17,17,.08);border-radius:24px;overflow:hidden;background:#f5f0e8;color:#fff;scroll-snap-align:start;text-decoration:none;isolation:isolate}
      .mejavi-home-ad img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
      .mejavi-home-ad::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.28) 62%,rgba(0,0,0,.06));z-index:-1}
      .mejavi-home-ad-copy{display:flex;min-height:230px;max-width:620px;flex-direction:column;align-items:flex-start;justify-content:center;padding:28px clamp(22px,5vw,52px)}
      .mejavi-home-ad-label{display:inline-flex;margin-bottom:10px;padding:6px 10px;border:1px solid rgba(255,255,255,.4);border-radius:999px;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);font:600 10px/1 Poppins,sans-serif;letter-spacing:.12em;text-transform:uppercase}
      .mejavi-home-ad h2{margin:0;font:600 clamp(22px,4vw,42px)/1.07 Poppins,sans-serif;color:#fff}
      .mejavi-home-ad p{max-width:560px;margin:11px 0 0;font:400 14px/1.65 Poppins,sans-serif;color:rgba(255,255,255,.9)}
      .mejavi-home-ad-cta{display:inline-flex;margin-top:18px;padding:11px 16px;border-radius:999px;background:#fff;color:#111;font:600 12px/1 Poppins,sans-serif}
      .mejavi-home-ad-static{cursor:default}
      @media (min-width:900px){.mejavi-home-ads{padding:40px 0 16px}.mejavi-home-ads-track{grid-auto-columns:minmax(56%,1fr)}.mejavi-home-ad,.mejavi-home-ad-copy{min-height:320px}}
      @media (max-width:560px){.mejavi-home-ads-inner{width:min(100% - 20px,1180px)}.mejavi-home-ads-track{grid-auto-columns:92%}.mejavi-home-ad,.mejavi-home-ad-copy{min-height:210px}.mejavi-home-ad-copy{padding:24px 20px}.mejavi-home-ad p{font-size:13px}}
    `;
    document.head.appendChild(style);
  }

  function renderHomepageAds(ads) {
    if (document.body?.dataset.page !== "home" || !Array.isArray(ads) || !ads.length) return;
    if (document.getElementById("mejaviHomepageAds")) return;

    const hero = document.querySelector("main .hero, .hero");
    if (!hero) return;

    ensureAdStyles();

    const section = document.createElement("section");
    section.id = "mejaviHomepageAds";
    section.className = "mejavi-home-ads";
    section.setAttribute("aria-label", "Iklan dan promosi Mejavi Skin+");

    const inner = document.createElement("div");
    inner.className = "mejavi-home-ads-inner";

    const head = document.createElement("div");
    head.className = "mejavi-home-ads-head";
    const heading = document.createElement("div");
    const kicker = document.createElement("span");
    kicker.textContent = "Promo Mejavi";
    const title = document.createElement("strong");
    title.textContent = "Pilihan & penawaran terbaru";
    heading.append(kicker, title);
    head.appendChild(heading);

    const track = document.createElement("div");
    track.className = "mejavi-home-ads-track";

    ads.forEach((ad) => {
      const imageUrl = safeAdUrl(ad.image_url, { image: true });
      if (!imageUrl) return;
      const targetUrl = safeAdUrl(ad.target_url);
      const card = document.createElement(targetUrl ? "a" : "article");
      card.className = `mejavi-home-ad${targetUrl ? "" : " mejavi-home-ad-static"}`;
      if (targetUrl) {
        card.href = targetUrl;
        if (new URL(targetUrl).origin !== window.location.origin) {
          card.target = "_blank";
          card.rel = "noopener noreferrer";
        }
      }

      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = String(ad.alt_text || ad.title || "Promo Mejavi Skin+").slice(0, 180);
      image.loading = "lazy";
      image.decoding = "async";

      const copy = document.createElement("div");
      copy.className = "mejavi-home-ad-copy";
      const label = document.createElement("span");
      label.className = "mejavi-home-ad-label";
      label.textContent = "Iklan";
      const headingEl = document.createElement("h2");
      headingEl.textContent = String(ad.title || "Promo Mejavi Skin+").slice(0, 120);
      copy.append(label, headingEl);

      if (ad.subtitle) {
        const subtitle = document.createElement("p");
        subtitle.textContent = String(ad.subtitle).slice(0, 280);
        copy.appendChild(subtitle);
      }

      if (targetUrl) {
        const cta = document.createElement("span");
        cta.className = "mejavi-home-ad-cta";
        cta.textContent = String(ad.cta_label || "Lihat promo").slice(0, 40);
        copy.appendChild(cta);
      }

      card.append(image, copy);
      track.appendChild(card);
    });

    if (!track.children.length) return;
    inner.append(head, track);
    section.appendChild(inner);
    hero.insertAdjacentElement("afterend", section);
  }

  function ensureHomepageProductsSection() {
    if (document.body?.dataset.page !== "home") return;
    if (document.getElementById("productGrid")) return;

    const newsletter = document.querySelector("main .newsletter");
    if (!newsletter) return;

    const section = document.createElement("section");
    section.className = "products home-products";
    section.id = "homeProducts";
    section.setAttribute("aria-labelledby", "homeProductsTitle");
    section.innerHTML = `
      <div class="container">
        <div class="section-head reveal">
          <span class="section-tag" data-id="productTag">Produk Kami</span>
          <h2 id="homeProductsTitle" data-id="productTitle">Temukan produk Mejavi Skin untuk rutinitasmu.</h2>
          <p data-id="productSubtitle">Klik detail untuk melihat komposisi, manfaat, cara penggunaan dan pilihan ukuran.</p>
        </div>
        <div class="product-grid" id="productGrid"></div>
        <div style="display:flex;justify-content:center;margin-top:28px">
          <a class="btn btn-dark" href="skincare-kulit-sensitif/">Lihat Semua Produk</a>
        </div>
      </div>
    `;
    newsletter.insertAdjacentElement("beforebegin", section);
  }

  function rewriteWhatsAppLinks(number) {
    const whatsapp = String(number || "").replace(/\D/g, "");
    if (!whatsapp) return;

    document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
      const current = link.getAttribute("href") || "";
      const query = current.includes("?") ? current.slice(current.indexOf("?")) : "";
      link.href = `https://wa.me/${whatsapp}${query}`;
    });

    document.querySelectorAll('a[href*="api.whatsapp.com/"]').forEach((link) => {
      try {
        const url = new URL(link.href, window.location.href);
        url.searchParams.set("phone", whatsapp);
        link.href = url.toString();
      } catch (_error) {
        // Abaikan link yang tidak valid.
      }
    });
  }

  function hideCollagenArticleThumbnail() {
    if (document.body?.dataset.page !== "articles") return;

    document
      .querySelectorAll(
        '.article-grid .article-card img[src*="skincare-kulit-sensitif-kolagen-sapi"]'
      )
      .forEach((image) => {
        const imageLink = image.closest("a");
        if (imageLink) imageLink.remove();
        else image.remove();
      });
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
    const configuredWhatsapp = String(settings.whatsapp || "").replace(/\D/g, "");
    const whatsapp =
      !configuredWhatsapp || configuredWhatsapp === LEGACY_WHATSAPP_NUMBER
        ? DEFAULT_WHATSAPP_NUMBER
        : configuredWhatsapp;

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

    rewriteWhatsAppLinks(whatsapp);

    window.mejaviSiteSettings = { ...settings, instagram, tiktok, email, whatsapp };
  }

  // Pastikan section produk tersedia sebelum script katalog melakukan render.
  ensureHomepageProductsSection();

  // Pastikan link statis selalu memakai nomor resmi terbaru, bahkan jika CMS sedang tidak tersedia.
  rewriteWhatsAppLinks(DEFAULT_WHATSAPP_NUMBER);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideCollagenArticleThumbnail, {
      once: true
    });
  } else {
    hideCollagenArticleThumbnail();
  }

  const ready = fetchPublishedContent();
  const adsReady = fetchHomepageAds();
  window.mejaviCMSReady = ready;
  window.mejaviHomepageAdsReady = adsReady;
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

  adsReady.then((ads) => {
    if (!ads.length) return;
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        () => renderHomepageAds(ads),
        { once: true }
      );
    } else {
      renderHomepageAds(ads);
    }
  });
})();