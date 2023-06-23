const correctPassword = require('../../database/data').consultorio.senha;
const correctCnes = require('../../database/data').consultorio.cnes;

const auth = async (req, res, next) => {
    const { senha_consultorio } = req.query;
    try {
        if (!senha_consultorio || senha_consultorio !== correctPassword) {
            throw new Error();
        };
        next();
    } catch (e) {
        return res.status(401).json({
            message: 'Usuário não autorizado ou senha incorreta!'
        });
    }
};

const authCnes = async (req, res, next) => {
    const { cnes_consultorio } = req.query;
    try {
        if (!cnes_consultorio || cnes_consultorio !== correctCnes) {
            throw new Error();
        };
        next();
    } catch (e) {
        return res.status(401).json({
            message: 'Usuário não autorizado ou senha incorreta!'
        });
    }
};

module.exports = {
    auth,
    authCnes
};