var gulp = require('gulp'),
    sass = require('gulp-sass'),
    php = require('gulp-connect-php'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence');

var reload  = browserSync.reload;

//Php
gulp.task('php', function() {
  php.server({
    base: 'app',
    port: 8010,
    keepalive: true
  });
});

//Sass
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
      	.pipe(sourcemaps.init())
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
          stream: true
        }))
});

//Browser sinc
gulp.task('browserSync',['php'], function() {
  browserSync({
    proxy: '127.0.0.1:8010',
    port: 8080,
    open: true,
    notify: false
  });
});

//Watch sass
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch(['app/*.php'], [reload]);
  gulp.watch('app/js/**/*.js', [reload]);
  // Other watchers
})

//Minified CSS & JS
gulp.task('useref', function(){
  return gulp.src('app/*.php')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

//Optimizing images
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg|ico)')
         // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
          })))
        .pipe(gulp.dest('dist/img'))
});

//Fonts to dist
gulp.task('fonts', function() {
  return gulp.src('app/fonts/*')
  .pipe(gulp.dest('dist/fonts'))
});

//Map to dist
gulp.task('sourcemaps', function() {
  return gulp.src('app/css/*.css.map')
  .pipe(gulp.dest('dist/css'))
});

//Cleaning up generated files automatically
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

//Combining Gulp tasks
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts', 'sourcemaps'],
    callback
  )
});

//Combining Gulp tasks / without clean
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})