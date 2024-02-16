const express = require('express');
const rc = require('./RecurringEvents');
const au = require("./auth")
const fs = require("fs");

var app = express();

fs.readFile("./appsettings.json", "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  var obj = JSON.parse(data);
  console.log(obj.mysql.user)
});

app.use(express.json());

app.get("/api/eventi/",(req,res) => {
    res.status(200).json(rc.events);
});

app.get("/api/compleanni",(req,res) => {
    let birthdays = [...rc.events];
    birthdays = birthdays.filter((birthday)=>{
            return birthday.type == "Compleanno"
    })
    res.status(200).json(birthdays);
});

app.get("/api/onomastici",(req,res) => {
    let birthdays = [...rc.events];
    birthdays = birthdays.filter((birthday)=>{
            return birthday.type == "Onomastico"
    })
    res.status(200).json(birthdays);
});

app.get("/api/eventi",(req,res) => {
    
    const query = req.query;
    
    let eventi = [...rc.events];

    var oggiDT = new Date(query.oggi);
    var mese = oggiDT.getMonth()+1;
    var day = oggiDT.getDate();
    
    if(query){
    
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

app.get("/api/area",au,(req,res)=>{
  res.send("area privata");
});

app.post("/api/eventi",(req, res) => {
    const evento = req.body;
    rc.events.push(evento);
    res.status(200).json(rc.events);
});

app.put("/api/eventi/:tipo/:persona",(req,res) => {
    
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

app.listen(3002);