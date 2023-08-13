var express = require('express');
var router = express.Router();

var assessment = require('../models/assessment');
var record = require('../models/record');

var gradeQuestion = function(type,max_score,assessment,student){
    var correct = 0;
    var total = 0;
    var score = 0;
    var penality = 0;

    switch(type){
        case 'matching':
            if(student.ans){
                var s_total = 0;
                assessment.categories.forEach(function(category,c_index){
                    total += category.objects.length;
                    s_total += student.ans[c_index].objects.length;
                    
                    category.objects.forEach(function(item){
                        for(var i=0; i<student.ans[c_index].objects.length; i++){
                            if(item.index == student.ans[c_index].objects[i].index){
                                student.ans[c_index].objects[i].correct = true;
                                correct += 1;
                            }
                        }
                    });
                });
                
                if(s_total > total){
                    if(correct > 1){
                        penality = (max_score / total) * (s_total - total);
                    }
                }
            }
            break;
        case 'multiplechoice':
            if(student.ans){
                total = assessment.answers.length;
                assessment.answers.forEach(function(item){
                    for(var i=0; i<student.ans.length; i++){
                        if(item.index == student.ans[i].index){
                            student.ans[i].correct = true;
                            correct += 1;
                        }
                    }
                });

                if(student.ans.length > assessment.answers.length){
                    if(correct > 0){
                        penality = (max_score / assessment.options.length) * (student.ans.length - correct);
                    }
                }
            }
            break;
        case 'sorting':
            if(student.ans){
                total = assessment.answer.length;
                for(var i=0; i<assessment.answer.length; i++){
                    if(assessment.answer[i].index == student.ans[i].index){
                        student.ans[i].correct = true;
                        correct += 1;
                    }
                }
            }
            break;
        case 'true-false':
            if(student.ans){
                total = assessment.true.length + assessment.false.length;;
                assessment.true.forEach(function(item){
                    for(var i=0; i<student.ans.true.length; i++){
                        if(item.index == student.ans.true[i].index){
                            student.ans.true[i].correct = true;
                            correct += 1;
                        }
                    }
                });
                assessment.false.forEach(function(item){
                    for(var i=0; i<student.ans.false.length; i++){
                        if(item.index == student.ans.false[i].index){
                             student.ans.false[i].correct = true;
                            correct += 1;
                        }
                    }
                });
            }
            break;
    }
    
    if(total != 0){
        score = ((correct * max_score) / total) - penality;
    }
    return(score);
}

router.use(function(req,res,next){
    if(req.user){
        next();
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');
    }
});

router.get('/', function(req,res,next){
    res.render('presentation/app');
});

router.get('/summary',function(req,res,next){
    res.render('presentation/app');
});

router.get('/question/:type',function(req,res,next){
    res.render('presentation/app');
});

router.get('/assessments',function(req,res,next){
    assessment.getAllAssessments(function(err,list){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(list);
        }
    });
});

router.get('/assessment/data/:id',function(req,res,next){
    assessment.getAssessmentForPresentation(req.params.id,function(err,assessment){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(assessment);
        }
    });
});

router.route('/record/:id')
.get(function(req,res,next){
    record.isAssessmentSolved(req.params.id,req.user._id,function(err,data){
        if(err){
            res.sendStatus(500);
        }else{
            if(data.length > 0){
                res.status(200).send(true);
            }else{
                res.status(200).send(false);
            }
        }
    });
})
.post(function(req,res,next){
    assessment.getAssessment(req.params.id,function(err,assessment){
        if(err){
            res.sendStatus(500);
        }else{
            var score = 0;
            var questions = assessment.questions;
            var parameters = assessment.parameters;
            var answers = req.body.answers;
            var t_goals = [];
            var goals = [];

            for(var i=0; i<assessment.goals.length; i++){
                t_goals.push({max_score:0,score:0});
            }

            for(var q=0; q<questions.length; q++){
                if(questions[q].type == 'common-base'){
                    for(var s=0; s<questions[q].questions.length; s++){
                        var isAdded = false;

                        answers[q][s].score = 0;
                        var s_score = Math.floor(gradeQuestion(questions[q].questions[s].type,parameters[q][s].score,questions[q].questions[s].body,answers[q][s])*10)/10;
                        score += s_score;
                        answers[q][s].score = s_score;
                        delete answers[q][s].status;

                        for(var g=0; g<parameters[q][s].goals.length; g++){
                            t_goals[parameters[q][s].goals[g]].max_score += parameters[q][s].score;
                            t_goals[parameters[q][s].goals[g]].score += s_score;
                        }
                    }
                }else{
                    answers[q].score = 0;
                    var q_score = Math.floor(gradeQuestion(questions[q].type,parameters[q].score,questions[q].body,answers[q])*10)/10;                    
                    score += q_score;
                    answers[q].score = q_score;
                    delete answers[q].status;

                    for(var g=0; g<parameters[q].goals.length; g++){
                        t_goals[parameters[q].goals[g]].max_score += parameters[q].score;
                        t_goals[parameters[q].goals[g]].score += q_score;
                    }
                }
            }

            for(var g=0; g<t_goals.length; g++){
                goals.push(Math.floor((t_goals[g].score * 100 / t_goals[g].max_score)*10)/10);
            }
        
            record.create(req.params.id,req.user._id,Math.floor(score*10)/10,answers,goals,function(err){
                if(err){
                    res.sendStatus(500);
                }else{
                    res.sendStatus(200);
                }
            });
        }
    });
});

router.get('/template/:view',function(req,res,next){
    if(req.params.view == 'list' || req.params.view == 'summary'){
        res.render('presentation/'+req.params.view);
    }else{
        res.render('question/' + req.params.view + '/template');
    }
});

module.exports = router;
