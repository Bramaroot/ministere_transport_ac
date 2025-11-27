import { Router } from 'express';
import { uploadSingle } from '../middleware/upload.js';
import { checkAuth } from '../middleware/auth.js';

const router = Router();

// Route pour uploader une image
router.post('/image', checkAuth, (req, res) => {
  console.log('📤 [UPLOAD] Début upload');
  console.log('📤 [UPLOAD] Content-Type:', req.get('content-type'));
  console.log('📤 [UPLOAD] User:', req.user?.email);

  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('❌ [UPLOAD] Erreur Multer:', err);
      console.error('❌ [UPLOAD] Message:', err.message);
      console.error('❌ [UPLOAD] Code:', err.code);
      return res.status(400).json({
        success: false,
        message: err.message || 'Erreur lors de l\'upload de l\'image'
      });
    }

    if (!req.file) {
      console.error('❌ [UPLOAD] Aucun fichier reçu');
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    console.log('✅ [UPLOAD] Fichier uploadé:', req.file.filename);
    console.log('✅ [UPLOAD] Taille:', req.file.size, 'bytes');

    // Retourner l'URL complète de l'image uploadée
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/news/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  });
});

export default router;
