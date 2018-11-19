const express = require('express');
const app = express();
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const path = require("path");

// localStorage.setItem('myFirstKey','myFirstValue');
// localStorage.getItem('myFirstKey');

app.use(express.static(path.join(__dirname,'/dist')));
app.use(express.static(path.join(__dirname,'/assets')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/dist/index.html'));
});

// app.get('*',(req,res)=>{
//     res.send('No such file exist!');
// });

app.listen(2000,()=>{
    console.log('App is running on port 2000!');
});
