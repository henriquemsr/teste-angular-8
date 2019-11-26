module.exports = (app) => {
    //get model usuario for login passport
    const usuario = app.src.models.users;
    //habilite cors
    const cors = require('cors');
    app.use(cors());
    //import helmet
    const helmet = require('helmet');
    //import body parser
    const body = require('body-parser');
    //use body parser
    app.use(body.urlencoded({ extended: false }));
    app.use(body.json());
    const passport = require('passport');
    // serilize token in guard session
    passport.serializeUser(function (user, done) {
      done(null, usuario);
    });
    //deserilize token 
    passport.deserializeUser(function (user, done) {
      done(null, usuario);
    });
    const jwt = require('jsonwebtoken');
    const passportJWT = require('passport-jwt');
    const fs = require('fs')
    const { promisify } = require('util');
  
    //conferte excel
    const json2csv = require('json2csv');
  
    //bcrypt
    const bcrypt = require('bcrypt');
  
    //config email
    const nodemailer = require('nodemailer');
  
    //upload image prod 
    const uploadProduto = require('../uploadImage/uploadProd.js');
     //upload image usuario
     const uploadUsuario = require('../uploadImage/uploadUser.js');
  
    //declare variavel nfe
    var nfe = require('nfe-io')('chave-de-acesso-na-api');
  
    //use body parser
    app.use(body.urlencoded({ extended: false }));
    app.use(body.json());
    //habilitar helmet
    app.use(helmet());
    //const get user
    const getUser = async obj => {
      return await usuario.findOne({
        where: obj,
      });
    };
    //unlik image
    const unlinkAsync = promisify(fs.unlink)
    //passport
    app.use(passport.initialize())
    app.use(passport.session())
    
    
    let ExtractJwt = passportJWT.ExtractJwt;
    let JwtStrategy = passportJWT.Strategy;
    let jwtOptions = {};
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = Math.random().toString();
    // lets create our strategy for web token
    let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
      let user = getUser({ id: jwt_payload.id });
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
  
    // use the strategy
    passport.use(strategy);
  
    //cors habilitada
    /* app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
      }); */
  
  
    return [jwt, jwtOptions, bcrypt, strategy, passport, uploadProduto, body, getUser, nodemailer, unlinkAsync,uploadUsuario];
  }
  