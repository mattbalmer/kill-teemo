var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify('./src/main.js')
        .require('./vendor/createjs-2013.12.12.min.js', {expose: 'createjs'})
        .bundle()
        .pipe(source('app.min.js'))
        //.pipe(buffer())
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.js'], ['compile']);
});

gulp.task('compile', ['browserify']);
gulp.task('default', ['compile', 'watch']);