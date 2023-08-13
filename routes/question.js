var express = require('express');
var router = express.Router();

var question = require('../models/question');

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
    res.render('question/app');
});

router.get('/bank',function(req,res,next){
    res.render('question/bank');
});

router.get('/:type/view',function(req,res,next){
    res.render('question/app');
});

router.route('/:type/form')
.get(function(req,res,next){
    res.render('question/app');
})
.post(function(req,res,next){
    question.create(req.body.question,req.user._id,function(err,saved){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

router.get('/template/:type/:view',function(req,res,next){
    res.render('question/'+req.params.type+'/'+req.params.view);
});

router.get('/data',function(req,res,next){
    question.getUserBank(req.user._id,function(err,bank){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(bank);
        }
    });
});

router.route('/data/:id')
.get(function(req,res,next){
    question.getQuestion(req.params.id,function(err,question){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(question);
        }
    });
})
.put(function(req,res,next){
    question.update(req.body.question,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
})
.delete(function(req,res,next){
    question.delete(req.params.id,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

module.exports = router;