// ============ VARIABLES  ============
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    merge = require('merge-stream'),
    spritesmith = require('gulp.spritesmith'),
    runSequence = require('run-sequence'), // correct finish of the previous task - to start next
    reload = browserSync.reload;

var $svgPlugins = {
    gutil: require('gulp-util'),
    svgSprite: require('gulp-svg-sprite'),
    size: require('gulp-size'),
}

var path = {
    build: { // destination folders of all files
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        icons: 'build/img/',
        favicon: 'build/', // favicon must be in the root
        svg: 'build/svg/',
        fonts: 'build/fonts/'
    },
    src: { // source folders of all files
        html: 'src/*.html',
        js: 'src/js/main.js', // I use only 1 file to control sequence of all scripts in main.js
        style: 'src/style/main.scss', // I use only 1 file to control sequence of all styles in main.scss
        img: 'src/img/**/*.*',
        icons: 'src/icons/*.*',
        favicon: 'src/favicon/*.*',
        svg: 'src/svg/',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // where are we should watch for changings
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.*', //watch for added css or sass files both
        img: 'src/img/**/*.*',
        icons: 'src/icons/**/*.*',
        favicon: 'src/favicon/*.*',
        svg: 'src/svg/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var pathSvg = {
    images: {
        src: path.src.svg,
        dest: path.build.svg + 'img/'
    },
    sprite: {
        src: path.build.svg + 'sprite/*',
        svg: 'img/sprite.svg',
        css: 'src/style/partials/_svgSprite.scss'
    },
    templates: {
        src: 'src/style/svg_tpl/'
    }
};

// ============ OPTIONS  ============

var browserSyncOptions = {
    server: {
        baseDir: "./build",
        routes: {
            "/bower_components": "./bower_components"
        }
    },
    tunnel: false,
    host: 'localhost',
    port: 3002,

    cors: true,
    logPrefix: "Browser-sync"
};
var autoPrefixerOptions = {
    browsers: [
        "Android 2.3", // To match upstream Bootstrap's level of browser compatibility
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 8",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
    ],
    cascade: false
};
var sassOptions = {
    errLogToConsole: true,
    precision: 10 //TODO test this parameter!
};
var spriteOptions = {
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: '_sprite.scss',
    padding: 2
};
var imageMinOptions = {
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()],
    interlaced: true
};

// ============ WEBSERVER  ============

gulp.task('webserver', function() {
    browserSync(browserSyncOptions);
});

// ============ TASKS  ============

gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream: true }));
});
gulp.task('js:build', function() {
    gulp.src(path.src.js) //get only main.js
        .pipe(rigger())
        //.pipe(minify()) // minify with "gulp-minify": "^1.0.0"
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream: true }));
});
gulp.task('style:build', function() {
    gulp.src(path.src.style) // get only main.scss (all scss files included from partials there)
        .pipe(sass.sync(sassOptions).on('error', sass.logError)) //compile SCSS/SASS to css, log the errors without falling down
        .pipe(prefixer(autoPrefixerOptions)) //add vendor-prefixes
        //.pipe(cssnano()) // minify
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream: true }));
});
gulp.task('image:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin(imageMinOptions)) //optimise images
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({ stream: true }));
});
gulp.task('favicon:build', function() {
    gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.build.favicon)) // simple copy all favicons and manifest.json
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts)) // simple copy
});
gulp.task('sprite:generate', function() {
    var spriteData = gulp.src(path.src.icons)
        .pipe(spritesmith(spriteOptions)); // Generate our spritesheet 
    var imgStream = spriteData.img
        .pipe(gulp.dest('src/img/')); // destination - to source files, because other task will do optimise process
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/style/partials/')); // other task will compile, concat, and minify this styles(SCSS/SASS) with other styles
    return merge(imgStream, cssStream); // Return a merged stream to handle both `end` events 
});

gulp.task('svgSprite', function() {
    return gulp.src(pathSvg.sprite.src)
        .pipe($svgPlugins.svgSprite({
            shape: {
                spacing: {
                    padding: 5
                }
            },
            mode: {
                css: {
                    dest: "./",
                    layout: "diagonal",
                    sprite: pathSvg.sprite.svg,
                    bust: false,
                    render: {
                        scss: {
                            dest: "src/style/svg_sprite/_sprite.scss",
                            template: "src/style/svg_tpl/sprite-template.scss"
                        }
                    }
                }
            },
            variables: {
                mapname: "icons"
            }
        }))
        .pipe(gulp.dest(path.build.svg));
});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('build', function(cb) {
    runSequence('clean', //clean build folder !!!first, then
        'sprite:generate', //generate sprite-image and sass-code for icons !!!second then        
        ['image:build', 'html:build', 'js:build', 'style:build', 'fonts:build', 'favicon:build'], //simultaneously
        cb);
});

// ============ WATCHING  ============

gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.icons], function(event, cb) {
        gulp.start('sprite:generate');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.favicon], function(event, cb) {
        gulp.start('favicon:build');
    });
});

// ============ bash: gulp  ============

gulp.task('default', function(cb) {
    runSequence('build', 'webserver', 'watch', cb);
});
