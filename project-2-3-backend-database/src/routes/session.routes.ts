import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(sessionController.list));
router.get('/:id', asyncHandler(sessionController.getOne));
router.post('/', asyncHandler(sessionController.create));
router.put('/:id', asyncHandler(sessionController.update));
router.delete('/:id', asyncHandler(sessionController.remove));

export default router;