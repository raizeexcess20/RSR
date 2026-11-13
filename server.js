import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync, exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

// Automatically build frontend assets if dist folder is missing
if (!fs.existsSync(indexPath)) {
  console.log('Production build not found in dist/. Automatically building assets now...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('Auto-build failed:', error);
  }
}

app.use(express.static(distDir));

app.get('*', (req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Application build in progress or dist/index.html missing. Run "npm run build".');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  const localUrl = `http://localhost:${PORT}`;
  console.log(`RSR server running at ${localUrl}`);

  // Automatically open browser preview when running locally outside AI Studio and non-CI
  if (process.env.DISABLE_HMR !== 'true' && !process.env.CI && process.env.NODE_ENV !== 'test') {
    const startCmd =
      process.platform === 'win32'
        ? `start ${localUrl}`
        : process.platform === 'darwin'
        ? `open ${localUrl}`
        : `xdg-open ${localUrl}`;

    exec(startCmd, () => {
      // Ignore background open errors in headless setups
    });
  }
});

