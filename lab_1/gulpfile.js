import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import del from 'del';

const sass = gulpSass(dartSass);
const bs = browserSync.create();

// Шляхи до файлів
const paths = {
  styles: {
    src: 'src/css/**/*.scss',
    dest: 'build/css/',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'build/js/',
  },
  html: {
    src: 'src/*.html',
    dest: 'build/',
  },
  images: {
    src: 'src/images/**/*',
    dest: 'build/images/',
  },
};

// Очищення папки build
export function clean() {
  return del(['build']);
}

// Компіліяція SCSS у CSS
export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(bs.stream());
}

// Об'єднання та стиснення JavaScript
export function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());
}

// Копіювання HTML файлів
export function html() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(bs.stream());
}

// Копіювання зображень
export function images() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
}

// Запуск локального сервера
export function serve() {
  bs.init({
    server: {
      baseDir: './build',
    },
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.html.src, html).on('change', bs.reload);
  gulp.watch(paths.images.src, images).on('change', bs.reload);
}

// Завдання за замовчуванням: очищення + збірка + сервер
export default gulp.series(clean, gulp.parallel(styles, scripts, html, images), serve);
