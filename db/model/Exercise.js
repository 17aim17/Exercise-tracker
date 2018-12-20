const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    exercises:[{
        description:{
            type: String,
            required:true
        },
        duration:{
            type:String,
            required:true
        },
        date:{
            type: Date
        }
    }]
})

Exercise = mongoose.model('exercises' ,ExerciseSchema);
   
module.exports  = {Exercise}