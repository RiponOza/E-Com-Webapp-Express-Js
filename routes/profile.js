const express = require("express");
const sellerService = require("../service/sellerService");


const router = express.Router();

// show profile
router.get('/seller-profile', async(req,res)=>{
    let seller = await sellerService.getSeller(req.query.id);
    if(seller){
        res.render('seller-profile',{
            email: seller.email,
            name: seller.name,
            address: seller.address,
            country: seller.country,
            state: seller.state,
            district: seller.district,
            pin: seller.pin,
            phone: seller.phone,
            image: seller.img_name
        });
        //res.send(status);
    } else {
        res.redirect('/seller-login');
    }
});

// show profile
router.get('/edit-profile', async(req,res)=>{
    let seller = await sellerService.getSeller(req.query.id);
    if(seller){
        res.render('seller-profile-edit',{
            name: seller.name,
            address: seller.address,
            country: seller.country,
            state: seller.state,
            district: seller.district,
            pin: seller.pin,
            phone: seller.phone
            //image: seller.img_name
        });
    } else {
        res.redirect('/seller-login');
    }
});
router.post('/edit-profile', async(req,res)=>{
       let updatedData = [
            req.body.name,
            req.body.address,
            req.body.country,
            req.body.state,
            req.body.district,
            req.body.pin,
            req.body.phone,
            req.session.userId
            //seller.img_name
       ]
        let status = await sellerService.updateSeller(updatedData);
        if(status){
            res.render('seller-dashboard',{
                session: req.session,
                status: 'Your profile is updated !',
                class: 'alert alert-success'
            });
        } else {
            res.render('seller-dashboard',{
                session: req.session,
                status: 'Oops.. Something went wrong !',
                class: 'alert alert-danger'
            });
        }
});


module.exports = router;