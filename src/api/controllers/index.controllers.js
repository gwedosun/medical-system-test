const data = require('../../database/data');

function listAll(req, res) {
    const appointments = data.consultas
    return res.json(appointments);
};



module.exports = {
    listAll
    // createAccount,
    // updateAccount,
    // deleteAccount,
    // deposite,
    // takeOut,
    // transfer,
    // balance,
    // statement
};