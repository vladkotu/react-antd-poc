import express from 'express';
const router = express.Router();
import contractorsRouter from './contractors';
import accountsRouter from './accounts';

router.use('/contractors', contractorsRouter)
router.use('/accounts', accountsRouter)

export default router;
