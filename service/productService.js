const db = require("../util/database");

const saveProduct = (product)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'insert into seller_item_info values(?,?,?,?,?,?,?,?)';
        db.query(sql, product, (err, results)=>{
            if(err){
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

const getProductsBySellerId = (sellerId)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'select * from seller_item_info where seller_id=?';
        db.query(sql, sellerId, (err, results)=>{
            if(err){
                console.log('error ==> ' + err);
                resolve(false);
            } else {
                resolve(results);
            }
        })
    });
}

const getProductsById = (productId)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'select * from seller_item_info where id=?';
        db.query(sql, [productId], (err, results)=>{
            if(err){
                resolve(false);
            } else {
                resolve(results[0]);
            }
        })
    });
}

const deleteProduct = (id)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'delete from seller_item_info where id=?';
        db.query(sql, [id], (err, results)=>{
            if(err){
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

const updateProductDetail = (newProductDetail)=>{
    return new Promise((resolve, reject)=>{
        let sql = 'update seller_item_info set item_name=?, type=?, price=?, amount=?, item_desc=? where id=?';
        db.query(sql, newProductDetail, (err, results)=>{
            if(err){
                console.log(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

module.exports = {saveProduct, getProductsById, getProductsBySellerId, deleteProduct, updateProductDetail};