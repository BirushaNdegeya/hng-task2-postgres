import { Router } from "express";
import UserController from "../controller/user.controller";


export const router = Router();
router.route('/:id').get(UserController.getUserInfo);
