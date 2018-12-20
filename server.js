// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { connect }= require('./db/connect/mongoose')
const bodyParser = require('body-parser')
const { User } = require('./db/model/User')
const { Exercise } = require('./db/model/Exercise')
const _ =             require('lodash')
const moment  =   require('moment')
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))
app.use(bodyParser.json())
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Post route for User
app.post('/api/exercise/new', (req,res)=>{
  let username = _.pick(req.body ,['username'])
  User.findOne(username).then((user)=>{
      if(user){
        res.send({error:'Username Already exist'})
      }else{
        let user =new User(username);
        user.save().then(user=> {
          res.send({username:user.username,id:user._id})
        }).catch(e=>console.log(e) )
      }
  })
})

// Post route for exercises
app.post('/api/exercise/add' ,(req,res)=>{
    const userId = req.body.userId;
    console.log(userId);
    
    const exercise =_.pick(req.body , [ 'description' ,'duration']);
     if(isValidDate(req.body.date)){
       exercise.date =req.body.date
     }else{
       res.send({error:"Date must be Valid and In format (YYYY-MM-DD)"})
       return
     }

    User.findById(userId).then((data)=>{
       console.log(data);       
       if(data){
          Exercise.findOne({userId : data._id}).then( dat =>{
            console.log(dat);
            if(dat){
              dat.exercises.push(exercise);
              dat.save().then(d=> res.send(d))
            }else{
              let exerciseData =new Exercise( 
                {
                  userId:data._id,
                  exercises:[exercise]
                })
                exerciseData.save().then(d=> res.send(d))
            }
             }).catch(e=> console.log(e) )
          }
    }).catch( e => res.send({ error :'This id is invalid'}))
})

app.get('/api/exercise/log' ,(req,res)=>{
   const userId =  req.query.userId;
   if(userId){
      const from = req.query.from;
      const to = req.query.to;
      const limit = req.query.limit;


      Exercise.findOne({userId:userId}).then(data =>{
        let fromArray =[]
        let toArray = [] 
        let resultArray =[]
        if(_.isEmpty(from)){
            fromArray = data.exercises
         }else{
            if(!isValidDate(from)){
              res.send({error:"Start Date must be Valid and In format (YYYY-MM-DD)"})
              return 
            }
             fromArray = data.exercises.filter(d=>{
               return moment(d.date).isAfter(from)
             })
         }

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

         if(_.isEmpty(limit)){
           resultArray =toArray
         }else{
            start = toArray.length-1;
            counter = toArray.length>limit?limit:toArray.length;
            while(counter!=0){
              resultArray.push(toArray[start--])
              counter--
            }
         }
         res.send({exercises:resultArray})

      }).catch( e => res.send({error:'No user Found'}))

   }else{
     res.send({error:'Please give your ID'})
   }
})

const isValidDate =(date)=>{
  return moment(date ,"YYYY-MM-DD" ,true).isValid()
}

// listen for requests :)
const listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
