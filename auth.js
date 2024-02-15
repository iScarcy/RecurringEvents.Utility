const auth = (req,res, next) => {
    const {user} = req.query;
    if(user == "scarcy"){
        next();
    }else{
        res.status(401).send("Utente Non Autorizzato");
    }
}

module.exports = auth;