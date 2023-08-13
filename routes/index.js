var express = require('express');
var router = express.Router();

var passport = require('passport');
var user = require('../models/user');

/* GET root page. */
router.get('/', function(req,res,next){
    if(req.user){
        res.redirect('/home');
    }else{
        res.render('index');
    }
});

/*Path to log in*/
router.route('/login')
.get(function(req,res,next){
    if(req.user){
        res.redirect('/home');
    }else{
        res.render('user/login',{message:req.flash('error')});
    }
})
.post(passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/login',
    failureFlash:'Verifique los datos ingresados'
}));

/*Path to log out*/
router.get('/logout',function(req,res,next){
    if(req.user){
        req.logout();
    }
    res.redirect('/');
});

/*Path to sign up*/
router.route('/signup')
.get(function(req,res,next){
    if(req.user){
        res.redirect('/home');
    }else{
        res.render('user/signup',{message:req.flash('message')});
    }
})
.post(function(req,res,next){
    user.create(req.body,function(err,user){
        if(err){
            if(err.name == "UserExistsError"){
                req.flash('message',"El usuario ya existe. Intente nuevamente con otro nombre de usuario.");
                res.redirect('/signup');
            }else{
                res.send(err);
            }
        }else{
            req.login(user,function(err){
                if(err){                    
                    req.flash('error','Debe iniciar sesión');
                    res.redirect('/login');
                }else{
                    res.redirect('/home');
                }
            });
        }
    });
});

/*Path to user guide*/
router.get('/guide',function(req,res,next){
    res.status(200).download('public/Manual.pdf');
});

/*Path to HOME*/
router.get('/home', function(req,res,next){
    if(req.user){
        res.render('user/'+req.user.role,{user:req.user,message:req.flash('message')});
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');
    }
});

router.route('/home/changepassword')
.post(function(req,res,next){
    if(req.user){
        user.changePassword(req.user._id,req.body.password,function(err){
            if(err){
                res.sendStatus(500);
            }else{
                res.sendStatus(200);
            }
        });
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');
    }
});

router.route('/home/resetpassword')
.post(function(req,res,next){
    if(req.user){
        user.resetPassword(req.body.username,req.body.password,function(err){
            if(err){
                res.sendStatus(500);
            }else{
                req.flash('message','Se ha cambiado la clave para el usuario ' + req.body.username);
                res.redirect('/home');
            }
        });       
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');        
    }
});

router.route('/home/verifyuser')
.post(function(req,res,next){
    if(req.user){
        user.verifyUser(req.body.username,function(err,user){
            if(err){
                res.sendStatus(500);
            }else{
                if(user != null){
                    req.flash('message',user.name + " " + user.lastname + "(" + req.body.username + ")" 
                        + "(" + user._id + ")");
                }else{
                    req.flash('message',"El usuario (" + req.body.username + ") no existe");
                }
                res.redirect('/home');
            }
        });
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');            
    }
});

module.exports = router;
