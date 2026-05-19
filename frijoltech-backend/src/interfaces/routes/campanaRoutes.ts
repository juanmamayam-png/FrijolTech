import { Router } from 'express';
import { CampanaController } from '../controllers/CampanaController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { iniciarCampanaSchema } from '../dtos/campanaDtos';

const router = Router();
const ctrl = new CampanaController();

router.use(authMiddleware);
router.post('/', validate(iniciarCampanaSchema), (req, res, next) => ctrl.iniciar(req, res, next));
router.get('/:id', (req, res, next) => ctrl.consultar(req, res, next));
router.get('/:id/etapas', (req, res, next) => ctrl.listarEtapas(req, res, next));

export default router;
