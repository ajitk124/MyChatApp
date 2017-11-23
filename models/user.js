const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    userName:{type:String, unique:true},
    fullName:{type:String, unique:true,default:''},
    email:{type:String,unique:true},
    password:{type:String,default:''},
    userImage:{type:String,default:'default.png'},
    facebook:{type:String,default:''},
    fbTokens:Array,
    google:{type:String,default:''}
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

userSchema.methods.vailidUserPassword = function(password){
    console.log("inside vailidUserPassword");
return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User',userSchema);