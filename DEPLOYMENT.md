# Deployment Guide

This repo is a monorepo with two deployable apps:

- `frontend`: React + Vite site
- `backend`: Laravel API

Recommended production setup:

- Vercel project 1 for `frontend`
- Vercel project 2 for `backend`
- Supabase for PostgreSQL
- S3-compatible object storage for uploads used by the Laravel `public` disk

## 1. Create the Supabase project

Create a new Supabase project, then open `Connect` in the Supabase dashboard and copy either:

- the direct Postgres connection string on port `5432`, or
- the transaction pooler connection string on port `6543`

Use those values for the Laravel database environment variables.

## 2. Prepare backend environment variables

In the Vercel project for `backend`, set these variables:

```env
APP_NAME=Portfolio API
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-project.vercel.app
APP_KEY=base64:generate-this-locally

DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=your-supabase-user
DB_PASSWORD=your-supabase-password
DB_SSLMODE=require

LOG_CHANNEL=stderr
CACHE_STORE=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync

FILESYSTEM_DISK=public
AWS_ACCESS_KEY_ID=your-storage-key
AWS_SECRET_ACCESS_KEY=your-storage-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-storage-bucket
AWS_URL=https://your-public-storage-url
AWS_ENDPOINT=https://your-s3-compatible-endpoint
AWS_USE_PATH_STYLE_ENDPOINT=true
```

Notes:

- `APP_KEY` must be generated from Laravel, for example with `php artisan key:generate --show`.
- The app writes portfolio images, profile photos, certificates, posters, and CV files to the `public` disk. Do not use local filesystem storage on Vercel for those uploads.
- If you want uploads to live inside Supabase too, use Supabase Storage only if you have S3-compatible credentials/endpoints available for your setup. Otherwise, use another S3-compatible bucket.

## 3. Run database migrations against Supabase

Run these commands from `backend` after pointing your local `.env` at the Supabase database:

```bash
php artisan key:generate
php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
```

This creates the schema and your admin login.

## 4. Deploy the backend to Vercel

Create a new Vercel project with:

- Root Directory: `backend`
- Framework Preset: `Other`

This repo already includes:

- `backend/vercel.json`
- `backend/api/index.php`

Those files route all requests through Laravel using the `vercel-php` runtime and move writable caches/views to `/tmp`.

## 5. Prepare frontend environment variables

In the Vercel project for `frontend`, set:

```env
VITE_API_URL=https://your-backend-project.vercel.app/api
```

## 6. Deploy the frontend to Vercel

Create a second Vercel project with:

- Root Directory: `frontend`
- Framework Preset: `Vite`

This repo already includes `frontend/vercel.json` so deep links such as `/projects/my-slug` and `/admin/dashboard` work after refresh.

## 7. Post-deploy checks

Verify these URLs:

- Frontend home page loads
- `https://your-backend-project.vercel.app/api/profile`
- `https://your-backend-project.vercel.app/api/projects`
- Frontend admin login works
- Uploading a new project image works
- Uploaded image URLs open directly

## 8. Local helper env files

Helpful files added in this repo:

- `frontend/.env.example`
- `backend/.env.example`

Copy their values into your real environment settings as needed.
