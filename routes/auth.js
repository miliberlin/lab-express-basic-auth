const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt');

/* GET home page */
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post("/login", (req, res, next) => {
    const {username,password} = req.body;
    User.findOne({username})
    .then(userFromDb => {
        if (userFromDb === null) {
            // if user does not exist
            res.render('login', {message: 'Invalid credentials'})
        }
        console.log(password, userFromDb.password);
        if (bcrypt.compareSync(password, userFromDb.password)) {
            console.log('a user is logging in!')
            req.session.user = userFromDb;
            res.redirect('/profile');
        }
    })
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
            req.session.user = createdUser;
            res.redirect('/');
        })
        .catch(err =>
            next(err)
        )
        }
    })
})

// logout -> delete session from DB
router.get('/logout', (req,res,next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/');
        }
    })
})

module.exports = router;