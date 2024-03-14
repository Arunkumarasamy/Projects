const express = require("express");
const hbs = require("express-handlebars");    //it's wrk like template engine
const bodyParser = require("body-parser")     // to get data in JSON formate
const mysql = require("mysql")

require("dotenv").config();      // it's inculde the dotenv commonly store 

// create express 
const app = express()

 
app.use(bodyParser.urlencoded({ extended: false }))    // handle json formate
app.use(bodyParser.json());                    // json used to data tranfering

// statice file include
app.use(express.static("public"))

// in handleBars call create fun
const handleBar = hbs.create({ extname: "hbs" })     //{give extension }
app.engine("hbs", handleBar.engine)     // assign app engine to handle "hbs" module  syntx-->("extensionName" ,moduleStroe Name.engine)
app.set("view engine", "hbs")     // (set into app , give into extension Name)


// MySql

// const con=mysql.createPool({
//     host :process.env.DB_HOST,
//     user : process.env.DB_USER,
//     password :process.env.DB_PASS,
//     database :process.env.DB_NAME
// })

// con.getConnection(function(err,connect){
//     if(err) throw err;
//     console.log("DB has connected")
// })




// Router

// app.get("/",function(req,res){
//     res.render("home")
// })

const routes = require("./server/routes/student")                  // import routes page
app.use("/", routes)        // when home display use "routes"

app.listen(9000, function () {
    console.log("server running")
})