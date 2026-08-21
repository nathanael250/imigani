import { query } from "../config/database.js";

export async function getDashboardSummary() {
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
      SUM(status = 'responded') AS responded,
      SUM(status = 'in_progress') AS in_progress
    FROM inquiries
  `);
  const latestInquiries = await query(`
    SELECT id, name, email, phone, inquiry, status, created_at
    FROM inquiries
    ORDER BY created_at DESC
    LIMIT 5
  `);

  return {
    inquiries: {
      inProgress: Number(inquiryStats?.in_progress || 0),
      new: Number(inquiryStats?.new_count || 0),
      responded: Number(inquiryStats?.responded || 0),
      total: Number(inquiryStats?.total || 0),
    },
    latestInquiries,
    tours: {
      draft: Number(tourStats?.draft || 0),
      published: Number(tourStats?.published || 0),
      total: Number(tourStats?.total || 0),
    },
  };
}
