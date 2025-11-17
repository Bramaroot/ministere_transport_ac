import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import pool from '../db.js';
import { generateAuthToken } from '../middleware/auth.js';
import { signAccessToken, signRefreshToken, verifyRefresh } from '../auth/tokens.js';
import { saveRefresh, findRefresh, replaceRefresh, revokeRefresh } from '../auth/refreshStore.js';
import { setRefreshCookie, clearRefreshCookie } from '../auth/cookies.js';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou votre service email préféré
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Connexion d'un utilisateur
export const login = async (req: Request, res: Response) => {
  const { identifiant, mot_de_passe } = req.body;

  try {
    if (!identifiant || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un identifiant et un mot de passe'
      });
    }

    const userResult = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1 OR nom_utilisateur = $1',
      [identifiant]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    const user = userResult.rows[0];

    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte a été désactivé. Veuillez contacter un administrateur.'
      });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    await pool.query(
      'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = $1',
      [user.id]
    );

    // --- NEW REFRESH TOKEN AUTH LOGIC ---
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const { token: refreshToken, jti } = signRefreshToken({ userId: user.id });

    await saveRefresh({
      jti,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip,
    });

    setRefreshCookie(res, refreshToken);
    // --- END NEW LOGIC ---

    const { mot_de_passe_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      accessToken, // Send the short-lived access token
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// Inscription d'un nouvel utilisateur
export const register = async (req: Request, res: Response) => {
  const { email, nom_utilisateur, mot_de_passe, prenom, nom } = req.body;

  try {
    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const userCheck = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1 OR nom_utilisateur = $2',
      [email, nom_utilisateur]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà'
      });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Créer l'utilisateur
    const newUser = await pool.query(
      `INSERT INTO utilisateurs 
       (email, nom_utilisateur, mot_de_passe_hash, prenom, nom, role, actif)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, nom_utilisateur, prenom, nom, role, date_creation`,
      [email, nom_utilisateur, hashedPassword, prenom, nom, 'consultant', true]
    );

    // Générer un token JWT
    const token = generateAuthToken(newUser.rows[0].id);

    res.status(201).json({
      success: true,
      token,
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

// Récupérer le profil de l'utilisateur connecté
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    const userResult = await pool.query(
      'SELECT id, nom_utilisateur, email, prenom, nom, role, actif, derniere_connexion, date_creation, date_modification FROM utilisateurs WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: userResult.rows[0]
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

// Endpoint temporaire pour générer un token admin (développement uniquement)
export const generateAdminToken = async (req: Request, res: Response) => {
  try {
    // Récupérer l'utilisateur admin
    const userResult = await pool.query(
      'SELECT id, nom_utilisateur, email, role FROM utilisateurs WHERE role = $1 LIMIT 1',
      ['admin']
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur admin trouvé'
      });
    }

    const adminUser = userResult.rows[0];
    const token = generateAuthToken(adminUser.id);

    res.json({
      success: true,
      token,
      user: adminUser,
      message: 'Token admin généré avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la génération du token admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du token'
    });
  }
};

// 🔹 Connexion admin simplifiée (sans OTP pour le développement)
export const loginAdminSimple = async (req: Request, res: Response) => {
  const { identifiant, mot_de_passe } = req.body;

  try {
    if (!identifiant || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un identifiant et un mot de passe'
      });
    }

    // Vérifier si l'utilisateur existe et est admin
    const userResult = await pool.query(
      'SELECT * FROM utilisateurs WHERE (email = $1 OR nom_utilisateur = $1) AND role = $2',
      [identifiant, 'admin']
    );

    if (userResult.rows.length === 0) {
      // Si aucun admin n'existe, créer un admin par défaut
      console.log('Aucun utilisateur admin trouvé. Création d\'un admin par défaut...');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      const newAdmin = await pool.query(
        'INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe_hash, prenom, nom, role, actif) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        ['admin', 'admin@transport-niger.ne', hashedPassword, 'Admin', 'Système', 'admin', true]
      );

      const user = newAdmin.rows[0];

      // Mettre à jour la date de dernière connexion
      await pool.query(
        'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = $1',
        [user.id]
      );

      // Générer un token JWT
      const token = generateAuthToken(user.id);

      // Renvoyer les informations de l'utilisateur (sans le mot de passe)
      const { mot_de_passe_hash, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        token,
        user: userWithoutPassword,
        message: 'Admin créé et connexion réussie'
      });
    }

    const user = userResult.rows[0];

    // Vérifier si le compte est actif
    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte administrateur a été désactivé.'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Mettre à jour la date de dernière connexion
    await pool.query(
      'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = $1',
      [user.id]
    );

    // Générer un token JWT
    const token = generateAuthToken(user.id);

    // Renvoyer les informations de l'utilisateur (sans le mot de passe)
    const { mot_de_passe_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Connexion admin réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// 🔹 Étape 1 : Login avec OTP pour les admins
export const loginAdminWithOTP = async (req: Request, res: Response) => {
  const { identifiant, mot_de_passe } = req.body;

  // console.log('🔍 [LOGIN-OTP] Début de la fonction loginAdminWithOTP');
  // console.log('📧 Identifiant reçu:', identifiant);
  // console.log('🔑 Mot de passe reçu:', mot_de_passe ? '***' : 'undefined');

  try {
    if (!identifiant || !mot_de_passe) {
      //onsole.log('❌ [LOGIN-OTP] Paramètres manquants');
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un identifiant et un mot de passe'
      });
    }

    // Vérifier si l'utilisateur existe et est admin
    //onsole.log('🔍 [LOGIN-OTP] Recherche de l\'utilisateur admin...');
    const userResult = await pool.query(
      'SELECT * FROM utilisateurs WHERE (email = $1 OR nom_utilisateur = $1) AND role = $2',
      [identifiant, 'admin']
    );

    //console.log('📊 [LOGIN-OTP] Nombre d\'utilisateurs trouvés:', userResult.rows.length);
    if (userResult.rows.length > 0) {
      console.log('👤 [LOGIN-OTP] Utilisateur trouvé:', {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        role: userResult.rows[0].role,
        actif: userResult.rows[0].actif
      });
    }

    if (userResult.rows.length === 0) {
      //console.log('❌ [LOGIN-OTP] Aucun utilisateur admin trouvé');
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Seuls les administrateurs peuvent utiliser cette fonctionnalité.'
      });
    }

    const user = userResult.rows[0];

    // Vérifier si le compte est actif
    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: 'Ce compte administrateur a été désactivé.'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Générer un code OTP à 6 chiffres
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 5 * 60 * 1000); // expire dans 5 minutes

    // Sauvegarder l'OTP dans la base de données
    await pool.query(
      'UPDATE utilisateurs SET otp = $1, otp_expiration = $2 WHERE id = $3',
      [otp, expires, user.id]
    );

    // Envoyer l'email avec le code OTP
    // console.log('📧 [LOGIN-OTP] Configuration email:');
    // console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    // console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'undefined');
    // console.log('📧 Email destinataire:', user.email);
    // console.log('🔢 Code OTP généré:', otp);

    try {
      //onsole.log('📤 [LOGIN-OTP] Tentative d\'envoi de l\'email...');

      // 🔧 DEBUG: Afficher le code OTP dans la console pour les tests
      // console.log('🔐 [DEBUG] CODE OTP POUR TEST:', otp);
      // console.log('📧 [DEBUG] Email destinataire:', user.email);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Code de vérification - Portail Administration Transports Niger',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Logo Header -->
                    <tr>
                      <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(180deg, #dcfce7 0%, #f0fdf4 100%);">
                        <img src="logo-niger.jpg" alt="Logo Ministère des Transports" style="width: 120px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
                        <h1 style="margin: 0; color: #14532d; font-size: 28px; font-weight: 700;">Code de Vérification</h1>
                        <div style="width: 80px; height: 4px; background: linear-gradient(90deg, #22c55e, #16a34a); margin: 20px auto 0; border-radius: 9999px;"></div>
                      </td>
                    </tr>
      
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 50px;">
                        <p style="margin: 0 0 24px; color: #1e293b; font-size: 18px; font-weight: 600;">
                          Bonjour ${user.prenom || user.nom_utilisateur},
                        </p>
                        
                        <p style="margin: 0 0 30px; color: #475569; font-size: 15px; line-height: 1.7;">
                          Vous tentez de vous connecter au portail d'administration du 
                          <strong style="color: #14532d;">Ministère des Transports et de l'Aviation Civile du Niger</strong>.
                        </p>
      
                        <!-- OTP Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 30px; text-align: center;">
                              <p style="margin: 0 0 16px; color: #065f46; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                                Votre code de vérification
                              </p>
                              <div style="font-size: 44px; font-weight: 800; color: #16a34a; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">
                  ${otp}
                </div>
                              <p style="margin: 16px 0 0; color: #047857; font-size: 13px;">
                                Entrez ce code pour continuer
                              </p>
                            </td>
                          </tr>
                        </table>
      
                        <!-- Warning Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px;">
                              <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                <strong>⏱️ Important :</strong> Ce code expire dans <strong>5 minutes</strong> pour des raisons de sécurité.
                              </p>
                            </td>
                          </tr>
                        </table>
      
                        
      
                        <p style="margin: 30px 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                          Cordialement,<br/>
                          <strong style="color: #14532d;">L'équipe du Ministère des Transports</strong>
                        </p>
                      </td>
                    </tr>
      
                    <!-- Footer -->
                    <tr>
                      <td style="background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px 50px; text-align: center; border-top: 1px solid #bbf7d0;">
                        <p style="margin: 0 0 12px; color: #065f46; font-size: 13px; font-weight: 700;">
                          Ministère des Transports et de l'Aviation Civile
                        </p>
                        <p style="margin: 0 0 12px; color: #047857; font-size: 12px;">
                          République du Niger
                        </p>
                        <div style="border-top: 1px solid #bbf7d0; margin: 20px 0; padding-top: 20px;">
                          <p style="margin: 0; color: #64748b; font-size: 11px;">
                            © ${new Date().getFullYear()} Tous droits réservés. Cet email a été envoyé automatiquement, merci de ne pas y répondre.
              </p>
            </div>
                      </td>
                    </tr>
      
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });

      //onsole.log('✅ [LOGIN-OTP] Email envoyé avec succès');
      res.json({
        success: true,
        message: 'Code de vérification envoyé à votre adresse email',
        email: user.email,
        expiresIn: 300 // 5 minutes en secondes
      });

    } catch (emailError) {
      //console.error('❌ [LOGIN-OTP] Erreur lors de l\'envoi de l\'email:', emailError);
      // console.error('❌ [LOGIN-OTP] Détails de l\'erreur:', {
      //   message: emailError.message,
      //   code: emailError.code,
      //   command: emailError.command
      // });
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.'
      });
    }

  } catch (error) {
    console.error('Erreur lors de la connexion admin avec OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// 🔹 Étape 2 : Vérification du code OTP
export const verifyAdminOTP = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email et code de vérification requis'
      });
    }

    // Récupérer l'utilisateur avec l'OTP
    const result = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1 AND role = $2',
      [email, 'admin']
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email non trouvé ou accès non autorisé'
      });
    }

    const user = result.rows[0];

    // Vérifier si l'OTP existe et n'est pas expiré
    if (!user.otp || new Date(user.otp_expiration) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Code de vérification expiré. Veuillez refaire une demande de connexion.'
      });
    }

    // Vérifier le code OTP
    if (parseInt(code) !== user.otp) {
      return res.status(400).json({
        success: false,
        message: 'Code de vérification incorrect'
      });
    }

    // Mettre à jour la date de dernière connexion
    await pool.query(
      'UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = $1',
      [user.id]
    );

    // --- NEW REFRESH TOKEN AUTH LOGIC ---
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const { token: refreshToken, jti } = signRefreshToken({ userId: user.id });

    await saveRefresh({
      jti,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip,
    });

    setRefreshCookie(res, refreshToken);
    // --- END NEW LOGIC ---

    // Nettoyer l'OTP de la base de données
    await pool.query(
      'UPDATE utilisateurs SET otp = NULL, otp_expiration = NULL WHERE id = $1',
      [user.id]
    );

    // Renvoyer les informations de l'utilisateur (sans le mot de passe)
    const { mot_de_passe_hash, otp, otp_expiration, ...userWithoutSensitiveData } = user;

    res.json({
      success: true,
      accessToken, // Send the short-lived access token
      token: generateAuthToken(user.id), // Keep legacy token for backward compatibility
      user: userWithoutSensitiveData,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du code'
    });
  }
};

