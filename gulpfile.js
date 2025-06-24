// gulpfile.js
import gulp from 'gulp';
import './tasks/css.js';
import './tasks/javascript.js';
import './tasks/images.js';
import './tasks/html.js';
import './tasks/w3c.js';  // Ajout des tests W3C

// Tâche de développement (sans minification)
gulp.task('dev', gulp.series(
    gulp.parallel('css', 'javascript:dev', 'images', 'html')
));

// Tâche de production (avec minification)
gulp.task('build', gulp.series(
    gulp.parallel('css:prod', 'javascript', 'images', 'html')
));

// Tests
gulp.task('test', gulp.series('build', 'w3c'));

// Watch
gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', gulp.series('css'));
    gulp.watch('src/js/**/*.js', gulp.series('javascript:dev')); // Mode dev pour watch
    gulp.watch('src/img/**/*', gulp.series('images'));
    gulp.watch('src/twig/**/*.twig', gulp.series('html'));
});

// Tâche par défaut (développement)
gulp.task('default', gulp.series('dev', 'watch'));