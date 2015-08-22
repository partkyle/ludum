var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var connect = require('gulp-connect');

var output = 'public';

gulp.task('js', function () {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(output + '/js'));
});


gulp.task('html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('src/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(output));
});


gulp.task('default', function() {
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.html', ['html']);
  connect.server({
    root: output,
    port: 8001
  });
});
