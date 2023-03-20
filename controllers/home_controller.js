const Post=require('../models/post');

module.exports.home = async (req, res)=>{
    await Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{path:'user'}
    })
    .then((posts)=>{
        return res.render('home',{
            title:'Codeial | Home',
            posts:posts
        })
    });
};