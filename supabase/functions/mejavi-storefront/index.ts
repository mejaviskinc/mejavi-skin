import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const LEGACY_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MAX_BODY_BYTES = 20_000;

function resolveSecretKey() {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return keys.default || Object.values(keys)[0] || LEGACY_SERVICE_KEY;
  } catch {
    return LEGACY_SERVICE_KEY;
  }
}

const supabaseAdmin = createClient(SUPABASE_URL, String(resolveSecretKey()), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const ALLOWED_ORIGINS = new Set([
  "https://mejaviskinc.github.io",
  "https://mejaviskinc.netlify.app",
  "https://euphonious-scone-aa243d.netlify.app",
  "http://localhost:8888",
  "http://localhost:5173",
]);

const baseHeaders = {
  "Access-Control-Allow-Headers": "content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

const messages: Record<string, { status: number; id: string; en: string }> = {
  STORE_RATE_LIMIT: {
    status: 429,
    id: "Terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi.",
    en: "Too many requests. Please wait a few minutes and try again.",
  },
  STORE_INVALID_NAME: {
    status: 400,
    id: "Nama pelanggan belum valid.",
    en: "The customer name is not valid.",
  },
  STORE_INVALID_PHONE: {
    status: 400,
    id: "Nomor WhatsApp belum valid.",
    en: "The WhatsApp number is not valid.",
  },
  STORE_INVALID_EMAIL: {
    status: 400,
    id: "Alamat email belum valid.",
    en: "The email address is not valid.",
  },
  STORE_INVALID_ADDRESS: {
    status: 400,
    id: "Alamat pengiriman belum lengkap.",
    en: "The shipping address is incomplete.",
  },
  STORE_INVALID_QUANTITY: {
    status: 400,
    id: "Jumlah produk belum valid.",
    en: "The product quantity is not valid.",
  },
  STORE_PRODUCT_NOT_FOUND: {
    status: 404,
    id: "Produk tidak ditemukan di sistem gudang.",
    en: "The product was not found in the warehouse system.",
  },
  STORE_OUT_OF_STOCK: {
    status: 409,
    id: "Stok produk belum tersedia. Silakan pilih produk lain atau hubungi admin.",
    en: "This product is currently out of stock. Please choose another item or contact support.",
  },
  STORE_TRACK_NOT_FOUND: {
    status: 404,
    id: "Pesanan tidak ditemukan. Periksa nomor pesanan dan nomor WhatsApp.",
    en: "Order not found. Check the order number and WhatsApp number.",
  },
};

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  const originAllowed = !origin || ALLOWED_ORIGINS.has(origin);
  const responseHeaders = {
    ...baseHeaders,
    ...(originAllowed && origin ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),
  };
  const json = (
    body: unknown,
    status: number,
    extraHeaders: Record<string, string> = {},
  ) => new Response(JSON.stringify(body), {
    status,
    headers: { ...responseHeaders, ...extraHeaders },
  });

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: originAllowed ? 204 : 403,
      headers: responseHeaders,
    });
  }

  if (request.method === "POST" && !originAllowed) {
    return json({ code: "ORIGIN_NOT_ALLOWED", message: "Request origin is not allowed." }, 403, {
      "Cache-Control": "no-store",
    });
  }

  if (!SUPABASE_URL || !resolveSecretKey()) {
    return json(
      { code: "STORE_NOT_CONFIGURED", message: "Store service is not configured." },
      503,
    );
  }

  try {
    if (request.method === "GET") {
      const { data, error } = await supabaseAdmin.rpc("get_storefront_catalog");
      if (error) throw error;

      const { data: imageRows, error: imageError } = await supabaseAdmin
        .from("products")
        .select("sku,image_url")
        .eq("is_active", true);
      if (imageError) throw imageError;

      const imagesBySku = new Map(
        (imageRows || []).map((item) => [String(item.sku), item.image_url || null]),
      );
      const products = (data || []).map((item) => ({
        ...item,
        image_url: imagesBySku.get(String(item.sku)) || null,
      }));

      return json(
        { products, synced_at: new Date().toISOString() },
        200,
        { "Cache-Control": "public, max-age=30, s-maxage=60" },
      );
    }

    if (request.method !== "POST") {
      return json({ code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }, 405);
    }

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return json({ code: "PAYLOAD_TOO_LARGE", message: "Request is too large." }, 413);
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return json({ code: "PAYLOAD_TOO_LARGE", message: "Request is too large." }, 413);
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody || "{}");
    } catch {
      return json({ code: "INVALID_JSON", message: "Invalid request body." }, 400);
    }

    if (String(payload.website || "").trim()) {
      return json({ code: "INVALID_REQUEST", message: "Invalid request." }, 400);
    }

    const requestKey = await fingerprint(request);
    const action = String(payload.action || "");

    if (action === "create_order") {
      const safePayload = {
        customer: payload.customer,
        shipping: payload.shipping,
        items: payload.items,
        note: payload.note,
        idempotency_key: payload.idempotency_key,
        checkout_url: payload.checkout_url,
      };
      const { data, error } = await supabaseAdmin.rpc("create_storefront_order", {
        p_payload: safePayload,
        p_request_key: requestKey,
      });
      if (error) throw error;
      return json({ order: data }, 201, { "Cache-Control": "no-store" });
    }

    if (action === "track_order") {
      const { data, error } = await supabaseAdmin.rpc("get_storefront_tracking", {
        p_order_number: String(payload.order_number || "").slice(0, 60),
        p_phone: String(payload.phone || "").slice(0, 30),
        p_request_key: requestKey,
      });
      if (error) throw error;
      return json({ order: data }, 200, { "Cache-Control": "no-store" });
    }

    return json({ code: "INVALID_ACTION", message: "Invalid action." }, 400);
  } catch (error) {
    const code = extractKnownCode(error);
    const language = request.headers.get("accept-language")?.toLowerCase().startsWith("en")
      ? "en"
      : "id";
    const known = messages[code];

    if (known) {
      return json({ code, message: known[language] }, known.status, {
        "Cache-Control": "no-store",
      });
    }

    console.error("Mejavi storefront request failed", {
      code: String((error as { code?: string })?.code || "unknown").slice(0, 40),
    });
    return json(
      {
        code: "STORE_SERVICE_ERROR",
        message: language === "en"
          ? "The order service is temporarily unavailable."
          : "Layanan pesanan sedang tidak tersedia. Silakan coba lagi.",
      },
      503,
      { "Cache-Control": "no-store" },
    );
  }
});


function extractKnownCode(error: unknown) {
  const message = String((error as { message?: string })?.message || "");
  return Object.keys(messages).find((code) => message.includes(code)) || "";
}

async function fingerprint(request: Request) {
  const ip = (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  ).split(",")[0].trim().slice(0, 80);
  const userAgent = (request.headers.get("user-agent") || "unknown").slice(0, 160);
  const source = new TextEncoder().encode(`${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", source);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
