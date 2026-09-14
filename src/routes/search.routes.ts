import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { validate, searchDoctorSchema } from '../middlewares/validate.js';

const router = Router();
const controller = new SearchController();

router.get('/doctors', validate(searchDoctorSchema, 'query'), (req, res, next) => controller.searchDoctors(req, res, next));

export default router;
