/* ==========================================
   MEJAVI HOMEPAGE — COMPACT PRODUCT CAROUSEL
   Verified-purchase ratings only
========================================== */

(function () {
  "use strict";

  if (document.body?.dataset.page !== "home") return;

  const SUPABASE_URL = "https://yqutzzhkuuehvmuqzjvb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_l9pctpDmJMd6xnpZWKwx5g_OhRajIql";
  const VERIFIED_RATINGS_KEY = "mejavi_verified_product_ratings_v1";
  const ratingSummary = new Map();
  let myRatings = readMyRatings();
  let pendingRating = null;

  function readMyRatings() {
    try {
      const value = JSON.parse(localStorage.getItem(VERIFIED_RATINGS_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_error) {
      return {};
    }
  }

  function saveMyRatings() {
    try {
      localStorage.setItem(VERIFIED_RATINGS_KEY, JSON.stringify(myRatings));
    } catch (_error) {
      // Backend tetap menjadi sumber utama rating.
    }
  }

  function injectStyles() {
    if (document.getElementById("mejaviCompactHomeProductStyles")) return;
    const style = document.createElement("style");
    style.id = "mejaviCompactHomeProductStyles";
    style.textContent = `
      .home-products .product-grid{grid-auto-columns:190px!important;gap:12px!important;padding-bottom:12px!important}
      .home-products .product-card{width:190px!important;min-width:190px!important;border-radius:18px!important}
      .home-products .product-image{height:190px!important;aspect-ratio:1/1}
      .home-products .product-content{padding:11px 11px 12px!important}
      .home-products .category,.home-products .product-desc,.home-products .product-bpom-status,.home-products .card-variant-field,.home-products .product-actions,.home-products .product-badge,.home-products .product-bpom-badge,.home-products .product-image-dots{display:none!important}
      .home-products .product-content h3{margin:0 0 6px!important;min-height:0!important;font-size:13px!important;line-height:1.3!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      .home-products .price{margin:0!important;font-size:13px!important;line-height:1.25!important}
      .home-products .old-price{display:inline-block;margin-right:5px;font-size:9px!important}
      .home-product-buy-overlay{position:absolute;left:9px;right:9px;bottom:9px;z-index:8;min-height:36px;border:0;border-radius:999px;background:rgba(17,17,17,.92);color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font:600 11px/1 Poppins,Inter,sans-serif;transition:.2s ease}
      .home-product-buy-overlay:hover{transform:translateY(-1px);background:#000}
      .home-product-rating{display:flex;flex-wrap:wrap;align-items:center;gap:4px 5px;margin-top:8px;min-height:20px}
      .home-product-stars{display:inline-flex;align-items:center;gap:1px}
      .home-product-star{width:15px;height:18px;padding:0;border:0;background:transparent;color:#d4d4d4;font-size:15px;line-height:1;cursor:pointer}
      .home-product-star.filled,.home-product-star.selected{color:#d59d25}
      .home-product-star:focus-visible{outline:2px solid #111;outline-offset:2px;border-radius:4px}
      .home-product-rating-meta{color:#8a8a8a;font:500 9px/1.2 Poppins,Inter,sans-serif;white-space:nowrap}
      .home-product-verified{display:none;flex-basis:100%;align-items:center;gap:4px;color:#4f7448;font:600 8px/1.2 Poppins,Inter,sans-serif}
      .home-product-verified.show{display:flex}
      .rating-verify-overlay{position:fixed;inset:0;z-index:20000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.5);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
      .rating-verify-overlay.open{display:flex}
      .rating-verify-card{position:relative;width:min(420px,100%);border:1px solid #e7e7e7;border-radius:24px;background:#fff;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,.2)}
      .rating-verify-close{position:absolute;top:13px;right:13px;width:36px;height:36px;border:0;border-radius:50%;background:#f3f3f3;font-size:22px;line-height:1}
      .rating-verify-kicker{display:inline-flex;margin-bottom:9px;padding:5px 9px;border-radius:999px;background:#eef5ec;color:#557c4d;font:700 9px/1 Poppins,Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase}
      .rating-verify-card h3{margin:0;padding-right:40px;font:600 22px/1.2 Poppins,Inter,sans-serif}
      .rating-verify-card p{margin:8px 0 0;color:#737373;font:400 12px/1.6 Poppins,Inter,sans-serif}
      .rating-verify-stars{margin:16px 0 4px;color:#d59d25;font-size:25px;letter-spacing:2px}
      .rating-verify-product{margin-bottom:15px;color:#444;font:600 11px/1.4 Poppins,Inter,sans-serif}
      .rating-verify-field{display:grid;gap:6px;margin-top:12px}
      .rating-verify-field span{font:600 11px/1.2 Poppins,Inter,sans-serif}
      .rating-verify-field input{width:100%;min-height:44px;border:1px solid #ddd;border-radius:13px;padding:0 12px;background:#fff;color:#111;font:500 13px/1 Poppins,Inter,sans-serif;outline:none}
      .rating-verify-field input:focus{border-color:#111}
      .rating-verify-error{min-height:18px;margin:10px 0 0!important;color:#b00020!important;font-size:10px!important}
      .rating-verify-submit{width:100%;min-height:46px;margin-top:4px;border:0;border-radius:999px;background:#111;color:#fff;font:600 12px/1 Poppins,Inter,sans-serif}
      .rating-verify-submit:disabled{opacity:.55;cursor:wait}
      .rating-verify-note{display:block;margin-top:10px;color:#999;font:400 9px/1.5 Poppins,Inter,sans-serif}
      @media(max-width:720px){
        .home-products .product-grid{grid-auto-columns:164px!important;gap:10px!important}
        .home-products .product-card{width:164px!important;min-width:164px!important;border-radius:16px!important}
        .home-products .product-image{height:164px!important}
        .home-products .product-content{padding:10px!important}
        .home-products .product-content h3{font-size:12px!important}
        .home-products .price{font-size:12px!important}
        .home-product-buy-overlay{left:8px;right:8px;bottom:8px;min-height:34px;font-size:10px}
        .home-product-star{width:14px;font-size:14px}
        .home-product-rating-meta{font-size:8px}
        .home-product-verified{font-size:7px}
        .rating-verify-card{padding:21px;border-radius:21px}
      }
    `;
    document.head.appendChild(style);
  }

  function createVerificationModal() {
    if (document.getElementById("ratingVerifyOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "ratingVerifyOverlay";
    overlay.className = "rating-verify-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "ratingVerifyTitle");
    overlay.innerHTML = `
      <div class="rating-verify-card">
        <button type="button" class="rating-verify-close" aria-label="Tutup">×</button>
        <span class="rating-verify-kicker">Pembelian Terverifikasi</span>
        <h3 id="ratingVerifyTitle">Verifikasi sebelum memberi rating</h3>
        <p>Rating hanya dapat diberikan untuk pesanan Mejavi Skin+ yang sudah dibayar dan berisi produk ini.</p>
        <div class="rating-verify-stars" id="ratingVerifyStars" aria-hidden="true"></div>
        <div class="rating-verify-product" id="ratingVerifyProduct"></div>
        <form id="ratingVerifyForm" novalidate>
          <label class="rating-verify-field">
            <span>Nomor Pesanan</span>
            <input id="ratingOrderNumber" type="text" maxlength="80" autocomplete="off" placeholder="Contoh: MJV-..." required>
          </label>
          <label class="rating-verify-field">
            <span>Nomor WhatsApp pembeli</span>
            <input id="ratingPhone" type="tel" maxlength="20" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" required>
          </label>
          <p class="rating-verify-error" id="ratingVerifyError" aria-live="polite"></p>
          <button class="rating-verify-submit" id="ratingVerifySubmit" type="submit">Verifikasi & Kirim Rating</button>
          <small class="rating-verify-note">Nomor WhatsApp hanya dipakai untuk mencocokkan pesanan dan tidak disimpan pada data rating.</small>
        </form>
      </div>
    `;

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeVerificationModal();
    });
    overlay.querySelector(".rating-verify-close").addEventListener("click", closeVerificationModal);
    overlay.querySelector("#ratingVerifyForm").addEventListener("submit", submitVerifiedRating);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("open")) closeVerificationModal();
    });
    document.body.appendChild(overlay);
  }

  function openVerificationModal(productId, productName, rating, widget) {
    pendingRating = { productId, productName, rating, widget };
    const overlay = document.getElementById("ratingVerifyOverlay");
    const form = document.getElementById("ratingVerifyForm");
    form.reset();
    document.getElementById("ratingVerifyError").textContent = "";
    document.getElementById("ratingVerifyStars").textContent = "★".repeat(rating) + "☆".repeat(5 - rating);
    document.getElementById("ratingVerifyProduct").textContent = productName || "Produk Mejavi Skin+";
    overlay.classList.add("open");
    document.body.classList.add("lock");
    window.setTimeout(() => document.getElementById("ratingOrderNumber").focus(), 20);
  }

  function closeVerificationModal() {
    const overlay = document.getElementById("ratingVerifyOverlay");
    overlay?.classList.remove("open");
    document.body.classList.remove("lock");
    pendingRating = null;
  }

  async function fetchRatingSummary() {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_product_rating_summary`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: "{}"
      });
      if (!response.ok) return;
      const rows = await response.json();
      if (!Array.isArray(rows)) return;
      ratingSummary.clear();
      rows.forEach((row) => {
        ratingSummary.set(String(row.product_id), {
          average: Number(row.average_rating || 0),
          count: Number(row.rating_count || 0)
        });
      });
      refreshAllRatings();
    } catch (_error) {
      // Kartu tetap berfungsi walau ringkasan rating belum tersedia.
    }
  }

  async function submitVerifiedRating(event) {
    event.preventDefault();
    if (!pendingRating) return;

    const orderNumber = document.getElementById("ratingOrderNumber").value.trim();
    const phone = document.getElementById("ratingPhone").value.trim();
    const errorEl = document.getElementById("ratingVerifyError");
    const submit = document.getElementById("ratingVerifySubmit");

    if (orderNumber.length < 3 || phone.replace(/\D/g, "").length < 8) {
      errorEl.textContent = "Isi nomor pesanan dan WhatsApp yang digunakan saat membeli.";
      return;
    }

    submit.disabled = true;
    submit.textContent = "Memverifikasi…";
    errorEl.textContent = "";

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_verified_product_rating`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          p_product_id: pendingRating.productId,
          p_order_number: orderNumber,
          p_phone: phone,
          p_rating: pendingRating.rating
        })
      });
      const rows = await response.json().catch(() => null);
      if (!response.ok || !Array.isArray(rows) || !rows[0]?.verified_purchase) {
        throw new Error("VERIFICATION_FAILED");
      }

      const row = rows[0];
      ratingSummary.set(pendingRating.productId, {
        average: Number(row.average_rating || pendingRating.rating),
        count: Number(row.rating_count || 1)
      });
      myRatings[pendingRating.productId] = pendingRating.rating;
      saveMyRatings();
      refreshAllRatings();
      closeVerificationModal();
    } catch (_error) {
      errorEl.textContent = "Pesanan tidak dapat diverifikasi. Pastikan nomor pesanan, WhatsApp, status pembayaran, dan produknya sudah sesuai.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Verifikasi & Kirim Rating";
    }
  }

  function renderRating(widget, productId) {
    const summary = ratingSummary.get(productId) || { average: 0, count: 0 };
    const mine = Number(myRatings[productId] || 0);
    const visual = mine || Math.round(summary.average);

    widget.querySelectorAll(".home-product-star").forEach((star) => {
      const value = Number(star.dataset.ratingValue);
      star.classList.toggle("filled", value <= Math.round(summary.average));
      star.classList.toggle("selected", mine > 0 && value <= mine);
      star.setAttribute("aria-pressed", String(mine === value));
    });

    const meta = widget.querySelector(".home-product-rating-meta");
    const verified = widget.querySelector(".home-product-verified");
    if (summary.count > 0) {
      meta.textContent = `${summary.average.toFixed(1)} (${summary.count})`;
      verified.classList.add("show");
      widget.setAttribute("aria-label", `Rating terverifikasi ${summary.average.toFixed(1)} dari 5, ${summary.count} penilaian`);
    } else {
      meta.textContent = "Beri rating";
      verified.classList.remove("show");
      widget.setAttribute("aria-label", "Belum ada rating terverifikasi. Klik bintang untuk memberi rating setelah pembelian.");
    }
    widget.dataset.visualRating = String(visual);
  }

  function createRatingWidget(productId, productName) {
    const root = document.createElement("div");
    root.className = "home-product-rating";
    root.dataset.ratingProduct = productId;

    const stars = document.createElement("div");
    stars.className = "home-product-stars";
    stars.setAttribute("role", "group");
    stars.setAttribute("aria-label", "Beri rating pembelian terverifikasi");

    for (let value = 1; value <= 5; value += 1) {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "home-product-star";
      star.dataset.ratingValue = String(value);
      star.textContent = "★";
      star.setAttribute("aria-label", `${value} bintang`);
      star.addEventListener("click", () => openVerificationModal(productId, productName, value, root));
      stars.appendChild(star);
    }

    const meta = document.createElement("span");
    meta.className = "home-product-rating-meta";
    const verified = document.createElement("span");
    verified.className = "home-product-verified";
    verified.textContent = "✓ Pembelian Terverifikasi";
    root.append(stars, meta, verified);
    renderRating(root, productId);
    return root;
  }

  function refreshAllRatings() {
    document.querySelectorAll(".home-product-rating[data-rating-product]").forEach((widget) => {
      renderRating(widget, widget.dataset.ratingProduct);
    });
  }

  function enhanceCard(card) {
    if (!card || card.dataset.homeCompactReady === "true") return;
    const productId = String(card.dataset.productId || "").trim();
    const imageWrap = card.querySelector(".product-image");
    const content = card.querySelector(".product-content");
    const title = content?.querySelector("h3")?.textContent?.trim() || "Produk Mejavi Skin+";
    const originalBuy = card.querySelector('[data-product-action="buy"]');
    const detailButton = card.querySelector('[data-product-action="detail"]');
    if (!productId || !imageWrap || !content) return;

    card.dataset.homeCompactReady = "true";

    const buy = document.createElement("button");
    buy.type = "button";
    buy.className = "home-product-buy-overlay";
    buy.textContent = "Beli";
    buy.setAttribute("aria-label", `Beli ${title}`);
    buy.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (card.querySelector(".card-variant-select")) {
        detailButton?.click();
        return;
      }
      if (originalBuy && !originalBuy.disabled) originalBuy.click();
      else detailButton?.click();
    });
    imageWrap.appendChild(buy);

    const rating = createRatingWidget(productId, title);
    const price = content.querySelector(".price");
    if (price) price.insertAdjacentElement("afterend", rating);
    else content.appendChild(rating);
  }

  function enhanceAllCards() {
    const grid = document.querySelector(".home-products #productGrid");
    if (!grid) return;
    grid.querySelectorAll(".product-card").forEach(enhanceCard);
  }

  function watchProductGrid() {
    const grid = document.querySelector(".home-products #productGrid");
    if (!grid) {
      window.setTimeout(watchProductGrid, 120);
      return;
    }
    enhanceAllCards();
    const observer = new MutationObserver(enhanceAllCards);
    observer.observe(grid, { childList: true });
    window.addEventListener("mejavi:catalog-synced", () => window.setTimeout(enhanceAllCards, 30));
  }

  injectStyles();
  createVerificationModal();
  watchProductGrid();
  fetchRatingSummary();
})();
