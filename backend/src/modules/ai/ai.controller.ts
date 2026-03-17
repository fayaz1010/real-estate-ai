/**
 * @module ai.controller
 * @description Controllers for AI-powered property management endpoints.
 */
import { Request, Response } from "express";

import { successResponse } from "../../utils/response";

import {
  generatePropertyValuation,
  generateMarketAnalysis,
  generateTenantScreeningInsights,
  generatePredictiveMaintenance,
} from "./ai.service";

/**
 * POST /api/ai/property-valuation
 * Generate an AI-powered property valuation estimate.
 * @param req - Request with property details in body
 * @param res - Response with estimated value, confidence score, and comparables
 */
export const propertyValuation = async (req: Request, res: Response) => {
  const result = generatePropertyValuation(req.body);
  return successResponse(
    res,
    result,
    "Property valuation generated successfully",
  );
};

/**
 * POST /api/ai/market-analysis
 * Generate an AI-powered market analysis for a given location.
 * @param req - Request with location (city, state, zipCode) in body
 * @param res - Response with market metrics, trends, and data sources
 */
export const marketAnalysis = async (req: Request, res: Response) => {
  const result = generateMarketAnalysis(req.body);
  return successResponse(res, result, "Market analysis generated successfully");
};

/**
 * POST /api/ai/tenant-screening
 * Generate AI-powered tenant screening insights.
 * @param req - Request with screening data (credit, background, income) in body
 * @param res - Response with risk score, recommendation, and justification
 */
export const tenantScreeningInsights = async (req: Request, res: Response) => {
  const result = generateTenantScreeningInsights(req.body);
  return successResponse(
    res,
    result,
    "Tenant screening insights generated successfully",
  );
};

/**
 * POST /api/ai/predictive-maintenance
 * Generate AI-powered predictive maintenance analysis.
 * @param req - Request with property data (age, history, sensors) in body
 * @param res - Response with potential issues and recommended actions
 */
export const predictiveMaintenance = async (req: Request, res: Response) => {
  const result = generatePredictiveMaintenance(req.body);
  return successResponse(
    res,
    result,
    "Predictive maintenance analysis generated successfully",
  );
};
