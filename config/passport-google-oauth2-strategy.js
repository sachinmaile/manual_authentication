const passport = require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const { doesNotReject } = require('assert');

passport.use(new googleStrategy({
    clientID:"990029122041-r3qb98hp1u47m8tq6hbtm3unfrvlj9th.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:8000/users/auth/google/callback"
}, async function(accessToken,refreshToken,profile,done){
    let user=await User.findOne({email:profile.emails[0].value})
    console.log('Finding user');
    if(user){
        console.log('user found');
        return done(null,user);
    }
    else{
        console.log('user creating');
        let newUser=await User.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            password:crypto.randomBytes(20).toString('hex')
        }); 
        console.log('done');
        return done(null,newUser);
    }
}));
module.exports=passport;