var express = require('express');
var flash = require('connect-flash');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


var router = express.Router();

var expressValidator = require('express-validator');
router.use(expressValidator());
//router.use(flash());
//router.use(session());

/* GET posts. */
router.get('/add', function(req, res, next) {
   res.render('addcategory',{
  	 'title': 'Add Category'
  	 
    });
    
});

router.get('/show/:category', function(req, res, next) {
   var posts = db.get('posts');

  posts.find({category: req.params.category},{},function(err,posts){

    res.render('index',{
    'title': req.params.category,
    'posts': posts
      });
    });
    
});


router.post('/add', function(req, res, next) {
  var name = req.body.name;
 


  req.checkBody('name','Name field is required').notEmpty();
  

  var errors = req.validationErrors();

  if(errors){
  	res.render('addcategory',{
  		"errors": errors
  	});
  }else{
  	var categories = db.get('categories');
  	categories.insert({
  		"name": name,
  		
  	},function(err,post){
  		if(err){
  			res.send(err);
  		}else {
  			//req.flash('success','Post Added');
  			res.location('/');
  			res.redirect('/');
  		}
  	});
  }
});


module.exports = router;
