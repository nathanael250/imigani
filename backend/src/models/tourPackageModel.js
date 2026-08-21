import { query, transaction } from "../config/database.js";
import { requireFields } from "./baseModel.js";

function cleanText(value) {
  return value === undefined || value === null ? null : String(value).trim();
}

function cleanNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

async function insert(connection, sql, params) {
  const [result] = await connection.execute(sql, params);
  return result.insertId;
}

async function tableHasColumn(connection, tableName, columnName) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS column_count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName],
  );

  return Number(rows[0]?.column_count || 0) > 0;
}

async function tableExists(connection, tableName) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS table_count
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?`,
    [tableName],
  );

  return Number(rows[0]?.table_count || 0) > 0;
}

function richSectionContent(value) {
  if (Array.isArray(value)) {
    return cleanText(
      value
        .map((item) => item.content || item.title || item.name || "")
        .filter(Boolean)
        .join("\n"),
    );
  }

  return cleanText(value);
}

function plainText(value, maxLength = 240) {
  const text = String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240);
}

async function createUniqueTourSlug(connection, name, excludeTourId = null) {
  const baseSlug = slugify(name) || `tour-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const params = excludeTourId ? [slug, excludeTourId] : [slug];
    const [rows] = await connection.execute(
      `SELECT id FROM tours WHERE slug = ?${excludeTourId ? " AND id <> ?" : ""} LIMIT 1`,
      params,
    );

    if (rows.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function getTourPackageLookups() {
  const [categories, destinations, currencies] = await Promise.all([
    query("SELECT id, name, slug, status FROM tour_categories ORDER BY name ASC"),
    query("SELECT id, name, status FROM destinations WHERE status = 'active' ORDER BY name ASC"),
    query("SELECT id, code, name, symbol FROM currencies ORDER BY code ASC"),
  ]);

  return {
    categories,
    currencies,
    destinations,
  };
}

async function saveTourPackageDetails(connection, tourId, payload = {}) {
  const tourPricesHasPriceNote = await tableHasColumn(connection, "tour_prices", "price_note");
  const tourInclusionsHasContent = await tableHasColumn(connection, "tour_inclusions", "content");
  const tourExclusionsHasContent = await tableHasColumn(connection, "tour_exclusions", "content");
  const tourExtrasHasContent = await tableHasColumn(connection, "tour_extras", "content");

  for (const [index, highlight] of (payload.highlights || []).entries()) {
    if (!highlight.title) continue;
    await connection.execute(
      `INSERT INTO tour_highlights (tour_id, title, display_order)
         VALUES (?, ?, ?)`,
      [tourId, cleanText(highlight.title), index + 1],
    );
  }

  for (const [index, destination] of (payload.destinations || []).entries()) {
    const destinationId = cleanNumber(destination.destination_id || destination.id);
    if (!destinationId) continue;
    await connection.execute(
      `INSERT IGNORE INTO tour_destinations (tour_id, destination_id, display_order, description)
         VALUES (?, ?, ?, ?)`,
      [tourId, destinationId, index + 1, cleanText(destination.description)],
    );
  }

  for (const [index, day] of (payload.itinerary_days || []).entries()) {
    if (!day.day_number && !day.title) continue;
    await connection.execute(
      `INSERT INTO tour_itinerary_days (tour_id, day_number, title, description, display_order)
         VALUES (?, ?, ?, ?, ?)`,
      [
        tourId,
        cleanNumber(day.day_number) || index + 1,
        cleanText(day.title) || `Day ${cleanNumber(day.day_number) || index + 1}`,
        cleanText(day.description),
        index + 1,
      ],
    );
  }

  for (const price of payload.prices || []) {
    if (!price.currency_id || !price.price) continue;

    if (tourPricesHasPriceNote) {
      await connection.execute(
        `INSERT INTO tour_prices
            (tour_id, currency_id, price, price_note)
           VALUES (?, ?, ?, ?)`,
        [
          tourId,
          cleanNumber(price.currency_id),
          cleanNumber(price.price),
          cleanText(price.price_note),
        ],
      );
    } else {
      await connection.execute(
        `INSERT INTO tour_prices
            (tour_id, currency_id, price)
           VALUES (?, ?, ?)`,
        [
          tourId,
          cleanNumber(price.currency_id),
          cleanNumber(price.price),
        ],
      );
    }
  }

  const inclusions = richSectionContent(payload.inclusions);
  if (inclusions) {
    if (tourInclusionsHasContent) {
      await connection.execute(
        `INSERT INTO tour_inclusions (tour_id, content)
           VALUES (?, ?)`,
        [tourId, inclusions],
      );
    } else {
      await connection.execute(
        `INSERT INTO tour_inclusions (tour_id, title, description, display_order)
           VALUES (?, ?, ?, ?)`,
        [tourId, plainText(inclusions) || "Included", inclusions, 1],
      );
    }
  }

  const exclusions = richSectionContent(payload.exclusions);
  if (exclusions) {
    if (tourExclusionsHasContent) {
      await connection.execute(
        `INSERT INTO tour_exclusions (tour_id, content)
           VALUES (?, ?)`,
        [tourId, exclusions],
      );
    } else {
      await connection.execute(
        `INSERT INTO tour_exclusions (tour_id, title, description, display_order)
           VALUES (?, ?, ?, ?)`,
        [tourId, plainText(exclusions) || "Excluded", exclusions, 1],
      );
    }
  }

  const extras = richSectionContent(payload.extras);
  if (extras) {
    if (tourExtrasHasContent) {
      await connection.execute(
        `INSERT INTO tour_extras (tour_id, content)
           VALUES (?, ?)`,
        [tourId, extras],
      );
    } else {
      await connection.execute(
        `INSERT INTO tour_extras (tour_id, name, description, display_order)
           VALUES (?, ?, ?, ?)`,
        [tourId, plainText(extras) || "Extra Information", extras, 1],
      );
    }
  }

  for (const [index, media] of (payload.media || []).entries()) {
    if (!media.url) continue;
    await connection.execute(
      `INSERT INTO tour_media (tour_id, media_type, url, title, display_order, is_cover)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [
        tourId,
        media.media_type === "video" ? "video" : "image",
        cleanText(media.url),
        cleanText(media.title),
        index + 1,
        media.is_cover ? 1 : 0,
      ],
    );
  }
}

async function readRichSection(connection, tableName, legacyTitleColumn, tourId) {
  const hasContent = await tableHasColumn(connection, tableName, "content");

  if (hasContent) {
    const [rows] = await connection.execute(
      `SELECT GROUP_CONCAT(content ORDER BY id ASC SEPARATOR '\n') AS content
       FROM ${tableName}
       WHERE tour_id = ?`,
      [tourId],
    );

    return rows[0]?.content || "";
  }

  const [rows] = await connection.execute(
    `SELECT GROUP_CONCAT(
        TRIM(
          CONCAT(
            COALESCE(NULLIF(${legacyTitleColumn}, ''), ''),
            CASE WHEN description IS NULL OR description = '' THEN '' ELSE '\n' END,
            COALESCE(NULLIF(description, ''), '')
          )
        )
        ORDER BY display_order ASC, id ASC
        SEPARATOR '\n'
      ) AS content
     FROM ${tableName}
     WHERE tour_id = ?`,
    [tourId],
  );

  return rows[0]?.content || "";
}

async function getTourWithDetails(connection, tourId) {
  const tourPricesHasPriceNote = await tableHasColumn(connection, "tour_prices", "price_note");
  const [tourRows] = await connection.execute(
    `SELECT
       t.*,
       tc.name AS category_name,
       tc.slug AS category_slug,
       (
         SELECT tm.url
         FROM tour_media tm
         WHERE tm.tour_id = t.id AND tm.media_type = 'image'
         ORDER BY tm.is_cover DESC, tm.display_order ASC, tm.id ASC
         LIMIT 1
       ) AS cover_image_url
     FROM tours t
     LEFT JOIN tour_categories tc ON tc.id = t.category_id
     WHERE t.id = ?
     LIMIT 1`,
    [tourId],
  );

  if (!tourRows.length) {
    const error = new Error("Tour package not found");
    error.statusCode = 404;
    throw error;
  }

  const [highlights] = await connection.execute(
    `SELECT id, title
     FROM tour_highlights
     WHERE tour_id = ?
     ORDER BY display_order ASC, id ASC`,
    [tourId],
  );
  const [destinations] = await connection.execute(
    `SELECT
       td.destination_id,
       d.name,
       td.description
     FROM tour_destinations td
     JOIN destinations d ON d.id = td.destination_id
     WHERE td.tour_id = ?
     ORDER BY td.display_order ASC, td.id ASC`,
    [tourId],
  );
  const [itineraryDays] = await connection.execute(
    `SELECT id, day_number, title, description
     FROM tour_itinerary_days
     WHERE tour_id = ?
     ORDER BY display_order ASC, day_number ASC, id ASC`,
    [tourId],
  );
  const [prices] = await connection.execute(
    tourPricesHasPriceNote
      ? `SELECT tp.id, tp.currency_id, tp.price, tp.price_note, c.code AS currency_code, c.name AS currency_name, c.symbol AS currency_symbol
         FROM tour_prices tp
         LEFT JOIN currencies c ON c.id = tp.currency_id
         WHERE tour_id = ?
         ORDER BY tp.id ASC`
      : `SELECT tp.id, tp.currency_id, tp.price, NULL AS price_note, c.code AS currency_code, c.name AS currency_name, c.symbol AS currency_symbol
         FROM tour_prices tp
         LEFT JOIN currencies c ON c.id = tp.currency_id
         WHERE tour_id = ?
         ORDER BY tp.id ASC`,
    [tourId],
  );
  const [media] = await connection.execute(
    `SELECT id, media_type, url, title, is_cover
     FROM tour_media
     WHERE tour_id = ?
     ORDER BY display_order ASC, id ASC`,
    [tourId],
  );
  const inclusions = await readRichSection(connection, "tour_inclusions", "title", tourId);
  const exclusions = await readRichSection(connection, "tour_exclusions", "title", tourId);
  const extras = await readRichSection(connection, "tour_extras", "name", tourId);

  const tour = tourRows[0];

  return {
    basic: {
      category_id: tour.category_id,
      category_name: tour.category_name,
      category_slug: tour.category_slug,
      description: tour.description || "",
      duration_days: tour.duration_days,
      duration_nights: tour.duration_nights,
      name: tour.name,
      status: tour.status,
    },
    cover_image_url: tour.cover_image_url,
    destinations,
    exclusions,
    extras,
    highlights,
    id: tour.id,
    inclusions,
    itinerary_days: itineraryDays,
    media,
    package: tour,
    prices,
  };
}

export async function getFullTourPackage(payload = {}) {
  const tourId = cleanNumber(payload.id || payload.tour_id);

  if (!tourId) {
    const error = new Error("Tour package id is required");
    error.statusCode = 400;
    throw error;
  }

  return transaction((connection) => getTourWithDetails(connection, tourId));
}

export async function createFullTourPackage(payload = {}) {
  const basic = payload.basic || {};
  requireFields(basic, ["name"]);

  return transaction(async (connection) => {
    const slug = await createUniqueTourSlug(connection, basic.name);
    const status = basic.status === "published" ? "published" : "draft";
    const tourId = await insert(
      connection,
      `INSERT INTO tours
        (category_id, name, slug, description, duration_days, duration_nights, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanNumber(basic.category_id),
        cleanText(basic.name),
        slug,
        cleanText(basic.description),
        cleanNumber(basic.duration_days),
        cleanNumber(basic.duration_nights),
        status,
      ],
    );

    await saveTourPackageDetails(connection, tourId, payload);

    const [rows] = await connection.execute("SELECT * FROM tours WHERE id = ? LIMIT 1", [tourId]);

    return {
      package: rows[0],
      tour_id: tourId,
    };
  });
}

