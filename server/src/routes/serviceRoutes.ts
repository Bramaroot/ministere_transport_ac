import { Router } from 'express';
import { submitPermisInternational, getPermisInternationalStatus } from '../controllers/serviceController';
import { uploadPermisInternational } from '../middleware/upload';

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
