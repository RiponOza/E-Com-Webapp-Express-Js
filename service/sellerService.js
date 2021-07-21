const db = require('../util/database');

// save seller in the database.
const addSeller = (seller)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'insert into seller_info values(?,?,?,?,?,?,?,?,?,?)';
        db.query(sql, seller, (err, result)=>{
            if(err){
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}


const isSellerPresent = (email)=>{
    return new Promise((resolve, reject)=>{
        let sql = "select * from seller_info where email=?";
        db.query(sql, email, (err, results)=>{
            if(!err){
                if(results.length == 0){
                    resolve(false);
                } else {
                    resolve(true);
                }
            } else {
                resolve(true);
            }
        });
    });
}


const getSeller = (email)=>{
    let query = "select * from seller_info where email=?";
    return new Promise((resolve, reject)=>{
        db.query(query, [email], (err, results)=>{
            if(!err){
                resolve(results[0]);
            } else {
                reject(false);
            }
        });
    });
}


const updateSeller = (updatedData)=>{
    let query = "update seller_info set name=?, address=?, country=?, state=?, district=?, pin=?, phone=? where email=?";
    return new Promise((resolve, reject)=>{
        db.query(query, updatedData, (err, results)=>{
            if(!err){
                resolve(true);
            } else {
                console.log('==============');
                console.log(err);
                resolve(false);
            }
        });
    });
}


const updatePassword = (userId, newPassword)=>{
    let query = "update seller_info set password=? where email=?";
    return new Promise((resolve, reject)=>{
        db.query(query, [newPassword, userId], (err, results)=>{
            if(!err){
                resolve(true);
            } else {
                reject(false);
            }
        });
    });
}


module.exports = {addSeller, isSellerPresent, getSeller, updateSeller, updatePassword};