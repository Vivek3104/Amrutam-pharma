import { query } from '../database/index.js';

export class AuditService {
  async getAuditLogs(limit = 50, offset = 0) {
    const res = await query(
      `SELECT id, user_id, user_role, action, resource, resource_id, ip_address, user_agent, timestamp
       FROM audit_logs
       ORDER BY timestamp DESC
       LIMIT $1 OFFSET $2;`,
      [limit, offset]
    );

    const countRes = await query(`SELECT COUNT(*) FROM audit_logs;`);

    return {
      logs: res.rows,
      totalCount: parseInt(countRes.rows[0].count, 10),
      limit,
      offset,
    };
  }
}
