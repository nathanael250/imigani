import { query } from "../config/database.js";
import { createNotification } from "./notificationModel.js";

const defaultSettings = {
  business_email: "info@imiganitours.com",
  business_name: "IMIGANI Tours & Safaris",
  business_phone: "+250 785 118 003",
  business_whatsapp: "+250 785 118 003",
  office_address: "Kigali, Rwanda",
  notification_email: "info@imiganitours.com",
};

export async function getSettings() {
  const rows = await query("SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key ASC");
  const settings = { ...defaultSettings };

  for (const row of rows) {
    settings[row.setting_key] = row.setting_value;
  }

  return settings;
}

export async function updateSettings(payload = {}) {
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined);

  for (const [key, value] of entries) {
    await query(
      `INSERT INTO site_settings (setting_key, setting_value)
       VALUES (:setting_key, :setting_value)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      { setting_key: key, setting_value: String(value ?? "") },
    );
  }

  await createNotification({
    entity_type: "settings",
    message: "Website settings were updated.",
    title: "Settings updated",
    type: "system",
  });

  return getSettings();
}
