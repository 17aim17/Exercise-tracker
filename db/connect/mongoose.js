const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB ,{useNewUrlParser:true})
.then(()=>{
    console.log('mongodb connected');
})
.catch((e)=>{
  console.log(e);  
})
module.exports ={
    mongoose
}