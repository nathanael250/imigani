import nodemailer from "nodemailer";
import env from "../config/env.js";

export function isMailConfigured() {
  return Boolean(env.mail.host && env.mail.user && env.mail.pass && env.mail.to);
}

export async function sendInquiryEmailNotification(inquiry = {}) {
  if (!isMailConfigured()) {
    return { ok: false, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    auth: {
      pass: env.mail.pass,
      user: env.mail.user,
    },
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
  });

  const subject = `New IMIGANI website request from ${inquiry.name || "a visitor"}`;
  const text = buildInquiryText(inquiry);

  const info = await transporter.sendMail({
    from: env.mail.from || env.mail.user,
    html: buildInquiryHtml(inquiry),
    replyTo: inquiry.email,
    subject,
    text,
    to: env.mail.to,
  });

  return { info, ok: true };
}

function buildInquiryText(inquiry = {}) {
  return [
    "New IMIGANI website request",
    "",
    `Name: ${inquiry.name || "Not provided"}`,
    `Email: ${inquiry.email || "Not provided"}`,
    `Phone: ${inquiry.phone || "Not provided"}`,
    `Status: ${inquiry.status || "new"}`,
    "",
    "Message:",
    String(inquiry.inquiry || "No message provided").trim(),
  ].join("\n");
}

function buildInquiryHtml(inquiry = {}) {
  const message = escapeHtml(String(inquiry.inquiry || "No message provided").trim()).replace(/\n/g, "<br>");

  return `
    <div style="font-family: Arial, sans-serif; color: #102d1a; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New IMIGANI website request</h2>
      <p><strong>Name:</strong> ${escapeHtml(inquiry.name || "Not provided")}</p>
      <p><strong>Email:</strong> ${escapeHtml(inquiry.email || "Not provided")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone || "Not provided")}</p>
      <p><strong>Status:</strong> ${escapeHtml(inquiry.status || "new")}</p>
      <hr style="border: 0; border-top: 1px solid #d7e2d5; margin: 20px 0;" />
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
