const express  = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const Mongostore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flas = require('connect-flash');
const passport = require('passport');


container.resolve(function(users,admin,_){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/chatApplication',{useMongoClient:true});

    const app = SetUpExpress();
    function SetUpExpress(){
        const app = express();
        const server = http.createServer(app);
        server.listen(8000,function(){
            console.log('Listening on port 8000');
        });

      ConfigureExpress(app);  
        //SetUp Router 
    const router = require('express-promise-router')();
    users.SetRouting(router);
    admin.SetRouting(router);
    app.use(router);
    }    

    function ConfigureExpress(app){

       require('./passport/passport-local');
       require('./passport/passport-facebook');
       require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(validator());
        app.use(session({
            secret:'thisisasecretkey',
            resave:true,
            saveUninitialized:true,
            store:new Mongostore({mongooseConnection:mongoose.connection})
        }));

        app.use(flas());
        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._= _;
    }
})