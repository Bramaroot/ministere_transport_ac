import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  uploadProjectImage
} from '../controllers/projectController.js';
import { checkAuth } from '../middleware/auth.js';
import { uploadProjectImage as uploadProjectMiddleware } from '../middleware/upload.js';

const router = Router();

// Routes publiques
router.get('/', getAllProjects);
router.get('/stats', getProjectStats);
router.get('/:id', getProjectById);

// Routes protégées (admin)
router.post('/', checkAuth, createProject);
router.put('/:id', checkAuth, updateProject);
router.delete('/:id', checkAuth, deleteProject);
router.post('/:id/upload-image', checkAuth, uploadProjectMiddleware, uploadProjectImage);

export default router;
