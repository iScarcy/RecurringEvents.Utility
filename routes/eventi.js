const express = require("express")
const router  = express.Router()

const rc = require('../RecurringEvents');

 

router.get("/",(req,res) => {
    
    
    let eventi = [...rc.events];
    var oggiDT = new Date(req.query.oggi);
    var mese = oggiDT.getMonth()+1;
    var day = oggiDT.getDate();
    //TODO: da gestire quando req.query è vuoto
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