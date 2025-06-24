import gulp from 'gulp';
import imagemin from 'gulp-imagemin';

gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('src/assets/img'));
});