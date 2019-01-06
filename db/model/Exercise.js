const mongoose = require('mongoose');
const _     = require('lodash');
const ExerciseSchema = new mongoose.Schema({
        description:{
            type: String,
            required:true,
            trim:true
        },
        duration:{
            type:Number,
            required:true
        },
        date:{
            type: Date
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            require:true
        }
})

// Instance method
ExerciseSchema.methods.toJSON =function(){
    let data = this
    let dataObject= data.toObject()
    return _.pick(dataObject,['userId','description','duration','date']);
}


Exercise = mongoose.model('Exercise' ,ExerciseSchema);
   
module.exports  = {Exercise}