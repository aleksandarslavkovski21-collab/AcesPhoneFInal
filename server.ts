import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';

import { initDB } from './src/db/init.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Initialization
// Railway automatically sets RAILWAY_VOLUME_MOUNT_PATH when a volume is attached.
// If available, use it to persist data across deployments. Otherwise, fallback to local directory.
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const DB_FILE = path.join(dataDir, 'aces-phones.db');
const db = initDB(DB_FILE);
const UPLOADS_DIR = path.join(dataDir, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`[Storage] Created uploads directory: ${UPLOADS_DIR}`);
}

// Migration Logic from old db.json
const OLD_DB_PATH = path.join(__dirname, 'db.json');
if (fs.existsSync(OLD_DB_PATH)) {
  try {
    const backupPath = path.join(__dirname, 'db.json.bak');
    console.log(`[Migration] Found old db.json. Migrating to SQLite...`);
    const oldData = JSON.parse(fs.readFileSync(OLD_DB_PATH, 'utf-8'));
    
    // Migrate Phones
    if (oldData.phones && Array.isArray(oldData.phones)) {
      const insertPhone = db.prepare(`
        INSERT OR REPLACE INTO phones (id, brand, model, price, ram, storage, condition, data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      db.transaction(() => {
        for (const phone of oldData.phones) {
          insertPhone.run(
            phone.id, phone.brand, phone.model, String(phone.price), 
            phone.ram || '', phone.storage || '', phone.condition, 
            JSON.stringify(phone)
          );
        }
      })();
      console.log(`[Migration] Migrated ${oldData.phones.length} phones.`);
    }

    // Migrate Config
    if (oldData.config) {
      const insertConfig = db.prepare(`INSERT OR REPLACE INTO config (id, data) VALUES (1, ?)`);
      insertConfig.run(JSON.stringify(oldData.config));
      console.log(`[Migration] Migrated AppConfig.`);
    }

    // Rename to prevent re-migration
    fs.renameSync(OLD_DB_PATH, backupPath);
    console.log(`[Migration] Renamed db.json to db.json.bak to complete migration.`);
  } catch (e) {
    console.error(`[Migration] Failed to migrate db.json:`, e);
  }
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL || 'aleksandarslavkovski21@gmail.com';

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

// Brute force protection: Max 20 login attempts per 15 minutes (increased for testing)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Премногу обиди. Пробајте повторно по 15 минути.' },
  standardHeaders: true,
  legacyHeaders: false,
});

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Trust the first proxy (e.g. Railway, Nginx)
  // This is required for express-rate-limit to work correctly behind a proxy
  app.set('trust proxy', 1);

  app.use(cors());
  app.use(bodyParser.json({ limit: '100mb' })); // Increased for multi-image uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // API Routes
  app.post('/api/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    const cleanInput = password ? String(password).trim() : '';
    const cleanAdminPass = String(ADMIN_PASSWORD).trim();
    
    if (cleanInput === cleanAdminPass) {
      res.json({ success: true, token: 'secret-session-token' });
    } else {
      res.status(401).json({ success: false, error: 'Погрешна лозинка' });
    }
  });

  // Google OAuth Routes
  app.get('/api/auth/google/url', (req, res) => {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Google OAuth is not configured' });
    }
    
    // Use APP_URL if available, otherwise try to detect it
    let baseUrl = process.env.APP_URL;
    if (!baseUrl) {
      const host = req.get('host');
      const protocol = host?.includes('localhost') ? 'http' : 'https';
      baseUrl = `${protocol}://${host}`;
    }
    
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/auth/google/callback`;
    console.log('Constructed Redirect URI (Auth):', redirectUri);
    
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      redirect_uri: redirectUri,
    });
    res.json({ url });
  });

  app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    
    let baseUrl = process.env.APP_URL;
    if (!baseUrl) {
      const host = req.get('host');
      const protocol = host?.includes('localhost') ? 'http' : 'https';
      baseUrl = `${protocol}://${host}`;
    }
    
    const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/auth/google/callback`;
    console.log('Constructed Redirect URI (Callback):', redirectUri);

    try {
      const { tokens } = await client.getToken({
        code: code as string,
        redirect_uri: redirectUri,
      });
      client.setCredentials(tokens);

      const userInfo = await client.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      const email = (userInfo.data as any).email;

      if (email === ALLOWED_EMAIL) {
        res.send(`
          <html>
            <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
              <div>
                <h2 style="color: #059669;">Успешна најава!</h2>
                <p>Прозорецот ќе се затвори автоматски...</p>
                <script>
                  // 1. Try postMessage
                  if (window.opener) {
                    window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
                  }
                  
                  // 2. Fallback: use localStorage signal
                  localStorage.setItem('google_auth_success', Date.now().toString());
                  
                  // 3. Close window
                  setTimeout(() => {
                    window.close();
                    // If still open, show manual close
                    document.body.innerHTML = '<h2>Најавени сте. Можете да го затворите овој прозорец.</h2>';
                  }, 500);
                </script>
              </div>
            </body>
          </html>
        `);
      } else {
        res.send(`
          <html>
            <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fef2f2; color: #991b1b; text-align: center; padding: 20px;">
              <div>
                <h1 style="font-size: 48px; margin-bottom: 10px;">🚫</h1>
                <h2 style="font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Пристапот е одбиен</h2>
                <p style="font-weight: 500; opacity: 0.8;">Вашиот емаил (${email}) нема дозвола за пристап до овој панел.</p>
                <button onclick="window.close()" style="margin-top: 20px; background: #991b1b; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">Затвори</button>
              </div>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  app.get('/api/data', (req, res) => {
    try {
      const phonesRows = db.prepare(`SELECT data FROM phones ORDER BY created_at DESC`).all();
      const configRow = db.prepare(`SELECT data FROM config WHERE id = 1`).get();
      
      const phones = phonesRows.map((row: any) => {
        const phone = JSON.parse(row.data);
        // Include stats if needed
        return phone;
      });
      const config = configRow ? JSON.parse((configRow as any).data) : null;
      
      res.json({ phones, config });
    } catch (e) {
      console.error('Failed to get data from sqlite:', e);
      res.status(500).json({ error: 'Database read failed' });
    }
  });

  const handleBase64Image = (base64Str: string, id: string, suffix: string) => {
    if (!base64Str || !base64Str.startsWith('data:image/')) return base64Str;
    try {
      const match = base64Str.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (!match) return base64Str;
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const data = match[2];
      const buffer = Buffer.from(data, 'base64');
      const filename = `${id}_${suffix}.${ext}`;
      const filepath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filepath, buffer);
      return `/uploads/${filename}`;
    } catch (e) {
      console.error('Failed to save image:', e);
      return base64Str;
    }
  };

  app.post('/api/phones', (req, res) => {
    try {
      const newPhones = req.body;
      if (!Array.isArray(newPhones)) {
        return res.status(400).json({ success: false, error: 'Expected array of phones' });
      }

      db.transaction(() => {
        db.prepare('DELETE FROM phones').run();
        const insert = db.prepare(`
          INSERT INTO phones (id, brand, model, price, ram, storage, condition, size_kb, data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const phone of newPhones) {
          // Process images: move Base64 out to files
          if (phone.images && Array.isArray(phone.images)) {
            phone.images = phone.images.map((img: string, idx: number) => 
              handleBase64Image(img, phone.id, `img_${idx}`)
            );
          }
          if (phone.image) {
            phone.image = handleBase64Image(phone.image, phone.id, 'main');
          }
          if (phone.thumbnail) {
            phone.thumbnail = handleBase64Image(phone.thumbnail, phone.id, 'thumb');
          }

          // Calculate approximate size in KB
          const jsonData = JSON.stringify(phone);
          let totalSizeB = Buffer.byteLength(jsonData, 'utf8');
          
          // Add file sizes if applicable
          const imagePaths = [phone.image, ...(phone.images || []), phone.thumbnail];
          for (const imgP of imagePaths) {
            if (imgP && imgP.startsWith('/uploads/')) {
              const fullP = path.join(dataDir, imgP);
              if (fs.existsSync(fullP)) {
                totalSizeB += fs.statSync(fullP).size;
              }
            }
          }
          const sizeKb = Math.round(totalSizeB / 1024);

          insert.run(
            phone.id, phone.brand, phone.model, String(phone.price), 
            phone.ram || '', phone.storage || '', phone.condition,
            sizeKb,
            jsonData
          );
        }
      })();
      res.json({ success: true });
    } catch (e) {
      console.error('Failed to write phones to sqlite:', e);
      res.status(500).json({ success: false, error: 'Database write failed' });
    }
  });

  app.post('/api/config', (req, res) => {
    try {
      const newConfig = req.body;
      const insert = db.prepare(`INSERT OR REPLACE INTO config (id, data) VALUES (1, ?)`);
      insert.run(JSON.stringify(newConfig));
      res.json({ success: true });
    } catch (e) {
      console.error('Failed to write config to sqlite:', e);
      res.status(500).json({ success: false, error: 'Database write failed' });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at:`);
    console.log(`  > Local:    http://localhost:${port}`);
    console.log(`  > Network:  http://0.0.0.0:${port} (listening on all interfaces)`);
  });
}

startServer();
