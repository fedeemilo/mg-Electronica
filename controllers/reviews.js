const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
    //REVIEWS CREATE
    async reviewCreate(req, res, next) {
         // find the post by its id
         let post = await Post.findById(req.params.id);
         // create the review
         req.body.review.author = req.user._id
         let review = await Review.create(req.body.review);
         // assign review to post
        post.reviews.push(review);
         // save the post
         post.save();
         // redirect to the post
         req.session.success = 'Comentario creado con éxito!'
         res.redirect(`/posts/${post.id}`);
    },

   //REVIEWS UPDATE
   async reviewUpdate(req, res, next){
      await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
      req.session.success = 'Comentario actualizado exitosamente!' 
      res.redirect(`/posts/${req.params.id}`);
   },

   //REVIEWS DESTROY
   async reviewDestroy(req, res, next){
      
   }
}