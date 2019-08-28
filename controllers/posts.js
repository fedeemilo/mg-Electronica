const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
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
        res.render('posts/index', { posts, title: 'MG Productos' });
    },
    //POSTS NEW
    postNew(req, res, next) {
        res.render('posts/new', {title: 'MG Electrónica'});
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
        let response = await geocodingClient
            .forwardGeocode({
            query: req.body.post.location,
            limit: 1
            })
            .send();
        req.body.post.coordinates = response.body.features[0].geometry.coordinates;
        let post = await Post.create(req.body.post);
        req.session.success = 'Producto cargado con éxito!'
        res.redirect(`/posts/${post.id}`);
    },

   //POSTS SHOW
   async postShow(req, res, next) {
       let post = await Post.findById(req.params.id).populate({
          path: 'reviews',
          options: { sort: {'_id': -1} }
        });
       res.render('./posts/show', { post, title: 'MG Producto'})
   },

   //POSTS EDIT
   async postEdit(req, res, next) {
       let post = await Post.findById(req.params.id);
       res.render('posts/edit', { post, title: 'MG Editar'});

   },

   //POSTS UPDATE
   async postUpdate(req, res, next){
       // find the post id
       let post = await Post.findById(req.params.id);
       // check if there's any images for deletion
       if (req.body.deleteImages && req.body.deleteImages.length) {
           // assign deleteImages from req.body to its own variable
           let deleteImages = req.body.deleteImages;

           //loop over deleteImages
           for (const public_id of deleteImages) {
               //delete images from cloudinary
               await cloudinary.v2.uploader.destroy(public_id);
               //delete image from post.image
               for (const image of post.images) {
                   if (image.public_id === public_id) {
                       let index = post.images.indexOf(image);
                       post.images.splice(index, 1);
                   }
               }
           }  
       }

       // check if there any new images for upload
       if (req.files) {
        // upload images
        for (const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            // add images to post.images array
            post.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
       }
       // check if location was updated
       if (req.body.post.location !== post.location) {
        let response = await geocodingClient
            .forwardGeocode({
            query: req.body.post.location,
            limit: 1
            })
            .send();
        post.coordinates = response.body.features[0].geometry.coordinates;
        post.location = req.body.post.location;
       }
       // update the post with any new properties
       post.title = req.body.post.title;
       post.desription = req.body.post.description; 
       post.price = req.body.post.price;
       // save the updated post into the db
       post.save();
       // redirect to show page     
       res.redirect(`/posts/${post.id}`);
   },

   //POSTS DESTROY
   async postDestroy(req, res, next){


       let post = await Post.findById(req.params.id);
       for (const image of post.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
       }
       await post.remove();
       res.redirect('/posts');
   }
}