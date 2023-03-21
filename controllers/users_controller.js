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
            req.flash('success','Logged in successfully');
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
    await User.findById(req.params.id)
    .then((user)=>{
        return res.render('user_profile',{
            title:'User Profile',
            profile_user:user
        });
    });
};

module.exports.update=function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body)
        .then(()=>{
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}

module.exports.destroySession=function(req, res) {
    req.logout(function(err){
        if(err){ console.log('Error',err)}
    });
    req.flash('success','Logged out successfully');
    return res.redirect('/'); 
};