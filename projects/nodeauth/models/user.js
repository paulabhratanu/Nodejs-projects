var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    username:{
    	type: String,
    	index: true
    },
    password:{
    	type: String
    },
    email:{
    	type: String
    },
    name:{
    	type: String
    },
    profileimage:{
    	type: String
    }
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
    var query = {username: username};
    User.findOne(query,callback);
}

module.exports.updateUserByPassword = function(username,password2,callback){
    var myquery = {username: username};
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password2, salt, function(err, hash) {
        password2 = hash;
        
        var newvalues = { $set:{password: password2} };
     db.collection("users").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
     
        
    });
});
    
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null,isMatch);
})
}

module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
        
    });
});
	
}