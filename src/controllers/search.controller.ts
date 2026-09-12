import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service.js';

const searchService = new SearchService();

export class SearchController {
  async searchDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { specialty, minRating, maxFee, limit, offset } = req.query;
      const results = await searchService.searchDoctors({
        specialty: specialty as string,
        minRating: minRating ? parseFloat(minRating as string) : undefined,
        maxFee: maxFee ? parseFloat(maxFee as string) : undefined,
        limit: limit ? parseInt(limit as string, 10) : 20,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }
}
