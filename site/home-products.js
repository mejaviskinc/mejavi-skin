/* ==========================================
   MEJAVI HOMEPAGE — COMPACT PRODUCT CAROUSEL
========================================== */

(function () {
  "use strict";

  if (document.body?.dataset.page !== "home") return;

  const SUPABASE_URL = "https://yqutzzhkuuehvmuqzjvb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_l9pctpDmJMd6xnpZWKwx5g_OhRajIql";
  const VOTER_KEY = "mejavi_rating_voter_id_v1";
  const MY_RATINGS_KEY = "mejavi_product_ratings_v1";
  const ratingSummary = new Map();
  let myRatings = readMyRatings();

  function readMyRatings() {
    try {
      const value = JSON.parse(localStorage.getItem(MY_RATINGS_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_error) {
      return {};
    }
  }

  function saveMyRatings() {
    try {
      localStorage.setItem(MY_RATINGS_KEY, JSON.stringify(myRatings));
    } catch (_error) {
      // Rating tetap tersimpan di backend walau localStorage diblokir.
    }
  }

  function getVoterId() {
    try {
      let voterId = localStorage.getItem(VOTER_KEY) || "";
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(voterId)) {
        return voterId;
      }
      voterId = crypto.randomUUID();
      localStorage.setItem(VOTER_KEY, voterId);
      return voterId;
    } catch (_error) {
      return crypto.randomUUID();
    }
  }

  const voterId = getVoterId();

  function injectStyles() {
    if (document.getElementById("mejaviCompactHomeProductStyles")) return;
    const style = document.createElement("style");
    style.id = "mejaviCompactHomeProductStyles";
    style.textContent = `
      .home-products .product-grid{
        grid-auto-columns:190px!important;
        gap:12px!important;
        padding-bottom:12px!important;
      }
      .home-products .product-card{
        width:190px!important;
        min-width:190px!important;
        border-radius:18px!important;
      }
      .home-products .product-image{
        height:190px!important;
        aspect-ratio:1/1;
      }
      .home-products .product-content{
        padding:11px 11px 12px!important;
      }
      .home-products .category,
      .home-products .product-desc,
      .home-products .product-bpom-status,
      .home-products .card-variant-field,
      .home-products .product-actions,
      .home-products .product-badge,
      .home-products .product-bpom-badge,
      .home-products .product-image-dots{
        display:none!important;
      }
      .home-products .product-content h3{
        margin:0 0 6px!important;
        min-height:0!important;
        font-size:13px!important;
        line-height:1.3!important;
        display:-webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient:vertical;
        overflow:hidden;
      }
      .home-products .price{
        margin:0!important;
        font-size:13px!important;
        line-height:1.25!important;
      }
      .home-products .old-price{
        display:inline-block;
        margin-right:5px;
        font-size:9px!important;
      }
      .home-product-buy-overlay{
        position:absolute;
        left:9px;
        right:9px;
        bottom:9px;
        z-index:8;
        min-height:36px;
        border:0;
        border-radius:999px;
        background:rgba(17,17,17,.92);
        color:#fff;
        box-shadow:0 8px 24px rgba(0,0,0,.18);
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
        font:600 11px/1 Poppins,Inter,sans-serif;
        transition:.2s ease;
      }
      .home-product-buy-overlay:hover{
        transform:translateY(-1px);
        background:#000;
      }
      .home-product-rating{
        display:flex;
        align-items:center;
        gap:5px;
        margin-top:8px;
        min-height:20px;
      }
      .home-product-stars{
        display:inline-flex;
        align-items:center;
        gap:1px;
      }
      .home-product-star{
        width:15px;
        height:18px;
        padding:0;
        border:0;
        background:transparent;
        color:#d4d4d4;
        font-size:15px;
        line-height:1;
        cursor:pointer;
      }
      .home-product-star.filled,
      .home-product-star.selected{
        color:#d59d25;
      }
      .home-product-star:focus-visible{
        outline:2px solid #111;
        outline-offset:2px;
        border-radius:4px;
      }
      .home-product-star[disabled]{
        cursor:wait;
        opacity:.65;
      }
      .home-product-rating-meta{
        color:#8a8a8a;
        font:500 9px/1.2 Poppins,Inter,sans-serif;
        white-space:nowrap;
      }
      @media(max-width:720px){
        .home-products .product-grid{
          grid-auto-columns:164px!important;
          gap:10px!important;
        }
        .home-products .product-card{
          width:164px!important;
          min-width:164px!important;
          border-radius:16px!important;
        }
        .home-products .product-image{
          height:164px!important;
        }
        .home-products .product-content{
          padding:10px!important;
        }
        .home-products .product-content h3{
          font-size:12px!important;
        }
        .home-products .price{
          font-size:12px!important;
        }
        .home-product-buy-overlay{
          left:8px;
          right:8px;
          bottom:8px;
          min-height:34px;
          font-size:10px;
        }
        .home-product-star{
          width:14px;
          font-size:14px;
        }
        .home-product-rating-meta{
          display:none;
        }
      }
    `;
    document.head.appendChild(style);
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
      rows.forEach((row) => {
        ratingSummary.set(String(row.product_id), {
          average: Number(row.average_rating || 0),
          count: Number(row.rating_count || 0)
        });
      });
      refreshAllRatings();
    } catch (_error) {
      // Kartu tetap berfungsi walau rating gagal dimuat.
    }
  }

  async function submitRating(productId, rating, widget) {
    if (!productId || rating < 1 || rating > 5 || widget.dataset.saving === "true") return;
    widget.dataset.saving = "true";
    widget.querySelectorAll("button").forEach((button) => { button.disabled = true; });

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_product_rating`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          p_product_id: productId,
          p_voter_id: voterId,
          p_rating: rating
        })
      });
      const rows = await response.json();
      if (!response.ok || !Array.isArray(rows) || !rows[0]) throw new Error("Rating gagal disimpan");

      const row = rows[0];
      ratingSummary.set(productId, {
        average: Number(row.average_rating || rating),
        count: Number(row.rating_count || 1)
      });
      myRatings[productId] = rating;
      saveMyRatings();
      refreshAllRatings();
    } catch (_error) {
      widget.classList.add("rating-error");
      window.setTimeout(() => widget.classList.remove("rating-error"), 1200);
    } finally {
      widget.dataset.saving = "false";
      widget.querySelectorAll("button").forEach((button) => { button.disabled = false; });
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
      star.title = `${value} bintang`;
    });

    const meta = widget.querySelector(".home-product-rating-meta");
    if (summary.count > 0) {
      meta.textContent = `${summary.average.toFixed(1)} (${summary.count})`;
      widget.setAttribute("aria-label", `Rating ${summary.average.toFixed(1)} dari 5, ${summary.count} penilaian`);
    } else {
      meta.textContent = "Beri rating";
      widget.setAttribute("aria-label", "Belum ada rating. Beri rating 1 sampai 5 bintang");
    }

    widget.dataset.visualRating = String(visual);
  }

  function createRatingWidget(productId) {
    const root = document.createElement("div");
    root.className = "home-product-rating";
    root.dataset.ratingProduct = productId;

    const stars = document.createElement("div");
    stars.className = "home-product-stars";
    stars.setAttribute("role", "group");
    stars.setAttribute("aria-label", "Beri rating produk");

    for (let value = 1; value <= 5; value += 1) {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "home-product-star";
      star.dataset.ratingValue = String(value);
      star.textContent = "★";
      star.setAttribute("aria-label", `${value} bintang`);
      star.addEventListener("click", () => submitRating(productId, value, root));
      stars.appendChild(star);
    }

    const meta = document.createElement("span");
    meta.className = "home-product-rating-meta";
    root.append(stars, meta);
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
    const originalBuy = card.querySelector('[data-product-action="buy"]');
    const detailButton = card.querySelector('[data-product-action="detail"]');
    if (!productId || !imageWrap || !content) return;

    card.dataset.homeCompactReady = "true";

    const buy = document.createElement("button");
    buy.type = "button";
    buy.className = "home-product-buy-overlay";
    buy.textContent = "Beli";
    buy.setAttribute("aria-label", "Beli produk");
    buy.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const hasMultipleVariants = Boolean(card.querySelector(".card-variant-select"));
      if (hasMultipleVariants) {
        detailButton?.click();
        return;
      }
      if (originalBuy && !originalBuy.disabled) {
        originalBuy.click();
      } else {
        detailButton?.click();
      }
    });
    imageWrap.appendChild(buy);

    const rating = createRatingWidget(productId);
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
    const observer = new MutationObserver(() => enhanceAllCards());
    observer.observe(grid, { childList: true });
    window.addEventListener("mejavi:catalog-synced", () => window.setTimeout(enhanceAllCards, 30));
  }

  injectStyles();
  watchProductGrid();
  fetchRatingSummary();
})();
