const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";
const VERSION = "2026.09.27-github-supabase";
const MAX_BODY_BYTES = 12000;
const MAX_MESSAGE_LENGTH = 700;
const MAX_MESSAGES = 8;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 8;
const buckets = new Map();

const ALLOWED_ORIGINS = new Set([
  "https://mejaviskincare.co.id",
  "https://www.mejaviskincare.co.id",
  "https://mejaviskinc.github.io",
  "https://mejaviskinc.netlify.app",
  "https://euphonious-scone-aa243d.netlify.app",
  "http://localhost:5173",
  "http://localhost:8888",
]);

const KNOWLEDGE = `
Mejavi Skin+ adalah brand skincare dan body care untuk rutinitas harian.
Kontak resmi: WhatsApp +62 821-4570-677, email mejaviskinc@gmail.com, Instagram @mejaviskinc, TikTok @mejaviskinc_.
Produk dan harga website:
- Radiance Treatment Body Serum: 60gr Rp69.000, 100gr Rp129.900, 250gr Rp215.000. BPOM NA18250117959.
- Brightening Gentle Cleanser: 100gr Rp89.000. BPOM NA18251209959.
- Plump + Bright Serumizer: 20gr Rp98.000. BPOM NA18250117979.
- Fresh Hydra Cream: Day & Night Rp179.900. BPOM NA18250118206.
- Lumiere Essence Hydra Cream: 15gr Rp122.000. BPOM NA18250117980.
- Herbal Relaxing Cream: 35gr Rp68.000. BPOM NA18260101852.
Panduan rutin umum: pagi cleanser, serum, moisturizer/cream, lalu sunscreen; malam cleanser, serum, lalu moisturizer/cream.
Pembelian dilakukan dari halaman Produk dan pembayaran dilanjutkan melalui Lynk.id.
Status pesanan diperiksa di halaman Lacak Pesanan menggunakan nomor pesanan dan nomor WhatsApp; jangan meminta data tersebut di chat.
Harga dan stok dapat berubah, jadi arahkan pelanggan mengecek halaman Produk untuk data terbaru.
Untuk iritasi, hentikan produk yang dicurigai dan konsultasikan ke tenaga kesehatan bila berat atau berlanjut.
Untuk kehamilan, menyusui, kulit sangat sensitif, alergi, atau kondisi medis, sarankan membaca komposisi, patch test, dan konsultasi tenaga kesehatan.
Jangan meminta password, OTP, PIN, nomor kartu, NIK, alamat lengkap, atau data pribadi sensitif.
`;

const SYSTEM = `Kamu adalah Javi, asisten customer service Mejavi Skin+. Jawab dalam bahasa pengguna, ringkas, ramah, dan faktual. Gunakan hanya pengetahuan resmi yang disediakan. Jangan mengarang stok, promo, hasil, komposisi, sertifikasi, atau status pesanan. Jangan mendiagnosis atau menjanjikan penyembuhan. Jika data tidak tersedia, arahkan ke WhatsApp resmi. Jangan meminta atau memproses data sensitif.\n\nPENGETAHUAN RESMI:\n${KNOWLEDGE}`;

