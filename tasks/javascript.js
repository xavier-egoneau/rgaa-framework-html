// tasks/javascript.js
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import babel from 'gulp-babel';

gulp.task('javascript', () => {
  return gulp.src([
    'src/js/core/*.js',         // Tous les fichiers core
    'src/js/components/*.js',   // Tous les composants
    'src/js/rgaa.js'           // Le fichier principal en dernier
  ])
    .pipe(concat('rgaa.js'))     // Concatène tout en un fichier
    .pipe(babel({               // Transpile ES6 → ES5
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())             // Minifie le code
    .on('error', function(err) {
      console.error('❌ Erreur JS:', err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/assets/js'));
});

// JavaScript - Développement (sans uglify pour debug)
gulp.task('javascript:dev', () => {
  return gulp.src([
    'src/js/core/*.js',
    'src/js/components/*.js',
    'src/js/rgaa.js'
  ])
    .pipe(concat('rgaa.js'))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest('dist/assets/js'));
});