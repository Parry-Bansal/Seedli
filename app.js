//dependencies
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const pool = require('./db');
const app = express();
const request = require('request');

//firebase dependencies
var firebase = require("firebase");
var admin = require("firebase-admin");
var db = admin.firestore();


  var time = firebase.firestore.Timestamp.now();
  console.log(time.toDate());

//example of timestamps
// const timestamp = snapshot.get('created_at');
// const date = timestamp.toDate();

//will use a callback to return an array of the EQ questions
function getQuestionKeys(callback){
  //init empty array of keys
  var keys=[];
  //reference to where the survey questions are stored
  var ref = db.collection('surveys').doc('eq').collection("Survey Question")
  //order by question id as a composite index
  ref = ref.orderBy("questID", "ASC");
  //whichever questions are active, we get a snapshot of
  ref.where ('active','==',true).get().then(snapshot=>{
    //for each question, we'll push it into the empty array
    snapshot.forEach(doc => {
        keys.push(doc.data().text);
      });
      //call the callback to work with this array
    callback(keys);
  });
}

//will use a callback to return an array of the EQ answers
function getAnswerKeys(callback){
  //init empty array
  var keys = [];
  //ref for the EQ answers
  var ref = db.collection('surveys').doc('eq').collection("Survey Answer");
  //get only 5 answers as those are the only ones that exist
  ref = ref.orderBy("questID","ASC").limit(5);
  //whichever answers are active, we'll get a snapshot of and store it in the empty array
  ref.where ('active','==',true).get().then(snapshot=>{
    snapshot.forEach(doc => {
        keys.push(doc.data().text);
      });
    // call back to work with the keys array
    callback(keys);
  });
}

//post a random response to firebase
function PostRandomResponse(){
  //get the arrays of the questions and answers
  getQuestionKeys(function(questions){
    getAnswerKeys(function(answers){
      // console.log(questions);
      // console.log(answers);
      //init a JSON object
      var fullObj = [{}];
      //init the JS Object to insert the response into
      var myObj = fullObj[0];
      //for each question, we'll generate a random number from 0-4
      questions.forEach(item => {
        var rand = Math.floor(Math.random() * 5);
        //use that random number as an array index for the question key
        myObj[item] = answers[rand];
      })
      // console.log(myObj);
      // console.log(fullObj);
      //post it
      postNew(fullObj);
    });
  });
}


//init bodyparsing of elements for HTTP requests
app.use(bodyParser.json());

//reference to the eq and matm http request directory
app.use('/', routes);

//app sends get request
function getall(collection){
  request(
    `http://localhost:3000/${collection}`,
    {json:true},
    (err,res,body) => {
    console.log(body);
  });
}

//app sends get request for a specific id
function getByID(collection,id){
  request(
    `http://localhost:3000/${collection}/${id}`,
    {json:true},
    (err,res,body) => {
    console.log(body);
  });
}

//app sends delete request for a specific id
function deleteByID(id){
  request.delete(
    `http://localhost:3000/eq/${id}`,
    {json:true},
    (err,res,body) => {
    console.log("deleted with id"+id+".");
  });
}

// app sends post request
function postNew(myObj){
  request.post({
    url:'http://localhost:3000/eq/',
    json: myObj
  });
}

//NOT NECCESSARY
// app sends put request (Deprecated, not neccessary)
function putEntry(myObj){
  request.put({
    url:'http://localhost:3000/eq/pMoBa7HJkgYc0y1aF5Vp',
    json: myNewObj
  });
}

app.use((err, req, res, next) => {
  res.json(err);
});

module.exports = app;
