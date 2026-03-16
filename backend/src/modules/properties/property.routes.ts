// Property Routes
import { Router } from 'express';
import propertyController from './property.controller';
import { authenticate, optionalAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import { createPropertySchema, updatePropertySchema } from './property.validation';

const router = Router();

// Public routes
router.get('/', optionalAuth, propertyController.getAll);
router.get('/slug/:slug', optionalAuth, propertyController.getBySlug);
router.get('/:id', optionalAuth, propertyController.getById);

// Protected routes
router.post('/', authenticate, validate(createPropertySchema), propertyController.create);
router.patch('/:id', authenticate, validate(updatePropertySchema), propertyController.update);
router.delete('/:id', authenticate, propertyController.delete);
router.get('/my-properties', authenticate, propertyController.getMyProperties);
router.post('/:id/publish', authenticate, propertyController.publish);

export default router;
