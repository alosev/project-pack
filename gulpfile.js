var gulp = require('gulp'); // gulp
var sass = require('gulp-sass'); // sass
var pug = require('gulp-pug'); // jade/pug
var rename = require('gulp-rename'); // remane file
var autoprefixer = require('gulp-autoprefixer'); // autoprefixer
var spritesmith = require('gulp.spritesmith'); // sprites
var cleanCSS = require('gulp-clean-css'); // minify css
var uglify = require('gulp-uglify'); // minify js
var watch = require('gulp-watch'); // tracking files

gulp.task('sass', function(){
    gulp.src('src/sass/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 5 version', 'ie 9']}))
        .pipe(gulp.dest('src/css/'));
});

gulp.task('pug', function(){
    gulp.src('src/jade/*.+(jade|pug)')
        .pipe(pug({pretty: '\t'}))
        .pipe(gulp.dest('dist/'));
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
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS(options))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function () {
    gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function () {
    gulp.src('src/images/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function(){
	
	// track sass/scss files
	watch('src/sass/**/*.+(sass|scss)', function(){
		gulp.start('sass');
	});
	
	// track pug/jade files
    watch('src/jade/**/*.+(jade|pug)', function(){
		gulp.start('pug');
	});
	
	// track js files
    watch('src/js/*.js', function(){
		gulp.start('js');
	});
	
	// track css files
    watch('src/css/*.css', function(){
		gulp.start('css');
	});
	
	// track fonts directory
    watch('src/fonts/**/*.*', function(){
		gulp.start('fonts');
	});
	
	// track image files
    watch('src/images/*.+(png|jpg|jpeg|gif|svg)', function(){
		gulp.start('images');
	});
	
	// track sprite files
    watch('src/images/sprite/*.png', function(){
		gulp.start('sprite');
	});
	
});

gulp.task('default', ['watch']);