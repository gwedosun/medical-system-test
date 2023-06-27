let data = require('../../database/data');

function listarConsultas(req, res) {
    const todasAsConsultas = data.consultas;
    return res.json(data.consultas);
};

function criarConsulta(req, res) {
    const { tipoConsulta, valorConsulta, paciente } = req.body;
    const { nome, cpf, dataNascimento, celular, email, senha } = paciente;

    // verificar se todos os dados estão preenchidos 
    if (!tipoConsulta || !valorConsulta || !nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({
            message: 'Preencha todos os dados para prosseguir.'
        })
    }

    // verificar se o valor da consulta é um numero
    if (!Number(valorConsulta)) {
        return res.status(400).json({
            message: 'Insira um número válido.'
        })
    }

    // verificar se o email é unico
    const emailExistente = data.consultas.find((el) => { return el.paciente.email === email });

    if (emailExistente) {
        return res.status(400).json({ message: 'Já existe uma conta vinculada a este e-mail.' })
    };

    // verificar se o cpf é unico 
    const cpfExistente = data.consultas.find(el => el.paciente.cpf === cpf);
    if (cpfExistente) {
        return res.status(400).json({
            message: 'Já existe uma conta vinculada a este CPF.'
        })
    };

    // verificar se há alguma consulta em andamento
    const consultaExistenteCpf = data.consultas.find(el => el.paciente.cpf === cpf);
    const consultaExistenteEmail = data.consultas.find(el => el.paciente.email === email);
    if (consultaExistenteCpf || consultaExistenteEmail) {
        return res.status(400).json({ message: 'Já existe uma consulta em andamento com o CPF/e-mail informado!' });

    }
    // validar se a especialidade existe
    const especialidade = tipoConsulta;
    const medicoEspecializado = data.consultorio.medicos.find((medico) => medico.especialidade === especialidade);
    if (!especialidade) {
        return res.status(400).json({
            message: 'Não atendemos essa especialidade.'
        });
    };

    // identificador do médico
    const idMedico = medicoEspecializado.identificador;



    const novaConsulta = {
        identificador: data.identificador++,
        tipoConsulta,
        idMedico,
        finalizada: false,
        valorConsulta,
        paciente: {
            nome,
            cpf,
            dataNascimento,
            celular,
            email,
            senha,
        },
    };



    data.consultas.push(novaConsulta);
    const { senha: _, ...user } = novaConsulta;
    return res.status(201).json(user);
};

function atualizarConsulta(req, res) {
    const paciente = req.body;
    const { nome, cpf, dataNascimento, celular, email, senha } = paciente;

    let idConsulta = req.params.idConsulta;
    if (!Number(idConsulta)) {
        return res.status(400).json({ message: 'Insira um número válido.' });
    };
    idConsulta = Number(idConsulta)

    // verificar se todos os campos estão preenchidos
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ message: 'Preencha todos os dados para prosseguir.' });
    }

    // verificar o id da consulta
    const consulta = data.consultas.find((el) => el.identificador === idConsulta);
    if (!consulta) {
        return res.status(404).json({ message: 'Consulta não existente. Tente novamente.' });
    }

    // verificar se a consulta não foi finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ message: "Não é possível atualizar dados de uma consulta finalizada." });
    }

    // verificar cpf existente
    const cpfExistente = data.consultas.find((el) => el.paciente.cpf === cpf && el.identificador !== idConsulta);
    if (cpfExistente) {
        return res.status(400).json({ message: 'CPF já existente.' });
    }

    // verificar email existente
    const emailExistente = data.consultas.find((el) => el.paciente.email === email && el.identificador !== idConsulta);
    if (emailExistente) {
        return res.status(400).json({ message: 'E-mail já existente.' });
    }

    // atualizar os dados do paciente na consulta
    consulta.paciente.nome = nome;
    consulta.paciente.cpf = cpf;
    consulta.paciente.dataNascimento = dataNascimento;
    consulta.paciente.celular = celular;
    consulta.paciente.email = email;
    consulta.paciente.senha = senha;

    res.status(201).json({ message: 'Dados atualizados com sucesso!' });
}

