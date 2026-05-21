import { Router } from 'express';
import { IncidenciaController } from '../controllers/IncidenciaController';

/**
 * Ruta pública del catálogo de plagas.
 * Se monta en /api/v1/plagas para NO colisionar con GET /api/v1/campañas/:id
 * (antes vivía en /campañas/plagas y Express la interpretaba como :id="plagas").
 */
const router = Router();
const ctrl = new IncidenciaController();

router.get('/', (req, res, next) => ctrl.listarPlagas(req, res, next));

export default router;