Deno.serve(async (request) => {
  const origin = String(request.headers.get("origin") || "");
  const originAllowed = !origin || ALLOWED_ORIGINS.has(origin);
  const headers = corsHeaders(origin, originAllowed);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: originAllowed ? 204 : 403, headers });
  }

  if (!originAllowed) {
    return json({ code: "ORIGIN_NOT_ALLOWED", message: "Request origin is not allowed." }, 403, headers);
  }

  const apiKey = String(Deno.env.get("OPENAI_API_KEY") || "").trim();

  if (request.method === "GET") {
    return json({
      service: "javi",
      version: VERSION,
      configured: Boolean(apiKey),
      ready: true,
      mode: apiKey ? "ai" : "assistant"
    }, 200, headers);
  }

  if (request.method !== "POST") {
    return json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }, 405, headers);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ code: "PAYLOAD_TOO_LARGE", message: "Request is too large." }, 413, headers);
  }

  const clientId = fingerprint(request);
  const limit = checkRateLimit(clientId);
  headers.set("X-RateLimit-Limit", String(RATE_LIMIT_REQUESTS));
  headers.set("X-RateLimit-Remaining", String(limit.remaining));
  if (!limit.allowed) {
    headers.set("Retry-After", String(limit.retryAfter));
    return json({ code: "RATE_LIMITED", message: "Too many requests." }, 429, headers);
  }

  let payload;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ code: "PAYLOAD_TOO_LARGE", message: "Request is too large." }, 413, headers);
    }
    payload = JSON.parse(raw || "{}");
  } catch {
    return json({ code: "INVALID_JSON", message: "Invalid request body." }, 400, headers);
  }

  const sanitized = sanitizeMessages(payload?.messages);
  if (!sanitized.ok) {
    return json({ code: "INVALID_MESSAGE", message: sanitized.message }, 400, headers);
  }

  if (containsSensitiveData(sanitized.messages)) {
    return json({
      code: "SENSITIVE_DATA",
      message: "Do not send passwords, OTPs, PINs, card numbers, identity numbers, or other sensitive data."
    }, 400, headers);
  }

  const language = payload?.language === "en" ? "en" : "id";
  const last = [...sanitized.messages].reverse().find((m) => m.role === "user")?.content || "";

  if (!apiKey) {
    return json({ reply: fallbackReply(last, language), mode: "assistant" }, 200, headers);
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25_000);
    const model = String(Deno.env.get("OPENAI_MODEL") || DEFAULT_MODEL).trim();
    const page = String(payload?.page || "unknown").slice(0, 30);

    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        reasoning: { effort: "none" },
        instructions: `${SYSTEM}\nBahasa antarmuka: ${language === "en" ? "English" : "Bahasa Indonesia"}. Halaman aktif: ${page}.`,
        input: JSON.stringify(sanitized.messages),
        max_output_tokens: 650,
        store: false
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(timer));

    if (!response.ok) {
      console.error("Javi upstream failed", response.status);
      return json({ reply: fallbackReply(last, language), mode: "assistant" }, 200, headers);
    }

    const result = await response.json();
    const reply = extractText(result);
    if (!reply) {
      return json({ reply: fallbackReply(last, language), mode: "assistant" }, 200, headers);
    }

    return json({ reply: reply.slice(0, 3500), mode: "ai" }, 200, headers);
  } catch (error) {
    console.error("Javi request failed", String(error?.name || "error").slice(0, 40));
    return json({ reply: fallbackReply(last, language), mode: "assistant" }, 200, headers);
  }
});

function corsHeaders(origin, allowed) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "Access-Control-Allow-Headers": "content-type, x-javi-client-version",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Javi-Version": VERSION
  });
  if (origin && allowed) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return headers;
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), { status, headers });
}

function sanitizeMessages(input) {
  if (!Array.isArray(input) || input.length < 1) {
    return { ok: false, message: "At least one message is required.", messages: [] };
  }
  const messages = input.slice(-MAX_MESSAGES).map((m) => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: String(m?.content || "").trim().slice(0, MAX_MESSAGE_LENGTH)
  })).filter((m) => m.content);
  if (!messages.length) return { ok: false, message: "Message is empty.", messages: [] };
  return { ok: true, messages };
}

function containsSensitiveData(messages) {
  const text = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  if (/\b(password|kata\s*sandi|passcode|pin|otp|cvv|cvc)\b[\s:=-]{0,8}[a-z0-9!@#$%^&*._-]{3,}/i.test(text)) return true;
  if (/\b\d{16}\b/.test(text)) return true;
  const cards = text.match(/(?:\d[ -]?){13,19}/g) || [];
  return cards.some(passesLuhn);
}

function passesLuhn(value) {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alternate) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function fingerprint(request) {
  return String(
    request.headers.get("x-forwarded-for") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  ).split(",")[0].trim().slice(0, 80);
}

function checkRateLimit(id) {
  const now = Date.now();
  const current = buckets.get(id);
  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    buckets.set(id, { startedAt: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, retryAfter: 0 };
  }
  current.count += 1;
  if (current.count > RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - current.startedAt)) / 1000)) };
  }
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - current.count, retryAfter: 0 };
}

