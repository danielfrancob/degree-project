var express = require('express');
var router = express.Router();

var assessment = require('../models/assessment');
var record = require('../models/record');

var Excel = require('exceljs');

router.use(function(req,res,next){
    if(req.user){
        next();
    }else{
        req.flash('error','Debe iniciar sesión');
        res.redirect('/login');
    }
});

router.get('/',function(req,res,next){
    res.render('record/'+req.user.role+'App');
});

router.get('/assessment',function(req,res,next){
    res.render('record/'+req.user.role+'App');
});

router.get('/assessment/student',function(req,res,next){
    res.render('record/'+req.user.role+'App');
});

router.get('/template/:view',function(req,res,next){
    res.render('record/'+req.params.view);
});

router.get('/student/list',function(req,res,next){
    record.getStudentRecords(req.user._id,function(err,data){
        if(err){
            res.sendStatus(500);
        }else{
            res.status(200).send(data);
        }
    });
});

router.put('/assessment/:id',function(req,res,next){
    assessment.setViewRecord(req.params.id,req.body.status,function(err){
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
});

router.get('/data/student/:id',function(req,res,next){
    record.getRecordForStudent(req.params.id,function(err,data){
        if(err){
            res.sendStatus(500);
        }else{
            var st_data = JSON.parse(JSON.stringify(data));
            var st_record = {
                name:st_data.assessment.name,
                student:st_data.student.name + " " + st_data.student.lastname,
                score:st_data.score,
                questions:st_data.assessment.questions,
                goals:[]
            }

            st_data.assessment.goals.forEach(function(goal,index){
                st_record.goals.push({goal:goal,value:st_data.goals[index],questions:[]});
            });

            st_record.questions.forEach(function(question,q_index){
                if(question.type == 'common-base'){
                    question.questions.forEach(function(subquestion,s_index){
                        delete subquestion.questions;
                        subquestion.goals = [];
                        subquestion.max_score = st_data.assessment.parameters[q_index][s_index].score;
                        subquestion.score = st_data.answers[q_index][s_index].score;
                        subquestion.answer= st_data.answers[q_index][s_index].ans;

                        st_data.assessment.parameters[q_index][s_index].goals.forEach(function(goal){
                            subquestion.goals.push(st_data.assessment.goals[goal]);
                            st_record.goals[goal].questions.push((q_index + 1) + "." + (s_index + 1));
                        });
                    });
                }else{
                    delete question.questions;
                    question.goals = [];
                    question.max_score = st_data.assessment.parameters[q_index].score;
                    question.score = st_data.answers[q_index].score;
                    question.answer= st_data.answers[q_index].ans;

                    st_data.assessment.parameters[q_index].goals.forEach(function(goal){
                        question.goals.push(st_data.assessment.goals[goal]);
                        st_record.goals[goal].questions.push((q_index + 1) + "");
                    });
                }
            });

            res.status(200).send(st_record);
        }
    });
});

router.get('/data/teacher/:id',function(req,res,next){
    assessment.getAssessmentForRecord(req.params.id,function(err,assessment){
        if(err){
            res.sendStatus(500);
        }else{
            record.getAssessmentRecords(req.params.id,function(err,records){
                if(err){
                    res.sendStatus(500);
                }else{
                    var t_assessment = JSON.parse(JSON.stringify(assessment));
                    t_assessment.records = [];
                    t_assessment.pass_count = [0,0];
                    t_assessment.score_count = [50,50,0];

                    for(var i=0; i<records.length; i++){
                        var record = records[i];
                        t_assessment.records.push({_id:record._id,student:record.student,score:record.score});
                        
                        t_assessment.score_count[2] += record.score;
                        
                        if(record.score >= 30){
                            t_assessment.pass_count[0] += 1;
                        }else{
                            t_assessment.pass_count[1] += 1;
                        }

                        for(var q_index=0; q_index<t_assessment.questions.length; q_index++){
                            var question = t_assessment.questions[q_index];
                            if(question.type == 'common-base'){
                                for(var s_index=0; s_index<question.questions.length; s_index++){
                                   var subquestion = question.questions[s_index];
                                   if(!subquestion.score){
                                        subquestion.max_score = assessment.parameters[q_index][s_index].score;
                                        subquestion.score = record.answers[q_index][s_index].score;
                                    }else{
                                        subquestion.score += record.answers[q_index][s_index].score;
                                    }

                                    t_assessment.parameters[q_index][s_index].goals.forEach(function(goal){
                                        if(!t_assessment.goals[goal].score){
                                            t_assessment.goals[goal].score = record.answers[q_index][s_index].score;
                                        }else{
                                            t_assessment.goals[goal].score += record.answers[q_index][s_index].score;
                                        }  
                                    });
                                }
                            }else{
                                if(!question.score){
                                    question.max_score = assessment.parameters[q_index].score;
                                    question.score = record.answers[q_index].score;
                                }else{
                                    question.score += record.answers[q_index].score;
                                }

                                t_assessment.parameters[q_index].goals.forEach(function(goal){
                                    if(!t_assessment.goals[goal].score){
                                        t_assessment.goals[goal].score = record.answers[q_index].score;
                                    }else{
                                        t_assessment.goals[goal].score += record.answers[q_index].score;
                                    }                                    
                                });
                            }                            
                        }
                    }

                    t_assessment.score_count[2] = Math.floor((t_assessment.score_count[2] / records.length) * 10) / 10;

                    t_assessment.questions.forEach(function(question,q_index){
                        if(question.type == 'common-base'){
                            question.questions.forEach(function(subquestion,s_index){
                                subquestion.score = Math.floor((subquestion.score / records.length) * 10) / 10;
                                t_assessment.parameters[q_index][s_index].goals.forEach(function(goal){
                                    if(!t_assessment.goals[goal].questions){
                                        t_assessment.goals[goal].questions = [(q_index + 1) + "." + (s_index + 1)];
                                        t_assessment.goals[goal].max_score = t_assessment.parameters[q_index][s_index].score;
                                    }else{
                                        t_assessment.goals[goal].questions.push((q_index + 1) + "." + (s_index + 1));
                                        t_assessment.goals[goal].max_score += t_assessment.parameters[q_index][s_index].score;
                                    }
                                });
                            });
                        }else{
                            question.score = Math.floor((question.score / records.length) * 10) / 10;
                            t_assessment.parameters[q_index].goals.forEach(function(goal){
                                if(!t_assessment.goals[goal].questions){
                                    t_assessment.goals[goal].questions = [(q_index + 1) + ""];
                                    t_assessment.goals[goal].max_score = t_assessment.parameters[q_index].score;
                                }else{
                                    t_assessment.goals[goal].questions.push((q_index + 1) + "");
                                    t_assessment.goals[goal].max_score += t_assessment.parameters[q_index].score;
                                }
                            });
                        }
                    });

                    t_assessment.goals.forEach(function(goal){
                        goal.score = Math.floor(((goal.score / records.length) * 100 / goal.max_score) * 10) / 10;
                    });

                    res.status(200).send(t_assessment);
                }
            });
        }
    });
});

router.get('/file/:id',function(req,res,next){
    record.getAssessmentRecordsForFile(req.params.id,function(err,data){
        data.sort(function(a,b){
            if(a.student.lastname > b.student.lastname){
                return 1;
            }
            if(a.student.lastname < b.student.lastname){
                return -1;
            }
        });

        var filename = "assessment.xlsx";
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet();

        data.forEach(function(record){
            var r_data = [];
            r_data.push(record.student.lastname);
            r_data.push(record.student.name);
            r_data.push(record.score);
            worksheet.addRow(r_data);
        });
        
        workbook.xlsx.writeFile(filename)
        .then(function(){
            res.status(200).download(filename);
        });
    });
});

module.exports = router;