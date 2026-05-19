import { Router } from 'express';
import { EtapaController } from '../controllers/EtapaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { registrarAvanceSchema } from '../dtos/etapaDtos';

const router = Router();
const ctrl = new EtapaController();

router.use(authMiddleware);
router.post('/:etapaId/avance', validate(registrarAvanceSchema), (req, res, next) => ctrl.registrarAvance(req, res, next));

export default router;
