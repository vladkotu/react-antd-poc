import express from 'express';
var router = express.Router()

router.get('/', (req, res, next) => {
  res.send({ accounts: true })
})

export default router;
