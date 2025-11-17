import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

// Méthode pour obtenir __dirname dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis la racine du projet
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const pool = new Pool({
  user: process.env.DB_USER || "mtacadmin",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mtac_bd",
  password: process.env.DB_PASSWORD || "MtacAdmin@2025@",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

// Fonction pour initialiser la base de données
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log("Vérification de la connexion à la base de données...");
    // Test simple de connexion
    await client.query("SELECT NOW()");
    console.log("Connexion à la base de données établie avec succès");
  } catch (err) {
    console.error("Erreur lors de la connexion à la base de données:", err);
    throw err;
  } finally {
    client.release();
  }
};

// Fonction pour vérifier si un utilisateur admin existe
const checkAdminUser = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id FROM utilisateurs WHERE role = $1 LIMIT 1",
      ["admin"]
    );

    if (result.rows.length === 0) {
      console.log(
        "Aucun utilisateur admin trouvé. Création d'un admin par défaut..."
      );
      // Le mot de passe sera hashé par le contrôleur utilisateur
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await client.query(
        "INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe_hash, prenom, nom, role, actif) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          "admin",
          "admin@transport-niger.ne",
          hashedPassword,
          "Admin",
          "Système",
          "admin",
          true,
        ]
      );

      console.log("Utilisateur admin créé avec succès");
    }
  } catch (err) {
    console.error(
      "Erreur lors de la vérification de l'utilisateur admin:",
      err
    );
  } finally {
    client.release();
  }
};

// Initialiser la base de données et vérifier l'utilisateur admin
initializeDatabase()
  .then(() => checkAdminUser())
  .catch(console.error);

export default pool;
