'use strict';

const passport = require('passport');
const User = require('../models/user');

const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secrestFile');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

passport.use(new FacebookStrategy({
    clientID:secret.facebook.clientID,
    clientsecret:secret.facebook.clientsecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:8000/auth/facebook/callback',
    passReqToCallback: true
},(req, token, refreshToken, profile, done) => {
    
    User.findOne({facebook:profile.id}, (err, user) => {
       if(err){
           return done(err);
       }
        
        if(user){
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbTokens.push({token:token});
            
            newUser.save((err) => {
               if(err){
                   return done(err);
               }

               return done(null, newUser);
            })
        }
    })
}));


