// ============ VARIABLES  ============
var gulp = require('gulp')
var gutil = require('gulp-util')
var watch = require('gulp-watch')
var sass = require('gulp-sass')
var prefixer = require('gulp-autoprefixer')
var cssnano = require('gulp-cssnano')
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')
var del = require('del')
var runSequence = require('run-sequence')
var sprite = require('gulp-svg-sprite')
var svgmin = require('gulp-svgmin')

// ============ PATHS  ============

var path = {
  build: {
    css: 'public/css/',
    img: 'public/img/',
    svg: 'public/svg/',
    favicon: 'public/', // favicon must be in the root
    fonts: 'public/fonts/',
    index: 'public/'
  },
  src: {
    style: 'src/style/main.scss', // used only 1 file to control sequence of all styles in main.scss
    img: 'src/img/**/*.*',
    favicon: 'src/favicon/*.*',
    fonts: 'src/fonts/**/*.*',
    svg: 'src/svg/*.svg',
    index: 'src/index.html'
  },
  watch: {
    style: 'src/style/**/*.*',
    img: 'src/img/**/*.*',
    favicon: 'src/favicon/*.*',
    fonts: 'src/fonts/**/*.*',
    svg: 'src/svg/*.svg',
    index: 'src/index.html'

  },
  clean: './public'
}

// ============ OPTIONS  ============

var autoPrefixerOptions = {
  browsers: [
    'Android 2.3', // To match upstream Bootstrap's level of browser compatibility
    'Android >= 4',
    'Chrome >= 20',
    'Firefox >= 24',
    'Explorer >= 8',
    'iOS >= 6',
    'Opera >= 12',
    'Safari >= 6'
  ],
  cascade: false
}
var sassOptions = {
  errLogToConsole: true,
  precision: 10
}

var imageMinOptions = {
  progressive: true,
  svgoPlugins: [{ removeViewBox: false }],
  use: [pngquant()],
  interlaced: true
}

gulp.task('style:build', function () {
  return gulp.src(path.src.style)
        .pipe(sass.sync(sassOptions).on('error', sass.logError))
        .pipe(prefixer(autoPrefixerOptions))
        // .pipe(cssnano()) // minify
        .pipe(gulp.dest(path.build.css))
})
gulp.task('image:build', function () {
  return gulp.src(path.src.img)
        .pipe(imagemin(imageMinOptions))
        .pipe(gulp.dest(path.build.img))
})
gulp.task('favicon:copy', function () {
  return gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.build.favicon))
})
gulp.task('fonts:copy', function () {
  return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
})
gulp.task('index:copy', function () {
  return gulp.src(path.src.index)
        .pipe(gulp.dest(path.build.index))
})
gulp.task('sprite-svg:generate', function () {
  return gulp.src('src/svg/*.svg')
        .pipe(svgmin())
        .pipe(sprite({
          shape: {
            transform: ['svgo']
          },
          mode: {
            symbol: {
              render: {
                css: false, // output option for icon sizing
                scss: false // output option for icon sizing
              },
              dest: './',
              sprite: 'svg-sprite.svg'
            }
          }
        }))
        .pipe(gulp.dest('./public/img/'))
})

gulp.task('clean', function () {
  return del(path.clean)
})

gulp.task('build', function (cb) {
  runSequence('clean',
        'sprite-svg:generate',
        ['image:build', 'style:build', 'fonts:copy', 'favicon:copy', 'index:copy'], // simultaneously
        cb)
})

// ============ WATCHING  ============

gulp.task('watch', function () {
  watch([path.watch.style], function () {
    gulp.start('style:build')
  })
  watch([path.watch.img], function () {
    gulp.start('image:build')
  })
  watch([path.watch.svg], function () {
    gulp.start('sprite-svg:generate')
  })
  watch([path.watch.favicon], function () {
    gulp.start('favicon:copy')
  })
  watch([path.watch.fonts], function () {
    gulp.start('fonts:copy')
  })
  watch([path.watch.index], function () {
    gulp.start('index:copy')
  })
})

// ============ bash: gulp  ============

gulp.task('default', function (cb) {
  runSequence('build', 'watch', cb)
  gutil.log('Build is Done! You are awesome!')
})
