Exercise Tracker
=================
Create a New User  {Enter username only}
---------------------------------------
                POST /api/exercise/new
    
Add exercises {Enter userId ,description ,duration ,date(YYYY-MM-DD)}
----------------------------------------------------------------------
                POST /api/exercise/add 
    
GET users's exercise log: 
-------------------------
                GET /api/exercise/log?{userId}[&from][&to][&limit] 
  { } = required, [ ] = optional
  from, to = dates (yyyy-mm-dd); limit = number
        
    
Working link here [https://equable-locust.glitch.me/](https://equable-locust.glitch.me/)
------------------------------------------------------


Made by [Glitch](https://glitch.com/)
-------------------

\ ゜o゜)ノ
