import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  uploadEventImage
} from '../controllers/eventController.js';
import { checkAuth } from '../middleware/auth.js';
import { uploadEventImage as uploadEventMiddleware } from '../middleware/upload.js';

const router = Router();

// Routes publiques
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEventById);

// Routes protégées (nécessitent une authentification)
router.post('/', checkAuth, createEvent);
router.put('/:id', checkAuth, updateEvent);
router.delete('/:id', checkAuth, deleteEvent);
router.post('/:id/upload-image', checkAuth, uploadEventMiddleware, uploadEventImage);

export default router;

