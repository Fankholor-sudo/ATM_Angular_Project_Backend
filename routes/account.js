const express = require('express');
const Account = require('../controller/account');

const router = express.Router();

router.post('/', Account.AccountCreate);
router.get('/', Account.AccountGet);
router.get('/:id', Account.AccountMyAccounts);
router.post('/withdraw', Account.AccountWithdraw);
router.post('/transfer', Account.AccountTransfer);
router.post('/payment', Account.AccountPayment);

module.exports = router;