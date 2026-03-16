// Property Controller
import { Request, Response } from 'express';
import propertyService from './property.service';
import { successResponse } from '../../utils/response';
import { asyncHandler } from '../../middleware/errorHandler';

export class PropertyController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const property = await propertyService.create(ownerId, req.body);
    return successResponse(res, property, 'Property created', 201);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const result = await propertyService.getAll(req.query);
    return successResponse(res, result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const property = await propertyService.getById(req.params.id);
    return successResponse(res, property);
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const property = await propertyService.getBySlug(req.params.slug);
    return successResponse(res, property);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const property = await propertyService.update(req.params.id, ownerId, req.body);
    return successResponse(res, property, 'Property updated');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    await propertyService.delete(req.params.id, ownerId);
    return successResponse(res, null, 'Property deleted');
  });

  getMyProperties = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const { page, limit } = req.query;
    const result = await propertyService.getMyProperties(
      ownerId,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20
    );
    return successResponse(res, result);
  });

  publish = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;
    const property = await propertyService.publish(req.params.id, ownerId);
    return successResponse(res, property, 'Property published');
  });
}

export default new PropertyController();
