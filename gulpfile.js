var gulp = require('gulp'); // gulp
var sass = require('gulp-sass'); // sass
var pug = require('gulp-pug'); // jade/pug
var rename = require('gulp-rename'); // remane file
var autoprefixer = require('gulp-autoprefixer'); // autoprefixer
var spritesmith = require('gulp.spritesmith'); // sprites
var cleanCSS = require('gulp-clean-css'); // minify css
var uglify = require('gulp-uglify'); // minify js
var browserSync = require('browser-sync').create(); // local server + sync browser

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task('sass', function(){
    gulp.src('src/sass/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 10 version', 'ie 9']}))
        .pipe(gulp.dest('src/css/'));
});

gulp.task('pug', function(){
    gulp.src('src/jade/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/images/sprite/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_variables.scss',
            cssFormat: 'scss',
            algorithm: 'binary-tree',
            cssTemplate: 'custom.scss.handlebars',
            cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name
            }
        }));
    spriteData.img.pipe(gulp.dest('src/images/'));
    spriteData.css.pipe(gulp.dest('src/sass/sprite/'));
});

gulp.task('css', function () {

    var options = {
        level: 0
    };

    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dest/css'))
        .pipe(cleanCSS(options))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
});

gulp.task('images', function () {
    gulp.src('src/images/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    gulp.watch('src/sass/**/*.+(sass|scss)', ['sass']); // track sass/scss files
    gulp.watch('src/jade/**/*.+(jade|pug)', ['pug']); // track pug/jade files
    gulp.watch('src/js/*.js', ['js']); // track js files
    gulp.watch('src/css/*.css', ['css']); // track css files
    gulp.watch('src/fonts/**/*', ['fonts']); // track fonts directory
    gulp.watch('src/images/*.+(png|jpg|jpeg|gif|svg)', ['images']); // track image files
    gulp.watch('src/images/sprite/*.png', ['sprite']); // track sprite files
});

gulp.task('default', ['watch', 'browser-sync']);