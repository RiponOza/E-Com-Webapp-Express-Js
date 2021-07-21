const express = require('express');
const request = require("request");
const multer = require("multer");
const fs = require("fs");
const db = require("../util/database");


const router = express.Router();

const profileImageOrgLocation = './images/profile-pic/org';
const profileImageSmallLocation = './images/profile-pic/small';

// multer configuration for single file upload
const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, profileImageOrgLocation);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }

}

const deleteImage = (imgLocation, imgName)=>{
    let img = imgLocation + '/' + imgName;
    fs.unlink(img, (err)=>{
        console.log(img + ' === is deleted successfully.');
    });
}

// upload profile pic
router.post('/upload-profile-pic', multer(multerConfig).single('imageFile'), (req, res) => {
    // checking if user already has an image
    let sql = 'SELECT img_name FROM seller_info WHERE email = ?';

    db.query(sql, req.session.userId, (err, result) => {
        if ((result[0]!=undefined) ){
            console.log('err1==>' + err);
            console.log('file==>' + req.file);
            deleteImage(profileImageOrgLocation, req.file.filename);
            deleteImage(profileImageSmallLocation, req.file.filename);
            return res.json({ status: false });
        } else if (req.file) {
            console.log(req.file);
            let url = 'http://127.0.0.1:5000/profile-image/' + req.file.filename;
            request(url, (err, response, body) => {
                if (!err) {
                    // update image name in database
                    sql = "UPDATE seller_info SET img_name =? WHERE email =?";
                    db.query(sql, [req.file.filename, req.session.userId], (err, result) => {
                        if (err) {
                            console.log(err);
                            deleteImage(profileImageOrgLocation, req.file.filename);
                            deleteImage(profileImageSmallLocation, req.file.filename);
                            return res.json({ status: false });
                        } else {
                            return res.json({ status: true });
                        }
                    });
                } else {
                    console.log('err2==>' + err);
                    deleteImage(profileImageOrgLocation, req.file.filename);
                    deleteImage(profileImageSmallLocation, req.file.filename);
                    return res.json({ status: false });
                }
            });

        } else {
            console.log('err3==>' + err);
            deleteImage(profileImageOrgLocation, req.file.filename);
            deleteImage(profileImageSmallLocation, req.file.filename);
            return res.json({ status: false });
        }

    });

});




module.exports = router;