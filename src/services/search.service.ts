import { query } from '../database/index.js';
import { cacheGet, cacheSet } from '../redis/index.js';

export interface SearchDoctorQuery {
  specialty?: string;
  minRating?: number;
  maxFee?: number;
  limit?: number;
  offset?: number;
}

export class SearchService {
  async searchDoctors(filter: SearchDoctorQuery) {
    const cacheKey = `search:doctors:${JSON.stringify(filter)}`;

    // 1. Try Redis Cache
    const cached = await cacheGet<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Query Database
    let sql = `
      SELECT d.id as doctor_id, d.specialty, d.experience_years, d.consultation_fee, d.rating, d.bio,
             p.full_name, p.gender
      FROM doctors d
      JOIN users u ON u.id = d.user_id
      JOIN profiles p ON p.user_id = u.id
      WHERE d.is_verified = TRUE
    `;
    const params: any[] = [];

    if (filter.specialty) {
      params.push(`%${filter.specialty}%`);
      sql += ` AND d.specialty ILIKE $${params.length}`;
    }

    if (filter.minRating) {
      params.push(filter.minRating);
      sql += ` AND d.rating >= $${params.length}`;
    }

    if (filter.maxFee) {
      params.push(filter.maxFee);
      sql += ` AND d.consultation_fee <= $${params.length}`;
    }

    sql += ` ORDER BY d.rating DESC, d.experience_years DESC`;

    const limit = filter.limit || 20;
    const offset = filter.offset || 0;
    params.push(limit, offset);
    sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const res = await query(sql, params);
    const results = res.rows;

    // 3. Cache results for 60 seconds
    await cacheSet(cacheKey, results, 60);

    return results;
  }
}
