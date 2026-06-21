// PM2 process config — Silhouette Paradox (Next.js 16 standalone server)
//
// Runtime model (mirrors the MailSort setup on this VPS):
//   PM2 → node server.js  ·  binds 127.0.0.1:39000  ·  OpenResty (1Panel) reverse-proxies your domain → 39000
//
// Port 39000 is loopback-only. Do NOT open it in UFW (same policy as MailSort's 3001).
// Start/update via ./deploy.sh — it builds, copies static assets, then runs `pm2 startOrReload`.

module.exports = {
  apps: [
    {
      name: 'silhouette-paradox',
      // The standalone bundle is self-contained; run server.js from inside it.
      cwd: '/opt/silhouette-paradox/.next/standalone',
      script: 'server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        HOSTNAME: '127.0.0.1', // loopback only — OpenResty sits in front
        PORT: '39000',
        // NOTE: the domain (NEXT_PUBLIC_SITE_URL) is a BUILD-time value, set via
        // .env.deploy before `npm run build` (see deploy.sh). It cannot be set here —
        // runtime env does not affect an already-inlined NEXT_PUBLIC_* value.
      },
    },
  ],
}
