var MongoClient = require('mongodb').MongoClient;
var state ={
    db : null
}

module.exports.connect=function(done){
    const url = "mongodb+srv://virtual-college:km9QEwfJNJuQS1Xw@virtual-college.agg7zab.mongodb.net/?retryWrites=true&w=majority"
    const dbname="virtual-college"

    MongoClient.connect(url,function(err,data){
        if (err) return done(err)

        else state.db= data.db(dbname)
        done()
    })
}

module.exports.get=()=>{
    return state.db
}