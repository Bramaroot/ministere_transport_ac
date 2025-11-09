import { Router } from 'express';
import { checkAuth, checkAdmin } from '../middleware/auth';
import { 
    getAllPermisInternational,
    getPermisInternationalById,
    updatePermisInternationalStatus,
    getPrivateDocument
} from '../controllers/serviceController';

const router = Router();

// Appliquer les middlewares d'authentification et d'admin à toutes les routes de ce fichier
// router.use(checkAuth, checkAdmin);

// Route pour lister toutes les demandes
router.get('/demandes/permis-international', getAllPermisInternational);

// Route pour obtenir une demande par son ID
router.get('/demandes/permis-international/:id', getPermisInternationalById);

// Route pour mettre à jour le statut d'une demande
router.put('/demandes/permis-international/:id/status', updatePermisInternationalStatus);

// Route sécurisée pour télécharger les documents
router.get('/documents/permis-international/:codeSuivi/:fileName', getPrivateDocument);

export default router;
