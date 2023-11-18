module.exports = function(req,res,next){

   res.status(404).type("html").send("<h1>Error 404</h1>")
}