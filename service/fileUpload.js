const multer = require("multer");

const storageEngine = multer.diskStorage({
    filename: (req, file, cb)=>{
        //let fileSize = file.size;
        cb(null, "" + Date.now() + file.originalname);
    },
    destination: (req, file, cb)=>{
        const fileLocation = 'C:/uploads/';
        cb(null, fileLocation);
    }
});
const maxSize = 10 * 1000 * 1000;

const upload = multer({
     storage: storageEngine,
     limits: { fileSize: maxSize },
     fileFilter: function (req, file, cb){
        
        var filetypes = /jpeg|jpg|png/;
        
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
});

module.exports = upload;

