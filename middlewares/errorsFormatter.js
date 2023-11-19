const path = require("path")
const fs = require("fs")

module.exports = function(err,req,res,next){

    if (req.file) {
        const pathNewImage = path.resolve("public/imgs/newPosts/" + req.file.filename)
        
        console.log(pathNewImage);
        fs.unlinkSync(pathNewImage)
    }

    res.format({ 
        json : () => {
            res.status(500).json({message:"Errore - Qualcosa è andato stroto ", error: err.message, status:err.status})

        },
        html : ()=> {
            res.status(500).send(`<h1>Errore - Qualcosa è andato storto - Errore ${err.status}</h1>`)
        }
    })
}