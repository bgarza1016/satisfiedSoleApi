var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

//user schema
var UserSchema = new Schema ({
      name: String,
      username: {type: String, required: true, index: {unigue: true}},
      password: {type: String, required: true, select: false}
});

//has the password before the usir is saved
UserSchema.pre('save', function(next){
    var user = this;

      //hash the pw only if the pw has been changed or user is new
      if (!user.isModified('password')) return next();

      //generate the hash
      bcrypt.hash(user.password, null, null, function(err, hash){
        if (err) return next(err);

        //change the pw to hashed version
        user.password = hash;
        next();
    });
});

//method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

//return the model
module.exports = mongoose.model('User', UserSchema);
