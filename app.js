const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const session = require('express-session');

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/ansDB",{useNewUrlParser:true}).then(()=>{
    console.log("connection established")
})

const questSchema = {
    fileName:String,
    quest:String,
    ans:String,
}

const Quest = mongoose.model("Quest",questSchema)

app.get("/",(req,res)=>{
    // const fileName = req.body.file;
    res.render("home");
})

app.get("/quest/:fileName",(req,res)=>{
    // console.log(req.params.fileName);
    Quest.find({fileName:req.params.fileName}).then(function(result){
        console.log(result);
        // const questions=[];
        // const answers =[];
        // result.forEach(obj =>{
        //     questions.push(obj.quest);
        //     answers.push(obj.answer);
        // })
        res.render("quest",{
            fileName:req.params.fileName,
            result:result,
        })
    }).catch(err=>{
        console.log(err);
    })
    // res.render("quest",{
    //     fileName:req.params.fileName
    // });
})

app.post("/home",(req,res)=>{
    const fileName = req.body.file;
    console.log("redirected");
    res.redirect(`/quest/${fileName}`);
})

app.post('/quest/:fileName',(req,res)=>{
    const fileName = req.params.fileName;
    console.log(fileName);
    const quest = new Quest({
        fileName: fileName,
        quest:req.body.quest,
        ans:"hmmm looking in to it"
    }) 
    quest.save();
    res.redirect(`/quest/${fileName}`);
})

// app.post("/quest")

app.listen(3000, ()=>{
    console.log("listening on port 3000");
})