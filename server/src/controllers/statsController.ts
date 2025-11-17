import { Request, Response } from 'express';
import pool from '../db.js';

export const getStats = async (req: Request, res: Response) => {
  try {
    console.log('Début de la récupération des statistiques...');
    
    // Récupérer le nombre d'articles
    console.log('Récupération du nombre d\'articles...');
    const articlesResult = await pool.query(
      'SELECT COUNT(*) as count FROM actualites WHERE active = $1',
      [true]
    );
    const articlesCount = parseInt(articlesResult.rows[0].count);
    console.log('Nombre d\'articles:', articlesCount);

    // Récupérer le nombre d'appels d'offres
    console.log('Récupération du nombre d\'appels d\'offres...');
    const tendersResult = await pool.query(
      'SELECT COUNT(*) as count FROM appels_offres WHERE statut = $1',
      ['publie']
    );
    const tendersCount = parseInt(tendersResult.rows[0].count);
    console.log('Nombre d\'appels d\'offres:', tendersCount);

    // Récupérer le nombre d'événements
    console.log('Récupération du nombre d\'événements...');
    const eventsResult = await pool.query(
      'SELECT COUNT(*) as count FROM evenements WHERE statut = $1',
      ['publie']
    );
    const eventsCount = parseInt(eventsResult.rows[0].count);
    console.log('Nombre d\'événements:', eventsCount);

    // Récupérer le nombre d'utilisateurs
    console.log('Récupération du nombre d\'utilisateurs...');
    const usersResult = await pool.query(
      'SELECT COUNT(*) as count FROM utilisateurs'
    );
    const usersCount = parseInt(usersResult.rows[0].count);
    console.log('Nombre d\'utilisateurs:', usersCount);

    // Récupérer les articles récents
    console.log('Récupération des articles récents...');
    const recentArticlesResult = await pool.query(
      'SELECT id, titre, date_creation, active as statut FROM actualites ORDER BY date_creation DESC LIMIT 5'
    );
    console.log('Articles récents récupérés:', recentArticlesResult.rows.length);

    // Récupérer les appels d'offres récents
    console.log('Récupération des appels d\'offres récents...');
    const recentTendersResult = await pool.query(
      'SELECT id, titre, date_creation, statut FROM appels_offres ORDER BY date_creation DESC LIMIT 5'
    );
    console.log('Appels d\'offres récents récupérés:', recentTendersResult.rows.length);

    // Récupérer les événements récents
    console.log('Récupération des événements récents...');
    const recentEventsResult = await pool.query(
      'SELECT id, titre, date_creation, statut FROM evenements ORDER BY date_creation DESC LIMIT 5'
    );
    console.log('Événements récents récupérés:', recentEventsResult.rows.length);

    const stats = {
      articles: articlesCount,
      tenders: tendersCount,
      events: eventsCount,
      users: usersCount,
      recentArticles: recentArticlesResult.rows,
      recentTenders: recentTendersResult.rows,
      recentEvents: recentEventsResult.rows,
    };

    console.log('Statistiques finales:', stats);
    console.log('Envoi de la réponse...');

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
    });
  }
};
