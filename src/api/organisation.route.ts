import { Router } from "express";
import OrganisationController from "../controller/organisation.controller";


export const router = Router();
// Get a Single Organisation
router.route('/:orgId').get(OrganisationController.getSingleOrganisationById);
// get organisation info
router.route('/').get(OrganisationController.getUserOrganisation)
// Add User to Organisation
router.route('/:orgId/users').post(OrganisationController.addUserOrganisation);
// create new organisation
router.route('/').post(OrganisationController.createOganisation)
