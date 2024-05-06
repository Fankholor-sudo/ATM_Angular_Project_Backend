const express = require('express');
const Transaction = require('../controller/transaction');

const router = express.Router();

router.post('/', Transaction.TransactionCreate);
router.get('/:id', Transaction.TransactionGet);
router.post('/update', Transaction.TransactionUpdate);

module.exports = router;