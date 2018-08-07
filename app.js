const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const pool = require('./db');
const app = express();

var firebase = require("firebase");
var admin = require("firebase-admin");

var serviceAccount = require("./secrets/seedlifirebase-firebase-adminsdk-iu213-d625185267.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seedlifirebase.firebaseio.com"
});

app.use(bodyParser.json());

app.get('/eq', (request, response, next) => {
  pool.query('SELECT * FROM eq', (err, res) => {
    if (err) return next(err);
    response.json(res.rows);
  });
});

app.get('/eq/:id', (request, response, next) => {
  const { id } = request.params;

  pool.query('SELECT * FROM eq WHERE id = $1', [id], (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

app.post('/eq', (request, response, next) => {
  const inputs = request.body[0];
  var values=[];
  Object.values(inputs).forEach(function(element){
    values.push(element);
  });
  const understand = values[0];
  const organized = values[1];
  const fight = values[2];
  const friendships = values[3];
  const conflict = values[4];
  pool.query(
    `INSERT INTO eq(understand,organized,fight,friendships,conflict)
    VALUES($1,$2,$3,$4,$5)`,
    [understand,organized,fight,friendships,conflict],
    (err, res) => {
      if (err) return next(err);

      response.redirect('/eq');
    }
  );
});

app.put('/eq/:id', (request, response, next) => {
  const { id } = request.params;
  const keys = ['understand','organized','fight','friendships','conflict'];
  const fields = [];
  const inputs=request.body[0];
  var values=[];
  Object.values(inputs).forEach(function(element){
    values.push(element);
  });

  keys.forEach((key,index) => {
    if (values[index]) fields.push(key);
  });
  fields.forEach((field, index) => {
    pool.query(
      `UPDATE eq SET ${field}=($1) WHERE id=($2)`,
      [values[index], id],
      (err, res) => {
        if (err) return next(err);

        if (index === fields.length - 1) response.redirect('/eq');
      }
    )
  });
});

app.delete('/eq/:id', (request, response, next) => {
  const { id } = request.params;

  pool.query('DELETE FROM eq WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    response.redirect('/eq');
  });
});

app.get('/matm', (request, response, next) => {
  pool.query('SELECT * FROM matm', (err, res) => {
    if (err) return next(err);
    response.json(res.rows);
  });
});

app.get('/matm/:id', (request, response, next) => {
  const { id } = request.params;

  pool.query('SELECT * FROM matm WHERE id = $1', [id], (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

app.post('/matm', (request, response, next) => {
  const inputs = request.body[0];
  var values=[];
  Object.values(inputs).forEach(function(element){
    values.push(element);
  });
  const feel = values[0];
  const sleep = values[1];
  const sessions = values[2];
  const beenupto = values[3];
  const water = values[4];
  const eatentoday = values[5];
  pool.query(
    `INSERT INTO matm(feel,sleep,sessions,beenupto,water,eatentoday)
    VALUES($1,$2,$3,$4,$5,$6)`,
    [feel,sleep,sessions,beenupto,water,eatentoday],
    (err, res) => {
      if (err) return next(err);

      response.redirect('/matm');
    }
  );
});

app.put('/matm/:id', (request, response, next) => {
  const { id } = request.params;
  const keys = ['feel','sleep','sessions','beenupto','water','eatentoday'];
  const fields = [];
  const inputs=request.body[0];
  var values=[];
  Object.values(inputs).forEach(function(element){
    values.push(element);
  });

  keys.forEach((key,index) => {
    if (values[index]) fields.push(key);
  });
  fields.forEach((field, index) => {
    pool.query(
      `UPDATE matm SET ${field}=($1) WHERE id=($2)`,
      [values[index], id],
      (err, res) => {
        if (err) return next(err);

        if (index === fields.length - 1) response.redirect('/matm');
      }
    )
  });
});

app.delete('/matm/:id', (request, response, next) => {
  const { id } = request.params;

  pool.query('DELETE FROM matm WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    response.redirect('/matm');
  });
});

app.use((err, req, res, next) => {
  res.json(err);
});

module.exports = app;
