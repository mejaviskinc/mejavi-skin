/* ==========================================
   MEJAVI ORDER TRACKING
========================================== */

(function () {
  "use strict";

  const API_URL =
    "https://yqutzzhkuuehvmuqzjvb.supabase.co/functions/v1/mejavi-storefront";
  const LAST_ORDER_KEY = "mejavi_last_order";

  const copy = {
    id: {
      home: "Home",
      about: "Tentang",
      products: "Produk",
      reviews: "Review",
      track: "Lacak Pesanan",
      eyebrow: "Status Pesanan",
      title: "Lacak perjalanan pesananmu.",
      intro: "Masukkan nomor pesanan dan nomor WhatsApp yang digunakan saat checkout.",
      stepOneTitle: "Temukan nomor pesanan",
      stepOneText: "Contoh: WEB-XXXXXXXX.",
      stepTwoTitle: "Gunakan nomor WhatsApp yang sama",
      stepTwoText: "Ini membantu menjaga data pesananmu tetap privat.",
      stepThreeTitle: "Lihat pembaruan terkini",
      stepThreeText: "Status gudang dan pengiriman akan muncul di sini.",
      formTitle: "Cek pesanan",
      formText: "Data ini hanya digunakan untuk menemukan pesananmu.",
      orderLabel: "Nomor pesanan",
      phoneLabel: "Nomor WhatsApp",
      submit: "Lacak Pesanan",
      loading: "Mencari pesanan…",
      footer: "Perawatan kulit dan tubuh dengan informasi yang jelas dan pelayanan yang hangat.",
      menu: "Menu",
      created: "Dibuat",
      total: "Total",
      payment: "Pembayaran",
      items: "Produk",
      shipment: "Pengiriman",
      courier: "Kurir",
      receipt: "Nomor resi",
      estimate: "Estimasi tiba",
      noShipment: "Pesanan belum diserahkan ke kurir.",
      noTimeline: "Belum ada riwayat pengiriman.",
      pending: "Menunggu pembayaran",
      paid: "Sudah dibayar",
      failed: "Gagal memuat pesanan. Silakan coba lagi.",
      statuses: {
        new_order: "Pesanan baru",
        allocated: "Dialokasikan",
        picking: "Sedang diambil",
        picked: "Selesai diambil",
        packing: "Sedang dikemas",
        ready_to_ship: "Siap dikirim",
        shipped: "Dikirim",
        delivered: "Terkirim",
        cancelled: "Dibatalkan",
        draft: "Draf",
        pending: "Menunggu",
        in_transit: "Dalam perjalanan"
      }
    },
    en: {
      home: "Home",
      about: "About",
      products: "Products",
      reviews: "Reviews",
      track: "Track Order",
      eyebrow: "Order Status",
      title: "Track your order journey.",
      intro: "Enter your order number and the WhatsApp number used at checkout.",
      stepOneTitle: "Find your order number",
      stepOneText: "Example: WEB-XXXXXXXX.",
      stepTwoTitle: "Use the same WhatsApp number",
      stepTwoText: "This helps keep your order details private.",
      stepThreeTitle: "See the latest updates",
      stepThreeText: "Warehouse and shipment updates will appear here.",
      formTitle: "Check an order",
      formText: "These details are used only to find your order.",
      orderLabel: "Order number",
      phoneLabel: "WhatsApp number",
      submit: "Track Order",
      loading: "Finding your order…",
      footer: "Skin and body care with clear information and warm service.",
      menu: "Menu",
      created: "Created",
      total: "Total",
      payment: "Payment",
      items: "Products",
      shipment: "Shipment",
      courier: "Courier",
      receipt: "Tracking number",
      estimate: "Estimated arrival",
      noShipment: "Your order has not been handed to a courier yet.",
      noTimeline: "No shipment updates yet.",
      pending: "Pending payment",
      paid: "Paid",
      failed: "The order could not be loaded. Please try again.",
      statuses: {
        new_order: "New order",
        allocated: "Allocated",
        picking: "Picking",
        picked: "Picked",
        packing: "Packing",
        ready_to_ship: "Ready to ship",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
        draft: "Draft",
        pending: "Pending",
        in_transit: "In transit"
      }
    }
  };

  function language() {
    return localStorage.getItem("mejavi_language") === "en" ? "en" : "id";
  }

  function text() {
    return copy[language()];
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function formatDate(value, withTime) {
    if (!value) return "—";
    return new Intl.DateTimeFormat(language() === "en" ? "en-GB" : "id-ID", {
      dateStyle: "medium",
      ...(withTime ? { timeStyle: "short" } : {})
    }).format(new Date(value));
  }

  function statusLabel(value) {
    return text().statuses[value] || String(value || "-").replaceAll("_", " ");
  }

  function applyLanguage() {
    const t = text();
    document.documentElement.lang = language();
    document.querySelectorAll("[data-track-copy]").forEach((element) => {
      const value = t[element.dataset.trackCopy];
      if (value) element.textContent = value;
    });
    document.title = language() === "en"
      ? "Track Order | Mejavi Skin"
      : "Lacak Pesanan | Mejavi Skin";
  }

  function setupMenu() {
    const menu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("overlay");
    const open = () => {
      menu.classList.add("active");
      overlay.classList.add("show");
      document.body.classList.add("lock");
    };
    const close = () => {
      menu.classList.remove("active");
      overlay.classList.remove("show");
      document.body.classList.remove("lock");
    };
    document.getElementById("menuBtn").addEventListener("click", open);
    document.getElementById("closeMenu").addEventListener("click", close);
    overlay.addEventListener("click", close);
  }

  function prefill() {
    const params = new URLSearchParams(location.search);
    const orderFromUrl = params.get("order") || "";
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "{}");
    } catch (_error) {
      saved = {};
    }

    document.getElementById("trackingOrder").value = orderFromUrl || saved.order_number || "";
    if (!orderFromUrl || orderFromUrl === saved.order_number) {
      document.getElementById("trackingPhone").value = saved.phone || "";
    }
  }

  async function submitTracking(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const errorBox = document.getElementById("trackingError");
    const submit = document.getElementById("trackingSubmit");
    const result = document.getElementById("trackingResult");
    const t = text();
    errorBox.textContent = "";
    result.classList.remove("visible");
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    submit.disabled = true;
    submit.textContent = t.loading;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language()
        },
        body: JSON.stringify({
          action: "track_order",
          order_number: String(values.get("order_number") || "").trim(),
          phone: String(values.get("phone") || "").trim()
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.order) throw new Error(payload.message || t.failed);

      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({
        order_number: payload.order.order_number,
        phone: String(values.get("phone") || "").trim(),
        created_at: payload.order.created_at
      }));
      renderResult(payload.order);
    } catch (error) {
      errorBox.textContent = error.message || t.failed;
    } finally {
      submit.disabled = false;
      submit.textContent = t.submit;
    }
  }

  function renderResult(order) {
    const t = text();
    const result = document.getElementById("trackingResult");
    result.innerHTML = "";

    const head = document.createElement("div");
    head.className = "tracking-result-head";
    const heading = document.createElement("div");
    const eyebrow = document.createElement("span");
    eyebrow.className = "order-eyebrow";
    eyebrow.textContent = t.track;
    const title = document.createElement("h2");
    title.textContent = order.order_number;
    heading.append(eyebrow, title);
    const status = document.createElement("span");
    status.className = "tracking-status";
    status.textContent = statusLabel(order.status);
    head.append(heading, status);

    const meta = document.createElement("div");
    meta.className = "tracking-meta";
    [
      [t.created, formatDate(order.created_at, false)],
      [t.total, formatMoney(order.total)],
      [t.payment, order.payment_status === "paid" ? t.paid : t.pending]
    ].forEach(([label, value]) => {
      const item = document.createElement("div");
      const key = document.createElement("span");
      const content = document.createElement("strong");
      key.textContent = label;
      content.textContent = value;
      item.append(key, content);
      meta.appendChild(item);
    });

    const itemTitle = document.createElement("strong");
    itemTitle.textContent = t.items;
    const items = document.createElement("div");
    items.className = "tracking-items";
    (order.items || []).forEach((orderItem) => {
      const row = document.createElement("div");
      row.className = "tracking-item";
      const info = document.createElement("div");
      const name = document.createElement("strong");
      const sku = document.createElement("small");
      const quantity = document.createElement("span");
      name.textContent = orderItem.name;
      sku.textContent = orderItem.sku;
      quantity.textContent = `${Number(orderItem.quantity)} × ${formatMoney(orderItem.unit_price)}`;
      info.append(name, sku);
      row.append(info, quantity);
      items.appendChild(row);
    });

    const shipment = document.createElement("div");
    shipment.className = "tracking-shipment";
    const shipmentTitle = document.createElement("strong");
    shipmentTitle.textContent = t.shipment;
    shipment.appendChild(shipmentTitle);
    const shipmentText = document.createElement("p");
    if (order.shipment) {
      const parts = [
        order.shipment.courier ? `${t.courier}: ${order.shipment.courier}` : "",
        order.shipment.tracking_number ? `${t.receipt}: ${order.shipment.tracking_number}` : "",
        order.shipment.estimated_delivery ? `${t.estimate}: ${formatDate(order.shipment.estimated_delivery, false)}` : ""
      ].filter(Boolean);
      shipmentText.textContent = parts.join(" · ") || statusLabel(order.shipment.status);
    } else {
      shipmentText.textContent = t.noShipment;
    }
    shipment.appendChild(shipmentText);

    result.append(head, meta, itemTitle, items, shipment);

    if ((order.timeline || []).length) {
      const timeline = document.createElement("div");
      timeline.className = "tracking-timeline";
      order.timeline.forEach((event) => {
        const row = document.createElement("div");
        row.className = "tracking-event";
        const eventTitle = document.createElement("strong");
        const description = document.createElement("small");
        const time = document.createElement("small");
        eventTitle.textContent = statusLabel(event.status);
        description.textContent = [event.description, event.location].filter(Boolean).join(" · ");
        time.textContent = formatDate(event.event_time, true);
        row.append(eventTitle, description, time);
        timeline.appendChild(row);
      });
      result.appendChild(timeline);
    } else {
      const empty = document.createElement("p");
      empty.className = "tracking-empty";
      empty.textContent = t.noTimeline;
      result.appendChild(empty);
    }

    result.classList.add("visible");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("langBtn").addEventListener("click", () => {
    localStorage.setItem("mejavi_language", language() === "id" ? "en" : "id");
    applyLanguage();
  });
  document.getElementById("trackingForm").addEventListener("submit", submitTracking);
  setupMenu();
  prefill();
  applyLanguage();
  window.addEventListener("load", () => {
    window.setTimeout(() => document.getElementById("loader").classList.add("hide"), 180);
  });
})();
