module.exports = (test)=>{
    for(i in test)
    {
        if(!Number.isInteger(Number.parseInt(test[i])))
        return false
    }
    return true
}