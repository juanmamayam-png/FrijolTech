import { Router } from 'express';
import { IncidenciaController } from '../controllers/IncidenciaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { registrarIncidenciaSchema } from '../dtos/incidenciaDtos';

const router = Router();
const ctrl = new IncidenciaController();

router.get('/plagas', (req, res, next) => ctrl.listarPlagas(req, res, next));

router.use(authMiddleware);
router.post('/:id/incidencias', validate(registrarIncidenciaSchema), (req, res, next) => ctrl.registrar(req, res, next));

export default router;