export async function updateFullTourPackage(payload = {}) {
  const tourId = cleanNumber(payload.id || payload.tour_id);
  const basic = payload.basic || {};

  if (!tourId) {
    const error = new Error("Tour package id is required");
    error.statusCode = 400;
    throw error;
  }

  requireFields(basic, ["name"]);

  return transaction(async (connection) => {
    const [existingRows] = await connection.execute("SELECT id FROM tours WHERE id = ? LIMIT 1", [tourId]);

    if (!existingRows.length) {
      const error = new Error("Tour package not found");
      error.statusCode = 404;
      throw error;
    }

    const slug = await createUniqueTourSlug(connection, basic.name, tourId);
    const status = basic.status === "published" ? "published" : "draft";

    await connection.execute(
      `UPDATE tours
       SET category_id = ?,
           name = ?,
           slug = ?,
           description = ?,
           duration_days = ?,
           duration_nights = ?,
           status = ?
       WHERE id = ?`,
      [
        cleanNumber(basic.category_id),
        cleanText(basic.name),
        slug,
        cleanText(basic.description),
        cleanNumber(basic.duration_days),
        cleanNumber(basic.duration_nights),
        status,
        tourId,
      ],
    );

    if (await tableExists(connection, "tour_accommodations")) {
      await connection.execute("DELETE FROM tour_accommodations WHERE tour_id = ?", [tourId]);
    }

    if (await tableExists(connection, "tour_meals")) {
      await connection.execute("DELETE FROM tour_meals WHERE tour_id = ?", [tourId]);
    }

    await connection.execute("DELETE FROM tour_highlights WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_destinations WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_itinerary_days WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_prices WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_inclusions WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_exclusions WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_extras WHERE tour_id = ?", [tourId]);
    await connection.execute("DELETE FROM tour_media WHERE tour_id = ?", [tourId]);

    await saveTourPackageDetails(connection, tourId, payload);

    return getTourWithDetails(connection, tourId);
  });
}
