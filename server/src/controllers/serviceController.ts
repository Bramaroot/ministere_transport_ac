import { Request, Response } from 'express';
import pool from '../db.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UploadedFiles {
    [fieldname: string]: Express.Multer.File[];
}

export const submitPermisInternational = async (req: Request, res: Response) => {
    const client = await pool.connect();
    const codeSuivi = crypto.randomBytes(16).toString('hex').slice(0, 16).match(/.{1,4}/g)?.join('-') || '';
    const tempFilePaths: string[] = [];
    const finalUploadDir = path.join(__dirname, `../../private_uploads/permis_international/${codeSuivi}`);

    try {
        await client.query('BEGIN');

        const { nom, prenom, email, telephone } = req.body;
        if (!nom || !prenom) {
            return res.status(400).json({ message: "Le nom et le prénom sont requis." });
        }

        const files = req.files as UploadedFiles;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ message: "Aucun fichier n'a été uploadé." });
        }

        await fs.mkdir(finalUploadDir, { recursive: true });

        const filePaths: { [key: string]: string | string[] } = {};
        
        const sanitizeFilename = (name: string) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_.]/gi, '_').toLowerCase();
        const applicantName = sanitizeFilename(`${prenom}_${nom}`);
        const submissionDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        for (const field in files) {
            const fieldFiles = files[field];
            if (fieldFiles.length > 0) {
                if (field === 'photos_identite') {
                    const photoPaths = [];
                    for (let i = 0; i < fieldFiles.length; i++) {
                        const file = fieldFiles[i];
                        const pieceName = sanitizeFilename(`${field}_${i + 1}`);
                        const extension = path.extname(file.originalname);
                        const newFilename = `${applicantName}-${pieceName}-${submissionDate}${extension}`;

                        // Avec memoryStorage, utiliser file.buffer au lieu de file.path
                        const finalPath = path.join(finalUploadDir, newFilename);
                        await fs.writeFile(finalPath, file.buffer);
                        tempFilePaths.push(finalPath);
                        photoPaths.push(`permis_international/${codeSuivi}/${newFilename}`);
                    }
                    filePaths[field] = photoPaths;
                } else {
                    const file = fieldFiles[0];
                    const pieceName = sanitizeFilename(field);
                    const extension = path.extname(file.originalname);
                    const newFilename = `${applicantName}-${pieceName}-${submissionDate}${extension}`;

                    // Avec memoryStorage, utiliser file.buffer au lieu de file.path
                    const finalPath = path.join(finalUploadDir, newFilename);
                    await fs.writeFile(finalPath, file.buffer);
                    tempFilePaths.push(finalPath);
                    filePaths[field] = `permis_international/${codeSuivi}/${newFilename}`;
                }
            }
        }

        const query = `
            INSERT INTO demandes_permis_international 
            (code_suivi, nom, prenom, email, telephone, path_demande_manuscrite, path_timbre_fiscal, path_copie_permis_national, path_copie_ancien_permis, paths_photos_identite)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `;
        
        const values = [
            codeSuivi,
            nom,
            prenom,
            email || null,
            telephone || null,
            filePaths['demande_manuscrite'] || null,
            filePaths['timbre_fiscal'] || null,
            filePaths['copie_permis_national'] || null,
            filePaths['copie_ancien_permis'] || null,
            filePaths['photos_identite'] ? JSON.stringify(filePaths['photos_identite']) : null
        ];

        await client.query(query, values);
        await client.query('COMMIT');

        res.status(201).json({ 
            message: 'Votre demande a été soumise avec succès.',
            codeSuivi: codeSuivi 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Erreur lors de la soumission de la demande de permis international:", error);

        // Nettoyage des fichiers
        try {
            if (await fs.stat(finalUploadDir)) {
                await fs.rm(finalUploadDir, { recursive: true, force: true });
            }
            // Nettoyer aussi les fichiers temporaires restants si le déplacement a échoué
            for (const file of (req.files as UploadedFiles | undefined)? Object.values(req.files).flat() : []) {
                await fs.unlink(file.path).catch(() => {});
            }
        } catch (cleanupError) {
            console.error("Erreur lors du nettoyage des fichiers:", cleanupError);
        }

        res.status(500).json({ message: 'Erreur interne du serveur.' });
    } finally {
        client.release();
    }
};

export const getPermisInternationalStatus = async (req: Request, res: Response) => {
    const { codeSuivi } = req.params;

    try {
        const result = await pool.query(
            'SELECT status, created_at, updated_at FROM demandes_permis_international WHERE code_suivi = $1',
            [codeSuivi]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Demande non trouvée.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération du statut de la demande:", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

// ====================================================================
// ADMIN-SPECIFIC CONTROLLERS
// ====================================================================

export const getAllPermisInternational = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            'SELECT id, code_suivi, nom, prenom, status, created_at FROM demandes_permis_international ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        const totalResult = await pool.query('SELECT COUNT(*) FROM demandes_permis_international');
        const total = parseInt(totalResult.rows[0].count, 10);

        res.status(200).json({
            data: result.rows,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de toutes les demandes de permis international:", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const getPermisInternationalById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM demandes_permis_international WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Demande non trouvée.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération de la demande par ID:", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const updatePermisInternationalStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Le statut est requis.' });
    }

    try {
        const result = await pool.query(
            'UPDATE demandes_permis_international SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Demande non trouvée.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de la demande:", error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
};

export const getPrivateDocument = async (req: Request, res: Response) => {
    const { codeSuivi, fileName } = req.params;

    try {
        // On ne vérifie pas la DB pour ne pas surcharger, on fait confiance au middleware admin
        // et on assume que le codeSuivi et fileName sont corrects.
        const filePath = path.join(__dirname, `../../private_uploads/permis_international/${codeSuivi}/${fileName}`);

        res.download(filePath, (err) => {
            if (err) {
                console.error("Erreur lors du téléchargement du fichier:", err);
                if (!res.headersSent) {
                    res.status(404).send('Fichier non trouvé.');
                }
            }
        });
    } catch (error) {
        console.error("Erreur inattendue dans getPrivateDocument:", error);
        if (!res.headersSent) {
            res.status(500).send('Erreur interne du serveur.');
        }
    }
};
