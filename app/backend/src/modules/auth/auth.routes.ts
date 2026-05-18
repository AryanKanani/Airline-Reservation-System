import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/me', authenticate, AuthController.me);

export default router;
