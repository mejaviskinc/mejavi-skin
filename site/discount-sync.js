(function () {
  const API = "https://yqutzzhkuuehvmuqzjvb.supabase.co/functions/v1/mejavi-storefront";
  const format = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
  async function syncDiscountNotice() {
    try {
      const response = await fetch(API + "?refresh=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const active = (data.products || []).filter((item) => item.discount_active);
      let notice = document.getElementById("mejavi-discount-notice");
      if (!active.length) { if (notice) notice.hidden = true; return; }
      if (!notice) {
        notice = document.createElement("aside");
        notice.id = "mejavi-discount-notice";
        notice.setAttribute("role", "status");
        notice.style.cssText = "margin:18px auto;padding:14px 18px;max-width:1120px;border:1px solid #e7d6bd;border-radius:16px;background:#fff8ee;color:#211b16;box-shadow:0 6px 18px rgba(0,0,0,.06);font-size:15px";
        (document.querySelector("main") || document.body).prepend(notice);
      }
      notice.hidden = false;
      notice.innerHTML = "<strong>Promo sedang berlangsung</strong><br>" + active.map((item) => "<span style='display:inline-block;margin-top:5px;margin-right:12px'><b>" + item.name + "</b>: <s>" + format(item.original_price) + "</s> <strong>" + format(item.price) + "</strong></span>").join("");
    } catch (_) {}
  }
  syncDiscountNotice();
  setInterval(syncDiscountNotice, 15000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncDiscountNotice(); });
})();