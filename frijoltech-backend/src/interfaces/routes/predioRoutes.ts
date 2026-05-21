import { Router } from 'express';
import { PredioController } from '../controllers/PredioController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { registrarPredioSchema, actualizarPredioSchema } from '../dtos/predioDtos';

const router = Router();
const ctrl = new PredioController();

router.use(authMiddleware);
router.post('/', validate(registrarPredioSchema), (req, res, next) => ctrl.registrar(req as never, res, next));
router.get('/', (req, res, next) => ctrl.listar(req as never, res, next));
router.get('/:id', (req, res, next) => ctrl.obtener(req as never, res, next));
router.get('/:id/lotes', (req, res, next) => ctrl.listarLotes(req as never, res, next));
router.put('/:id', validate(actualizarPredioSchema), (req, res, next) => ctrl.actualizar(req as never, res, next));

export default router;
