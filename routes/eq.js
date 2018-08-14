const { Router } = require('express');
const pool = require('../db');

const router = Router();

//firebase dependencies
var firebase = require("firebase");
var admin = require("firebase-admin");
var serviceAccount = require("../secrets/seedlifirebase-firebase-adminsdk-iu213-d625185267.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seedlifirebase.firebaseio.com"
});
//init firestore
var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

// get all eq results
router.get('/', (request, response, next) => {
  //firebase reference where eq results are stored
  var ref = db.collection('/eq/');
  //get a snapshot of the database at the time of function call
  var all = ref.get().then(snapshot => {
    // for each document in the snapshot
      snapshot.forEach(doc => {
          //log each id and data stored
        console.log(doc.id, '=>', doc.data());
      });
    })
    //log all errors
    .catch(err => {
      console.log('Error getting documents', err);
    });
});
//get the eq results of a certain id
router.get('/:id', (request, response, next) => {
  //get the id to search
  const { id } = request.params;
  //reference of the eq results at that id
  var ref = db.collection('eq').doc(id);
  // get the document stored at that collection
  var getDoc = ref.get().then(doc => {
    // if doc doesn't exist
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        // otherwise log the data
        console.log('Document data:', doc.data());
      }
    })
    //log any errors
    .catch(err => {
      console.log('Error getting document', err);
  });
});
//create a new entry into the eq results
router.post('/', (request, response, next) => {
  const inputs = request.body[0];
  var values=[];
  var keys = [];
  Object.values(inputs).forEach(function(element){
    values.push(element);
  });
  Object.keys(inputs).forEach(function(element){
    keys.push(element);
  });
  var obj = {};
  keys.forEach((item,index) => {
    obj[item] = values[index];
  });

  db.collection('eq').add(obj).then(ref => {
  console.log('Added document with ID: ', ref.id);
  });
});
//edit an existing entry in eq results
router.put('/:id', (request, response, next) => {
  const { id } = request.params;
  const inputs=request.body[0];
  var values=[];
  Object.values(inputs).forEach(function(element){
    values.push(element);
  });
  var putref=db.collection('eq').doc(id);
  const understand = values[0];
  const organized = values[1];
  const fight = values[2];
  const friendships = values[3];
  const conflict = values[4];

  var updatedinfo = putref.update({
    understand: `${understand}`,
    organized: `${organized}`,
    fight: `${fight}`,
    friendships: `${friendships}`,
    conflict: `${conflict}`
  }).then(putref => {
  console.log('Edited document with ID: ', id);
  });

});
//delete the doc corresponding to the id
router.delete('/:id', (request, response, next) => {
  const { id } = request.params;

  var deleteDoc = db.collection('eq').doc(id).delete();
});

module.exports = router;
