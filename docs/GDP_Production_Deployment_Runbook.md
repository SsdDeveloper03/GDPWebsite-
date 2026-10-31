# Growth Ka Digital Partner (GDP) — Production Deployment Runbook

**Document Version:** 1.0.0  
**Project:** Growth Ka Digital Partner (GDP)  
**Status:** DRAFT / FOR CLIENT REVIEW (No Deployment Performed)  
**Execution Authority:** Requires Explicit Written Approval from Bhavesh Sir  

---

## 1. Pre-Deployment Gate & Approval Checklist

Do **NOT** begin deployment until every checkbox below has been verified:

- [ ] **Stakeholder Approval:** Bhavesh Sir has reviewed the local staging application (`http://localhost:5173`) and formally signed off on design, content, and branding.
- [ ] **Hosting Plan Confirmed:** Verified Linux VPS environment with Node.js v20+ and PM2 is provisioned and accessible via SSH.
- [ ] **Database Backup:** Full backup of SQL Server database `GDPWebsiteDB` completed and archived before applying any migration.
- [ ] **Existing Site Backup:** Current Hostinger web root directory (`public_html/`) downloaded and archived locally.
- [ ] **DNS & Email Records Documented:** Current DNS zone records (especially `MX`, `TXT`, `SPF`, `DKIM`, and `DMARC`) exported to prevent email downtime.
- [ ] **Production Secrets Ready:** Dedicated production `.env` prepared with cryptographically secure session secrets and production database credentials.

---

## 2. Production Build Execution

Execute production builds inside the clean local repository:

### Step 2.1: Frontend Production Build
```bash
cd frontend
npm ci
npm run build
```
- **Verification:** Confirm `dist/` is created with `index.html`, minified CSS, and JavaScript chunks.
- **Expected Output:**
  ```text
  ✓ built in ~4s
  dist/index.html                   2.02 kB
  dist/assets/index-[hash].css    136.92 kB
  dist/assets/index-[hash].js     676.26 kB
  ```

### Step 2.2: Backend Production Build
```bash
cd ../backend
npm ci
npm run build
```
- **Verification:** Confirm `dist/` contains compiled JavaScript output (`dist/index.js`, `dist/routes/`, etc.).

---

## 3. Server Provisioning & Configuration (Linux VPS)

### Step 3.1: Directory Structure on Server
```bash
mkdir -p /var/www/gdp-platform/frontend
mkdir -p /var/www/gdp-platform/backend
```

### Step 3.2: Deploy Backend Files & Dependencies
Copy backend `dist/`, `package.json`, `package-lock.json`, `prisma/`, and production `.env` to `/var/www/gdp-platform/backend/`.
```bash
cd /var/www/gdp-platform/backend
npm ci --omit=dev
npx prisma generate
```

### Step 3.3: Database Migration Execution
```bash
npx prisma migrate deploy
```
*(Runs only pending forward migrations; does not reset or delete existing data).*

### Step 3.4: Process Supervision via PM2
Create `ecosystem.config.cjs`:
```javascript
module.exports = {
  apps: [
    {
      name: "gdp-backend",
      script: "dist/index.js",
      cwd: "/var/www/gdp-platform/backend",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
```
Start and persist the daemon:
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 4. Web Server & Reverse Proxy Configuration (Nginx)

Place Nginx configuration at `/etc/nginx/sites-available/growthkadigitalpartner.com`:

```nginx
server {
    server_name growthkadigitalpartner.com www.growthkadigitalpartner.com;

    # Static Frontend SPA
    root /var/www/gdp-platform/frontend/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA Client-Side Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static Asset Caching
    location ~* \.(webp|png|jpg|jpeg|svg|ico|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Proxy for Socket.IO
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Enable site and test configuration:
```bash
ln -s /etc/nginx/sites-available/growthkadigitalpartner.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 5. SSL Certificate & Domain Verification

```bash
certbot --nginx -d growthkadigitalpartner.com -d www.growthkadigitalpartner.com
```

### Critical Email Preservation Rule
When updating DNS `A` records to point to the new VPS IP:
- **DO NOT** modify or delete existing `MX` records (e.g., pointing to Hostinger Titan Mail or Google Workspace).
- **DO NOT** delete `TXT` records for SPF (`v=spf1 ...`), DKIM, or DMARC.
- Verify email deliverability immediately before and after DNS cutover.

---

## 6. Post-Deployment Smoke Tests

Execute these verification checks immediately following cutover:

1. **HTTP to HTTPS Redirect:** Confirm `http://growthkadigitalpartner.com` redirects to `https://`.
2. **Frontend Loading:** Confirm homepage loads with zero console errors and favicon renders.
3. **API Health Check:** Visit `https://growthkadigitalpartner.com/api/health` and verify HTTP 200 with `{ status: "ok" }`.
4. **Episode Grid & Modal:** Confirm episodes load from live database and clicking opens 16:9 player.
5. **Contact Inquiry:** Submit test inquiry; verify lead confirmation appears and team alert is received.
6. **Admin Login:** Log into `/admin/login` with provisioned credentials; verify dashboard metrics load.
7. **Mobile Smoke Test:** Visit on smartphone (390px viewport); test mobile hamburger navigation.

---

## 7. Rollback Procedure (Emergency Reversal)

If critical issues or unexpected failures occur during cutover:

1. **Revert DNS `A` Record:** Change domain `A` record back to original Hostinger shared hosting IP address (`TTL = 300`).
2. **Restore Static Files:** If files in Hostinger `public_html` were touched, upload original backup archive.
3. **Stop PM2 Process:** On VPS, run `pm2 stop gdp-backend` to prevent partial operations.
4. **Verify Email:** Confirm incoming and outgoing email continues uninterrupted.
