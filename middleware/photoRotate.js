var Jimp = require("jimp");

module.exports = function(req, res, next) {
    if(req.files[0]){
        Jimp.read(req.files[0].destination + '/' + req.files[0].filename, function (err, image) {
            if (err) console.log(err);
            image.quality(60)
               .exifRotate() 
               .write(req.files[0].destination + '/' + req.files[0].filename); // save 
            
               next();
            });
    
      } else {
        next()
      }
};
