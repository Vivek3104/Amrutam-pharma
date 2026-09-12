import { query } from '../database/index.js';

export class AnalyticsService {
  async getDashboardOverview() {
    // 1. Total consultations & breakdown
    const consSummary = await query(`
      SELECT status, COUNT(*) as count 
      FROM consultations 
      GROUP BY status;
    `);

    // 2. Total revenue
    const revSummary = await query(`
      SELECT SUM(amount) as total_revenue, COUNT(*) as successful_transactions 
      FROM payments 
      WHERE status = 'SUCCESS';
    `);

    // 3. Total active users count by role
    const usersSummary = await query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role;
    `);

    // 4. Top Specialties by booking volume
    const specialtySummary = await query(`
      SELECT d.specialty, COUNT(c.id) as total_consultations
      FROM consultations c
      JOIN doctors d ON d.id = c.doctor_id
      GROUP BY d.specialty
      ORDER BY total_consultations DESC
      LIMIT 5;
    `);

    return {
      consultationsByStatus: consSummary.rows,
      revenue: {
        totalRevenue: parseFloat(revSummary.rows[0]?.total_revenue || '0'),
        successfulTransactions: parseInt(revSummary.rows[0]?.successful_transactions || '0', 10),
      },
      usersByRole: usersSummary.rows,
      topSpecialties: specialtySummary.rows,
      generatedAt: new Date().toISOString(),
    };
  }

  async getDailyConsultationTrends(days = 7) {
    const res = await query(`
      SELECT DATE(created_at) as date, COUNT(*) as total_consultations,
             COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_consultations,
             COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_consultations
      FROM consultations
      WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC;
    `, [days]);

    return res.rows;
  }
}
