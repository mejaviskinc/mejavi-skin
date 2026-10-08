/* ==========================================
   MEJAVI STORE — WEBSITE ↔ WAREHOUSE
========================================== */

(function () {
  "use strict";

  const API_URL =
    "https://yqutzzhkuuehvmuqzjvb.supabase.co/functions/v1/mejavi-storefront";
  const LAST_ORDER_KEY = "mejavi_last_order";
  const CHECKOUT_MODE = "lynk_single_entry";
  let activeProduct = null;
  let activeVariant = null;
  let orderKey = "";
  let catalogLoaded = false;

  const TRUSTED_IMAGE_HOSTS = Object.freeze([
    "mejaviskincare.co.id",
    "mejaviskinc.github.io",
    "yqutzzhkuuehvmuqzjvb.supabase.co"
  ]);
  const TRUSTED_CHECKOUT_HOSTS = Object.freeze(["lynk.id"]);

  function trustedHost(hostname, allowedHosts) {
    return allowedHosts.some((host) =>
      hostname === host || hostname.endsWith(`.${host}`)
    );
  }

  function safeUrl(value, {
    allowedHosts = [],
    allowDataImage = false,
    fallback = ""
  } = {}) {
    const raw = String(value ?? "").trim();
    if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return fallback;
    if (/^(?:javascript|vbscript):/i.test(raw.replace(/\s+/g, ""))) {
      return fallback;
    }

    if (
      allowDataImage &&
      /^data:image\/(?:png|jpe?g|webp|gif|svg\+xml);base64,/i.test(raw)
    ) {
      return raw;
    }

    try {
      const parsed = new URL(raw, window.location.href);

      if (parsed.origin === window.location.origin) {
        return /^[a-z][a-z0-9+.-]*:/i.test(raw) ? parsed.href : raw;
      }

      if (
        parsed.protocol === "https:" &&
        trustedHost(parsed.hostname, allowedHosts)
      ) {
        return parsed.href;
      }
    } catch (_error) {
      return fallback;
    }

    return fallback;
  }

  function safeImageSrc(value, fallback = "") {
    return safeUrl(value, {
      allowedHosts: TRUSTED_IMAGE_HOSTS,
      allowDataImage: true,
      fallback
    });
  }

  function safeCheckoutUrl(value) {
    return safeUrl(value, {
      allowedHosts: TRUSTED_CHECKOUT_HOSTS,
      fallback: "#"
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const copy = {
    id: {
      track: "Lacak Pesanan",
      eyebrow: "Checkout Mejavi",
      title: "Data cukup diisi satu kali",
      subtitle: "Nama, alamat, nomor WhatsApp, jumlah, pengiriman, dan pembayaran dilanjutkan di Lynk.id. Setelah pembayaran sukses, order otomatis masuk ke Mejavi Warehouse.",
      product: "Produk",
      quantity: "Jumlah",
      name: "Nama lengkap",
      phone: "Nomor WhatsApp",
      email: "Email (opsional)",
      address: "Alamat lengkap",
      city: "Kota / Kabupaten",
      province: "Provinsi",
      postal: "Kode pos",
      note: "Catatan pesanan (opsional)",
      submit: "Lanjut ke Lynk.id",
      submitting: "Membuka Lynk.id…",
      secure: "Website Mejavi tidak akan meminta alamat lagi. Isi data pengiriman satu kali di Lynk.id.",
      unavailable: "Stok produk ini belum tersedia.",
      successEyebrow: "Pesanan berhasil dibuat",
      successTitle: "Lanjutkan pembayaran",
      successBody:
        "Nomor pesananmu sudah tercatat. Selesaikan pembayaran melalui Lynk.id agar tim dapat memprosesnya.",
      orderNumber: "Nomor pesanan",
      total: "Total",
      payment: "Status pembayaran",
      pending: "Menunggu pembayaran",
      pay: "Bayar melalui Lynk.id",
      trackOrder: "Lacak pesanan",
      close: "Tutup",
      genericError: "Pesanan belum dapat dibuat. Silakan coba lagi.",
      stock: "Stok",
      soldOut: "Stok habis"
    },
    en: {
      track: "Track Order",
      eyebrow: "Mejavi checkout",
      title: "Enter your details only once",
      subtitle: "Name, address, WhatsApp number, quantity, shipping, and payment are completed on Lynk.id. After successful payment, the order is synced automatically to Mejavi Warehouse.",
      product: "Product",
      quantity: "Quantity",
      name: "Full name",
      phone: "WhatsApp number",
      email: "Email (optional)",
      address: "Full address",
      city: "City / Regency",
      province: "Province",
      postal: "Postal code",
      note: "Order note (optional)",
      submit: "Continue to Lynk.id",
      submitting: "Opening Lynk.id…",
      secure: "The Mejavi website will not ask for your address again. Enter shipping details once on Lynk.id.",
      unavailable: "This product is currently out of stock.",
      successEyebrow: "Order created",
      successTitle: "Continue to payment",
      successBody:
        "Your order number has been recorded. Complete payment through Lynk.id so the team can process it.",
      orderNumber: "Order number",
      total: "Total",
      payment: "Payment status",
      pending: "Pending payment",
      pay: "Pay through Lynk.id",
      trackOrder: "Track order",
      close: "Close",
      genericError: "Your order could not be created. Please try again.",
      stock: "Stock",
      soldOut: "Out of stock"
    }
  };

  function language() {
    return localStorage.getItem("mejavi_language") === "en" ? "en" : "id";
  }

  function text() {
    return copy[language()];
  }

  function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function variantImage(variant) {
    const value =
      variant?.image ??
      variant?.image_url ??
      variant?.imageUrl ??
      variant?.photo ??
      variant?.photo_url;

    return safeImageSrc(value);
  }

  function productImage(product, variant) {
    const mainImage = safeImageSrc(product?.image);

    if (product?.isBundle && mainImage) return mainImage;
    return variantImage(variant) || mainImage || "logo-mejavi.png";
  }

  function newOrderKey() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `web-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function injectTrackingLinks() {
    const t = text();

    document.querySelectorAll(".desktop-nav, .mobile-links").forEach((nav) => {
      if (nav.querySelector("[data-order-tracking-link]")) return;
      const link = document.createElement("a");
      link.href = "track.html";
      link.dataset.orderTrackingLink = "true";
      link.textContent = t.track;
      nav.appendChild(link);
    });

    const footerLinks = document.querySelector("footer .footer-links");
    if (footerLinks && !footerLinks.querySelector("[data-order-tracking-link]")) {
      const link = document.createElement("a");
      link.href = "track.html";
      link.dataset.orderTrackingLink = "true";
      link.textContent = t.track;
      footerLinks.appendChild(link);
    }
  }

  function refreshLanguage() {
    const t = text();
    document.querySelectorAll("[data-order-tracking-link]").forEach((link) => {
      link.textContent = t.track;
    });

    const modal = document.getElementById("orderModal");
    if (!modal || !modal.classList.contains("active")) return;
    if (modal.dataset.state === "success") return;
    if (modal.dataset.state === "lynk") renderLynkCheckout();
    else renderCheckout();
  }

  function ensureModal() {
    if (document.getElementById("orderModal")) return;

    const modal = document.createElement("div");
    modal.className = "order-modal";
    modal.id = "orderModal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="order-modal-backdrop" data-order-close></div>
      <section class="order-dialog" role="dialog" aria-modal="true" aria-labelledby="orderTitle">
        <button class="order-close" type="button" data-order-close aria-label="Close">×</button>
        <div id="orderModalContent"></div>
      </section>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll("[data-order-close]").forEach((button) => {
      button.addEventListener("click", closeCheckout);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        closeCheckout();
      }
    });
  }

  function openCheckout(product, variant) {
    ensureModal();
    activeProduct = product;
    activeVariant = variant;
    orderKey = newOrderKey();

    const productModal = document.getElementById("productModal");
    if (productModal) productModal.classList.remove("active");

    if (CHECKOUT_MODE === "lynk_single_entry") {
      renderLynkCheckout();
    } else {
      renderCheckout();
    }
    const modal = document.getElementById("orderModal");
    modal.dataset.state = CHECKOUT_MODE === "lynk_single_entry" ? "lynk" : "form";
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    window.setTimeout(() => modal.querySelector("button, a, input")?.focus(), 80);
  }

  function closeCheckout() {
    const modal = document.getElementById("orderModal");
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");
  }

  function renderLynkCheckout() {
    const t = text();
    const content = document.getElementById("orderModalContent");
    if (!content || !activeProduct || !activeVariant) return;

    const available = activeVariant.available !== false;
    const checkoutUrl = safeCheckoutUrl(activeVariant.lynk);
    const canCheckout = available && checkoutUrl !== "#";
    const stockText = Number.isFinite(Number(activeVariant.stock))
      ? `${t.stock}: ${Math.max(0, Number(activeVariant.stock))}`
      : "";

    content.innerHTML = `
      <div class="order-heading">
        <span class="order-eyebrow">${t.eyebrow}</span>
        <h2 id="orderTitle">${t.title}</h2>
        <p>${t.subtitle}</p>
      </div>

      <div class="order-product-summary">
        <img src="${escapeHtml(productImage(activeProduct, activeVariant))}" alt="">
        <div>
          <span>${t.product}</span>
          <strong id="orderProductName"></strong>
          <small id="orderVariantInfo"></small>
        </div>
      </div>

      <div class="order-success-actions">
        <a class="order-submit ${canCheckout ? "" : "disabled"}"
           href="${canCheckout ? escapeHtml(checkoutUrl) : "#"}"
           ${canCheckout ? 'target="_blank" rel="noopener noreferrer"' : 'aria-disabled="true"'}
           data-lynk-checkout>
          ${canCheckout ? t.submit : t.unavailable}
        </a>
        <a class="order-secondary" href="track.html">${t.trackOrder}</a>
      </div>
      <p class="order-privacy">${stockText ? `${stockText} · ` : ""}${t.secure}</p>
      <div class="order-flow-note">
        <strong>${language() === "en" ? "Automatic order sync" : "Sinkronisasi order otomatis"}</strong>
        <span>${language() === "en"
          ? "Successful Lynk.id payments are sent to Supabase and appear in Mejavi Warehouse as paid orders."
          : "Pembayaran Lynk.id yang berhasil dikirim ke Supabase dan muncul di Mejavi Warehouse sebagai order yang sudah dibayar."}</span>
      </div>
    `;

    content.querySelector("#orderProductName").textContent =
      activeProduct.name[language()] || activeProduct.name.id;
    content.querySelector("#orderVariantInfo").textContent =
      `${activeVariant.size} · ${rupiah(activeVariant.price)}`;

    const link = content.querySelector("[data-lynk-checkout]");
    if (link && canCheckout) {
      link.addEventListener("click", () => {
        localStorage.setItem("mejavi_last_lynk_product", JSON.stringify({
          sku: activeVariant.sku,
          lynk: checkoutUrl,
          opened_at: new Date().toISOString()
        }));
        window.setTimeout(closeCheckout, 250);
      });
    } else if (link) {
      link.addEventListener("click", (event) => event.preventDefault());
    }
  }

  function renderCheckout() {
    const t = text();
    const content = document.getElementById("orderModalContent");
    if (!content || !activeProduct || !activeVariant) return;

    const available = activeVariant.available !== false;
    const stockText = Number.isFinite(Number(activeVariant.stock))
      ? `${t.stock}: ${Math.max(0, Number(activeVariant.stock))}`
      : "";

    content.innerHTML = `
      <div class="order-heading">
        <span class="order-eyebrow">${t.eyebrow}</span>
        <h2 id="orderTitle">${t.title}</h2>
        <p>${t.subtitle}</p>
      </div>

      <div class="order-product-summary">
        <img src="${escapeHtml(productImage(activeProduct, activeVariant))}" alt="">
        <div>
          <span>${t.product}</span>
          <strong id="orderProductName"></strong>
          <small id="orderVariantInfo"></small>
        </div>
      </div>

      <form class="order-form" id="orderForm" novalidate>
        <div class="order-field order-field-full order-honeypot" aria-hidden="true">
          <label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label>
        </div>
        <div class="order-field">
          <label for="orderName">${t.name}</label>
          <input id="orderName" name="name" type="text" minlength="2" maxlength="100" autocomplete="name" required>
        </div>
        <div class="order-field">
          <label for="orderPhone">${t.phone}</label>
          <input id="orderPhone" name="phone" type="tel" inputmode="tel" minlength="9" maxlength="20" placeholder="08xxxxxxxxxx" autocomplete="tel" required>
        </div>
        <div class="order-field">
          <label for="orderEmail">${t.email}</label>
          <input id="orderEmail" name="email" type="email" maxlength="120" autocomplete="email">
        </div>
        <div class="order-field">
          <label for="orderQuantity">${t.quantity}</label>
          <input id="orderQuantity" name="quantity" type="number" min="1" max="${Math.min(20, Math.max(1, Number(activeVariant.stock) || 20))}" value="1" inputmode="numeric" required>
        </div>
        <div class="order-field order-field-full">
          <label for="orderAddress">${t.address}</label>
          <textarea id="orderAddress" name="address" minlength="8" maxlength="300" autocomplete="street-address" required></textarea>
        </div>
        <div class="order-field">
          <label for="orderCity">${t.city}</label>
          <input id="orderCity" name="city" type="text" minlength="2" maxlength="100" autocomplete="address-level2" required>
        </div>
        <div class="order-field">
          <label for="orderProvince">${t.province}</label>
          <input id="orderProvince" name="province" type="text" maxlength="100" autocomplete="address-level1">
        </div>
        <div class="order-field">
          <label for="orderPostal">${t.postal}</label>
          <input id="orderPostal" name="postal_code" type="text" inputmode="numeric" maxlength="12" autocomplete="postal-code">
        </div>
        <div class="order-field">
          <label for="orderNote">${t.note}</label>
          <input id="orderNote" name="note" type="text" maxlength="500">
        </div>
        <div class="order-error order-field-full" id="orderError" role="alert"></div>
        <div class="order-field-full">
          <button class="order-submit" type="submit" ${available ? "" : "disabled"}>
            ${available ? t.submit : t.unavailable}
          </button>
          <p class="order-privacy">${stockText ? `${stockText} · ` : ""}${t.secure}</p>
        </div>
      </form>
    `;

    content.querySelector("#orderProductName").textContent =
      activeProduct.name[language()] || activeProduct.name.id;
    content.querySelector("#orderVariantInfo").textContent =
      `${activeVariant.size} · ${rupiah(activeVariant.price)}`;
    content.querySelector("#orderForm").addEventListener("submit", submitOrder);
  }

  async function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const errorBox = form.querySelector("#orderError");
    const submit = form.querySelector(".order-submit");
    const t = text();

    errorBox.textContent = "";
    if (!form.reportValidity()) return;
    if (activeVariant.available === false) {
      errorBox.textContent = t.unavailable;
      return;
    }

    const fields = new FormData(form);
    const quantity = Number(fields.get("quantity"));
    submit.disabled = true;
    submit.textContent = t.submitting;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language()
        },
        body: JSON.stringify({
          action: "create_order",
          website: fields.get("website"),
          customer: {
            name: String(fields.get("name") || "").trim(),
            phone: String(fields.get("phone") || "").trim(),
            email: String(fields.get("email") || "").trim()
          },
          shipping: {
            address: String(fields.get("address") || "").trim(),
            city: String(fields.get("city") || "").trim(),
            province: String(fields.get("province") || "").trim(),
            postal_code: String(fields.get("postal_code") || "").trim()
          },
          items: [{ sku: activeVariant.sku, quantity }],
          note: String(fields.get("note") || "").trim(),
          idempotency_key: orderKey,
          checkout_url: safeCheckoutUrl(activeVariant.lynk)
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.order) {
        throw new Error(payload.message || t.genericError);
      }

      const savedOrder = {
        order_number: payload.order.order_number,
        phone: String(fields.get("phone") || "").trim(),
        created_at: new Date().toISOString()
      };
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(savedOrder));
      renderSuccess(payload.order);
    } catch (error) {
      errorBox.textContent = error.message || t.genericError;
      submit.disabled = false;
      submit.textContent = t.submit;
    }
  }

  function renderSuccess(order) {
    const t = text();
    const content = document.getElementById("orderModalContent");
    const modal = document.getElementById("orderModal");
    const checkoutUrl = safeCheckoutUrl(order.checkout_url);
    modal.dataset.state = "success";
    content.innerHTML = `
      <div class="order-success-mark" aria-hidden="true">✓</div>
      <div class="order-heading order-heading-center">
        <span class="order-eyebrow">${t.successEyebrow}</span>
        <h2 id="orderTitle">${t.successTitle}</h2>
        <p>${t.successBody}</p>
      </div>
      <dl class="order-receipt">
        <div><dt>${t.orderNumber}</dt><dd id="successOrderNumber"></dd></div>
        <div><dt>${t.total}</dt><dd id="successOrderTotal"></dd></div>
        <div><dt>${t.payment}</dt><dd>${t.pending}</dd></div>
      </dl>
      <div class="order-success-actions">
        <a class="order-submit${checkoutUrl === "#" ? " disabled" : ""}" href="${escapeHtml(checkoutUrl)}" target="_blank" rel="noopener noreferrer">${t.pay}</a>
        <a class="order-secondary" href="track.html?order=${encodeURIComponent(order.order_number)}">${t.trackOrder}</a>
        <button class="order-link-button" type="button" data-order-close-success>${t.close}</button>
      </div>
    `;
    content.querySelector("#successOrderNumber").textContent = order.order_number;
    content.querySelector("#successOrderTotal").textContent = rupiah(order.total);
    if (checkoutUrl === "#") {
      const paymentLink = content.querySelector(".order-submit");
      paymentLink.setAttribute("aria-disabled", "true");
      paymentLink.addEventListener("click", (event) => event.preventDefault());
    }
    content.querySelector("[data-order-close-success]").addEventListener("click", closeCheckout);
  }

  async function syncCatalog() {
    try {
      const response = await fetch(`${API_URL}?refresh=${Date.now()}`, {
        cache: "no-store",
        headers: { "Accept-Language": language(), "Cache-Control": "no-cache" }
      });
      if (!response.ok) return;
      const payload = await response.json();
      const products = Array.isArray(payload.products) ? payload.products : [];
      const catalog = new Map(products.map((item) => [String(item.sku), item]));

      (window.mejaviProducts || []).forEach((product) => {
        product.variants.forEach((variant) => {
          const current = catalog.get(variant.sku);
          if (!current) return;
          variant.price = Number(current.price);
          variant.originalPrice = current.discount_active
            ? Number(current.original_price)
            : 0;
          variant.discountType = current.discount_type || "none";
          variant.discountValue = Number(current.discount_value || 0);
          variant.discountStartsAt = current.discount_starts_at || null;
          variant.discountEndsAt = current.discount_ends_at || null;
          variant.discountActive = Boolean(current.discount_active);
          variant.stock = Number(current.stock);
          variant.available = Boolean(current.available);
          variant.image = typeof current.image_url === "string"
            ? current.image_url.trim()
            : "";

          // Produk tunggal biasa boleh memakai foto dari Warehouse. Bundle
          // tetap memakai galeri website agar foto paket utama tidak tertimpa.
          if (!product.isBundle && product.variants.length === 1 && variant.image) {
            product.image = variant.image;
          }
        });
      });

      window.mejaviStorefrontCatalog = products;
      window.mejaviStorefrontCatalogMeta = {
        updatedAt: payload.catalog_updated_at || null,
        syncedAt: payload.synced_at || null
      };
      catalogLoaded = true;
      if (typeof window.renderProducts === "function") window.renderProducts();
      decorateProductStock();
      window.dispatchEvent(new CustomEvent("mejavi:catalog-synced", {
        detail: {
          catalog: products,
          updatedAt: payload.catalog_updated_at || null,
          syncedAt: payload.synced_at || null
        }
      }));
    } catch (_error) {
      catalogLoaded = false;
    }
  }

  function decorateProductStock() {
    const cards = document.querySelectorAll("#productGrid .product-card");
    cards.forEach((card, index) => {
      const product = (window.mejaviProducts || [])[index];
      if (!product?.variants?.length) return;

      const selectedValue = card.dataset.selectedVariant;
      const selectionConfirmed = product.variants.length <= 1 ||
        card.dataset.variantConfirmed === "true";
      const needsSelection = product.variants.length > 1 && !selectionConfirmed;
      const variantIndex = needsSelection ? null : Number(selectedValue || 0);
      const variant = variantIndex === null ? null : product.variants[variantIndex];

      const buy = card.querySelector(".small-btn.buy");
      const existing = card.querySelector(".warehouse-stock-note");
      if (existing) existing.remove();

      const note = document.createElement("small");
      note.className = "warehouse-stock-note";
      if (needsSelection) {
        note.textContent = language() === "en" ? "Choose a size first to unlock buying." : "Pilih ukuran terlebih dahulu untuk membeli.";
        if (buy) buy.disabled = true;
      } else if (variant.available === false) {
        note.classList.add("sold-out");
        note.textContent = text().soldOut;
        if (buy) buy.disabled = true;
      } else if (catalogLoaded && Number.isFinite(Number(variant.stock))) {
        note.textContent = `${text().stock}: ${Number(variant.stock)}`;
        if (buy) buy.disabled = false;
      } else if (buy) {
        buy.disabled = false;
      }
      card.querySelector(".product-actions")?.before(note);
    });
  }

  function bootstrap() {
    ensureModal();
    injectTrackingLinks();
    syncCatalog();

    // Keep storefront availability aligned with the warehouse without a page refresh.
    window.setInterval(syncCatalog, 15_000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncCatalog();
    });
    window.addEventListener("online", syncCatalog);

    document.getElementById("langBtn")?.addEventListener("click", () => {
      window.setTimeout(() => {
        refreshLanguage();
        decorateProductStock();
      }, 0);
    });

    window.addEventListener("mejavi:variant-change", decorateProductStock);
  }

  window.mejaviStore = {
    apiUrl: API_URL,
    openCheckout,
    closeCheckout,
    syncCatalog
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
