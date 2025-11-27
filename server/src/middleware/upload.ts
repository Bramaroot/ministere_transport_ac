import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuration du stockage des fichiers pour les actualités
const newsStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'server/uploads/news/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `news-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Configuration du stockage des fichiers pour les avatars
const avatarStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'server/uploads/avatars/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `avatar-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Configuration du stockage des fichiers pour les événements
const eventStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'server/uploads/events/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `event-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Configuration du stockage des fichiers pour les projets
const projectStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'server/uploads/projects/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `project-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});


// Filtre pour accepter seulement les images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Vérifier le type MIME
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'));
  }
};

// Configuration de multer pour les actualités
export const upload = multer({
  storage: newsStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  }
});

// Configuration de multer pour les avatars
export const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limite de 2MB pour les avatars
  }
});

// Configuration de multer pour les événements
export const uploadEvent = multer({
  storage: eventStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  }
});

// Configuration de multer pour les projets
export const uploadProject = multer({
  storage: projectStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  }
});


// Middleware pour upload d'une seule image
export const uploadSingle = upload.single('image');

// Middleware pour upload de plusieurs images
export const uploadMultiple = upload.array('images', 5);

// Middleware pour upload d'avatar
export const uploadAvatar = avatarUpload.single('avatar');

// Middleware pour upload d'image d'événement
export const uploadEventImage = uploadEvent.single('image');

// Middleware pour upload d'image de projet
export const uploadProjectImage = uploadProject.single('image');

// ====================================================================
// Configuration pour les services E-Services (ex: Permis International)
// ====================================================================

// Stockage temporaire pour les fichiers privés (utiliser memoryStorage pour accéder au buffer)
const privateTempStorage = multer.memoryStorage();

// Filtre pour accepter documents (PDF) et images (JPG, PNG)
const documentAndImageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  // Vérifier le type MIME (plus simple et plus rapide que file-type)
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls les PDF, JPG, et PNG sont acceptés.'));
  }
};

// Configuration de multer pour la demande de permis international
const permisInternationalUpload = multer({
  storage: privateTempStorage,
  fileFilter: documentAndImageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB par fichier
  },
});

// Middleware pour les champs du formulaire de permis international
export const uploadPermisInternational = permisInternationalUpload.fields([
  { name: 'demande_manuscrite', maxCount: 1 },
  { name: 'timbre_fiscal', maxCount: 1 },
  { name: 'copie_permis_national', maxCount: 1 },
  { name: 'copie_ancien_permis', maxCount: 1 },
  { name: 'photos_identite', maxCount: 2 },
]);
