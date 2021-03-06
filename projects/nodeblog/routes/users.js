var express = require('express');
var router = express.Router();
var multer= require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

var expressValidator = require('express-validator');



router.use(expressValidator());
router.use(passport.initialize());
/* GET users listing. */
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.get('/logout', function(req, res, next) {
  req.logout();
  //req.flash('success','You are logged out');
  res.redirect('/users/login');
});


router.post('/register' ,function(req, res, next) {
  //console.log(req.body.email);
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  console.log(name);

  //Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password1','Passwords do not match').equals(req.body.password);

  //Check Errors
  var errors = req.validationErrors();

  if(errors){
  	res.render('register',{
  		errors: errors
  	});
  }else{
  	var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
     
  	});

     User.createUser(newUser,function(err,user){
    if(err) throw err;
    console.log(user);
  });

  //req.flash('success','You are now registered and can login');

  res.location('/');
  res.redirect('/');
  }

 
  //console.log(req.file);
  //res.redirect('/users/register');
});
router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/register'}),
  function(req, res) {
   //req.flash('success','You are now logged in');
   console.log("hey");
   res.redirect('/');
  });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username,password,done){
  User.getUserByUsername(username,function(err,user){
   if(err) throw err;
   if(!user){
    return done(null,false,{message:'Unknown user'});
   }
   User.comparePassword(password, user.password, function(err,isMatch){
    if(err) return done(err);
    if(isMatch){
      return done(null,user);
    }else {
      return done(null,false,{message:'Invalid Password'});

    }

   });
  });

}));



module.exports = router;
