const express = require("express");
const multer = require("multer");
const productService = require("../service/productService");
const { route } = require("./login");
const url = require("url");
const fs = require("fs");

const router = express.Router();

// multer file storage object config
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// multer file filtering object
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// using multer middleware
router.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));


// render add-product page. This page is used to add product by seller
router.get('/add-product', (req, res) => {
    //session validation
    if (req.session.isLoggedin == 1) {
        res.render('add-product', {
            session: req.session
        });
    } else {
        res.redirect('/seller-login');
    }
});

router.post('/add-product', async (req, res) => {

    // if error occured in the uploded file
    if (!req.file) {
        res.render('add-product', { status: 'Upload a proper image !', class: 'alert alert-danger' });
    }
    // if everything runs smooth
    else {
        let product = [
            null,
            req.body.name,
            req.body.desc,
            req.body.type,
            req.body.price,
            req.body.amount,
            req.file.filename,
            req.session.userId
        ];

        let status = await productService.saveProduct(product);
        if (status) {
            res.render('add-product', { status: 'file uploded successfully !', class: 'alert alert-success', session: req.session });
        } else {
            res.render('add-product', { status: 'error occured !', class: 'alert alert-danger', session: req.session });
        }
    }
});


// get seller product by seller id
router.get('/my-products', async (req, res) => {
    if (req.session.isLoggedin == 1) {
        let products = await productService.getProductsBySellerId(req.session.userId);
        res.render('seller-products', {
            products: products,
            session: req.session
        });
    } else {
        req.session.isLoggedin = 0;
        res.redirect('/seller-login');
    }

});

// UPDATE OR EDIT PRODUCT DETAILS
router.get('/seller-product-update', async (req, res) => {
    let result = await productService.getProductsById(req.query.id);
    res.render('seller-product-update', {
        session: req.session,
        id: req.query.id,
        name: result.item_name,
        type: result.type,
        price: result.price,
        amount: result.amount,
        desc: result.item_desc,
        image: result.img_name
    });
});

router.post('/seller-product-update', async (req, res) => {
    //let result = await productService.getProductsById(req.query.id);
    let updatedFields = [
        req.body.name,
        req.body.type,
        req.body.price,
        req.body.amount,
        req.body.desc,
        req.body.id //id should be placed at the end
    ];
    let status = await productService.updateProductDetail(updatedFields);
    if (status) {
        res.redirect('/my-products');
    } else {
        res.redirect('/seller-login');
    }

});



// DELETE PRODUCT
router.get('/delete-product', async (req, res) => {

    if (req.session.isLoggedin == 1) {
        // product delete logic
        //let bookId = url.parse(req.url, true).query.id
        let product = await productService.getProductsById(req.query.id);
        let img_name = product.img_name;
        fs.unlinkSync('./images/' + img_name);
        let status = await productService.deleteProduct(req.query.id);
        res.redirect('/my-products');
    } else {
        res.redirect('/seller-login');
    }
});

module.exports = router;