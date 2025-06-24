// tasks/css.js
import gulp from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';

// Configuration moderne de Sass
const sassCompiler = gulpSass(sass);

gulp.task('css', function() {
    return gulp.src('src/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sassCompiler({
            outputStyle: 'expanded',
            includePaths: ['src/sass'],
            // Configuration moderne pour éviter le legacy warning
            silenceDeprecations: ['legacy-js-api']
        }).on('error', sassCompiler.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'));
});

// Version production (minifiée)
gulp.task('css:prod', function() {
    return gulp.src('src/sass/main.scss')
        .pipe(sassCompiler({
            outputStyle: 'compressed',
            includePaths: ['src/sass'],
            // Configuration moderne pour éviter le legacy warning
            silenceDeprecations: ['legacy-js-api']
        }).on('error', sassCompiler.logError))
        .pipe(gulp.dest('dist/assets/css'));
});