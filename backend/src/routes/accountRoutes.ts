import { Router } from 'express';
import { accountController } from '../controllers/accountController';

const router = Router();

router.get('/accounts', accountController.listar);
router.get('/accounts/:id', accountController.buscarPorId);
router.post('/accounts/:id/saque', accountController.saque);

export default router;
