const express = require('express');
const rc = require('./RecurringEvents');
const eventsRouter = require('./routes/eventi');
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

app.use('/api/eventi', eventsRouter)

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

app.get("/api/area",au,(req,res)=>{
  res.send("area privata");
});

app.listen(3002);