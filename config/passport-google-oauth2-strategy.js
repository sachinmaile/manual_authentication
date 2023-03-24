const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const { doesNotReject } = require('assert');

passport.use(new googleStrategy({
    clientID:"990029122041-r3qb98hp1u47m8tq6hbtm3unfrvlj9th.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"https://localhost:8000/users/auth/google/callback"
},function(accessToken,refreshToken,profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){
            console.log('Error in google strategy-passport',err);
            return;
        }
        console.log(profile);
        if(user){
            return done(null,user);
        }
        else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log('Error in creating user google strategy passport',err);
                    return;
                }
                return done(null,user);
            });
        }
    });
}));
module.exports=passport;