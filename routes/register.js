const express = require("express");
const bcrypt = require("bcrypt");
const sellerService = require("../service/sellerService");
const email = require("../service/email");
const fileUpload = require("../service/fileUpload");

const router = express.Router();

// seller register
router.get('/seller-register', (req, res, next)=>{
    res.render('seller-register');
});


router.post('/seller-register' , async(req,res)=>{
    try{
        // data validation
        // check if user is present
        let userStatus = await sellerService.isSellerPresent(req.body.email);
        if(userStatus == true){
            res.render('seller-register', {status: 'Email address is already registered !', class: 'alert alert-danger'});
        }
        // check if password and confirm password is same
        else if(req.body.c_password != req.body.password){
            res.render('seller-register', {status: 'password and confirm password must be same !', class: 'alert alert-danger'});
        } 
        // checking for null inputs
        else if(req.body.email==null || req.body.name==null || req.body.country == '#' || req.body.state == null || req.body.district == null || req.body.pin == null || req.body.phone == null){
            res.render('seller-register', {status: 'you must fill all the fields !', class: 'alert alert-danger'});
        }
        else {
            let hashedPassword = await bcrypt.hash(req.body.password, 10);
            
            let seller = [
            req.body.email,
            req.body.name,
            req.body.address,
            req.body.country,
            req.body.state,
            req.body.district,
            req.body.pin,
            req.body.phone,
            null, // setting img name as null for the form. later will fill it.
            hashedPassword ];
            
            let emailSubject = 'Hello From ECom Elites !';
            let emailText = `Hello, ${req.body.name}. Thank you for joining us as a seller. Hope your journey with us will be awesome !`;
            let status = sellerService.addSeller(seller); 
            
            if(status){
                req.session.isLoggedin = 1;
                req.session.userId = req.body.email;
                email.sendEmail(emailSubject, emailText);
                res.render('seller-dashboard', {
                    status: 'successfully regestered !', 
                    class: 'alert alert-success',
                    session: req.session
                });
            } else {
                req.session.isLoggedin = 0;
                req.session.userId = null;
                res.redirect('/seller-login');
            }
        }

    } catch(err){
        res.render('register', { status: 'oops, something went wrong !', class: 'alert alert-danger' });
    }
});


// for image upload
router.post('/upload', (req,res)=>{
   res.render('image-upload');
});
router.post('/uploadimage', fileUpload.single('image'), (req,res)=>{
    try{
        //console.log(req.file);
        console.log('successfully uploaded !');
        res.redirect('/library');
    }catch{
        res.redirect('/login');
    }
});
router.post('/multi', fileUpload.array('images', 3), (req,res)=>{
    //console.log(req.file);
    res.send('successfully uploaded multiple files!');
});


module.exports = router;
