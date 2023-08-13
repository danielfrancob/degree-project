var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('default',function(){
    server.run(['./bin/www']);
    gulp.watch(['app.js'],[server.run]);
    gulp.watch(['./routes/**/*.js'],[server.run]);
    gulp.watch(['./models/**/*.js'],[server.run]); 
});
