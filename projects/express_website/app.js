var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.get('/',function(req,res){
 //console.log('Hello world');//gives output on the server side
 //res.send('<h1>Hello world</h1>');//gives output on the client side;
 res.render('index',{title:'Computer Not Working?'});
});

app.get('/about',function(req,res){
 res.render('about');
});

app.get('/contact',function(req,res){
 res.render('contact');
});

app.post('/contact/send',function(req,res){
 //console.log('Test');
 var transporter = nodemailer.createTransport({
 	service: 'Gmail',
 	auth: {
         user: 'abhratanu072@gmail.com',
         pass: 'jiituniversity1!'
 	}

 });

 var mailOptions = {
 	from: 'Abhratanu paul',
 	to: 'paul_abhratanu@rediffmail.com',
 	subject: 'Website submission',
 	text: 'You have a submission... Name: '+req.body.name+'Email: '+req.body.email+'Message: '+req.body.message,
 	html: '<p>You have a submission...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
 };
 transporter.sendMail(mailOptions,function(error,info){
 	if(error){
 		console.log(error);
 		res.redirect('/');
 	}else {
 		console.log('Message Sent: '+info.response);
 		res.redirect('/');
 	}
 })

});

app.listen(3000);
console.log('Server is running on port 3000...');