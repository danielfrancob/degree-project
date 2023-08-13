var express = require('express');
var router = express.Router();

var multer = require('multer');
var crypto = require('crypto');
var fs = require('fs');

var gallery = require('../models/gallery');
var user = require('../models/user');

/*Set filenames and extensions*/
var storage = multer.diskStorage({
    destination:function(req,file,callback){
        var route = "";
        if(req.app.get('mode') == 'remote'){
            route = process.env.OPENSHIFT_DATA_DIR + '/galleries';
        }else{
            route = 'public/galleries';
        }
        callback(null,route);
    },
    filename:function(req,file,callback){
        crypto.pseudoRandomBytes(10,function(err,raw){
            if(err){
                callback(err);
            }else{
                var name = raw.toString('hex') + '.' + file.originalname.split('.').pop();
                callback(null,name);
            }
        });
    }
});

var upload = multer({storage:storage});

router.use(function(req,res,next){
    if(req.user){
        next();
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');
    }
});

/*GET ROOT page*/
router.get('/',function(req,res,next){
    res.render('gallery/app');
});

router.get('/template/:template',function(req,res,next){
    res.render('gallery/'+req.params.template);
});

router.get('/data',function(req,res,next){
    gallery.getUserGallery(req.user._id,function(err,gallery){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(gallery);
        }
    });
});

router.get('/edit',function(req,res,next){
    res.render('gallery/app');
});

router.route('/data/:id')
.get(function(req,res,next){
    gallery.getItem(req.params.id,function(err,item){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(item);
        }
    });
})
.put(function(req,res,next){
    gallery.update(req.body.item,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
})
.delete(function(req,res,next){
    gallery.delete(req.params.id,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

router.route('/upload/text')
.get(function(req,res,next){
    res.render('gallery/app');
})
.post(function(req,res,next){
    req.body.item.type="text";
    gallery.create(req.body.item,req.user._id,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

router.route('/upload/files')
.get(function(req,res,next){
    res.render('gallery/app');
})
.post(upload.single('file'),function(req,res,next){
    var data = {
        name:req.body.customName,
        type:req.file.mimetype.split('/')[0],
        path:req.file.path,
        url:'/galleries/' + req.file.filename
    }

    if(req.app.get('mode') == 'remote'){
        fs.writeFileSync(
            process.env.OPENSHIFT_REPO_DIR + '/public/galleries/' + req.file.filename,
            fs.readFileSync(data.path)
        );
    }

    gallery.create(data,req.user._id,function(err){
        if(err){
            res.send(err);
        }else{
            res.send('ok');
        }
    })
});

module.exports = router;
