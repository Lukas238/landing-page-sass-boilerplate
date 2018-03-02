/*
    PACKAGES
*************************/
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    run = require('run-sequence'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    clean = require('gulp-rimraf'),
    inlinesource = require('gulp-inline-source'),
    replace = require('gulp-replace'),
    imagemin = require('gulp-imagemin'),
    assemble = require('assemble');
app = assemble();


/*
    VARIABLES
*************************/
var cfg = {
    dist: './dist',
    dev: './dev',
    directory_listing: true
};
cfg.wf = cfg.dev;


/*
    TASKS
*************************/

// PLUMBER: PRITTIER ERROR CONSOLE MESSAGE
var onError = function (error) {
    gutil.beep();
    gutil.log(gutil.colors.red(error.message));
    this.emit('end');
};

// CLEAN: DEV
gulp.task('clean:dev', function () {
    return gulp.src(cfg.dev + "/*", {
        read: false
    }).pipe(clean());
});

// CLEAN:DIST
gulp.task('clean:dist', function () {
    return gulp.src(cfg.dist + "/*", {
        read: false
    }).pipe(clean());
});

// BROWSERSYNC LOCAL SERVER
gulp.task('serve', function () {
    browserSync.init(null, {
        notify: false,
        server: {
            baseDir: cfg.wf,
            directory: cfg.directory_listing,
        }
    });
});


//	VENDORS
gulp.task('vendors', ['vendors:js', 'vendors:css', 'vendors:img', 'vendors:fonts']);

//	VENDORS:JS
gulp.task('vendors:js', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
            'node_modules/slick-carousel/slick/slick.js',
        ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(cfg.wf + '/js'));
});

//	VENDORS:CSS
gulp.task('vendors:css', function () {
    return gulp.src([
            'node_modules/slick-carousel/slick/slick.css',
            'node_modules/slick-carousel/slick/slick-theme.css'
        ])
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest(cfg.wf + '/css'));
});

//	VENDORS:CSS
gulp.task('vendors:img', function () {
    return gulp.src([
            'node_modules/slick-carousel/slick/ajax-loader.gif'
        ])
        .pipe(gulp.dest(cfg.wf + '/img'));
});

//	VENDORS:FONTS
gulp.task('vendors:fonts', function () {
    return gulp.src([
            'node_modules/slick-carousel/slick/fonts/*'
        ])
        .pipe(gulp.dest(cfg.wf + '/fonts'));
});

//	SCSS
gulp.task('scss', function () {
    return gulp.src('./src/scss/styles.scss')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                './node_modules/bootstrap-sass/assets/stylesheets'
            ],
            errLogToConsole: true
        }))
        .pipe(cleanCSS({
            sourceMap: true,
            compatibility: 'ie10'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cfg.wf + '/css'))
        .pipe(reload({
            stream: true
        }));
});

// JS
gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cfg.wf + '/js'))
        .pipe(reload({
            stream: true
        }));
});

// IMAGES
gulp.task('images', function (tmp) {
    return gulp.src('./src/img/*')
        /*.pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))*/
        .pipe(gulp.dest(cfg.wf + '/img'));
});

//	FONTS
gulp.task('fonts', function () {
    return gulp.src(cfg.src + '/fonts/*')
        .pipe(gulp.dest(cfg.wf + '/fonts'));
});

//	HTML
gulp.task('html', function () {
    var file_list = cfg.wf == cfg.dist ? './src/*.html' : './src/**/*.html';

    return gulp.src(file_list)
        .pipe(gulp.dest(cfg.wf + '/'))
        .pipe(reload({
            stream: true
        }));
});


//	ASSEMBLE TEMPALTES
gulp.task('assemble', ['html'], function () {
    app.layouts('src/layouts/*.hbs');
    app.pages('src/*.hbs');
    
    return app.toStream('pages')
        .pipe(app.renderFile())
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(app.dest(cfg.wf));
});


/*
    PORCELAIN TASKS
*************************/

/* DEFAULT */
gulp.task('default', ['clean:dev'], function () {
    cfg.wf = cfg.dev;
    run(['images', 'scss', 'js', 'fonts', 'vendors', 'assemble', 'serve'], function () {
        gulp.watch('./src/**/*.hbs', ['assemble']).on('change', reload);
        gulp.watch('./src/**/*.html', ['html']).on('change', reload);
        gulp.watch('./src/img/*', ['images']).on('change', reload);
        gulp.watch('./src/scss/**/*.scss', ['scss']);
        gulp.watch('./src/js/scripts.js', ['js']);
    });
});

/* BUILD */
gulp.task('build', ['clean:dist'], function () {
    cfg.wf = cfg.dist;
    run(['images', 'scss', 'js', 'fonts', 'vendors', 'assemble']);
});