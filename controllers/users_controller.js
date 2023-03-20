const User=require('../models/user');

module.exports.signUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user-sign-up');
}

module.exports.signIn=function(req,res){
    return res.render('user-sign-in');
}

module.exports.create=async (req,res)=>{
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    await User.findOne({email:req.body.email})
        .then((user)=>{
            if(!user)
            {
                User.create(req.body)
                    .then((user)=>{
                        return res.redirect('/users/signIn');
                    })
                    .catch((err)=>{
                        console.log('Error in creating user while signing up');
                        return;
                    });
            }
            else{
                return res.redirect('back');
            }})
        .catch((err)=>{
            console.log('Error in fetching user in signing up');
            return;
        });
    };

module.exports.createSession=async (req,res)=>{
    await User.findOne({email:req.body.email})
    .then((user)=>{
        if(user){
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            res.cookie('user_id',user.id);
            return res.redirect('/');
        }
        else{
            return res.redirect('back');
        }
    })
    .catch((err)=>{
        console.log('Error in finding user in signing in');
        return;
    });
};

module.exports.profile=async (req,res)=>{
    if(req.cookies.user_id){
        await User.findById(req.cookies.user_id)
        .then((user)=>{
            if(user){
                return res.render('user_profile',{
                    title:"User Profile",
                    user:user
                });
            }
            else{
                return res.redirect('/users/signIn');
            }
        });
    }
    else{
        return res.redirect('/users/signIn');
    }
};

module.exports.destroySession=function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/');
    });  
};