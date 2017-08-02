// ============ VARIABLES  ============
var gulp = require('gulp'),
    watch = require('gulp-watch'),    
    // minify = require('gulp-minify'),
    sass = require('gulp-sass'),
    prefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    //rigger = require('gulp-rigger'),    
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),    
    //browserSync = require("browser-sync"),
    //merge = require('merge-stream'),
    //spritesmith = require('gulp.spritesmith'),
    del = require('del'),
    runSequence = require('run-sequence'),
    // reload = browserSync.reload;

var $ = {
    //gutil: require('gulp-util'),
    svgSprite: require('gulp-svg-sprite'),
    //size: require('gulp-size'),
    svgmin: require('gulp-svgmin')
}

// ============ PATHS  ============

var path = {
    build: { // destination folders of all files
        html: 'public/',
        //js: 'public/js/',
        css: 'public/css/',
        img: 'public/img/',
        //icons: 'public/img/',
        favicon: 'public/', // favicon must be in the root
        svg: 'public/svg/',
        fonts: 'public/fonts/'
    },
    src: { // source folders of all files
        //html: 'src/*.html',
        //js: 'src/js/main.js', // I use only 1 file to control sequence of all scripts in main.js
        style: 'src/style/main.scss', // I use only 1 file to control sequence of all styles in main.scss
        img: 'src/img/**/*.*',
        //icons: 'src/icons/*.*',
        favicon: 'src/favicon/*.*',
        svg: 'src/svg/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // where are we should watch for changings
        //html: 'src/**/*.html',
        //js: 'src/js/**/*.js',
        style: 'src/style/**/*.*', //watch for added css or sass files both
        img: 'src/img/**/*.*',
        //icons: 'src/icons/**/*.*',
        favicon: 'src/favicon/*.*',
        svg: 'src/svg/*.svg',
        //svg_tpl: 'src/style/partials/svg-tpl/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './public'     
};

// ============ OPTIONS  ============

// var browserSyncOptions = {
//     server: {
//         baseDir: "./public",
//         routes: {
//             "/bower_components": "./bower_components"
//         }
//     },
//     tunnel: true,
//     host: 'localhost',
//     port: 3005,

//     cors: true,
//     logPrefix: "Browser-sync"
// };
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
// var spriteOptions = {
//     imgName: 'sprite.png',
//     imgPath: '../img/sprite.png',
//     cssName: '_sprite.scss',
//     padding: 2
// };
var imageMinOptions = {
    progressive: true,
    svgoPlugins: [{ removeViewBox: false }],
    use: [pngquant()],
    interlaced: true
};

// ============ WEBSERVER  ============

// gulp.task('webserver', function() {
//     browserSync(browserSyncOptions);
// });

// ============ TASKS  ============

// gulp.task('html:build', function() {
//     return gulp.src(path.src.html)
//         .pipe(rigger())
//         .pipe(gulp.dest(path.build.html))
//         .pipe(reload({ stream: true }));
// });
// gulp.task('js:build', function() {
//     return gulp.src(path.src.js) //get only main.js
//         .pipe(rigger())
//         //.pipe(minify()) // minify with "gulp-minify": "^1.0.0"
//         .pipe(gulp.dest(path.build.js))
//         .pipe(reload({ stream: true }));
// });
gulp.task('style:build', function() {
    return gulp.src(path.src.style) // get only main.scss (all scss files included from partials there)
        .pipe(sass.sync(sassOptions).on('error', sass.logError))
        .pipe(prefixer(autoPrefixerOptions))
        //.pipe(cssnano()) // minify
        .pipe(gulp.dest(path.build.css));
        //.pipe(reload({ stream: true }));
});
gulp.task('image:build', function() {
    return gulp.src(path.src.img)
        .pipe(imagemin(imageMinOptions))
        .pipe(gulp.dest(path.build.img));
        //.pipe(reload({ stream: true }));
});
gulp.task('favicon:build', function() {
    return gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.build.favicon));
});
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});
// gulp.task('sprite:generate', function() {
//     var spriteData = gulp.src(path.src.icons)
//         .pipe(spritesmith(spriteOptions)); // generate spritesheet 
//     var imgStream = spriteData.img
//         .pipe(gulp.dest('src/img/')); // to source files, because other task will do optimise process
//     var cssStream = spriteData.css
//         .pipe(gulp.dest('src/style/partials/')); // other task will compile & concat & minify generated styles with other styles
//     return merge(imgStream, cssStream); // Return a merged stream to handle both `end` events 
// });

gulp.task('sprite-svg:generate', function() {
    return gulp.src('src/svg/*.svg')
        .pipe($.svgmin()) // minify here
        .pipe($.svgSprite({
            shape: {
                transform: ['svgo']
            },
            mode: {
                symbol: {
                    render: {
                        css: false, //CSS output option for icon sizing
                        scss: false // SCSS output option for icon sizing
                    },
                    dest: './', // destination folder
                    prefix: '.svg--%s', // BEM-style prefix if styles rendered
                    sprite: 'svg-sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest('./public/img/')); // no need to reload - after generating will be style building with reloading
});

gulp.task('clean', function() {
    return del(path.clean.build); //source can be string or array
});

gulp.task('build', function(cb) {
    runSequence('clean', //clean build folder !!!first, then
        'sprite-svg:generate', //generate sprite-svg for icons !!!second then        
        ['image:build', 'style:build', 'fonts:build', 'favicon:build'], //simultaneously
        cb);
});

// ============ WATCHING  ============

gulp.task('watch', function() {
    // watch([path.watch.html], function() {
    //     gulp.start('html:build');
    // });
    watch(path.watch.style, function() {
        gulp.start('style:build');
    });
    // watch([path.watch.js], function() {
    //     gulp.start('js:build');
    // });
    watch(path.watch.img, function() {
        gulp.start('image:build');
    });
    // watch([path.watch.icons], function() {
    //     gulp.start('sprite:generate');
    // });
    watch(path.watch.svg, function() {
        // runSequence('sprite-svg:generate', //1st
        //     'style:build' //2nd
        // )
        gulp.start('sprite-svg:generate');
    });
    watch(path.watch.fonts, function() {
        gulp.start('fonts:build');
    });
    watch(path.watch.favicon, function() {
        gulp.start('favicon:build');
    });
});

// ============ bash: gulp  ============

gulp.task('default', function(cb) {
    runSequence('build', 'watch', cb);
});
