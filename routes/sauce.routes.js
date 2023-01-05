const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauce.controller');

const auth = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer-config');


router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likeSauce);
router.post('/:id/dislike', auth, saucesCtrl.dislikeSauce);

module.exports = router;