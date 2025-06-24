// tasks/w3c.js
import gulp from 'gulp';
import through2 from 'through2';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Validation W3C
gulp.task('w3c', () => {
  return gulp.src('dist/**/*.html')
    .pipe(through2.obj(function(file, enc, cb) {
      const contents = file.contents.toString();
      const fileName = path.basename(file.path);
      
      console.log(`🔍 Validation W3C: ${fileName}`);
      
      fetch('https://validator.w3.org/nu/?out=json', {
        method: 'POST',
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: contents
      })
      .then(response => response.json())
      .then(data => {
        const errors = data.messages.filter(msg => msg.type === 'error');
        const warnings = data.messages.filter(msg => msg.type === 'info');
        
        console.log(`📊 Résultats pour ${fileName}:`);
        console.log(`   Erreurs: ${errors.length}`);
        console.log(`   Avertissements: ${warnings.length}`);
        
        if (errors.length > 0) {
          console.log('❌ Erreurs détectées:');
          errors.forEach(msg => {
            console.log(`   - Ligne ${msg.lastLine}: ${msg.message}`);
          });
        } else {
          console.log('✅ Aucune erreur W3C');
        }
        
        // Rapport
        const reportPath = path.join('reports/w3c', `${fileName}.json`);
        fs.mkdirSync('reports/w3c', { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(data, null, 2));
        
        console.log(`📄 Rapport: ${reportPath}\n`);
      })
      .catch(error => {
        console.error('❌ Erreur validation:', error);
      })
      .finally(() => cb(null, file));
    }));
});