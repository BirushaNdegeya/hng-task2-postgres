import app from "./server";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


dotenv.config();
const port = process.env.PORT;
app.listen(port);