'use strict'

const gulp = require('gulp')
const cp = require('child_process')

// sass plugins
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// server plugins
const browserSync = require('browser-sync')

const messages = {
  jekyllDev: 'Running: $ jekyll build for dev',
  jekyllProd: 'Running: $ jekyll build for prod'
}

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future Jekyll builds)
 */
function styles () {
  return gulp
    .src('_sass/styles.scss')
    .pipe(
      sass({
        includePaths: ['scss'],
        onError: browserSync.notify
      })
    )
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'))
}

function stylesProd () {
  return gulp
    .src('_sass/styles.scss')
    .pipe(
      sass({
        includePaths: ['scss'],
        onError: browserSync.notify
      })
    )
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(gulp.dest('assets/css'))
}

/**
 * Server functionality handled by BrowserSync
 */
function browserSyncServe (done) {
  browserSync.init({
    server: './_site/',
    port: 1234
  })
  done()
}

function browserSyncReload (done) {
  browserSync.reload()
  done()
}

/**
 * Build Jekyll site
 */
function jekyllDev (done) {
  browserSync.notify(messages.jekyllDev)
  return cp
    .spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {
      stdio: 'inherit'
    })
    .on('close', done)
}

function jekyllProd (done) {
  browserSync.notify(messages.jekyllProd)
  return cp
    .spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' })
    .on('close', done)
}

/**
 * Watch source files for changes & recompile
 * Watch html/md files, run Jekyll & reload BrowserSync
 */
function watchMarkup () {
  gulp.watch(
    ['index.html', '_layouts/*.html', '_posts/*', '_includes/*', '*.md'],
    gulp.series(jekyllDev, browserSyncReload)
  )
}

function watchStyles () {
  gulp.watch(['_sass/**/*.scss', '_sass/*.scss'], styles)
}

// function watch() {
//   gulp.parallel(watchMarkup, watchStyles);
// }

var serve = gulp.series(styles, jekyllDev, browserSyncServe)

var watch = gulp.parallel(watchMarkup, watchStyles)

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the Jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', gulp.parallel(serve, watch))

gulp.task('build', gulp.series(stylesProd, jekyllProd))
