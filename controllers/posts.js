const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'mg-electronica',
    api_key: '811337271329754',
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
    //POSTS INDEX
    async postIndex(req, res, next) {
        let posts = await Post.find({});
        res.render('posts/index', { posts: posts });
    },
    //POSTS NEW
    postNew(req, res, next) {
        res.render('posts/new');
    },

    //POSTS CREATE
    async postCreate(req, res, next) {
        req.body.post.images = [];
        for (const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            req.body.post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`);
    },

   //POSTS SHOW
   async postShow(req, res, next) {
       let post = await Post.findById(req.params.id);
       res.render('./posts/show', { post })
   },

   //POSTS EDIT
   async postEdit(req, res, next) {
       let post = await Post.findById(req.params.id);
       res.render('posts/edit', { post });
   },

   //POSTS UPDATE
   async postUpdate(req, res, next){
       let post = await Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true });
       res.redirect(`/posts/${post.id}`);
   },

   //POSTS DESTROY
   async postDestroy(req, res, next){
       let post = await Post.findByIdAndRemove(req.params.id);
       res.redirect('/posts');
   }
}