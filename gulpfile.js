const   gulp = require('gulp'),

        webpackStream = require('webpack-stream'),

        browsersync = require('browser-sync').create(),
        autoprefixer = require('gulp-autoprefixer'),
        sourcemaps = require('gulp-sourcemaps'),
        sass = require('gulp-sass'),
        notify = require('gulp-notify'),
        plumber = require('gulp-plumber'),
        pug = require('gulp-pug'),

        path = {
            src: 'src',
            dist: 'dist',
            pug: 'views',
            scss: 'scss',
            css: 'css',
            js: 'js'
        },

        files = {
            pug: `${path.src}/${path.pug}/**/*.pug`,
            css: `${path.dist}/${path.css}/**/*.css`,
            scss: `${path.src}/${path.scss}/**/*.scss`,
            js: `${path.src}/${path.js}/**/*.js`
        }

let webpackOptions = require('./webpack.config')


// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: path.dist
        }
    })

    done()
}


// HTML task
function htmlGenerate() {
    return gulp
        .src(`${path.src}/${path.pug}/*.pug`)
        .pipe(plumber({
            errorHandler: notify.onError( err => ({
                title: 'Pug Builder',
                message: err.message
            }))
        }))
        .pipe(pug({
            pretty: '\t'
        }))
        .pipe(gulp.dest(`${path.dist}`))
        .pipe(browsersync.stream())
}


// CSS task
function cssGenerate() {
    return gulp
        .src(files.scss)
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: notify.onError( err => ({
                title: 'SCSS Builder',
                message: err.message
            }))
        }))
        .pipe(sass({ outputStyle: 'nested' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${path.dist}/${path.css}`))
        .pipe(browsersync.stream())
}


// Webpack
function jsGenerate() {
    webpackOptions.mode = 'development'

    return gulp
        .src(files.js)
        .pipe(plumber({
            errorHandler: notify.onError( err => ({
                title: 'Webpack Builder',
                message: err.message
            }))
        }))
        .pipe(webpackStream(webpackOptions))
        .pipe(gulp.dest(`${path.dist}/${path.js}`))
        .pipe(browsersync.stream())
}


// Watch files
function watchFiles() {
    gulp.watch( files.scss, cssGenerate )
    gulp.watch( files.pug, htmlGenerate )
    gulp.watch( files.js, jsGenerate )
}


const watch = gulp.parallel(watchFiles, browserSync)

exports.css = cssGenerate
exports.html = htmlGenerate
exports.default = gulp.series(htmlGenerate, jsGenerate, cssGenerate, watch)
