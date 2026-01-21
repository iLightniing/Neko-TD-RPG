import { spawn } from 'child_process';
import electron from 'electron';
import waitOn from 'wait-on';

// 1. Lance Nuxt
const nuxt = spawn('npx', ['nuxi', 'dev'], { 
    shell: true, 
    stdio: 'inherit' 
});

// 2. Attend que Nuxt soit prêt sur le port 3000
waitOn({ 
    resources: ['http://localhost:3000'],
    timeout: 30000 // 30 secondes max
}).then(() => {
    console.log('--- Nuxt est prêt, lancement d\'Electron... ---');
    
    // 3. Lance Electron en pointant sur ton fichier main.cjs
    const child = spawn(electron, ['electron/main.cjs'], { 
        shell: true, 
        stdio: 'inherit',
        env: { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:3000' }
    });

    child.on('close', () => {
        nuxt.kill();
        process.exit();
    });
}).catch((err) => {
    console.error('Erreur d\'attente du serveur Nuxt:', err);
});