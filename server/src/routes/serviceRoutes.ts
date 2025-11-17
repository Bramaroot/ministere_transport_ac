import { Router } from 'express';
import { submitPermisInternational, getPermisInternationalStatus } from '../controllers/serviceController.js';
import { uploadPermisInternational } from '../middleware/upload.js';

const router = Router();

router.post(
    '/services/permis-international', 
    uploadPermisInternational, 
    submitPermisInternational
);

router.get(
    '/services/permis-international/status/:codeSuivi',
    getPermisInternationalStatus
);

export default router;
