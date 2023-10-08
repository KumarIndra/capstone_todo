import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
var todayArray = [];
app.get("/",(req,res)=>{
    res.render("index.ejs", {
        taskToday: todayArray
    });
});

app.post("/", (req,res)=>{
    // console.log(req.body);
    const text = req.body["today_task"];
    if(text){
        todayArray.push(text);
    } 
    res.render("index.ejs", {
        taskToday: todayArray
    });
    
    
});

app.listen(port,()=>{
    console.log(`Started the server at the port: ${port}`);
})
