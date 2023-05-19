const gulp = require('gulp');
const clean = require('gulp-clean');
const gulpSass = require('gulp-sass');
const nodeSass = require('sass');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sass = gulpSass(nodeSass);
const BS = require('browser-sync');
const imagemin = require('gulp-imagemin');

const browserSync = BS.create();

const cleanDist = () => gulp.src('dist/*', { allowEmpty: true }).pipe(clean());

const scss = () => {
  return gulp.src('./src/scss/**/*.scss').pipe(sass().on('error', sass.logError)).pipe(gulp.dest('./dist/css'));
};

const imgMin = () => {
  return gulp.src('src/img/**/*.{jpg,png,svg,gif,ico}').pipe(imagemin()).pipe(gulp.dest('dist/img'));
};

const html = () => {
  return gulp
    .src('./src/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'));
};

const js = () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(concat('all.js'))
    .pipe(
      terser({
        keep_fnames: true,
        mangle: false
      })
    )
    .pipe(gulp.dest('./dist/js'));
};

const dev = () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(
    './src/**/*',
    gulp.series(cleanDist, gulp.parallel(html, scss, imgMin, js), next => {
      browserSync.reload();
      next();
    })
  );
};

gulp.task('build', gulp.series(cleanDist, gulp.parallel(html, js, imgMin, scss)));
gulp.task('dev', gulp.series('build', dev));