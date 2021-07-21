const express = require("express");
const bcrypt = require("bcrypt");
//const otp = require("../service/otp");
const sellerService = require("../service/sellerService");

const router = express.Router();

// INDEX PAGE
router.get('/', (req, res, next)=>{
    res.render('index');
});

// SELLER LOGIN START //
router.get('/seller-login', (req, res, next)=>{
        if(req.session.isLoggedin == 1){
            res.redirect('/seller-dashboard');
            return;
        }
        res.render('seller-login');
});

router.post('/seller-login', async(req, res, next)=>{
    let seller = await sellerService.getSeller(req.body.email);

    if((seller != undefined) && (req.body.email == seller.email) && (await bcrypt.compare(req.body.password, seller.password))){
        // setting session object
        req.session.isLoggedin = 1;
        req.session.userId = req.body.email;
        req.session.image = seller.img_name;
        res.render('seller-dashboard', {
            status: 'Hello, ' + seller.name + ".",
            class: 'alert alert-success', 
            session: req.session
        });
    } else {
        req.session.isLoggedin = 0;
        res.render('seller-login', {status: 'oops, your user name or password is incorrect !', class: 'alert alert-danger'});
    }
    
});
// SELLER LOGIN ENDS //


// BUYER LOGIN START //
router.get('/buyer-login', (req, res, next)=>{
    res.render('buyer-login');
});

router.post('/buyer-login', async(req, res, next)=>{
    let user = await userService.getUser(req.body.email);

    if((user != undefined) && (req.body.email == user.email) && (await bcrypt.compare(req.body.password, user.password))){
        // setting session object
        req.session.isLoggedin = 2;
        res.redirect('/library');
    } else {
        req.session.isLoggedin = 0;
        res.render('buyer-login', {status: 'oops, your user name or password is incorrect !', class: 'alert alert-danger'});
    }
    
});
// BUYER LOGIN END //


// SELLER LOGOUT
router.get('/seller-logout', (req,res)=>{
    req.session.isLoggedin=undefined;
    req.session.userId=undefined;
    req.session.image=undefined;
    res.render('seller-login', {status: 'Succesfully logged out !', class: 'alert alert-success'});

});


router.get('/logout', (req, res)=>{
    req.session = undefined;
    res.render('login', {status: 'Succesfully logged out !', class: 'alert alert-success'});
});

module.exports = router;