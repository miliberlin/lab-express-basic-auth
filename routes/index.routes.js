const express = require('express');
const router = express.Router();

// middleware to check if the user is logged in
const loginCheck = () => {
    return (req,res,next) => {
      if (req.session.user) {
        next();
      } else {
        res.redirect('/login');
      }
    }
}

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/profile', loginCheck(), (req, res, next) => {
    console.log('a user has been logged in!')
    res.render('profile')
});

router.get('/main', loginCheck(), (req, res, next) => {
    res.render('main')
})

router.get('/private', loginCheck(), (req, res, next) => {
    res.render('private')
})

module.exports = router;
