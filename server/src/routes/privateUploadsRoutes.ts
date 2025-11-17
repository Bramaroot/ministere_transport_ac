import { Router } from 'express';
import { checkAuth } from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Route protégée pour servir les fichiers privés
router.get('/*', checkAuth, (req, res) => {
  // Extraire le chemin du fichier depuis l'URL
  const filePath = req.params[0];
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
