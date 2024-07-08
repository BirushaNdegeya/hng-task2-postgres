import { Response, Request } from "express";
import client from "../client";

export default class UserController {
   static async getUserInfo(req: Request, res: Response): Promise<void> {
      const { id } = req.params;
      try {
         const user = await client.user.findUnique({ where: { userId: id } });
         if (!user) {
            res.sendStatus(404);
            return;
         }
         res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: {
               userId: user.userId,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
               phone: user.phone,
            }
         });
      } catch (error: any) {
         res.sendStatus(500);
      }
   }
}