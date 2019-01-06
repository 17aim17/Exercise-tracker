const mongoose = require('mongoose');
const _     = require('lodash');
const UserSchema = new mongoose.Schema({
    username :{
        type:String,
        unique:true,
        trim:true,
        required:true,
        minlength:1        
    }
})

//instance method
UserSchema.methods.toJSON =function(){
    let user = this
    let userObject= user.toObject()
    return _.pick(userObject,['_id','username']);
}

const  User= mongoose.model('User' ,UserSchema);
module.exports  = {User}