(function () {
  "use strict";

  const API = "https://yqutzzhkuuehvmuqzjvb.supabase.co/functions/v1/mejavi-storefront";
  const DISMISSED_KEY = "mejavi_dismissed_promos_v1";
  const CATALOG_EVENT = "mejavi:catalog-synced";
  let latestCatalog = [];

  const number = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const language = () => {
    try {
      return localStorage.getItem("mejavi_language") === "en" ? "en" : "id";
    } catch (_error) {
      return "id";
    }
  };

  const format = (value) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number(value));

  const isTrue = (value) =>
    value === true || value === 1 || value === "1" || value === "true";

  const isActive = (item) =>
    isTrue(item?.discount_active) &&
    number(item?.original_price) > number(item?.price);

  const signature = (item) => [
    item?.sku,
    item?.price,
    item?.original_price,
    item?.discount_type,
    item?.discount_value,
    item?.discount_starts_at,
    item?.discount_ends_at,
    item?.updated_at
  ].map((value) => String(value ?? "")).join("|");

  const discountLabel = (item) => {
    if (item?.discount_type === "percentage") {
      return language() === "en"
        ? "Save " + number(item.discount_value) + "%"
        : "Diskon " + number(item.discount_value) + "%";
    }
    return language() === "en"
      ? "Save " + format(item?.discount_value)
      : "Hemat " + format(item?.discount_value);
  };

  function readDismissed() {
    try {
      const value = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_error) {
      return {};
    }
  }

  function writeDismissed(value) {
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(value));
    } catch (_error) {
      // Notifikasi tetap berfungsi walaupun penyimpanan lokal tidak tersedia.
    }
  }

  function setupBell() {
    const tools = document.querySelector(".nav-tools");
    if (!tools || document.getElementById("mejavi-notification-wrap")) return;

    const style = document.createElement("style");
    style.id = "mejavi-notification-style";
    style.textContent = [
      "#mejavi-notification-wrap{position:relative;display:inline-flex;flex-shrink:0}",
      "#mejavi-notification-btn{position:relative;display:grid;place-items:center;width:40px;height:40px;padding:0;border:0;border-radius:50%;background:transparent;color:inherit;cursor:pointer}",
      "#mejavi-notification-btn:hover{background:rgba(33,27,22,.07)}",
      "#mejavi-notification-btn svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}",
      "#mejavi-notification-count{position:absolute;top:0;right:0;display:none;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#b42318;color:#fff;font:700 10px/17px Arial,sans-serif;text-align:center}",
      "#mejavi-notification-panel{position:absolute;top:46px;right:0;z-index:1000;width:min(360px,calc(100vw - 32px));max-height:min(70vh,540px);overflow:auto;padding:16px;border:1px solid #e7e0d8;border-radius:18px;background:#fff;color:#211b16;box-shadow:0 16px 40px rgba(0,0,0,.16);font-size:13px;line-height:1.45}",
      ".mejavi-promo-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #f0ece7}",
      ".mejavi-promo-row:last-child{border-bottom:0}",
      ".mejavi-promo-name{display:block;font-weight:800}",
      ".mejavi-promo-prices{display:flex;align-items:center;gap:7px;margin-top:4px}",
      ".mejavi-promo-prices s{color:#8a8178;font-size:12px}",
      ".mejavi-promo-prices strong{color:#211b16;font-size:13px}",
      ".mejavi-promo-remove{flex:0 0 auto;padding:6px 8px;border:1px solid #e6ddd4;border-radius:8px;background:#fff;color:#6c625a;font-size:11px;font-weight:700;cursor:pointer}",
      ".mejavi-promo-remove:hover{background:#f7f2ec}",
      ".mejavi-promo-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}",
      ".mejavi-promo-actions button{padding:8px 11px;border:0;border-radius:9px;background:#211b16;color:#fff;font-size:11px;font-weight:700;cursor:pointer}",
      ".mejavi-promo-actions button.secondary{border:1px solid #e6ddd4;background:#fff;color:#6c625a}",
      ".live-discount-badge{display:inline-block;margin-left:8px;padding:3px 7px;border-radius:999px;background:#211b16;color:#fff;font-size:11px;font-weight:700;vertical-align:middle}",
      "@media(max-width:600px){#mejavi-notification-wrap{position:static}#mejavi-notification-panel{position:fixed;top:68px;left:12px;right:12px;width:auto;max-height:70vh;border-radius:18px;padding:16px}.mejavi-promo-row{gap:8px}}"
    ].join("");

    document.head.appendChild(style);

    const wrap = document.createElement("div");
    wrap.id = "mejavi-notification-wrap";
    wrap.innerHTML = '<button id="mejavi-notification-btn" type="button" aria-label="Notifikasi promo" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg><span id="mejavi-notification-count">0</span></button><div id="mejavi-notification-panel" hidden role="region" aria-label="Notifikasi promo"></div>';
    tools.prepend(wrap);

    const button = wrap.querySelector("#mejavi-notification-btn");
    const panel = wrap.querySelector("#mejavi-notification-panel");
    button.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      button.setAttribute("aria-expanded", String(!panel.hidden));
    });
  }

  function chooseVariant(product, card, catalogBySku) {
    const variants = Array.isArray(product?.variants) ? product.variants : [];
    if (!variants.length) return null;

    const selected = card.dataset.selectedVariant;
    if (selected !== "") {
      return variants[number(selected, 0)] || variants[0];
    }

    return variants.reduce((best, variant) => {
      const bestSource = catalogBySku.get(String(best?.sku));
      const source = catalogBySku.get(String(variant?.sku));
      const bestPrice = number(bestSource?.price ?? best?.price);
      const price = number(source?.price ?? variant?.price);
      return price < bestPrice ? variant : best;
    }, variants[0]);
  }

  function applyCardPromos(catalog) {
    const products = window.mejaviProducts || [];
    const cards = document.querySelectorAll("#productGrid .product-card");
    const catalogBySku = new Map(
      catalog.map((item) => [String(item.sku), item])
    );

    cards.forEach((card, index) => {
      const product = products[index];
      if (!product) return;

      const variant = chooseVariant(product, card, catalogBySku);
      const source = catalogBySku.get(String(variant?.sku));
      const price = card.querySelector(".card-price");
      if (!variant || !source || !price) return;

      const currentPrice = number(source.price ?? variant.price);
      const oldPrice = isActive(source) ? number(source.original_price) : 0;
      price.replaceChildren();

      if (oldPrice > currentPrice) {
        const old = document.createElement("span");
        old.className = "old-price";
        old.textContent = format(oldPrice);
        price.appendChild(old);
        price.appendChild(document.createTextNode(" "));
      }

      price.appendChild(document.createTextNode(format(currentPrice)));

      if (isActive(source)) {
        const badge = document.createElement("span");
        badge.className = "live-discount-badge";
        badge.textContent = discountLabel(source);
        price.appendChild(badge);
      }
    });
  }

  function applyCatalog(catalog) {
    latestCatalog = Array.isArray(catalog) ? catalog : [];
    applyCardPromos(latestCatalog);
    renderNotificationPanel(latestCatalog);
  }

  function renderNotificationPanel(catalog) {
    const panel = document.getElementById("mejavi-notification-panel");
    const count = document.getElementById("mejavi-notification-count");
    if (!panel || !count) return;

    const active = catalog.filter(isActive);
    const dismissed = readDismissed();
    const visible = active.filter((item) => dismissed[signature(item)] !== true);
    const english = language();

    count.textContent = String(visible.length);
    count.style.display = visible.length ? "block" : "none";
    panel.replaceChildren();

    const heading = document.createElement("strong");
    heading.textContent = english === "en"
      ? "Active promotions"
      : "Promo sedang berlangsung";
    panel.appendChild(heading);

    if (!active.length) {
      const empty = document.createElement("p");
      empty.textContent = english === "en"
        ? "There are no active promotions right now."
        : "Tidak ada promo aktif saat ini.";
      panel.appendChild(empty);
      return;
    }

    if (!visible.length) {
      const empty = document.createElement("p");
      empty.textContent = english === "en"
        ? "All active promotion notifications have been removed."
        : "Semua notifikasi promo aktif sudah dihapus.";
      panel.appendChild(empty);
      return;
    }

    const list = document.createElement("div");
    visible.forEach((item) => {
      const row = document.createElement("article");
      row.className = "mejavi-promo-row";

      const body = document.createElement("div");
      const name = document.createElement("span");
      name.className = "mejavi-promo-name";
      name.textContent = item.name || item.product_name || item.sku || "Produk";
      body.appendChild(name);

      const prices = document.createElement("div");
      prices.className = "mejavi-promo-prices";
      const old = document.createElement("s");
      old.textContent = format(item.original_price);
      const current = document.createElement("strong");
      current.textContent = format(item.price);
      prices.append(old, current);
      body.appendChild(prices);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mejavi-promo-remove";
      remove.textContent = english === "en" ? "Remove" : "Hapus";
      remove.addEventListener("click", () => {
        const next = readDismissed();
        next[signature(item)] = true;
        writeDismissed(next);
        renderNotificationPanel(catalog);
      });

      row.append(body, remove);
      list.appendChild(row);
    });
    panel.appendChild(list);

    const actions = document.createElement("div");
    actions.className = "mejavi-promo-actions";

    const clear = document.createElement("button");
    clear.type = "button";
    clear.textContent = english === "en" ? "Remove all" : "Hapus semua";
    clear.addEventListener("click", () => {
      const next = readDismissed();
      visible.forEach((item) => { next[signature(item)] = true; });
      writeDismissed(next);
      renderNotificationPanel(catalog);
    });

    const close = document.createElement("button");
    close.type = "button";
    close.className = "secondary";
    close.textContent = english === "en" ? "Close" : "Tutup";
    close.addEventListener("click", () => {
      panel.hidden = true;
      document.getElementById("mejavi-notification-btn")?.setAttribute("aria-expanded", "false");
    });

    actions.append(clear, close);
    panel.appendChild(actions);
  }

  async function sync() {
    setupBell();

    try {
      const response = await fetch(API + "?refresh=" + Date.now(), {
        cache: "no-store",
        headers: { "Accept-Language": language(), "Cache-Control": "no-cache" }
      });
      if (!response.ok) return;

      const payload = await response.json();
      applyCatalog(payload.products);
    } catch (_error) {
      // Website tetap memakai harga bawaan ketika Warehouse tidak merespons.
    }
  }

  function refreshCards() {
    if (latestCatalog.length) applyCardPromos(latestCatalog);
  }

  setupBell();
  window.addEventListener(CATALOG_EVENT, (event) => {
    const sharedCatalog = event.detail?.catalog || window.mejaviStorefrontCatalog;
    if (Array.isArray(sharedCatalog)) applyCatalog(sharedCatalog);
  });
  sync();
  window.setInterval(sync, 15000);
  window.addEventListener("mejavi:variant-change", refreshCards);
  window.addEventListener("mejavi:catalog-synced", refreshCards);
  document.getElementById("langBtn")?.addEventListener("click", () => {
    window.setTimeout(refreshCards, 0);
  });
})();