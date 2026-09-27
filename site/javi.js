/* ==========================================
   JAVI — MEJAVI AI CUSTOMER SERVICE
   Widget ini berjalan di semua halaman dan
   mengirim pertanyaan ke Supabase Edge Function.
========================================== */

(function initJaviCustomerService() {
  "use strict";

  const API_ENDPOINT = "https://yqutzzhkuuehvmuqzjvb.supabase.co/functions/v1/javi";
  const CLIENT_VERSION = "2026.09.27-github-supabase";
  const DEFAULT_WHATSAPP_URL =
    "https://wa.me/628214570677?text=Halo%20Mejavi%20Skin%2C%20saya%20ingin%20dibantu%20oleh%20customer%20service.";
  const STORAGE_KEY = "mejavi_javi_conversation_v1";
  const MAX_STORED_MESSAGES = 10;
  const MAX_MESSAGE_LENGTH = 700;

  function whatsappUrl() {
    const phone = String(window.mejaviSiteSettings?.whatsapp || "").replace(/\D/g, "");
    if (!phone) return DEFAULT_WHATSAPP_URL;
    return `https://wa.me/${phone}?text=Halo%20Mejavi%20Skin%2C%20saya%20ingin%20dibantu%20oleh%20customer%20service.`;
  }

  const copy = {
    id: {
      launcher: "Tanya Javi",
      launcherSub: "Customer Service",
      panelTitle: "Javi",
      panelStatus: "Customer Service • Online",
      panelConfigured: "AI sudah dikonfigurasi • Siap diuji",
      panelChecking: "Memeriksa layanan AI…",
      panelOffline: "AI belum aktif • WhatsApp tersedia",
      reset: "Mulai percakapan baru",
      close: "Tutup percakapan",
      greeting:
        "Hai, aku Javi 👋 Asisten virtual Mejavi Skin. Aku bisa membantu memilih produk, menjelaskan cara pakai, mengecek informasi BPOM, atau menghubungkanmu dengan tim kami. Ada yang ingin kamu tanyakan?",
      quickProduct: "Pilih produk",
      quickBpom: "Cek BPOM",
      quickRoutine: "Urutan pemakaian",
      quickHuman: "Hubungi tim",
      productPrompt:
        "Bantu saya memilih produk Mejavi yang sesuai dengan kebutuhan kulit saya.",
      bpomPrompt:
        "Apakah produk Mejavi terdaftar BPOM? Jelaskan cara mengecek nomor notifikasinya.",
      routinePrompt:
        "Bagaimana urutan pemakaian produk Mejavi untuk rutinitas pagi dan malam?",
      placeholder: "Tulis pertanyaanmu untuk Javi…",
      send: "Kirim pesan",
      typing: "Javi sedang mengetik",
      notice:
        "Javi memberikan jawaban otomatis berdasarkan informasi resmi Mejavi. Jawaban dapat keliru—jangan kirim data pribadi, OTP, atau informasi pembayaran.",
      humanLabel: "Butuh bantuan langsung? Chat WhatsApp",
      empty: "Tulis pertanyaan terlebih dahulu.",
      genericError:
        "Maaf, Javi sedang mengalami kendala. Coba lagi sebentar atau hubungi tim Mejavi melalui WhatsApp.",
      rateError:
        "Pesanmu cukup banyak dalam waktu singkat. Tunggu sebentar, lalu coba lagi ya.",
      safetyError:
        "Pesan tidak dapat diproses dengan aman. Jangan kirim password, OTP, PIN, NIK, nomor kartu, atau data pribadi sensitif. Silakan tulis ulang pertanyaan tanpa data tersebut.",
      authError:
        "Layanan AI lanjutan Javi belum tersedia. Javi tetap dapat membantu dengan informasi resmi Mejavi; untuk bantuan langsung, hubungi WhatsApp Mejavi.",
      creditError:
        "Saldo atau billing OpenAI API untuk Javi belum aktif, atau batas pemakaian telah tercapai. Aktifkan billing API lalu coba kembali. Sementara itu, tim Mejavi siap membantu melalui WhatsApp.",
      modelError:
        "Model AI lanjutan Javi sedang tidak tersedia. Javi tetap dapat membantu dengan informasi resmi Mejavi.",
      requestError:
        "Konfigurasi permintaan AI Javi perlu diperbarui. Silakan deploy file Javi terbaru atau hubungi tim Mejavi melalui WhatsApp.",
      incompleteError:
        "Jawaban Javi terhenti sebelum selesai. Silakan kirim ulang pertanyaanmu dengan kalimat yang lebih singkat.",
      localError:
        "Javi siap digunakan melalui backend Supabase. Jika layanan AI lanjutan belum aktif, Javi tetap memberi jawaban otomatis dari informasi resmi Mejavi.",
      unavailable:
        "Javi sedang belum tersedia. Untuk bantuan sekarang, silakan hubungi tim Mejavi melalui WhatsApp.",
      timeout:
        "Respons Javi memerlukan waktu lebih lama dari biasanya. Silakan coba kirim ulang atau hubungi tim Mejavi.",
      newConversation:
        "Percakapan baru dimulai. Ada yang bisa Javi bantu?"
    },
    en: {
      launcher: "Ask Javi",
      launcherSub: "Customer Service",
      panelTitle: "Javi",
      panelStatus: "Customer Service • Online",
      panelConfigured: "AI configured • Ready to test",
      panelChecking: "Checking AI service…",
      panelOffline: "AI unavailable • WhatsApp is available",
      reset: "Start a new conversation",
      close: "Close conversation",
      greeting:
        "Hi, I’m Javi 👋 Mejavi Skin’s virtual assistant. I can help you choose a product, explain how to use it, check BPOM information, or connect you with our team. What would you like to know?",
      quickProduct: "Choose a product",
      quickBpom: "Check BPOM",
      quickRoutine: "Product routine",
      quickHuman: "Contact the team",
      productPrompt:
        "Help me choose the right Mejavi product for my skin-care needs.",
      bpomPrompt:
        "Are Mejavi products registered with BPOM? Explain how I can verify the notification number.",
      routinePrompt:
        "What is the recommended order for using Mejavi products in a morning and evening routine?",
      placeholder: "Type your question for Javi…",
      send: "Send message",
      typing: "Javi is typing",
      notice:
        "Javi provides automated answers based on official Mejavi information. Answers may be imperfect—do not share personal data, OTPs, or payment information.",
      humanLabel: "Need direct help? Chat on WhatsApp",
      empty: "Please type a question first.",
      genericError:
        "Sorry, Javi is having trouble responding. Please try again shortly or contact the Mejavi team on WhatsApp.",
      rateError:
        "You’ve sent several messages in a short time. Please wait a moment and try again.",
      safetyError:
        "This message cannot be processed safely. Do not send passwords, OTPs, PINs, identity numbers, card details, or sensitive personal data. Please rewrite it without that information.",
      authError:
        "Javi’s advanced AI service is not available. Javi can still help with official Mejavi information; for direct help, contact Mejavi on WhatsApp.",
      creditError:
        "OpenAI API credit or billing for Javi is inactive, or its usage limit has been reached. Enable API billing and try again. Meanwhile, the Mejavi team can help on WhatsApp.",
      modelError:
        "Javi’s advanced AI model is currently unavailable. Javi can still help with official Mejavi information.",
      requestError:
        "Javi’s AI request configuration needs to be updated. Deploy the latest Javi files or contact the Mejavi team on WhatsApp.",
      incompleteError:
        "Javi’s answer stopped before it was complete. Please resend your question using a shorter sentence.",
      localError:
        "Javi is ready through the Supabase backend. If advanced AI is not enabled, Javi still provides automated answers from official Mejavi information.",
      unavailable:
        "Javi is currently unavailable. For help now, please contact the Mejavi team on WhatsApp.",
      timeout:
        "Javi is taking longer than usual to respond. Please try again or contact the Mejavi team.",
      newConversation:
        "A new conversation has started. How can Javi help?"
    }
  };

  let messages = loadMessages();
  let busy = false;
  let closeTimer = null;
  let serviceState = "unknown";
  let availabilityChecked = false;

  const root = document.createElement("div");
  root.className = "javi-root";
  root.dataset.javiVersion = CLIENT_VERSION;
  root.innerHTML = `
    <button
      class="javi-launcher"
      id="javiLauncher"
      type="button"
      aria-controls="javiPanel"
      aria-expanded="false"
    >
      <span class="javi-launcher-glow" aria-hidden="true"></span>
      <span class="javi-avatar javi-avatar-launcher" aria-hidden="true">
        <img src="logo-mejavi.png" alt="">
      </span>
      <span class="javi-launcher-copy">
        <strong id="javiLauncherLabel"></strong>
        <small id="javiLauncherSub"></small>
      </span>
      <span class="javi-ai-badge" aria-hidden="true">AI</span>
    </button>

    <section
      class="javi-panel"
      id="javiPanel"
      role="dialog"
      aria-labelledby="javiPanelTitle"
      hidden
    >
      <header class="javi-header">
        <span class="javi-avatar" aria-hidden="true">
          <img src="logo-mejavi.png" alt="">
        </span>

        <span class="javi-header-copy">
          <strong id="javiPanelTitle">Javi</strong>
          <small>
            <span class="javi-status-dot" aria-hidden="true"></span>
            <span id="javiPanelStatus"></span>
          </small>
        </span>

        <span class="javi-header-actions">
          <button class="javi-icon-btn" id="javiReset" type="button">
            <span aria-hidden="true">↻</span>
          </button>
          <button class="javi-icon-btn" id="javiClose" type="button">
            <span aria-hidden="true">×</span>
          </button>
        </span>
      </header>

      <div
        class="javi-messages"
        id="javiMessages"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      ></div>

      <div class="javi-typing" id="javiTyping" hidden>
        <span class="javi-mini-avatar" aria-hidden="true">J</span>
        <span class="javi-typing-bubble">
          <i></i><i></i><i></i>
          <span class="javi-visually-hidden" id="javiTypingLabel"></span>
        </span>
      </div>

      <div class="javi-quick-actions" id="javiQuickActions">
        <button type="button" data-javi-action="product"></button>
        <button type="button" data-javi-action="bpom"></button>
        <button type="button" data-javi-action="routine"></button>
        <button type="button" data-javi-action="human" class="javi-human-chip"></button>
      </div>

      <form class="javi-form" id="javiForm">
        <label class="javi-visually-hidden" for="javiInput" id="javiInputLabel"></label>
        <textarea
          id="javiInput"
          rows="1"
          maxlength="${MAX_MESSAGE_LENGTH}"
          autocomplete="off"
          enterkeyhint="send"
        ></textarea>
        <button class="javi-send" id="javiSend" type="submit">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 4 17 8-17 8 3-8-3-8Z"></path>
            <path d="M7 12h14"></path>
          </svg>
          <span class="javi-visually-hidden" id="javiSendLabel"></span>
        </button>
      </form>

      <div class="javi-footer-note">
        <p id="javiNotice"></p>
        <a href="${whatsappUrl()}" target="_blank" rel="noopener noreferrer" id="javiHumanLink"></a>
      </div>
    </section>
  `;

  document.body.appendChild(root);

  const launcher = document.getElementById("javiLauncher");
  const panel = document.getElementById("javiPanel");
  const closeButton = document.getElementById("javiClose");
  const resetButton = document.getElementById("javiReset");
  const messageList = document.getElementById("javiMessages");
  const typing = document.getElementById("javiTyping");
  const form = document.getElementById("javiForm");
  const input = document.getElementById("javiInput");
  const sendButton = document.getElementById("javiSend");
  const quickActions = document.getElementById("javiQuickActions");

  applyLanguage();
  renderConversation();
  Promise.resolve(window.mejaviCMSReady).then(function () {
    const humanLink = document.getElementById("javiHumanLink");
    if (humanLink) humanLink.href = whatsappUrl();
  });

  launcher.addEventListener("click", function () {
    if (panel.classList.contains("is-open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeButton.addEventListener("click", closePanel);

  resetButton.addEventListener("click", function () {
    messages = [];
    saveMessages();
    renderConversation();
    appendStatusMessage(getText().newConversation);
    input.focus();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener("input", resizeInput);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  quickActions.addEventListener("click", function (event) {
    const button = event.target.closest("[data-javi-action]");

    if (!button || busy) {
      return;
    }

    const action = button.dataset.javiAction;

    if (action === "human") {
      window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
      return;
    }

    const text = getText();
    const prompts = {
      product: text.productPrompt,
      bpom: text.bpomPrompt,
      routine: text.routinePrompt
    };

    sendMessage(prompts[action]);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });

  new MutationObserver(function (mutations) {
    if (mutations.some(function (mutation) {
      return mutation.attributeName === "lang";
    })) {
      applyLanguage();
      renderConversation();
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  function getLanguage() {
    return document.documentElement.lang === "en" ? "en" : "id";
  }

  function getText() {
    return copy[getLanguage()];
  }

  function applyLanguage() {
    const text = getText();

    document.getElementById("javiLauncherLabel").textContent = text.launcher;
    document.getElementById("javiLauncherSub").textContent = text.launcherSub;
    document.getElementById("javiPanelTitle").textContent = text.panelTitle;
    setServiceState(serviceState);
    document.getElementById("javiTypingLabel").textContent = text.typing;
    document.getElementById("javiNotice").textContent = text.notice;
    document.getElementById("javiHumanLink").textContent = text.humanLabel;
    document.getElementById("javiHumanLink").href = whatsappUrl();
    document.getElementById("javiInputLabel").textContent = text.placeholder;
    document.getElementById("javiSendLabel").textContent = text.send;

    launcher.setAttribute("aria-label", text.launcher);
    closeButton.setAttribute("aria-label", text.close);
    closeButton.setAttribute("title", text.close);
    resetButton.setAttribute("aria-label", text.reset);
    resetButton.setAttribute("title", text.reset);
    input.setAttribute("placeholder", text.placeholder);
    sendButton.setAttribute("aria-label", text.send);

    const actionLabels = {
      product: text.quickProduct,
      bpom: text.quickBpom,
      routine: text.quickRoutine,
      human: text.quickHuman
    };

    quickActions.querySelectorAll("[data-javi-action]").forEach(function (button) {
      button.textContent = actionLabels[button.dataset.javiAction];
    });
  }

  function openPanel() {
    window.clearTimeout(closeTimer);
    panel.hidden = false;

    window.requestAnimationFrame(function () {
      panel.classList.add("is-open");
      launcher.classList.add("is-open");
      launcher.setAttribute("aria-expanded", "true");
      scrollToLatest(false);
      checkAvailability();
      window.setTimeout(function () {
        input.focus();
      }, 170);
    });
  }

  function closePanel() {
    panel.classList.remove("is-open");
    launcher.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();

    closeTimer = window.setTimeout(function () {
      panel.hidden = true;
    }, 220);
  }

  function renderConversation() {
    messageList.replaceChildren();
    appendMessage("assistant", getText().greeting, false);

    messages.forEach(function (message) {
      appendMessage(message.role, message.content, false);
    });

    scrollToLatest(false);
  }

  function appendMessage(role, content, shouldScroll) {
    const row = document.createElement("div");
    row.className = "javi-message-row javi-message-" + role;

    if (role === "assistant") {
      const avatar = document.createElement("span");
      avatar.className = "javi-mini-avatar";
      avatar.textContent = "J";
      avatar.setAttribute("aria-hidden", "true");
      row.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.className = "javi-message-bubble";
    bubble.textContent = content;
    row.appendChild(bubble);
    messageList.appendChild(row);

    if (shouldScroll !== false) {
      scrollToLatest(true);
    }
  }

  function appendStatusMessage(content) {
    const status = document.createElement("p");
    status.className = "javi-status-message";
    status.textContent = content;
    messageList.appendChild(status);
    scrollToLatest(true);
  }

  async function sendMessage(rawMessage) {
    if (busy) {
      return;
    }

    const content = String(rawMessage || "").trim();

    if (!content) {
      input.setCustomValidity(getText().empty);
      input.reportValidity();
      input.setCustomValidity("");
      return;
    }

    if (panel.hidden) {
      openPanel();
    }

    input.value = "";
    resizeInput();

    const userMessage = {
      role: "user",
      content: content.slice(0, MAX_MESSAGE_LENGTH)
    };

    messages.push(userMessage);
    trimMessages();
    saveMessages();
    appendMessage("user", userMessage.content);
    setBusy(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(function () {
      controller.abort();
    }, 30000);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Javi-Client-Version": CLIENT_VERSION
        },
        body: JSON.stringify({
          messages: messages.slice(-MAX_STORED_MESSAGES),
          language: getLanguage(),
          page: document.body.dataset.page || "unknown"
        }),
        signal: controller.signal
      });

      let payload = {};

      try {
        payload = await response.json();
      } catch (error) {
        payload = {};
      }

      if (!response.ok) {
        throw createRequestError(response.status, payload.code);
      }

      const reply = String(payload.reply || "").trim();

      if (!reply) {
        throw createRequestError(502, "EMPTY_RESPONSE");
      }

      const assistantMessage = {
        role: "assistant",
        content: reply
      };

      setServiceState("ready");
      messages.push(assistantMessage);
      trimMessages();
      saveMessages();
      appendMessage("assistant", assistantMessage.content);
    } catch (error) {
      appendMessage("assistant", getErrorMessage(error));
    } finally {
      window.clearTimeout(timeoutId);
      setBusy(false);

      if (!panel.hidden && panel.classList.contains("is-open")) {
        input.focus();
      }
    }
  }

  function setBusy(nextBusy) {
    busy = nextBusy;
    input.disabled = nextBusy;
    sendButton.disabled = nextBusy;
    resetButton.disabled = nextBusy;
    quickActions.querySelectorAll("button").forEach(function (button) {
      button.disabled = nextBusy;
    });
    typing.hidden = !nextBusy;

    if (nextBusy) {
      scrollToLatest(true);
    }
  }

  function createRequestError(status, code) {
    const error = new Error(code || "REQUEST_FAILED");
    error.status = status;
    error.code = code;
    return error;
  }

  function getErrorMessage(error) {
    const text = getText();

    if (error && error.name === "AbortError") {
      return text.timeout;
    }

    if (error && (error.status === 429 || error.code === "RATE_LIMITED")) {
      return text.rateError;
    }

    if (
      error &&
      ["SENSITIVE_DATA", "CONTENT_BLOCKED", "ORIGIN_NOT_ALLOWED"].includes(error.code)
    ) {
      return text.safetyError;
    }

    if (error && error.code === "AI_NOT_CONFIGURED") {
      setServiceState("offline");
      return text.unavailable;
    }

    if (error && error.code === "AI_UNAVAILABLE") {
      setServiceState("offline");
      return text.unavailable;
    }

    if (error && error.code === "AI_AUTH_ERROR") {
      setServiceState("offline");
      return text.authError;
    }

    if (error && error.code === "AI_CREDIT_ERROR") {
      setServiceState("offline");
      return text.creditError;
    }

    if (
      error &&
      (error.code === "AI_MODEL_ERROR" || error.code === "AI_PERMISSION_ERROR")
    ) {
      setServiceState("offline");
      return text.modelError;
    }

    if (error && error.code === "AI_REQUEST_ERROR") {
      return text.requestError;
    }

    if (
      error &&
      (error.code === "AI_INCOMPLETE" ||
        error.code === "EMPTY_RESPONSE" ||
        error.code === "AI_INVALID_RESPONSE")
    ) {
      return text.incompleteError;
    }

    if (error && error.code === "AI_TIMEOUT") {
      setServiceState("offline");
      return text.timeout;
    }

    if (
      error &&
      (error.code === "AI_SERVICE_ERROR" ||
        error.code === "AI_UPSTREAM_ERROR" ||
        error.code === "AI_INVALID_RESPONSE")
    ) {
      setServiceState("offline");
      return text.genericError;
    }

    if (
      window.location.protocol === "file:" ||
      (error && error.status === 404)
    ) {
      return text.localError;
    }

    return text.genericError;
  }

  async function checkAvailability() {
    if (availabilityChecked) {
      return;
    }

    availabilityChecked = true;

    if (window.location.protocol === "file:") {
      setServiceState("offline");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Accept": "application/json",
          "X-Javi-Client-Version": CLIENT_VERSION
        }
      });
      const payload = response.ok ? await response.json() : {};
      if (payload.version) {
        root.dataset.javiBackendVersion = String(payload.version);
      }
      setServiceState(
        payload.configured || payload.ready ? "configured" : "offline"
      );
    } catch (error) {
      setServiceState("offline");
    }
  }

  function setServiceState(nextState) {
    serviceState = nextState;

    const status = document.getElementById("javiPanelStatus");
    const dot = document.querySelector(".javi-status-dot");
    const text = getText();

    status.textContent =
      serviceState === "ready"
        ? text.panelStatus
        : serviceState === "configured"
          ? text.panelConfigured
        : serviceState === "offline"
          ? text.panelOffline
          : text.panelChecking;

    dot.classList.toggle("is-offline", serviceState === "offline");
    dot.classList.toggle("is-checking", serviceState === "unknown");
  }

  function trimMessages() {
    messages = messages
      .filter(function (message) {
        return (
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim()
        );
      })
      .slice(-MAX_STORED_MESSAGES);
  }

  function loadMessages() {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "[]");

      if (!Array.isArray(saved)) {
        return [];
      }

      return saved
        .filter(function (message) {
          return (
            message &&
            (message.role === "user" || message.role === "assistant") &&
            typeof message.content === "string"
          );
        })
        .map(function (message) {
          return {
            role: message.role,
            content: message.content.slice(0, MAX_MESSAGE_LENGTH * 2)
          };
        })
        .slice(-MAX_STORED_MESSAGES);
    } catch (error) {
      return [];
    }
  }

  function saveMessages() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      /* Penyimpanan sesi bersifat opsional. */
    }
  }

  function resizeInput() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 96) + "px";
  }

  function scrollToLatest(smooth) {
    window.requestAnimationFrame(function () {
      messageList.scrollTo({
        top: messageList.scrollHeight,
        behavior: smooth ? "smooth" : "auto"
      });
    });
  }
})();
