import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import des routes
import newsRoutes from './routes/newsRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import uploadRoutes from './routes/uploadRoutes';
import projectRoutes from './routes/projectRoutes';
import eventRoutes from './routes/eventRoutes';
import tenderRoutes from './routes/tenderRoutes';
import statsRoutes from './routes/statsRoutes';
import serviceRoutes from './routes/serviceRoutes';
import adminServiceRoutes from './routes/adminServiceRoutes';
import privateUploadsRoutes from './routes/privateUploadsRoutes';

// Import de la connexion à la base de données
import pool from './db';

// Charger les variables d'environnement
dotenv.config();

// Compatibilité ES Modules pour __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3001;

// Fonction pour créer les répertoires d'upload s'ils n'existent pas
const createUploadsDirectories = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const privateUploadsDir = path.join(__dirname, '../private_uploads');

  const dirsToCreate = [
    path.join(uploadsDir, 'news'),
    path.join(uploadsDir, 'avatars'),
    path.join(uploadsDir, 'events'),
    path.join(uploadsDir, 'projects'),
    path.join(privateUploadsDir, 'temp'),
    path.join(privateUploadsDir, 'permis_international')
  ];

  dirsToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Répertoire créé : ${dir}`);
    }
  });
};

// Créer les répertoires nécessaires au démarrage
createUploadsDirectories();

// Test de connexion à la base de données
pool.connect()
  .then(client => {
    console.log('Connecté à PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à PostgreSQL', err);
  });

// Middlewares
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json()); // Pour parser les requêtes JSON
app.use(cookieParser()); // Pour parser les cookies

// Servir les fichiers statiques (images uploadées publiques uniquement)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint (pour monitoring et load balancers)
app.get('/health', async (req, res) => {
  try {
    // Tester la connexion à la base de données
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api', serviceRoutes); // Routes de services généraux
app.use('/api/admin', adminServiceRoutes); // Routes de services admin

// Route protégée pour les fichiers privés (DOIT être après les routes d'API)
app.use('/private_uploads', privateUploadsRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur Express démarré sur le port ${port}`);
});
