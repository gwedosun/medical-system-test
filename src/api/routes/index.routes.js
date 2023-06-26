const express = require('express');
const router = express.Router();
const {
    listarConsultas,
    criarConsulta,
    atualizarConsulta,
    cancelarConsulta,
    finalizarConsulta,
    laudoConsultas,
    consultasMedico
} = require('../controllers/index.controllers');

router.get('/consultas', listarConsultas);
router.post('/consultas', criarConsulta);
router.put('/consultas/:idConsulta', atualizarConsulta);
router.delete('/consultas/:idConsulta', cancelarConsulta);
router.post('/consultas/finalizar', finalizarConsulta);
router.get('/consultas/laudo', laudoConsultas);
router.get('/consultas/medico', consultasMedico);

module.exports = router;
