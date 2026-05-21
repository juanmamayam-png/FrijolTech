import { Router } from 'express';
import { IncidenciaController } from '../controllers/IncidenciaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { registrarIncidenciaSchema } from '../dtos/incidenciaDtos';

/**
 * Rutas de incidencias fitosanitarias asociadas a una campaña.
 * Se monta en /api/v1/campañas → POST /api/v1/campañas/:id/incidencias
 * La ruta pública de plagas se movió a plagaRoutes (/api/v1/plagas).
 */
const router = Router();
const ctrl = new IncidenciaController();

router.use(authMiddleware);
router.post('/:id/incidencias', validate(registrarIncidenciaSchema), (req, res, next) => ctrl.registrar(req, res, next));

export default router;
