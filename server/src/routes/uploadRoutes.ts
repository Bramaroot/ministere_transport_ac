import { Router } from 'express';
import { uploadSingle } from '../middleware/upload';
import { checkAuth } from '../middleware/auth';

const router = Router();

// Route pour uploader une image
router.post('/image', checkAuth, (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Erreur lors de l\'upload:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Erreur lors de l\'upload de l\'image'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Retourner l'URL complète de l'image uploadée
    const imageUrl = `http://localhost:3001/uploads/news/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  });
});

export default router;
