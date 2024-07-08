import { Router } from "express";
import LoginController from "../auth/login.controller";


export const router = Router();
router.route('/').post(LoginController.login);