const { Router } = require('express');
const eq = require('./eq.js');
const matm = require('./matm.js');
const router = Router();

router.use('/eq', eq);
router.use('/matm', matm);

module.exports = router;
