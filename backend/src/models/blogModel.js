import { createRow, deleteRow, listRows, requireFields, updateRow } from "./baseModel.js";
import { query } from "../config/database.js";
import { createNotification } from "./notificationModel.js";

const blogFields = [
  "title",
  "slug",
  "content",
  "cover_image_url",
  "status",
  "published_at",
];

export function listBlogPosts(payload = {}) {
  return listRows("blog_posts", {
    allowedFilters: ["status"],
    filters: payload.filters,
    limit: payload.limit,
    offset: payload.offset,
    orderBy: "created_at",
    searchable: ["title", "content"],
    search: payload.search,
  });
}

export async function getBlogPost(payload = {}) {
  const { id, slug, status } = payload;

  if (!id && !slug) {
    const error = new Error("Blog post id or slug is required");
    error.statusCode = 400;
    throw error;
  }

  const clauses = [id ? "id = :id" : "slug = :slug"];
  const params = id ? { id } : { slug };

  if (status) {
    clauses.push("status = :status");
    params.status = status;
  }

  const rows = await query(`SELECT * FROM blog_posts WHERE ${clauses.join(" AND ")} LIMIT 1`, params);

  if (!rows[0]) {
    const error = new Error("Blog post not found");
    error.statusCode = 404;
    throw error;
  }

  return rows[0];
}

export async function createBlogPost(payload = {}) {
  requireFields(payload, ["title"]);
  const slug = await makeUniqueSlug(payload.title);
  const status = payload.status || "draft";
  const post = await createRow("blog_posts", { ...payload, slug, status }, blogFields);

  await createNotification({
    entity_id: post.id,
    entity_type: "blog_post",
    message: `${post.title} was created as a ${post.status} blog post.`,
    title: "Blog post created",
    type: "blog",
  });

  return post;
}

export function updateBlogPost(payload = {}) {
  requireFields(payload, ["id"]);
  return updateRow("blog_posts", payload.id, payload, blogFields);
}

export function deleteBlogPost(payload = {}) {
  requireFields(payload, ["id"]);
  return deleteRow("blog_posts", payload.id);
}

async function makeUniqueSlug(title) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;

  while (await slugExists(slug)) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

async function slugExists(slug) {
  const rows = await query("SELECT id FROM blog_posts WHERE slug = :slug LIMIT 1", { slug });
  return rows.length > 0;
}

function slugify(value) {
  return String(value || "blog-post")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
