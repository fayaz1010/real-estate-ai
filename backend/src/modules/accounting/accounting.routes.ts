import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth";

import accountingController from "./accounting.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("LANDLORD", "PROPERTY_MANAGER", "BUSINESS", "ADMIN", "SUPER_ADMIN"));

router.get("/summary", accountingController.getDashboardSummary);
router.get("/income-statement", accountingController.getIncomeStatement);
router.get("/balance-sheet", accountingController.getBalanceSheet);
router.get("/cash-flow", accountingController.getCashFlowStatement);
router.get("/rent-collection", accountingController.getRentCollectionReport);
router.get("/expenses", accountingController.getExpenseReport);
router.get("/properties", accountingController.getProperties);

export default router;
