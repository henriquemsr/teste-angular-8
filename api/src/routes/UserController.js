module.exports = (app) => {
    //declare version api
    const version = "/v1/usuario";
    //declare model usuario
    const usuario = app.src.models.users;
    //imports libs
    const jwt = app.src.libs.libs[0];
    const jwtOptions = app.src.libs.libs[1];
    const bcrypt = app.src.libs.libs[2];
    const passport = app.src.libs.libs[4];
    const getUser = app.src.libs.libs[7];

    //function check carateres especiais
    var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    var checkForSpecialChar = function (string) {
        for (i = 0; i < specialChars.length; i++) {
            if (string.indexOf(specialChars[i]) > -1) {
                return true
            }
        }
        return false;
    }

    //login user
    app.route(version + '/login')
        .all((req, res, next) => {
            delete req.body.id;
            next();
        }).post(async (req, res) => {
            const { email, password } = req.body;

            if (req.body.email == null || req.body.email == '' || req.body.email == undefined) {
                res.json({
                    error: true,
                    data: 'Favor preencha o email'
                })
            } else if (req.body.password == null || req.body.password == '' || req.body.password == undefined) {
                res.json({
                    error: true,
                    data: 'Favor preencha a senha'
                })
            } else {
                if (email && password) {
                    let user = await getUser({ email: email });
                    if (!user) {
                        res.json({
                            error: true,
                            data: "O usuario não encontrado"
                        })
                    }
                    const match = await bcrypt.compare(password, user.password);
                    if (match) {
                        let payload = { id: user.id };
                        let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 1800 });
                        res.json({ msg: 'Você esta logado!', token: token, id: user.id, name: user.get('nome'), perfil: user.get('perfil'), error: false });
                    } else {
                        res.json({
                            error: true,
                            data: "A senha esta incorreta"
                        })
                    }
                }
            }
        });

    //cadastro de usuario
    app.route(version + '/usuario')
        .post((req, res) => {
            if (req.body.nome == undefined || req.body.nome == null || req.body.nome == '') {
                res.json({
                    error: true,
                    data: "Favor Preencha o nome",
                })
            }
            else if (req.body.email == undefined || req.body.email == null || req.body.email == '') {
                res.json({
                    error: true,
                    data: "Favor Preencha o email",
                })
            }
            else if (req.body.telefone == undefined || req.body.telefone == null || req.body.telefone == '') {
                res.json({
                    error: true,
                    data: "Favor Preencha o telefone",
                })
            }
            else if (req.body.password == undefined || req.body.password == null || req.body.password == '') {
                res.json({
                    error: true,
                    data: "Favor Preencha a senha",
                })
            }
            else if (req.body.perfil == undefined || req.body.perfil == null || req.body.perfil == '') {
                res.json({
                    error: true,
                    data: "Favor Preencha o perfil",
                })
            }
            else if (req.body.password.length < 6) {
                res.json({
                    error: true,
                    data: "A senha precisa ter pelo menos 6 digitos",
                })
            }
            else if (!checkForSpecialChar(req.body.password)) {
                res.json({
                    error: true,
                    data: "A senha precisa ter pelo menos 1 caratere especial",
                })

            } else {
                usuario.findAndCountAll({ where: { email: req.body.email } }).then(result => {
                    if (result.count == 0) {
                        let payload = { id: result.rows.id };
                        let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: 1800 });
                        const {
                            nome,
                            email,
                            telefone,
                            password,
                            perfil
                        } = req.body;
                        let hash = bcrypt.hashSync(password, 10);
                        usuario.create({
                            nome: nome,
                            email: email,
                            telefone: telefone,
                            password: hash,
                            perfil: perfil
                        }).then(user => res.status(201).json({
                            error: false,
                            message: 'Cadastro realizado com sucesso',
                            id: user.get('id'),
                            name: user.get('nome'),
                            perfil: user.get('perfil'),
                            token: token
                        })).catch(error => res.json({
                            error: true,
                            data: [],
                            error: error
                        }))
                    } else {
                        res.json({
                            error: true,
                            data: "Usuario ja existe"
                        })
                    }

                })
            }
        });

    app.route(version + '/usuario')
        .get(passport.authenticate("jwt", { session: false }),(req, res) => {
            usuario.findAndCountAll({order:[['nome']],attributes:['nome','email','telefone','usuario_path_img','date_create','status']}).then(result => {
                res.status(200).json({
                    error: false,
                    data: result
                })
            }).catch(err => {
                res.status(500).json({
                    error: true,
                    data: err
                })

            })

        });

    app.route(version + '/usuario/:id')
        .get(passport.authenticate("jwt", { session: false }),(req, res) => {
            const id = req.params.id;
            usuario.findOne({
                attributes:['nome','email','telefone','usuario_path_img','date_create','status'],
                where: {
                    id: id
                }
            }).then(result => {
                res.status(200).json({
                    error: false,
                    data: result
                })
            }).catch(err => {
                res.status(500).json({
                    error: true,
                    data: err
                })

            })

        });

}