import { Response, Request } from "express";
import client from "../client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
export default class LoginController {
   static async login(req: Request, res: Response): Promise<void> {
      const JWT_SECRET = process.env.JWT_SECRET || "";
      const { email, password } = req.body;
      try {
         const user = await client.user.findUnique({ where: { email } });
         if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({
               status: 'Bad request',
               message: 'Authentication failed',
               statusCode: 401
            });
            return;
         }
         const token = jwt.sign({ userId: user?.userId, email: user?.email }, JWT_SECRET, {
            expiresIn: '1h',
         });

         res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
               accessToken: token,
               user: {
                  userId: user?.userId,
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  email: user?.email,
                  phone: user?.phone,
               }
            }
         });
      } catch (error: any) {
         res.status(401).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401,
         });
      } finally {
         await client.$disconnect();
      }
   }
}