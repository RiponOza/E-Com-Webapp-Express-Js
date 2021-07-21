const express = require("express");
const bcrypt = require("bcrypt");
const sellerService = require("../service/sellerService");
const otpService = require("../service/otp");

const router = express.Router();


router.get('/forget-password', (req, res) => {
    res.render('forget-password');
});


router.post('/send-otp', async (req, res) => {
    let emailTo = req.body.emailTo;
    req.session.userId = emailTo;
    let otp = await otpService.createOtp();
    req.session.otp = otp;
    let status = await otpService.sendOtp(emailTo, otp);
    if (status) {
        // invalidate otp after 2 minutes
        setTimeout(()=>{
            req.session.otp = undefined;
        }, 120000);
        res.json({ status: true });
    } else {
        req.session.otp = undefined;
        res.json({ status: false });
    }
});


router.post('/validate-otp', (req,res)=>{
    let otp = req.body.otp;
    if(otp == req.session.otp){
        res.render('reset-password');
    } else {
        res.render('forget-password', {
            status: 'Oops, OTP is incorrect !',
            class: 'alert alert-danger'
        });
    }
});


router.post('/reset-password', async(req, res) => {
    let email = req.session.userId;
    let password = req.body.password;
    let cPassword = req.body.confirmPassword;
    let resObj;
    // data validation
    if (password == '' || cPassword == '') {
        resObj = {
            status: 'Please fill up all the fields !',
            class: 'alert alert-danger'
        }
        res.render('forget-password', resObj);
    } else if (password != cPassword) {
        resObj = {
            status: 'password and confirm-password must be same !',
            class: 'alert alert-danger'
        }
        res.render('forget-password', resObj);
    }
    else {
        let hashedPassword = await bcrypt.hash(password, 10);
        let status =await sellerService.updatePassword(email, hashedPassword);
        if (status) {
            resObj = {
                status: 'your password is updated !',
                class: 'alert alert-success'
            }
        } else {
            resObj = {
                status: 'Oops, something went wrong. Please try again !',
                class: 'alert alert-danger'
            }
        }
        res.render('seller-login', resObj);
    }
});


// this is for testing purpose
router.get('/check-otp', (req, res) => {
    res.json({ otp: req.session.otp });
});


module.exports = router;
