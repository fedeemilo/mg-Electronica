const User = require('../models/user');

module.exports = {
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });  
        //esperamos a que termine el registro antes de redireccionar
        await User.register(newUser, req.body.password); 
        res.redirect('/');
    }
}