import express from 'express';
const router = express.Router();
import usersRouter from './users';
import accountsRouter from './accounts';

router.use('/users', usersRouter)
router.use('/accounts', accountsRouter)

export default router;
