const express = require('express');
const Client = require('../controller/client');

const router = express.Router();

router.post('/', Client.ClientCreate);
router.get('/:ClientId', Client.ClientGet);
router.post('/update', Client.ClientUpdate);
router.post('/signin', Client.ClientSignIn);

module.exports = router;