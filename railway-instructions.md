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
Since this app uses SQLite, your database will be deleted every time you deploy/restart unless you set up a **Volume**.

1.  **Create Volume:**
    *   In your Railway project, click **+ New** > **Volume**.
    *   For **Mount Path**, enter exactly: `/app/data`
2.  **Attach to Service:**
    *   Go to your Service settings, then to the **Volumes** tab.
    *   If the volume isn't already attached, attach it.
3.  **Automatic Code Support:**
    *   The app's `server.ts` is already updated to automatically find this path via the `RAILWAY_VOLUME_MOUNT_PATH` variable.
    *   Your `aces-phones.db` will now be safely stored in the volume and will persist forever!


## 3. Build & Start
Railway will automatically detect the `package.json` and run:
- `npm install`
- `npm run build` (via the `prestart` script we added)
- `npm start`

Your app should be live shortly after deployment!
