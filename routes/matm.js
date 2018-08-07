const { Router } = require('express');
const pool = require('../db');

const router = Router();

router.get('/', (request, response, next) => {
  pool.query('SELECT * FROM matm ORDER BY id ASC', (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

router.get('/:id', (request, response, next) => {
  const { id } = request.params;

  pool.query('SELECT * FROM matm WHERE id = $1', [id], (err, res) => {
    if (err) return next(err);

    response.json(res.rows);
  });
});

router.post('/', (request, response, next) => {
  const { understand,organized,fight,friendships,conflict } = request.body;

  pool.query(
    `INSERT INTO matm(understand,organized,fight,friendships,conflict)
    VALUES($1, $2, $3, $4, $5)`,
    [understand,organized,fight,friendships,conflict],
    (err, res) => {
      if (err) return next(err);

      response.redirect('/matm');
    }
  );
});

router.put('/:id', (request, response, next) => {
  const { id } = request.params;
  const keys = ['understand','organized','fight','friendships','conflict'];
  const fields = [];

  keys.forEach(key => {
    if (request.body[key]) fields.push(key);
  });

  fields.forEach((field, index) => {
    pool.query(
      `UPDATE eq SET ${field}=($1) WHERE id=($2)`,
      [request.body[field], id],
      (err, res) => {
        if (err) return next(err);

        if (index === fields.length - 1) response.redirect('/eq');
      }
    )
  });
});

router.delete('/:id', (request, response, next) => {
  const { id } = request.params;

  pool.query('DELETE FROM eq WHERE id=($1)', [id], (err, res) => {
    if (err) return next(err);

    response.redirect('/eq');
  });
});

module.exports = router;
