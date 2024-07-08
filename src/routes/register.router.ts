import { Router } from "express";
import RegisterController from "../auth/register.controller";


export const router = Router();
router.route('/').post(RegisterController.register);