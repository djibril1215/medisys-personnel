const express = require('express');
const router = express.Router();
const {
  createPersonnel,
  getAllPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel,
  createPersonnelFromAuth,
  deletePersonnelByUserId,
} = require('../controllers/personnelController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createPersonnel);
router.get('/', verifyToken, getAllPersonnel);
router.get('/:id', verifyToken, getPersonnelById);
router.put('/:id', verifyToken, updatePersonnel);
router.delete('/:id', verifyToken, deletePersonnel);

// Routes internes - utilisees uniquement par medisys-auth (protegees par le meme token JWT)
router.post('/internal/from-auth', verifyToken, createPersonnelFromAuth);
router.delete('/internal/by-user/:user_id', verifyToken, deletePersonnelByUserId);

module.exports = router;
