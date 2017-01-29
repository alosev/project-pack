var gulp = require('gulp'); // сам gulp
var sass = require('gulp-sass'); // sass
var pug = require('gulp-pug'); // jade/pug
var autoprefixer = require('gulp-autoprefixer'); // автопрефекс
var spritesmith = require('gulp.spritesmith'); // спрайты
var cleanCSS = require('gulp-clean-css'); // минификация css
var uglify = require('gulp-uglify'); // минификация js
//var browserSync = require('browser-sync').create(); // локальный сервер + синхронизация браузера

// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./dist/"
//         },
//         port: 8080,
//         open: true,
//         notify: false
//     });
// });

gulp.task('sass', function(){
    gulp.src('src/sass/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 10 version', 'ie 9']}))
        .pipe(gulp.dest('src/css/'))
        //.pipe(browserSync.stream())
});

gulp.task('pug', function(){
    gulp.src('src/jade/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'))
        //.pipe(browserSync.stream())
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
    gulp.src('src/css/*.css')
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function () {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('fonts', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('images', function () {
    gulp.src('src/images/*.+(png|jpg|jpeg|gif)')
        .pipe(gulp.dest('dist/images'))
});

gulp.task('watch', function(){
    gulp.watch('src/sass/**/*.+(sass|scss)', ['sass']); // Отслеживаем файлы sass
    gulp.watch('src/jade/**/*.+(jade|pug)', ['pug']); // Отслеживаем файлы pug
    gulp.watch('src/js/*.js', ['js']); // Отслеживаем файлы js
    gulp.watch('src/css/*.css', ['css']); // Отслеживаем файлы css
    gulp.watch('src/fonts/**/*', ['fonts']); // Отслеживаем файлы fonts
    gulp.watch('src/images/*.+(png|jpg|jpeg|gif)', ['images']); // Отслеживаем файлы fonts
    gulp.watch('src/images/sprite/*.png', ['sprite']); // Отслеживаем файлы sprite/png
});

gulp.task('default', ['watch'/*, 'browser-sync']*/]);