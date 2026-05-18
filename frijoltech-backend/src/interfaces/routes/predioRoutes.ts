import { Router } from 'express';
import { PredioController } from '../controllers/PredioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { registrarPredioSchema } from '../dtos/predioDtos';

const router = Router();
const ctrl = new PredioController();

router.use(authMiddleware);
router.post('/', validate(registrarPredioSchema), (req, res, next) => ctrl.registrar(req as never, res, next));
router.get('/', (req, res, next) => ctrl.listar(req as never, res, next));

export default router;
