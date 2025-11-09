import { Request, Response } from 'express';
import pool from '../db';

// Get all news articles
export const getNews = async (req: Request, res: Response) => {
  try {
    const allNews = await pool.query('SELECT * FROM actualites ORDER BY date_creation DESC');
    res.json(allNews.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single news article
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = await pool.query('SELECT * FROM actualites WHERE id = $1', [id]);

    if (news.rows.length === 0) {
      return res.status(404).json({ msg: 'Article d\'actualité non trouvé' });
    }

    res.json(news.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new news article
export const createNews = async (req: Request, res: Response) => {
  try {
    const { titre, contenu, url_image, active = true, cree_par } = req.body;

    if (!titre || !contenu) {
        return res.status(400).json({ msg: 'Le titre et le contenu sont obligatoires.' });
    }

    const newNews = await pool.query(
      'INSERT INTO actualites (titre, contenu, url_image, active, cree_par) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titre, contenu, url_image, active, cree_par]
    );

    res.status(201).json(newNews.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a news article
export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titre, contenu, url_image, active } = req.body;

    if (!titre || !contenu) {
        return res.status(400).json({ msg: 'Le titre et le contenu sont obligatoires.' });
    }

    const updatedNews = await pool.query(
      'UPDATE actualites SET titre = $1, contenu = $2, url_image = $3, active = $4, date_modification = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [titre, contenu, url_image, active, id]
    );

    if (updatedNews.rows.length === 0) {
      return res.status(404).json({ msg: 'Article d\'actualité non trouvé' });
    }

    res.json(updatedNews.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a news article
export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query('DELETE FROM actualites WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rowCount === 0) {
        return res.status(404).json({ msg: 'Article d\'actualité non trouvé' });
    }

    res.json({ msg: 'Article d\'actualité supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