function extractText(result) {
  if (typeof result?.output_text === "string") return result.output_text.trim();
  const parts = [];
  for (const item of result?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function fallbackReply(message, language) {
  const q = String(message || "").toLowerCase();
  const en = language === "en";
  const wa = en
    ? "For anything more specific, contact Mejavi on WhatsApp at +62 821-4570-677."
    : "Untuk bantuan yang lebih spesifik, hubungi WhatsApp Mejavi di +62 821-4570-677.";

  if (/halo|hai|hi\b|hello|pagi|siang|malam/.test(q)) {
    return en ? "Hi 👋 I’m Javi, Mejavi Skin’s virtual assistant. I can help with products, prices, BPOM information, product routines, ordering, or tracking guidance." : "Hai 👋 Aku Javi, asisten virtual Mejavi Skin. Aku bisa membantu soal produk, harga, informasi BPOM, urutan pemakaian, pembelian, atau panduan tracking.";
  }
  if (/track|lacak|pesanan|order|resi|pengiriman/.test(q)) {
    return en ? "To check an order, open the Track Order page and enter the order number plus the WhatsApp number used at checkout. Please do not send those details in this chat. " + wa : "Untuk mengecek pesanan, buka halaman Lacak Pesanan lalu masukkan nomor pesanan dan nomor WhatsApp yang digunakan saat checkout. Jangan kirim data tersebut di chat ini. " + wa;
  }
  if (/bpom|izin|notifikasi/.test(q)) {
    return en ? "Mejavi products listed on the website include BPOM notification numbers. You can verify each number on the official Cek BPOM website. Open the product detail page to see the registered number." : "Produk Mejavi yang tercantum di website memiliki nomor notifikasi BPOM. Nomor tersebut bisa diverifikasi melalui situs resmi Cek BPOM. Buka detail produk untuk melihat nomor yang terdaftar.";
  }
  if (/rutinitas|urutan|pagi|malam|routine|how to use/.test(q)) {
    return en ? "A simple routine is: morning — cleanser, serum, moisturizer/cream, then sunscreen; evening — cleanser, serum, then moisturizer/cream. Follow each product label and adjust to your skin’s tolerance." : "Urutan sederhana: pagi — cleanser, serum, moisturizer/cream, lalu sunscreen; malam — cleanser, serum, lalu moisturizer/cream. Tetap ikuti petunjuk pada kemasan dan sesuaikan dengan toleransi kulit.";
  }
  if (/body serum|radiance/.test(q)) return en ? "Radiance Treatment Body Serum is available in 60gr (Rp69,000), 100gr (Rp129,900), and 250gr (Rp215,000). BPOM: NA18250117959. Check the Products page for current stock." : "Radiance Treatment Body Serum tersedia 60gr (Rp69.000), 100gr (Rp129.900), dan 250gr (Rp215.000). BPOM: NA18250117959. Cek halaman Produk untuk stok terbaru.";
  if (/cleanser|facial foam|sabun/.test(q)) return en ? "Brightening Gentle Cleanser is listed at 100gr for Rp89,000. BPOM: NA18251209959. It is intended to help cleanse dirt and excess oil from the face." : "Brightening Gentle Cleanser tercantum ukuran 100gr dengan harga Rp89.000. BPOM: NA18251209959. Produk ini digunakan untuk membantu membersihkan kotoran dan minyak berlebih pada wajah.";
  if (/serumizer|serum wajah|plump/.test(q)) return en ? "Plump + Bright Serumizer is listed at 20gr for Rp98,000. BPOM: NA18250117979. It is a lightweight facial serum for a daily skincare routine." : "Plump + Bright Serumizer tercantum ukuran 20gr dengan harga Rp98.000. BPOM: NA18250117979. Ini adalah serum wajah bertekstur ringan untuk rutinitas harian.";
  if (/fresh hydra|day.*night|all in one/.test(q)) return en ? "Fresh Hydra Cream is listed as a Day & Night set for Rp179,900. BPOM: NA18250118206." : "Fresh Hydra Cream tercantum sebagai paket Day & Night dengan harga Rp179.900. BPOM: NA18250118206.";
  if (/lumiere|moisturizer|pelembap|pelembab/.test(q)) return en ? "Lumiere Essence Hydra Cream is listed at 15gr for Rp122,000. BPOM: NA18250117980. It is a moisturizer intended to help keep skin feeling hydrated and comfortable." : "Lumiere Essence Hydra Cream tercantum ukuran 15gr dengan harga Rp122.000. BPOM: NA18250117980. Produk ini merupakan moisturizer untuk membantu kulit terasa lembap dan nyaman.";
  if (/herbal|relaxing/.test(q)) return en ? "Herbal Relaxing Cream is listed at 35gr for Rp68,000. BPOM: NA18260101852. It is for external use and light massage on the body." : "Herbal Relaxing Cream tercantum ukuran 35gr dengan harga Rp68.000. BPOM: NA18260101852. Produk digunakan untuk pemakaian luar dan pijat ringan pada tubuh.";
  if (/harga|price|produk|product|pilih|recommend|rekomendasi/.test(q)) {
    return en ? "Mejavi currently lists Body Serum, Brightening Gentle Cleanser, Plump + Bright Serumizer, Fresh Hydra Cream, Lumiere Essence Hydra Cream, and Herbal Relaxing Cream. Open the Products page to compare current prices, sizes, and stock. " + wa : "Mejavi saat ini menampilkan Body Serum, Brightening Gentle Cleanser, Plump + Bright Serumizer, Fresh Hydra Cream, Lumiere Essence Hydra Cream, dan Herbal Relaxing Cream. Buka halaman Produk untuk membandingkan harga, ukuran, dan stok terbaru. " + wa;
  }
  if (/beli|checkout|lynk|bayar|payment|buy/.test(q)) {
    return en ? "Open the Products page, select a product and size, then continue to Lynk.id for payment. Current stock is shown from the warehouse system when available." : "Buka halaman Produk, pilih produk dan ukurannya, lalu lanjutkan pembayaran melalui Lynk.id. Stok terbaru ditampilkan dari sistem warehouse jika tersedia.";
  }
  if (/kolaborasi|collab|affiliate|reseller|distributor|creator/.test(q)) {
    return en ? "Mejavi is open to collaborations with creators, affiliates, resellers, distributors, retail partners, communities, and events. Use the Collaboration page or contact the team via WhatsApp." : "Mejavi terbuka untuk kolaborasi dengan creator, affiliate, reseller, distributor, retail, komunitas, dan event. Gunakan halaman Kolaborasi atau hubungi tim melalui WhatsApp.";
  }
  if (/iritasi|alergi|hamil|menyusui|eczema|eksim|dokter|sakit/.test(q)) {
    return en ? "For irritation or medical concerns, stop using the suspected product and consult a healthcare professional if symptoms are severe or persistent. For pregnancy, breastfeeding, allergies, or very sensitive skin, review the ingredients and ask a healthcare professional before trying a new product." : "Untuk iritasi atau keluhan medis, hentikan pemakaian produk yang dicurigai dan konsultasikan ke tenaga kesehatan bila gejalanya berat atau berlanjut. Untuk kehamilan, menyusui, alergi, atau kulit sangat sensitif, baca komposisi dan konsultasikan terlebih dahulu sebelum mencoba produk baru.";
  }
  return en ? "I can help with Mejavi products, prices, BPOM information, routines, ordering, tracking guidance, and collaborations. I don’t have enough verified information for that question yet. " + wa : "Aku bisa membantu soal produk Mejavi, harga, BPOM, urutan pemakaian, pembelian, panduan tracking, dan kolaborasi. Untuk pertanyaan itu aku belum punya informasi terverifikasi yang cukup. " + wa;
}
