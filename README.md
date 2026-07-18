# VerbaAI

Quick run instructions for the VerbaAI workspace (backend + frontend).

Prerequisites
- Node.js (16+ recommended) and npm
- MongoDB running locally (or provide `MONGODB_URI`)

Backend (verbaai-backend)

1. Install dependencies

```bash
cd verbaai-backend
npm install
```

2. Environment (create a `.env` in `verbaai-backend` or export variables)

Example `.env`:

```
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/verbaai
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENAI_API_KEY=
```

3. Run in development

```bash
npm run dev
```

4. Run tests

```bash
npm test
```

Frontend (verbaai-frontend)

1. Install dependencies

```bash
cd verbaai-frontend
npm install
```

2. Start dev server (Vite)

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

Full stack

1. Start backend first (so API is available): `verbaai-backend` -> `npm run dev`
2. Start frontend: `verbaai-frontend` -> `npm run dev`

Useful URLs
- Backend API root: http://localhost:5001/
- Frontend (Vite): http://localhost:5173/

Notes
- If you run into port conflicts, change `PORT` in the backend `.env` or pass `PORT` when starting.
- Ensure MongoDB is running or set `MONGODB_URI` to a reachable database.

If you want, I can commit this README and update the project `package.json` scripts or create a root-level script to start both services together.
