import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
export default function authenticateJWT(req: Request | any, res: Response, next: NextFunction): void {
   const JWT_SECRET = process.env.JWT_SECRET || "";
   const token = req.header('Authorization')?.split(' ')[1];
   if (!token) {
      res.sendStatus(403);
      return;
   }
   try {
      const user = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
      req.user = user;
      next();
   } catch (e) {
      res.sendStatus(403);
   }
}