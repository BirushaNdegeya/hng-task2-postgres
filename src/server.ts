import express, { Request, Response } from 'express';
import cors from 'cors';
import * as registerRouter from './routes/register.router';
import * as loginRouter from './routes/login.router';
import * as userRouter from './api/user.route';
import * as organisationRouter from './api/organisation.route';
import authenticateJWT from './auth/authenticateJWT';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/', authenticateJWT);
app.use('/auth/register', registerRouter.router);
app.use('/auth/login', loginRouter.router);
// get user Info
app.use('/api/users', userRouter.router);
// Get User's Organisations
app.use('/api/organisations', organisationRouter.router);

app.use('*', function (req: Request, res: Response): void {
   res.sendStatus(404);
});
export default app;