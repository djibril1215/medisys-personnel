const pool = require('../config/db');

const createPersonnel = async (req, res) => {
  const { nom, prenom, email, telephone, poste, role, equipe, date_embauche } = req.body;
  const hopital_id = req.user.hopital_id;

  if (!nom || !prenom || !email) {
    return res.status(400).json({ message: 'Nom, prénom et email sont requis.' });
  }

  if (!hopital_id) {
    return res.status(403).json({ message: "Votre compte n'est rattache a aucun hopital." });
  }

  try {
    const existing = await pool.query('SELECT id FROM personnel WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Un membre du personnel avec cet email existe déjà.' });
    }

    const newPersonnel = await pool.query(
      `INSERT INTO personnel (nom, prenom, email, telephone, poste, role, equipe, date_embauche, hopital_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nom, prenom, email, telephone, poste, role || 'personnel', equipe, date_embauche, hopital_id]
    );

    res.status(201).json({ message: 'Membre du personnel créé avec succès.', personnel: newPersonnel.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création.' });
  }
};

const getAllPersonnel = async (req, res) => {
  const hopital_id = req.user.hopital_id;

  try {
    const result = await pool.query(
      'SELECT * FROM personnel WHERE hopital_id = $1 ORDER BY created_at DESC',
      [hopital_id]
    );
    res.status(200).json({ personnel: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération.' });
  }
};

const getPersonnelById = async (req, res) => {
  const { id } = req.params;
  const hopital_id = req.user.hopital_id;

  try {
    const result = await pool.query(
      'SELECT * FROM personnel WHERE id = $1 AND hopital_id = $2',
      [id, hopital_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Membre du personnel non trouvé dans votre etablissement.' });
    }

    res.status(200).json({ personnel: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const updatePersonnel = async (req, res) => {
  const { id } = req.params;
  const hopital_id = req.user.hopital_id;
  const { nom, prenom, email, telephone, poste, role, equipe, date_embauche } = req.body;

  try {
    const result = await pool.query(
      `UPDATE personnel SET nom = $1, prenom = $2, email = $3, telephone = $4,
       poste = $5, role = $6, equipe = $7, date_embauche = $8, updated_at = NOW()
       WHERE id = $9 AND hopital_id = $10 RETURNING *`,
      [nom, prenom, email, telephone, poste, role, equipe, date_embauche, id, hopital_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Membre du personnel non trouvé dans votre etablissement.' });
    }

    res.status(200).json({ message: 'Mis à jour avec succès.', personnel: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
};

const deletePersonnel = async (req, res) => {
  const { id } = req.params;
  const hopital_id = req.user.hopital_id;

  try {
    const result = await pool.query(
      'DELETE FROM personnel WHERE id = $1 AND hopital_id = $2 RETURNING *',
      [id, hopital_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Membre du personnel non trouvé dans votre etablissement.' });
    }

    res.status(200).json({ message: 'Supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
};

module.exports = { createPersonnel, getAllPersonnel, getPersonnelById, updatePersonnel, deletePersonnel };
