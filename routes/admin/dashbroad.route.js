const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/deshbroad.controller")

router.get('/', controller.dashbroad);



module.exports = router;