// 🔹 Fonction pour réinitialiser l'OTP (en cas de problème)
export const resendAdminOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    // Vérifier que l'utilisateur existe et est admin
    const userResult = await pool.query(
      'SELECT * FROM utilisateurs WHERE email = $1 AND role = $2',
      [email, 'admin']
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur admin non trouvé'
      });
    }

    const user = userResult.rows[0];

    // Générer un nouveau code OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    // Mettre à jour l'OTP
    await pool.query(
      'UPDATE utilisateurs SET otp = $1, otp_expiration = $2 WHERE id = $3',
      [otp, expires, user.id]
    );

    // Renvoyer l'email (design harmonisé vert)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Nouveau code de vérification - Portail Administration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,.1);overflow:hidden;">
                  <tr>
                    <td style="padding:32px 40px;text-align:center;background:linear-gradient(180deg,#dcfce7 0%,#f0fdf4 100%);">
                      <h1 style="margin:0;color:#14532d;font-size:24px;font-weight:800;">🔄 Nouveau code de vérification</h1>
                      <div style="width:80px;height:4px;background:linear-gradient(90deg,#22c55e,#16a34a);margin:16px auto 0;border-radius:9999px;"></div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:32px 48px;">
                      <p style="margin:0 0 16px;color:#1e293b;font-size:18px;font-weight:600;">Bonjour ${user.prenom || user.nom_utilisateur},</p>
                      <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.7;">Vous avez demandé un nouveau code de vérification.</p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 8px 0 0;">
                        <tr>
                          <td style="background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border:2px solid #22c55e;border-radius:12px;padding:24px;text-align:center;">
                            <p style="margin:0 0 8px;color:#065f46;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Votre code</p>
                            <div style="font-size:40px;font-weight:800;color:#16a34a;letter-spacing:8px;font-family:'Courier New',monospace;">${otp}</div>
                            <p style="margin:8px 0 0;color:#047857;font-size:12px;">Entrez ce code pour continuer</p>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 0;">
                        <tr>
                          <td style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:8px;padding:16px;">
                            <p style="margin:0;color:#991b1b;font-size:13px;line-height:1.6;">⏱️ Ce code expire dans <strong>5 minutes</strong>.</p>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 0;color:#64748b;font-size:13px;">Cordialement,<br/><strong style="color:#14532d;">L'équipe du Ministère des Transports</strong></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:linear-gradient(180deg,#f0fdf4 0%,#dcfce7 100%);padding:20px 40px;text-align:center;border-top:1px solid #bbf7d0;">
                      <p style="margin:0 0 6px;color:#065f46;font-size:12px;font-weight:700;">Ministère des Transports et de l'Aviation Civile</p>
                      <p style="margin:0 0 6px;color:#047857;font-size:12px;">République du Niger</p>
                      <p style="margin:0;color:#64748b;font-size:11px;">© ${new Date().getFullYear()} Email automatique – ne pas répondre.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    res.json({
      success: true,
      message: 'Nouveau code de vérification envoyé',
      expiresIn: 300
    });

  } catch (error) {
    console.error('Erreur lors du renvoi OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du nouveau code'
    });
  }
};

