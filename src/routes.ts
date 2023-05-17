import { Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";

const authController = new AuthController()

const routes = Router()

routes.post("/login",authController.Login)
routes.post("/register",authController.Register)



export {routes}