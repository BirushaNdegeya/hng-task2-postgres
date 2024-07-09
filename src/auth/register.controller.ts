import { Response, Request } from "express";
import client from "../client";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isValidEmail from "../utils/isValidEmail";
import isValidInput from "../utils/isValidInput";
import isValidPassword from "../utils/isValidPassword";


dotenv.config();
export default class RegisterController {
   static async register(req: Request, res: Response): Promise<void> {
      const { firstName, lastName, email, password, phone } = req.body;
      try {
         const JWT_SECRET = process.env.JWT_SECRET || "";
         const valid = isValidEmail(email) && isValidInput(firstName) && isValidInput(lastName) && isValidInput(phone) && isValidPassword(password);
         if (!valid) {
            res.send('all fields are required');
            return;
         }
         const hashedPassword = await bcrypt.hash(password, 10);
         const createdUser = await client.user.create({
            data: { firstName, lastName, email, password: hashedPassword, phone }
         });
         const organisationName = `${firstName}'s Organisation`;
         await client.organisation.create({
            data: {
               name: organisationName,
               users: {
                  connect: {
                     userId: createdUser.userId,
                  },
               },
            },
         });
         const token = jwt.sign({ userId: createdUser.userId, email: createdUser.email }, JWT_SECRET, {
            expiresIn: '1h',
         });
         res.status(201).send({
            status: "success",
            message: "Registration successful",
            data: {
               accessToken: token,
               user: {
                  userId: createdUser.userId,
                  firstName: createdUser.firstName,
                  lastName: createdUser.lastName,
                  email: createdUser.email,
                  phone: createdUser.phone,
               }
            }
         });
      } catch (error: any) {
         res.status(400).send({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400,
            error: error.message
         });
      } finally {
         await client.$disconnect();
      }
   }
}