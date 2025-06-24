// tasks/html.js
import gulp from 'gulp';
import twig from 'gulp-twig';

gulp.task('html', function() {
    return gulp.src('src/twig/*.twig') // Seules les pages, pas les layouts
        .pipe(twig({
            base: 'src/twig/',  // Pour que les extends/includes fonctionnent
            errorLogToConsole: true
        }))
        .on('error', function(err) {
            console.error('❌ Erreur Twig:', err.message);
            this.emit('end');
        })
        .pipe(gulp.dest('dist'));
});