const http = require('http');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var cors = require('cors')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

const hostname = '127.0.0.1';
const port = 3000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//balance
app.post('/bal', function(req,res){
    MongoClient.connect(url ,function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var credit = req.body['Credit']
        var id = req.body['Idcard']
        dbo.collection("User").find({Credit: credit, Idcard :id }).toArray(function(err, AAA)  {
            if (err) throw err 
            if (AAA.length != 0)
            {
                dbo.collection("History").find({Credit: credit}).toArray(function(err, BBB)  {
                        if (err) throw err;
                        var last = BBB.length
                        console.log(last);
                        console.log(BBB[last-1].Balance);
                        db.close();
                       res.end(JSON.stringify(BBB[last-1]['Balance']))
                      });
            }
            else  
            {
                db.close();
                res.end("error")
            }
        });
    });
        
})

//register
app.post('/reg', function(req,res){
        MongoClient.connect(url, function(err, db) {
       if (err) throw err
        var dbo = db.db("mydb")
        var credit = req.body['Credit']
        var id = req.body['Idcard']
    dbo.collection("User").find({Credit: credit, Idcard :id }).toArray(function(err, AAA)  {
        if (err) throw err 
        var myquery = {Credit: credit,Idcard :id };
        var newvalues = { $set: {Mac: req.body['Mac'], Key1: req.body['Key1'] , Key2: req.body['Key2'] } };
        if (AAA.length != 0)
        {
            dbo.collection("User").updateOne(myquery, newvalues, function(err, BBB) {
                if (err) throw err;
                console.log("1 document updated");   
                db.close();  
                res.end("OK")
            });
        }
        else  
        {
            db.close();
            res.end("error")
        }
      })
    })   

})


//setting
app.post('/set', function(req,res){
    MongoClient.connect(url, function(err, db) {
   if (err) throw err
    var dbo = db.db("mydb")
    var credit = req.body['Credit']
    var id = req.body['Idcard']
dbo.collection("User").find({Credit: credit, Idcard :id }).toArray(function(err, AAA)  {
    if (err) throw err 
    var myquery = {Credit: credit,Idcard :id };
    var newvalues = { $set: {Mac: req.body['Mac'], Key1: req.body['Key1'] , Key2: req.body['Key2'] } };
    if (AAA.length != 0)
    {
        dbo.collection("User").updateOne(myquery, newvalues, function(err, BBB) {
            if (err) throw err;
            console.log("1 document updated");   
            db.close();  
            res.end("OK")
        });
    }
    else  
    {
        db.close();
        res.end("error")
    }
  })
})   

})


var server = app.listen(port, hostname, () => {
  var hostname = server.address().address
  var port = server.address().port
  console.log(`Server running at http://${hostname}:${port}/`);
});