// REFRESH TOKEN (nouvelle route)
export const refreshToken = async (req: Request, res: Response) => {
  console.log('🔄 [REFRESH] Début du rafraîchissement du token');
  const token = req.cookies?.rt;

  if (!token) {
    console.log('❌ [REFRESH] Aucun refresh token trouvé dans les cookies');
    return res.status(401).json({ message: "No refresh token" });
  }
  console.log('🍪 [REFRESH] Refresh token reçu:', token.slice(0, 10) + '...');

  try {
    console.log('🔍 [REFRESH] Vérification du refresh token...');
    const payload = verifyRefresh(token) as any;
    console.log('✅ [REFRESH] Payload du token vérifié:', { userId: payload.userId, jti: payload.jti });

    console.log('🔍 [REFRESH] Recherche du token dans le store avec jti:', payload.jti);
    const entry = await findRefresh(payload.jti);

    if (!entry) {
      console.log('❌ [REFRESH] Token non trouvé dans le store');
      return res.status(401).json({ message: "Refresh invalidé" });
    }
    if (entry.revokedAt) {
      console.log('❌ [REFRESH] Token révoqué le:', entry.revokedAt);
      return res.status(401).json({ message: "Refresh invalidé" });
    }
    console.log('✅ [REFRESH] Token trouvé et valide dans le store');

    // Rotation
    console.log('🔄 [REFRESH] Rotation du token...');
    const accessToken = signAccessToken({ userId: entry.userId });
    const { token: newRefreshToken, jti: newJti } = signRefreshToken({ userId: entry.userId });

    await replaceRefresh(payload.jti, newJti, {
      userId: entry.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip,
    });
    console.log('✅ [REFRESH] Rotation terminée. Nouveau jti:', newJti);

    setRefreshCookie(res, newRefreshToken);
    console.log('🍪 [REFRESH] Nouveau refresh token envoyé dans le cookie');

    res.json({ accessToken });
  } catch (error) {
    console.error('❌ [REFRESH] Erreur lors du rafraîchissement:', error.message);
    return res.status(401).json({ message: "Refresh expiré ou invalide" });
  }
};

// LOGOUT (nouvelle route)
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.rt;
  if (token) {
    try {
      const payload = verifyRefresh(token) as any;
      await revokeRefresh(payload.jti, "logout");
    } catch { }
  }
  clearRefreshCookie(res);
  res.status(204).send();
};
