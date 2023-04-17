//importing express module
const express = require('express');
//getting path upto index.js
const path = require('path');
//setting port number
const port = 8008;
//importing mongoose module
const db = require('./config/mongoose');
//
const Task = require('./models/task');
//firing express
const app = express();
//informing about view engine
app.set('view engine', 'ejs');
//getting path of views
app.set('views', path.join(__dirname, 'views'));
//middleware to decode the requests
app.use(express.urlencoded());
//using the static folder
app.use(express.static('assets'));

//home page code
app.get('/', function(req, res){

    Task.find({}, function(err,tasks){
        if(err){
            console.log("error in fetching tasks from db");
            return;
        }
        return res.render('home',{
             task_list: tasks
        });

    })
});

//creating a task code
app.post('/create-task', function(req, res){
    
    Task.create({
        desc: req.body.desc,
        date: req.body.date,
        category:req.body.category
    }, function(err, newTask){
        if(err){console.log('Error in creating a Task!')
            return;}
            console.log('******', newTask);
            return res.redirect('back');
    })

});

//deleting a task code
app.post('/delete-task', function(req, res){
 
    var id=req.body.delete_list;

    //handling deletion of 0 tasks
    if(typeof id=="undefined")
    {
        return res.redirect('back');   
    }

    //handling deletion of 1 task
    if(typeof id =="string")
    {
        Task.findOneAndDelete(id, function(err){
            if(err){
                console.log('error in deleting the object');
                return;
            }
            return res.redirect('back');
    })
    }
    //handling deletion of more than 1 task
    else
    {
    var i;
    for (i = 0; i < id.length; i++) {
        
        Task.findOneAndDelete(id[i], function(err){
            if(err){
                console.log('error in deleting the object');
                return;
            }

    })
    }
    return res.redirect('back');
    }
    });

//server listening on given port
app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})