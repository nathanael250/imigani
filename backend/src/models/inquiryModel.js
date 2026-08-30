import { createRow, listRows, requireFields, updateRow } from "./baseModel.js";
import { createNotification } from "./notificationModel.js";
import { query } from "../config/database.js";
import { sendInquiryEmailNotification } from "../services/mailService.js";
import { sendInquiryWhatsAppNotification } from "../services/wawpService.js";

const inquiryFields = ["name", "email", "phone", "inquiry", "status", "is_read"];
let inquiryReadColumnPromise;

export async function listInquiries(payload = {}) {
  await ensureInquiryReadColumn();

  return listRows("inquiries", {
    allowedFilters: ["status", "is_read"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["name", "email", "phone", "inquiry"],
    search: payload.search,
  });
}

export async function createInquiry(payload = {}) {
  await ensureInquiryReadColumn();
  requireFields(payload, ["name", "email", "inquiry"]);
  const inquiry = await createRow("inquiries", payload, inquiryFields);

  await createNotification({
    entity_id: inquiry.id,
    entity_type: "inquiry",
    message: `${inquiry.name} sent a new booking or enquiry message.`,
    title: "New booking enquiry",
    type: "booking",
  });

  sendInquiryWhatsAppNotification(inquiry)
    .then((result) => {
      if (result.skipped) {
        console.warn("Wawp WhatsApp notification skipped: missing Wawp configuration.");
      } else {
        console.log(`Wawp WhatsApp notification sent for inquiry #${inquiry.id}.`);
      }
    })
    .catch((error) => {
      console.warn(`Wawp WhatsApp notification failed: ${error.message}`);
    });

  sendInquiryEmailNotification(inquiry)
    .then((result) => {
      if (result.skipped) {
        console.warn("Email notification skipped: missing SMTP configuration.");
      } else {
        console.log(`Email notification sent for inquiry #${inquiry.id}.`);
      }
    })
    .catch((error) => {
      console.warn(`Email notification failed: ${error.message}`);
    });

  return inquiry;
}

export async function updateInquiryStatus(payload = {}) {
  await ensureInquiryReadColumn();
  requireFields(payload, ["id", "status"]);
  return updateRow("inquiries", payload.id, { status: payload.status }, inquiryFields);
}

export async function markInquiryRead(payload = {}) {
  await ensureInquiryReadColumn();
  requireFields(payload, ["id"]);
  return updateRow("inquiries", payload.id, { is_read: 1 }, inquiryFields);
}

export function ensureInquiryReadColumn() {
  if (!inquiryReadColumnPromise) {
    inquiryReadColumnPromise = addInquiryReadColumnIfMissing().catch((error) => {
      inquiryReadColumnPromise = null;
      throw error;
    });
  }

  return inquiryReadColumnPromise;
}

async function addInquiryReadColumnIfMissing() {
  const rows = await query("SHOW COLUMNS FROM inquiries LIKE 'is_read'");

  if (rows.length > 0) {
    return;
  }

  await query("ALTER TABLE inquiries ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0 AFTER status");
}
