import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
var todayArray = [];

mongoose.connect("mongodb://127.0.0.1:27017/itemDB");
//Items Schema and model
const itemSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "This is your new TodoList!"
});

todayArray.push(item1);

//List Schema and Model
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = mongoose.model("List", listSchema);

app.get("/",(req,res)=>{
    Item.find({})
        .then((items)=>{
            res.render("index.ejs", {
                taskToday: items,
                taskName: "Today"
            });
        })
        .catch(error=>console.log(error));
});

//Create Custom name list and show case
app.get("/:customNameList", (req,res)=>{
    //Captilize the customName
    var naming = req.params.customNameList;
    var nameLower = (naming.toLowerCase()).substring(1, naming.length);
    var nameUpper = naming.substring(0,1).toUpperCase();
    console.log(naming + "->" + nameUpper + nameLower);
    
    const customName = nameUpper + nameLower;
    List.findOne({name: customName})
        .then(customNamefromDB=>{
            if(!customNamefromDB){
                const list = new List({
                    name: customName,
                    items: todayArray
                });
                list.save().then(p=>console.log(customName + " is Saved")).catch(error=>console.log(error));
                res.render("index.ejs", {
                    taskToday: todayArray,
                    taskName: customName
                });
            } else {
                res.render("index.ejs", {
                    taskToday: customNamefromDB.items,
                    taskName: customName
                });
            }
        })
        .catch(error=>console.log(error));
});

app.post("/", (req,res)=>{
    // console.log(req.body);
    const text = req.body.today_task;
    const listName = req.body.list;

    const item1 = new Item({name: text});
    console.log("Inside / Post: " + listName);
    if(listName === "Today") {
        if(text){
            item1.save().then(p=>console.log("Sucessfully posted")).catch(error=>console.log(error));
            // todayArray.push(item1);
        } 
        res.redirect("/");
    } else {
        List.findOne({name: listName})
            .then(element=>{
                if(element){
                    element.items.push(item1);
                    element.save();
                }
            })
            .catch(error=>console.log(error));
        res.redirect("/" + listName);
    }
});

app.post("/delete", (req,res)=>{
    const deleteBtn = req.body.deleteButton;
    const listName = req.body.list;
    if(listName === "Today"){
        Item.findByIdAndDelete({_id: deleteBtn})
        .then(p=>console.log("Deleted the id:"+p._id))
        .catch(error=>console.log(error));
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id:deleteBtn}}})
            .then(p=>console.log("listName:"+listName+" with id: "+deleteBtn+" deleted successfully"))
            .catch(error=>console.log(error));
        res.redirect("/" + listName);
    }

    
});

app.listen(port,()=>{
    console.log(`Started the server at the port: ${port}`);
})
