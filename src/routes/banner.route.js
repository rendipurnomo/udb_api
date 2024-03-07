const express = require('express');
const { getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner } = require('../controllers/banner.controller.js');

const router = express.Router();

router.get('/', getAllBanners);
router.get('/:id', getBannerById);
router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router