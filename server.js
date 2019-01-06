
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { connect }= require('./db/connect/mongoose')
const bodyParser = require('body-parser')
const  {ObjectID} =require('mongodb')
const { User } = require('./db/model/User')
const { Exercise } = require('./db/model/Exercise')
const _ =             require('lodash')
const moment  =   require('moment')

app.use(express.static('public'))
app.use(bodyParser.json())

const port  = process.env.PORT || 3000

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// Post route for User
app.post('/api/exercise/new', (req,res)=>{
  let username = _.pick(req.body ,['username'])
  User.findOne(username).then((user)=>{
      if(user){
        res.status(400).send({error:'Username Already exist'})
      }else{
        let user =new User(username);
        user.save().then(user=> {
          res.status(200).send({user})
        }).catch(e=>console.log(e) )
      }
  })
})


// Post route for exercises
app.post('/api/exercise/add' ,(req,res)=>{
    const userId = req.body.userId;
    if(!ObjectID.isValid(userId)){
      return res.status(404).send(); 
    }

    const exercise =_.pick(req.body , [ 'description' ,'duration']);
     if(isValidDate(req.body.date)){
       exercise.date =req.body.date
     }else{
        return res.status(400).send({error:"Date must be Valid and In format (YYYY-MM-DD)"})
     }

    User.findById(userId).then((data)=>{       
      if(!data){
        return res.status(400).send(`No user with ${userId} exists`);
      }
      const newExercise = new Exercise({
        description:exercise.description,
        duration:exercise.duration,
        date:exercise.date,
        userId:userId
      })

      newExercise.save().then((exercise)=>{
        res.status(200).send({exercise})
      })

    }).catch((e) =>{
        res.status(400).send()
    })
})

app.get('/api/exercise/log' ,(req,res)=>{
   const userId =  req.query.userId;
   if(!userId){
     return res.status(400).send('Please Provide UserId')
   }
   if(!ObjectID.isValid(userId)){
     return res.status(404).send(); 
   }

   const from = req.query.from;
   const to = req.query.to;
   const limit = req.query.limit;

   Exercise.find({userId:userId}).then((exercises)=>{
      let fromArray =[]
      let toArray = [] 
      let resultArray =[]

      // 1st filter
      if(_.isEmpty(from)){
        fromArray = exercises
      }else{
        if(!isValidDate(from)){
          res.send({error:"Start Date must be Valid and In format (YYYY-MM-DD)"})
          return 
        }
         fromArray = exercises.filter(d=>{
           return moment(d.date).isAfter(from)
         })
      }

      // 2nd filter
      if(_.isEmpty(to)){
        toArray =fromArray
      }else{
         if(!isValidDate(to)){
           res.send({error:"End Date must be Valid and In format (YYYY-MM-DD)"})
           return 
         }
          toArray = fromArray.filter(d=>{
         return moment(d.date).isBefore(to)
       })
      }

      // 3rd filter
      if(_.isEmpty(limit)){
        resultArray =toArray
      }else{
         start = toArray.length-1;
         counter = toArray.length>limit?limit:toArray.length;
         while(counter!=0){
           resultArray.push(toArray[start--])
           counter--;
         }
      }

      res.status(200).send(resultArray)


   })
   .catch((e)=>{
      res.status(400).send()
   })


  
})

const isValidDate =(date)=>{
  return moment(date ,"YYYY-MM-DD" ,true).isValid()
}

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

