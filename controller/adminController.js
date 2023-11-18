
function index(req,res){
    res.send("Admin home page of " + req.user.username)
}

module.exports = {index}