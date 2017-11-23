'use strict';

const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(req,email,password,done)=>{
   
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }

        if(user){
            return(null,false,req.flash('error','User with email is already exist'));
        }

        const newUser = new User();
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.userName = req.body.username;

        newUser.save((err)=>{
            done(null,newUser);
        });
    });
}));


passport.use('local.login', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(req,email,password,done)=>{
    console.log("Inside local.login");
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }
        console.log("Inside local.login-->1");
        const messages = [];
        if(!user || !user.vailidUserPassword(password)){
            messages.push("Email doesn't exist or password in not vailid");
            return done(null,false,req.flash('error',messages));
        }
        return done(null,user);

    });
}));