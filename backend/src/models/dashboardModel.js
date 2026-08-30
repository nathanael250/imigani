import { query } from "../config/database.js";
import { ensureInquiryReadColumn } from "./inquiryModel.js";
import { getUnreadNotificationCount } from "./notificationModel.js";

export async function getDashboardSummary() {
  await ensureInquiryReadColumn();

  const [tourStats] = await query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'published') AS published,
      SUM(status = 'draft') AS draft
    FROM tours
  `);
  const [inquiryStats] = await query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'new') AS new_count,
      SUM(is_read = 0) AS unread_count,
      SUM(status = 'responded') AS responded,
      SUM(status = 'in_progress') AS in_progress
    FROM inquiries
  `);
  const [blogStats] = await query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'published') AS published,
      SUM(status = 'draft') AS draft
    FROM blog_posts
  `);
  const [reviewStats] = await query(`
    SELECT
      COUNT(*) AS total,
      SUM(status = 'approved') AS approved,
      SUM(status = 'pending') AS pending
    FROM reviews
  `);
  const latestInquiries = await query(`
    SELECT id, name, email, phone, inquiry, status, is_read, created_at
    FROM inquiries
    ORDER BY created_at DESC
    LIMIT 5
  `);
  const recentBlogPosts = await query(`
    SELECT id, title, status, cover_image_url, created_at
    FROM blog_posts
    ORDER BY created_at DESC
    LIMIT 5
  `);

  return {
    blogs: {
      draft: Number(blogStats?.draft || 0),
      published: Number(blogStats?.published || 0),
      total: Number(blogStats?.total || 0),
    },
    inquiries: {
      inProgress: Number(inquiryStats?.in_progress || 0),
      new: Number(inquiryStats?.new_count || 0),
      responded: Number(inquiryStats?.responded || 0),
      total: Number(inquiryStats?.total || 0),
      unread: Number(inquiryStats?.unread_count || 0),
    },
    latestInquiries,
    notifications: {
      unread: await getUnreadNotificationCount(),
    },
    recentBlogPosts,
    reviews: {
      approved: Number(reviewStats?.approved || 0),
      pending: Number(reviewStats?.pending || 0),
      total: Number(reviewStats?.total || 0),
    },
    tours: {
      draft: Number(tourStats?.draft || 0),
      published: Number(tourStats?.published || 0),
      total: Number(tourStats?.total || 0),
    },
  };
}
