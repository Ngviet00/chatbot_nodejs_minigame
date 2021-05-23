import express from "express";
import homepageController from "../controllers/homepageController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homepageController.getHomepage);

    router.get("/webhooks/facebook/webhook", homepageController.getWebhook);
    router.post("/webhooks/facebook/webhook", homepageController.postWebhook);

    router.get("/register", homepageController.getWebViewRegister);
    router.post("/set-up-register", homepageController.postWebViewRegister);

    router.get("/spin", homepageController.getSpinWheel);
    router.post("/set-up-spin", homepageController.postSpinWheel);

    return app.use("/", router);
};

module.exports = initWebRoutes;
