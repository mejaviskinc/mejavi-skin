(function () {
  const API = "https://yqutzzhkuuehvmuqzjvb.supabase.co/functions/v1/mejavi-storefront";
  const DISMISS_KEY = "mejavi_discount_notice_dismissed";
  const format = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
  let activeSignature = "";
  function setupBell() {
    const tools = document.querySelector(".nav-tools");
    if (!tools || document.getElementById("mejavi-notification-wrap")) return;
    const wrap = document.createElement("div");
    wrap.id = "mejavi-notification-wrap";
    wrap.style.cssText = "position:relative;display:inline-flex";
    if (!document.getElementById("mejavi-notification-style")) { const style = document.createElement("style"); style.id = "mejavi-notification-style"; style.textContent = "#mejavi-notification-wrap{flex-shrink:0}#mejavi-notification-panel{max-height:70vh;overflow:auto}@media(max-width:600px){#mejavi-notification-wrap{position:static!important}#mejavi-notification-panel{position:fixed!important;left:12px!important;right:12px!important;top:68px!important;width:auto!important;max-height:70vh;border-radius:18px!important;padding:18px!important;font-size:14px!important}#mejavi-notification-btn{padding:10px!important}}"; document.head.appendChild(style); }\n    wrap.innerHTML = "<button id='mejavi-notification-btn'    wrap.innerHTML = "<button id='mejavi-notification-btn' type='button' aria-label='Notifikasi promo' style='position:relative;border:0;background:transparent;font-size:21px;cursor:pointer;padding:8px'><svg viewBox='0 0 24 24' width='21' height='21' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9'/><path d='M10 21h4'/></svg><span id='mejavi-notification-count' style='display:none;position:absolute;right:2px;top:0;background:#b42318;color:#fff;border-radius:999px;font:700 10px/16px Arial;width:16px;height:16px'>0</span></button><div id='mejavi-notification-panel' hidden style='position:absolute;right:0;top:44px;z-index:20;width:min(330px,calc(100vw - 32px));padding:16px;border:1px solid #e7e0d8;border-radius:14px;background:#fff;box-shadow:0 12px 30px rgba(0,0,0,.14);font-size:14px;line-height:1.5'></div>";
    tools.prepend(wrap);
    wrap.querySelector("button").onclick = () => { const panel = wrap.querySelector("#mejavi-notification-panel"); panel.hidden = !panel.hidden; };
  }
  async function sync() {
    setupBell();
    try {
      const response = await fetch(API + "?refresh=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      const catalog = ((await response.json()).products || []);
      const active = catalog.filter((item) => item.discount_active);
      if (typeof window.renderProducts === "function") window.renderProducts();
      document.querySelectorAll("#productGrid .product-card").forEach((card) => {
        const title = card.querySelector("h3")?.textContent?.trim().toLowerCase();
        const match = catalog.find((item) => title && item.name.toLowerCase() === title);
        const price = card.querySelector(".card-price");
        if (!price || !match) return;
        let badge = card.querySelector(".live-discount-badge");
        if (match.discount_active) {
          if (!badge) { badge = document.createElement("span"); badge.className = "live-discount-badge"; price.appendChild(badge); }
          badge.textContent = match.discount_type === "percentage" ? "Diskon " + Number(match.discount_value) + "%" : "Hemat " + format(match.discount_value);
          badge.style.cssText = "display:inline-block;margin-left:8px;padding:3px 7px;border-radius:999px;background:#211b16;color:#fff;font-size:11px;font-weight:700";
        } else if (badge) badge.remove();
      });
      activeSignature = active.map((item) => item.sku + ":" + item.price + ":" + item.original_price + ":" + item.discount_value).sort().join("|");
      const count = document.getElementById("mejavi-notification-count");
      const panel = document.getElementById("mejavi-notification-panel");
      if (!count || !panel) return;
      count.textContent = active.length;
      count.style.display = active.length ? "block" : "none";
      panel.innerHTML = active.length ? "<strong>Promo sedang berlangsung</strong><div style='margin-top:8px'>" + active.map((item) => "<div style='padding:8px 0;border-bottom:1px solid #f0ece7'><b>" + item.name + "</b><br><s>" + format(item.original_price) + "</s> <strong>" + format(item.price) + "</strong></div>").join("") + "</div><button type='button' id='mejavi-dismiss-notif' style='margin-top:10px;border:0;background:#211b16;color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer'>Tutup notifikasi</button>" : "Tidak ada promo aktif saat ini.";
      const dismiss = document.getElementById("mejavi-dismiss-notif");
      if (dismiss) dismiss.onclick = () => { localStorage.setItem(DISMISS_KEY, activeSignature); panel.hidden = true; count.style.display = "none"; };
      if (localStorage.getItem(DISMISS_KEY) === activeSignature) { count.style.display = "none"; panel.hidden = true; }
    } catch (_) {}
  }
  sync();
  setInterval(sync, 15000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) sync(); });
})();