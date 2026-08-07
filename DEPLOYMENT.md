# VerbaAI — Deployment Guide

This guide walks through deploying VerbaAI to production: MongoDB Atlas for
the database, Render (or Railway) for the backend, and Vercel (or Netlify)
for the frontend. Any Node host / static host combination works the same
way — the important part is the environment variables and CORS wiring.

---

## 1. Database — MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Under **Database Access**, create a database user with a strong password.
3. Under **Network Access**, add an IP allowlist entry. For most PaaS hosts
   (Render, Railway) that don't have a fixed IP, allow `0.0.0.0/0` (all IPs)
   — access is still gated by the username/password in the connection
   string, not by network exposure alone.
4. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/verbaai?retryWrites=true&w=majority
   ```
   Replace `<user>`/`<password>` with your database user's credentials, and
   set the database name (`verbaai`) explicitly if it isn't already in the
   string.

---

## 2. Gemini API Key

Get a free key at https://aistudio.google.com/app/apikey. This is used
server-side only — it must never be exposed to the frontend or committed to
source control.

---

## 3. Backend — Render (or Railway)

1. Push the `backend/` folder to a Git repository (or the whole monorepo —
   Render lets you set a root directory).
2. On Render: **New → Web Service**, connect the repo, set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add every environment variable from `backend/.env.example` (see
   `ENVIRONMENT_VARIABLES.md` for what each one means) under the service's
   **Environment** tab. In particular:
   - `MONGODB_URI` — your Atlas connection string from step 1
   - `JWT_SECRET` and `REFRESH_TOKEN_SECRET` — generate two long, random,
     **different** values (e.g. `openssl rand -hex 32` twice)
   - `GEMINI_API_KEY_1` — from step 2
   - `GEMINI_API_KEY_2` and `GEMINI_API_KEY_3` — optional extra Gemini keys
     for rotation/failover
   - `CLIENT_URL` — leave as `http://localhost:5173` for now; you'll update
     this after the frontend is deployed (step 4)
   - `NODE_ENV=production` — this matters: it makes the refresh-token cookie
     use `Secure` + `SameSite=None`, which is required for the cookie to
     work across the different domains that Render and Vercel will give you
4. Deploy. Once live, visit `https://your-backend.onrender.com/api/health`
   — you should see `{"success":true,"message":"VerbaAI backend is running"}`.

---

## 4. Frontend — Vercel (or Netlify)

1. Push the `frontend/` folder (or the monorepo, with root directory set to
   `frontend`) to the same or a separate repo.
2. On Vercel: **New Project**, import the repo, set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add one environment variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy. Once live, you'll have a URL like `https://verbaai.vercel.app`.

---

## 5. Connect them — update CORS

Go back to the backend's environment variables (Render/Railway) and update:
```
CLIENT_URL=https://verbaai.vercel.app
```
Redeploy the backend so the change takes effect. This is what allows the
`cors` middleware to accept requests from your live frontend, and it's also
the `Path`/origin the refresh-token cookie is scoped against.

---

## 6. Post-deploy checklist

- [ ] Visit the deployed frontend, sign up for a new account, confirm it
      redirects to the Dashboard.
- [ ] Refresh the page while logged in — you should stay logged in (tests
      the refresh-token cookie flow across your real domains).
- [ ] Try the Communication Coach (text mode is enough to verify Gemini is
      wired correctly) and confirm a session appears in History.
- [ ] Upload a small PDF resume and confirm the ATS analysis returns.
- [ ] Check the Dashboard shows real, non-zero numbers after using a
      feature.
- [ ] Open browser dev tools → Network tab → confirm the `refreshToken`
      cookie has `Secure` and `SameSite=None` set (only true if
      `NODE_ENV=production` was set on the backend).
- [ ] Confirm your Gemini API keys and both JWT secrets are **not** visible
      anywhere in the frontend's built JavaScript (they shouldn't be —
      they're backend-only — but it's worth a sanity check).

---

## Notes

- **Voice input** (Communication Coach) requires HTTPS in production
  (browsers block microphone access on plain HTTP except on `localhost`) —
  both Vercel and Render serve HTTPS by default, so this works out of the box.
- **Cold starts:** Render's free tier spins down after inactivity; the first
  request after idle can take 30–60 seconds. This is a hosting-tier
  limitation, not an application bug.
- **Scaling the database:** MongoDB Atlas's free tier (M0) is fine for a
  portfolio/demo. For real traffic, upgrade the cluster tier and consider
  adding read replicas.
