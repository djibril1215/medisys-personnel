const express = require('express');
const router = express.Router();
const {
  createPersonnel,
  getAllPersonnel,
  getPersonnelById,
  updatePersonnel,
  deletePersonnel,
} = require('../controllers/personnelController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createPersonnel);
router.get('/', verifyToken, getAllPersonnel);
router.get('/:id', verifyToken, getPersonnelById);
router.put('/:id', verifyToken, updatePersonnel);
router.delete('/:id', verifyToken, deletePersonnel);

module.exports = router;
