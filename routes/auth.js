const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt');

/* GET home page */
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post('/signup', (req,res,next) => {
    const {username, password} = req.body;


if (password.length < 8) {
        res.render('signup', {message: 'Your password has to be 8 characters or more.'});
        return;
    }

    if (username === '') {
        res.render('signup', {message: 'Your username cannot be empty.'});
        return;
    }

    User.findOne({username})
    .then(userInDb => {
        if(userInDb !== null) {
            res.render('signup', {message: 'The username is already taken.'});
        } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        User.create({username, password: hash})
        .then(createdUser => {
            console.log(createdUser);
            res.redirect('/');
        })
        .catch(err =>
            next(err)
        )
        }
    })
})

module.exports = router;