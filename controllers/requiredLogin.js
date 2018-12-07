

module.exports = (req,res,next)=>{
    if(!req.user){
        return res.json({
            code : 9998,
            message : 'Token is invailid.'
        })
    }
    else{
        next();
    }
}