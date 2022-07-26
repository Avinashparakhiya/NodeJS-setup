const express = require("express");
const router = express.Router();
const { validate } = require('express-validation');
const { register, login } = require('../validations/auth');
const { isAuth } = require('../Middleware/authentication');
const upload = require('../Middleware/fileUpload')
const logger = require("../utils/logger");

const {
  getAll,
  signup,
  signin
} = require("../Controller/auth");

/**
 * API ROUTE FOR LIST 
 * */
router.get("/list", isAuth('user-list'), getAll);
/**
 * API ROUTE FOR SIGNUP WITH VALIDATION
 * */
router.post("/signup", validate(register), signup);
/**
 * API ROUTE FOR SIGNIN WITH VALIDATION
 * */
router.post("/signin", validate(login), signin);

/**
 * API ROUTE FOR AUDIO UPLOAD WITH VALIDATION AND AUTHNTICATION
 * */
router.post("/tuneUpload", isAuth('admin-tune-Upload'), upload.single('audio'), (req, res, next) => {
  logger.info(`=======req.files======== ::${JSON.stringify(req.file)}`);
  res.json(req.file)
});

/**
 * API ROUTE FOR Video UPLOAD WITH VALIDATION AND AUTHNTICATION
 * */
router.post("/videoUpload", isAuth('admin-video-upload'), upload.single('video'), (req, res, next) => {
  logger.info(`=======req.files======== ::${JSON.stringify(req.file)}`);
  res.json(req.file)
});

module.exports = router;