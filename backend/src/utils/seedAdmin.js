import bcrypt from "bcrypt";
import db from "../config/database.js";

const seedAdmin = async () => {
  try {
    const email = "admin@imiganitoursandsafaris.com";
    const password = "Passcode123!";

    const passwordHash = await bcrypt.hash(password, 12);

    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingAdmin.length > 0) {
      await db.execute(
        `UPDATE users
         SET name = ?, password_hash = ?, role = 'admin', status = 'active'
         WHERE email = ?`,
        ["Administrator", passwordHash, email]
      );

      console.log("Admin refreshed successfully.");
      return;
    }

    // Create admin
    await db.execute(
      `INSERT INTO users
        (name, email, password_hash, role, status)
       VALUES (?, ?, ?, 'admin', 'active')`,
      ["Administrator", email, passwordHash]
    );

    console.log("Admin seeded successfully.");
  } catch (error) {
    console.error("Failed to seed admin:", error);
  }
};

export default seedAdmin;
