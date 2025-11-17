import { Router } from 'express';
import { checkAuth } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Middleware d'authentification pour toutes les routes de ce router
router.use(checkAuth);

// Route protégée pour servir les fichiers privés
router.use((req, res) => {
  // Extraire le chemin complet depuis req.url
  const filePath = req.url.startsWith('/') ? req.url.slice(1) : req.url;
  const absolutePath = path.join(__dirname, '../../private_uploads', filePath);

  // Vérifier que le fichier existe
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ message: 'Fichier non trouvé' });
  }

  // Vérifier que le chemin ne contient pas de tentative de sortie du répertoire
  const normalizedPath = path.normalize(absolutePath);
  const privateUploadsDir = path.join(__dirname, '../../private_uploads');

  if (!normalizedPath.startsWith(privateUploadsDir)) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }

  // Servir le fichier
  res.sendFile(absolutePath);
});

export default router;
