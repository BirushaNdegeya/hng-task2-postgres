import { Response, Request } from "express";
import client from "../client";


export default class OrganisationController {
   static async getUserOrganisation(req: Request | any, res: Response): Promise<void> {
      try {
         const organisations = await client.organisation.findMany({
            where: {
               users: {
                  some: {
                     userId: req.user.userId,
                  },
               },
            },
         });
         res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: {
               organisations: organisations.map(org => ({
                  orgId: org.orgId,
                  name: org.name,
                  description: org.description,
               })),
            }
         });
      } catch (error) {
         res.sendStatus(500);
      }
   }

   // Get a Single Organisation

   static async getSingleOrganisationById(req: Request | any, res: Response): Promise<void> {
      const { orgId } = req.params;
      try {
         const organisation = await client.organisation.findUnique({
            where: { orgId },
            include: {
               users: true,
            }
         });
         if (!organisation || !organisation.users.some(user => user.userId === req.user.userId)) {
            res.sendStatus(404);
            return;
         }
         res.status(200).json({
            status: 'success',
            message: 'Organisation retrieved successfully',
            data: {
               orgId: organisation?.orgId,
               name: organisation?.name,
               description: organisation?.description,
            }
         });
      } catch (error) {
         res.sendStatus(500);
      }
   }

   // create new organisation

   static async createOganisation(req: Request | any, res: Response): Promise<void> {
      const { name, description } = req.body;
      try {
         const organisation = await client.organisation.create({
            data: {
               name,
               description,
               users: {
                  connect: {
                     userId: req.user.userId,
                  },
               },
            },
         });
         res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: {
               orgId: organisation.orgId,
               name: organisation.name,
               description: organisation.description,
            }
         });
      } catch (error: any) {
         res.status(400).json({
            status: 'Bad request',
            message: 'Client error',
            statusCode: 400
         });
      }
   }

   // Add User to Organisation

   static async addUserOrganisation(req: Request | any, res: Response): Promise<void> {
      const { orgId } = req.params;
      const { userId } = req.body;

      try {
         const organisation = await client.organisation.findUnique({
            where: { orgId },
            include: {
               users: true,
            }
         });

         if (!organisation || !organisation.users.some(user => user.userId === req.user.userId)) {
            res.sendStatus(404);
            return;
         }

         await client.organisation.update({
            where: { orgId },
            data: {
               users: {
                  connect: {
                     userId,
                  },
               },
            },
         });

         res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully',
         });

      } catch (error) {
         res.sendStatus(500);
      }
   }
}