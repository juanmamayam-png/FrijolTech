import { Router } from 'express';
import { CampañaController } from '../controllers/CampañaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { iniciarCampañaSchema } from '../dtos/campañaDtos';

const router = Router();
const ctrl = new CampañaController();

router.use(authMiddleware);
router.post('/', validate(iniciarCampañaSchema), (req, res, next) => ctrl.iniciar(req, res, next));
router.get('/:id', (req, res, next) => ctrl.consultar(req, res, next));
router.get('/:id/etapas', (req, res, next) => ctrl.listarEtapas(req, res, next));

export default router;
