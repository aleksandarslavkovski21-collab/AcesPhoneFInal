# Railway Deployment Instructions

To successfully deploy this project on Railway, please follow these steps in your Railway dashboard:

## 1. Environment Variables
Railway will need several environment variables to function correctly. Go to the **Variables** tab of your service and add:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Set to `production` |
| `PORT` | Set to `3000` (Railway usually injects this automatically) |
| `ADMIN_PASSWORD` | Choose a strong password for your admin panel |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |
| `ALLOWED_EMAIL` | The email address allowed to access the admin panel |
| `APP_URL` | The public URL Railway gives you (e.g., `https://your-app.up.railway.app`) |

## 2. Persistent Storage (SQLite)
Since this app uses SQLite, your database will be deleted every time you deploy unless you set up a **Volume**.

1. Go to **Settings** > **Volumes** > **Add Volume**.
2. Mount the volume at `/app/data` (or similar).
3. **Important**: If you change the mount path, you must update the `DB_FILE` path in `server.ts` to point to the volume.

Currently, the app stores data in the root directory as `aces-phones.db`. For Railway, it is recommended to move this to a persistent path.

## 3. Build & Start
Railway will automatically detect the `package.json` and run:
- `npm install`
- `npm run build` (via the `prestart` script we added)
- `npm start`

Your app should be live shortly after deployment!
