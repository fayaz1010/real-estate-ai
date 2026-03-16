// Main Router - Aggregates all module routes
import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import propertyRoutes from '../modules/properties/property.routes';
import inspectionRoutes from '../modules/inspections/inspection.routes';
import applicationRoutes from '../modules/applications/application.routes';

const router = Router();

// Module routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/applications', applicationRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Real Estate Platform API',
    version: '1.0.0',
    status: 'active',
    modules: {
      auth: '/api/auth',
      properties: '/api/properties',
      inspections: '/api/inspections',
      applications: '/api/applications',
    },
  });
});

export default router;
