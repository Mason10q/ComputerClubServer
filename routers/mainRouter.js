const express = require("express");
const mainRouter = express.Router();
const urlEncodedParser = express.urlencoded({extended: false});

const authController = require("../controllers/authController.js");
const mainController = require("../controllers/mainController.js");
    
mainRouter.post("/auth/signIn", authController.signIn);
mainRouter.post("/auth/signUp", authController.signUp);
mainRouter.post("/auth/profile/remove", authController.deleteProfile);

mainRouter.get("/computers/list", mainController.getAllComputers);
mainRouter.get("/computers/search", mainController.searchComputers);

mainRouter.get("/basket/list", mainController.getBasket);
mainRouter.post("/basket/add", mainController.addToBasket);
mainRouter.post("/basket/remove", mainController.removeFromBasket);
mainRouter.get("/basket/contains", mainController.isInBasket);

module.exports = mainRouter;