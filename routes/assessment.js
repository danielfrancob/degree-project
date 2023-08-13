var express = require('express');
var router = express.Router();

var assessment = require('../models/assessment');

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
    res.render('assessment/app');
});

router.route('/form')
.get(function(req,res,next){
    res.render('assessment/app');
})
.post(function(req,res,next){
    assessment.create(req.body.assessment,req.user._id,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

router.get('/view',function(req,res,next){
    res.render('assessment/app');
});

router.get('/template/:template',function(req,res,next){
    res.render('assessment/'+req.params.template);
});

router.get('/data',function(req,res,next){
    assessment.getAssessmentBank(req.user._id,function(err,bank){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(bank);
        }
    });
});

router.route('/data/:id')
.get(function(req,res,next){
    assessment.getAssessment(req.params.id,function(err,data){
        if(err){
            res.sendStatus(500);
        }else{
            var assessment = JSON.parse(JSON.stringify(data));
            var questions = assessment.questions;
            assessment.questions = [];

            for(var i=0; i<questions.length; i++){
                if(questions[i].type == "common-base"){
                    var question_data =questions[i];
                    for(var j=0; j<question_data.questions.length; j++){
                        question_data.questions[j].score = assessment.parameters[i][j].score;
                        question_data.questions[j].goals = [];
                        for(var k=0; k<assessment.parameters[i][j].goals.length; k++){
                            question_data.questions[j].goals.push(assessment.goals[assessment.parameters[i][j].goals[k]]);
                        }
                    }
                    assessment.questions.push({question:question_data});
                }else{
                    var question_data = {
                        question:questions[i],
                        goals:[],
                        score:assessment.parameters[i].score
                    }
                    for(var j=0; j<assessment.parameters[i].goals.length; j++){
                        question_data.goals.push(assessment.goals[assessment.parameters[i].goals[j]]);
                    }
                    assessment.questions.push(question_data);
                }
            }
            res.status(200).send(assessment);
        }
    });
})
.put(function(req,res,next){
    assessment.update(req.body.assessment,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
})
.delete(function(req,res,next){
    assessment.delete(req.params.id,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

module.exports = router;