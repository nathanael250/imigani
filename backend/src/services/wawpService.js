import env from "../config/env.js";

const REQUEST_TIMEOUT_MS = 8000;

export function isWawpConfigured() {
  return Boolean(env.wawp.instanceId && env.wawp.accessToken && env.wawp.notifyNumber);
}

export async function sendInquiryWhatsAppNotification(inquiry = {}) {
  if (!isWawpConfigured()) {
    return { ok: false, skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(env.wawp.apiUrl, {
      body: JSON.stringify({
        access_token: env.wawp.accessToken,
        chatId: toWhatsAppChatId(env.wawp.notifyNumber),
        instance_id: env.wawp.instanceId,
        message: buildInquiryMessage(inquiry),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    });

    const body = await readJsonResponse(response);

    if (!response.ok) {
      throw new Error(body?.message || body?.error || `Wawp request failed with status ${response.status}`);
    }

    return { body, ok: true };
  } finally {
    clearTimeout(timeout);
  }
}

function buildInquiryMessage(inquiry = {}) {
  const lines = [
    "New IMIGANI website request",
    "",
    `Name: ${inquiry.name || "Not provided"}`,
    `Email: ${inquiry.email || "Not provided"}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    "",
    "Message:",
    String(inquiry.inquiry || "No message provided").trim(),
  ];

  return lines.join("\n");
}

function toWhatsAppChatId(phoneNumber = "") {
  const digits = String(phoneNumber).replace(/\D/g, "");
  return `${digits}@c.us`;
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
