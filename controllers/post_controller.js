const Post=require('../models/post');
const Comment= require('../models/comment');

module.exports.create=async (req,res)=>{
    await Post.create({
        content:req.body.content,
        user:req.user._id
    })
    .then(()=>{
        return res.redirect('back');
    })
    .catch((err)=>{
        console.log('Error in creating post',err);
        return;
    });
};

module.exports.destroy=async (req,res)=>{
    Post.findById(req.params.id)
    .then((post)=>{
        if(post.user==req.user.id){
            post.deleteOne();
            Comment.deleteMany({post:req.params.id})
            .catch((err)=>{
                console.log(err);
                return res.redirect('back');
            })
        }
        else{
            return res.redirect('back');
        }
    });
};