function cancelarConsulta(req, res) {
    const idConsulta = req.params.idConsulta;

    // verificar id da consulta como param
    const consulta = data.consultas.find((el) => el.identificador === +idConsulta);
    if (!consulta) {
        return res.status(404).json({ message: 'Consulta não existente. Tente novamente.' });
    }

    // ver se a consulta foi finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ message: 'A consulta não pôde ser cancelada pois já foi finalizada.' })
    };

    // remover a consulta 
    data.consultas = data.consultas.filter(
        (consulta) => consulta.identificador !== +idConsulta);
    res.status(201).json({ message: "Consulta cancelada com sucesso." });
};

function finalizarConsulta(req, res) {
    const { idConsulta, textoMedico } = req.body;

    // verificar se todos os campos estão preenchidos
    if (!idConsulta || !textoMedico) {
        return res.status(400).json({ message: 'Preencha todos os dados para prosseguir.' });
    }

    // verificar o id da consulta
    const consulta = data.consultas.find((el) => el.identificador === +idConsulta);
    if (!consulta) {
        return res.status(404).json({ message: 'Consulta não existente. Tente novamente.' });
    }

    // verificar se a consulta não foi finalizada
    if (consulta.finalizada) {
        return res.status(400).json({ message: "Consulta já finalizada." });
    };

    // verificar tamanho do txt medico
    if (textoMedico.length === 0 || textoMedico.length > 200) {
        return res.status(400).json({ message: 'O textoMedico precisa ter entre 0 e 200 caracteres.' });
    };

    // laudo
    let novoLaudo = {
        idLaudo: data.idLaudo,
        idConsulta: idConsulta,
        idMedico: consulta.idMedico,
        textoMedico: textoMedico,
        paciente: consulta.paciente,
    };
    data.laudos.push(novoLaudo);

    // finalizar consulta
    consulta.finalizada = true;
    consulta.idLaudo = data.idLaudo++;

    return res.status(200).json({ message: 'Consulta finalizada com sucesso.' });
};

function laudoConsultas(req, res) {
    const idConsulta = req.query.idConsulta;
    const senha = req.query.senha;

    // verificar senha e id
    if (!idConsulta || !senha) {
        return res.status(400).json({ message: 'Informe identificador e senha para prosseguir.' })
    };

    // verificar consulta
    const consulta = data.consultas.find((el) => el.identificador === +idConsulta);
    if (!consulta) {
        return res.status(404).json({ message: 'Consulta não existente. Tente novamente.' });
    };

    // verificar a senha
    if (consulta.paciente.senha !== senha) {
        return res.status(400).json({ message: 'Senha incorreta. Tente novamente.' })
    };

    // verificar se existe laudo
    const laudo = data.laudos.find((laudo) => laudo.idConsulta === +idConsulta);
    if (!laudo) {
        return res.status(404).json({ message: 'Laudo não encontrado.' });
    };

    // exibir laudo e info
    // const laudoExibido = {
    //     identificador: laudo.identificador,
    //     idConsulta: laudo.idConsulta,
    //     idMedico: laudo.idMedico,
    //     textoMedico: laudo.textoMedico,
    //     paciente: consulta.paciente
    // }

    const resultado = { ...consulta, ...laudo }

    res.status(200).json(resultado);
};

function consultasMedico(req, res) {
    const idMedico = req.query.idMedico;

    const medico = data.consultorio.medicos.find((el) => el.identificador === Number(idMedico));
    if (!medico) {
        return res.status(402).json({ message: 'O médico informado não existe.' });
    }

    const consultasFinalizadas = data.consultas.filter(
        (consulta) => consulta.idMedico === Number(idMedico) && consulta.finalizada
    );

    return res.status(200).json(consultasFinalizadas);
}




module.exports = {
    listarConsultas,
    criarConsulta,
    atualizarConsulta,
    cancelarConsulta,
    finalizarConsulta,
    laudoConsultas,
    consultasMedico,
};