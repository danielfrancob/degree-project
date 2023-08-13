var express = require('express');
var router = express.Router();

var Survey = require('../models/survey');

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
    res.redirect('/survey/'+req.user.role);
});

router.route('/teacher')
.get(function(req,res,next){
    Survey.isSolved(req.user._id,1,function(err,data){
        if(err){
            res.redirect('/home');
        }else{
            if(data.length > 0){
                res.redirect('/home');
            }else{
                res.render('survey/teacher');
            }
        }
    });
})
.post(function(req,res,next){
    Survey.create(req.user._id,1,req.body.answers,function(err){
        if(err){
            res.render('survey/teacher',{error:"Ha ocurrido un error en el servidor. Intente nuevamente."});
        }else{
            res.redirect('/home');
        }
    });
});

router.get('/student',function(req,res,next){
    res.render('survey/student');
});

router.route('/student/:number')
.get(function(req,res,next){
    Survey.isSolved(req.user._id,req.params.number,function(err,data){
        if(err){
            res.redirect('/home');
        }else{
            if(data.length > 0){
                res.redirect('/home');
            }else{
                res.render('survey/student-'+req.params.number);
            }
        }
    });    
})
.post(function(req,res,next){
    Survey.create(req.user._id,req.params.number,req.body.answers,function(err){
        if(err){
            res.render('survey/teacher',{error:"Ha ocurrido un error en el servidor. Intente nuevamente."});
        }else{
            res.redirect('/home');
        }
    });
});

router.get('/data/:role/:number',function(req,res,next){
    Survey.getSurveyData(req.params.role,req.params.number,function(err,data){
        if(err){
            res.status(500).send("Ocurrió un error en el servidor. Intente nuevamente.");
        }else{            
            if(data.length > 0){
                var filename = req.params.role + "_" + req.params.number + ".xlsx";
                var workbook = new Excel.Workbook();
                var worksheet = workbook.addWorksheet();

                data.forEach(function(item){
                    var r_data = [];
                    r_data.push(item.user.name);
                    r_data.push(item.user.lastname);

                    item.answers.forEach(function(ans){
                        r_data.push(ans);
                    });
                    worksheet.addRow(r_data);
                });

                workbook.xlsx.writeFile(filename)
                .then(function(){
                    res.status(200).download(filename);
                });
            }else{
                res.status(200).send("Ningún usuario ha contestado la encuesta solicitada. No se ha generado el archivo." 
                    + "<br>" + "<a href='/home'>Regresar</a>");
            }
        }
    });
});

module.exports = router;