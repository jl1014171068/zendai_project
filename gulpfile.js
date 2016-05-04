var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshints = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    bowersync = require('browser-sync'),
    minhtml = require('gulp-minify-html'),
    addsrc = require('gulp-add-src'),
    config = {
    bootstrapDir: './bower_components/bootstrap-sass',
    publicDir: './public',
    jquery:'./bower_components/jquery/dist/',
};

// 将scss文件转化为css，存入public目录，自动前缀，改名，压缩
gulp.task('css', function() {
    return gulp.src('./css/app.scss')
    .pipe(sass({
        includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(config.publicDir + '/css'));
});

// 加载前先清空目录
gulp.task('clean', function() {  
  return gulp.src([config.publicDir+'/css',config.publicDir+'/script', config.publicDir+'/images',config.publicDir+'/fonts'], {read: false})
    .pipe(clean());
});

gulp.task('fonts', function() {
    return gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
    .pipe(gulp.dest(config.publicDir + '/fonts'));
});

// 编译压缩js
gulp.task('scripts', function() {  
  // return gulp.src(config.bootstrapDir+'/assets/javascripts/bootstrap.min.js')
     return gulp.src([config.jquery+'jquery.min.js',config.bootstrapDir+'/assets/javascripts/bootstrap.min.js']) 
    .pipe(concat('bootstrap.min.js'))
    .pipe(addsrc('./script/*.js'))  
    .pipe(gulp.dest(config.publicDir+'/script/'));
});
// 图片压缩
gulp.task('images', function() {  
  return gulp.src('./images/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(config.publicDir+'/images/'))
    .pipe(notify({ message: 'Images task complete' }));
});

//运行
gulp.task('default',['clean','css','fonts','scripts','images']);

// 看守
gulp.task('watch', function() {

  // 看守所有.scss档
  gulp.watch('/css/*.scss', ['css']);

  // 看守所有.js档
  gulp.watch('./script/*.js', ['scripts']);

  // 看守所有图片档
  gulp.watch('./images/*', ['images']);

  // 建立即时重整伺服器
  // var server = livereload();
   livereload.listen();

  // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
  // gulp.watch(['public/**']).on('change', function(file) {
  //   server.change(file.path);
  // });
   gulp.watch(['public/**']).on('change', livereload.changed);

});

