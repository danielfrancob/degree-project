var express = require('express');
var express_session = require('express-session');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var root = require('./routes/index');
var gallery = require('./routes/gallery');
var question = require('./routes/question');
var assessment = require('./routes/assessment');
var presentation = require('./routes/presentation');
var record = require('./routes/record');
var survey = require('./routes/survey');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('./models/user');
var flash = require('connect-flash');
var fs = require('fs');

var app = express();

// app.set('mode','local');
app.set('mode','remote');

var conn_string = "";

/*
    if remote
        Create PDF user guide
        Create OPENSHIFT_DATA_DIR/galleries
        Create runtime public/galleries
        Copy OPENSHIFT_DATA_DIR/galleries to public/galleries
        Create mongo connection
    else
        Create public/galleries
        Create mongo connection
*/

if(app.get('mode') == 'remote'){
    // Create manual in public folder
    fs.writeFile(
        process.env.OPENSHIFT_REPO_DIR + '/public/Manual.pdf',
        fs.readFileSync(process.env.OPENSHIFT_DATA_DIR + '/Manual.pdf')
    );
    // Create galleries in public folder
    fs.mkdir(process.env.OPENSHIFT_DATA_DIR + '/galleries',function(err){
        fs.mkdir(process.env.OPENSHIFT_REPO_DIR + '/public/galleries',function(err){
            var files = fs.readdirSync(process.env.OPENSHIFT_DATA_DIR + '/galleries');
            files.forEach(function(file){
                fs.writeFile(
                    process.env.OPENSHIFT_REPO_DIR + '/public/galleries/' + file,
                    fs.readFileSync(process.env.OPENSHIFT_DATA_DIR + '/galleries/' + file)
                );
            });
        });
    });
    conn_string = 'mongodb://user_crud:8521478963@ds053126.mlab.com:53126/degree-project'
}else{
    fs.mkdir('public/galleries',function(err){});
    conn_string = 'mongodb://localhost/degree-project';
}

mongoose.connect(conn_string,function(err){
    var message = "DB Connection: ";
    if(err){
        message += "There was an error with database connection. \n" + err;
    }else{
        message += "Database connection is OK";
    }
    console.log(message);   
});

app.use(express_session({
    secret:'degree-project',
    resave:false,
    saveUninitialized:false
}));

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',root);
app.use('/gallery',gallery);
app.use('/question',question);
app.use('/assessment',assessment);
app.use('/presentation',presentation);
app.use('/record',record);
app.use('/survey',survey);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
