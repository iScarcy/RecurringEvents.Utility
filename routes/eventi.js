const express = require("express")
 
const router  = express.Router()

const rc = require('../RecurringEvents');

 

router.get("/",(req,res) => {
    
    
    let eventi = [...rc.events];
    let allEvents = eventi;
    var oggiDT = new Date(req.query.oggi);
    var mese = oggiDT.getMonth()+1;
    var day = oggiDT.getDate();
    
    if(req.query){
    
        eventi = eventi.filter((evento) => {
        
        var dateDT = new Date(evento.data);
        var evento_mese     = dateDT.getMonth()+1;
        var evento_giorno = dateDT.getDate();
        if(evento_giorno == day && evento_mese == mese)
        {
          return evento.data;
        } 
            
        });
    }
    if(eventi.length==0)
        res.status(200).json(allEvents);
    else    
        res.status(200).json(eventi);

    
});

router.get("/fetch",(req,res) => {
    var request = require ('request')
    request ({
        url: 'http://192.168.1.83:5071/api/event/all',
        json: true
    }, (error, response, body) => {
        !error && response.statusCode === 200
            ? res.status(200).json(body)
            : console.log (error)
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