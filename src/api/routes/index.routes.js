const express = require('express');
const controllers = require('../controllers/index.controllers.js');
const { auth, authCnes } = require('../middleware/auth.js');
const router = express.Router();
router.use(auth, authCnes);

router.get('/consultas', controllers.listAll);
// router.post('/contas', controllers.createAccount);
// router.put('/contas/:id/usuario', controllers.updateAccount);
// router.delete('/contas/:id', controllers.deleteAccount);
// router.post('/trasacoes/depositar', controllers.deposite);
// router.post('/trasacoes/sacar', controllers.takeOut);
// router.post('/trasacoes/transfer', controllers.transfer);
// router.get('/contas/saldo', controllers.balance);
// router.get('/contas/extrato', controllers.statement);




module.exports = router;