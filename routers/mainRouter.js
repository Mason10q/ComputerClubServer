const express = require("express");
const mainRouter = express.Router();
const urlEncodedParser = express.urlencoded({extended: false});

const authController = require("../controllers/authController.js");
const mainController = require("../controllers/mainController.js");
    
mainRouter.post("/auth/signIn", authController.signIn);
mainRouter.post("/auth/signUp", authController.signUp);
mainRouter.post("/auth/profile/delete", authController.deleteProfile);

module.exports = mainRouter;