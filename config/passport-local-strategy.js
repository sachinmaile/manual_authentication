const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');

passport.use(new LocalStrategy({ usernameField:'email' },
    async (email, password, done)=> {
      await User.findOne({ email: email })
      .then((user)=>{
        if (!user || user.password!=password) { 
            console.log('Invalid Username/Password');
            return done(null, false); 
        }
        return done(null, user);
      })
      .catch((err) => { 
        console.log('Error in finding user --> passport');
        return done(err); 
      })
    }
));

passport.serializeUser(async (user,done)=>{
    await done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    await User.findById(id)
    .then((user)=>{
        return done(null,user);
    })
    .catch((err)=>{
        console.log('Error in finding user-->passport');
        return done(err);
    });
})

passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/signIn');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports = passport;