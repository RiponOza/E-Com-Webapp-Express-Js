const express = require('express');
const session = require('express-session');
const sellerService = require('../service/sellerService');
const Auth = require("../middleware/auth");


const router = express.Router()

// render seller dashboard for logged in seller
router.get('/seller-dashboard', Auth, async (req, res) => {
    let seller = await sellerService.getSeller(req.session.userId);
    res.render('seller-dashboard', {
        image: req.session.image,
        class: 'alert alert-success',
        session: req.session
    });
});

module.exports = router;