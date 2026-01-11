const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');

// Define the new directory structure
const dirs = [
    'src/config',
    'src/services',
    'src/routes',
    'src/middleware',
    'src/utils',
    'db',
    'scripts'
];

// Create directories
if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir);
dirs.forEach(dir => {
    const fullPath = path.join(backendDir, dir);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// Define file moves
const moves = [
    { src: 'index.js', dest: 'src/index.js' },
    { src: 'db.js', dest: 'src/config/db.js' },
    { src: 'syncService.js', dest: 'src/services/syncService.js' },
    { src: 'stocksTrader.js', dest: 'src/services/stocksTrader.js' },
    { src: 'authRoutes.js', dest: 'src/routes/authRoutes.js' },
    { src: 'authMiddleware.js', dest: 'src/middleware/authMiddleware.js' },
    { src: 'encryption.js', dest: 'src/utils/encryption.js' },
    { src: 'schema.sql', dest: 'db/schema.sql' },
    { src: 'setup_db.js', dest: 'scripts/setup_db.js' },
    { src: 'manual_test.js', dest: 'scripts/manual_test.js' },
    { src: 'package.json', dest: 'package.json' },
    { src: '.env', dest: '.env' },
    { src: 'server.js', dest: 'src/server_legacy.js' } // Backup old server file
];

// Execute moves
moves.forEach(move => {
    const srcPath = path.join(rootDir, move.src);
    const destPath = path.join(backendDir, move.dest);
    if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
        console.log(`Moved: ${move.src} -> backend/${move.dest}`);
    } else {
        console.warn(`Skipped (not found): ${move.src}`);
    }
});

console.log('✅ Project reorganization complete.');