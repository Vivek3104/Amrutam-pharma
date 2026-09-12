import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';

const router = Router();
const controller = new SearchController();

router.get('/doctors', (req, res, next) => controller.searchDoctors(req, res, next));

export default router;
