const express = require("express")
 
const router  = express.Router()

const rc = require('../RecurringEvents');
const { isDate } = require("util/types");

class RecurringEvent {
    
    constructor(type, data,description) {
      
          switch(type){
              case 0: this.type = "Compleanno";
                      break;
              case 1: this.type = "Onomastico";
                      break;
              case 2: this.type = "Anniversario";
                      break;
          }

          this.data = data.substring(0, 10);
          this.description = description;
      
    }

    
  }

router.get("/",(req,res) => {
    
    
    let eventi = [...rc.events];
    let allEvents = eventi;
    res.status(200).json(allEvents);

    
});

router.get("/today",(req,res) => {
    
    
    let eventi = [...rc.events];
    let allEvents = eventi;
    var oggiDT = new Date();
    var mese = oggiDT.getMonth()+1;
    var day = oggiDT.getDate();
    var search = false
    console.log(oggiDT)
  
   
    eventi = eventi.filter((evento) => {
    
    var dateDT = new Date(evento.data);
    var evento_mese     = dateDT.getMonth()+1;
    var evento_giorno = dateDT.getDate();
    if(evento_giorno == day && evento_mese == mese)
    {
        return evento.data;
    } 
        
    });
     
    
    res.status(200).json(eventi);
     

    
});

router.get("/search",(req,res) => {
    
    
    let eventi = [...rc.events];
    let allEvents = eventi;
    var oggiDT = new Date(req.query.oggi);
    var mese = oggiDT.getMonth()+1;
    var day = oggiDT.getDate();
    
    eventi = eventi.filter((evento) => {
    
    var dateDT = new Date(evento.data);
    var evento_mese     = dateDT.getMonth()+1;
    var evento_giorno = dateDT.getDate();
    if(evento_giorno == day && evento_mese == mese)
    {
        return evento.data;
    } 
        
    });
  
    
     
    res.status(200).json(eventi);
    

    
});

router.get("/fetch",(req,res) => {
    var request = require ('request')
    var fs = require('fs');

    request ({
        url: 'http://192.168.1.83:5071/api/event/all',
        json: true
    }, (error, response, body) => {
        if(!error && response.statusCode === 200){
            var events = new Array();
            for (const key in body) {
                  events.push(new RecurringEvent(body[key]["type"],body[key]["date"],body[key]["description"]));
            }
            var jsonArray = JSON.parse(JSON.stringify(events))

            fs.writeFile("RecurringEventSource.js", JSON.stringify(events), function(err) {
                if (err) {
                    console.log(err);
                }
            });

             res.status(200).json(jsonArray)
            }
        })
});



router.get("/:persona", (req, res) => {
    const {persona} = req.params;
   
    let eventi = [...rc.events];
    eventi = eventi.filter((evento) => {
        return evento.description.trim().toLocaleLowerCase() == persona.toLocaleLowerCase();
    });

    res.status(200).json(eventi);
});


router.post("/",(req, res) => {
    const evento = req.body;
    rc.events.push(evento);
    res.status(200).json(rc.events);
});

router.put("/:tipo/:persona",(req,res) => {
    
    const {tipo} = req.params;
    const {persona} = req.params;
       
    const dati = req.body;
    
    let eventi = [...rc.events];
    eventi = eventi.filter((evento) => {
        if(evento.type.toLowerCase() == tipo.toLowerCase() && evento.description.toLowerCase() == persona.toLowerCase()){
          evento.data = dati.data;
          return evento;
        }
    });
     
   res.status(200).json(eventi);
});

module.exports = router