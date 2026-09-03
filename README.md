# NetflixGPT

A Netflix-style movie app with AI search, trailers, and movie recommendations.

## What It Includes

1. **Authentication**
   - Sign up and sign in with email and password
   - MongoDB Atlas user storage
   - bcrypt password hashing
   - JWT sessions

2. **Movie browsing**
   - Now Playing, Popular, and Trending movies
   - Movie details and trailers
   - Responsive movie cards and layouts

3. **AI search**
   - Natural-language search with OpenAI
   - Movie data and recommendations from TMDB

## Built With

- **Frontend:** React, React Router, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Authentication:** JWT and bcryptjs
- **APIs:** TMDB and OpenAI

## Project Structure

```text
client/    React frontend
server/    Express backend and MongoDB auth
```

## Quick Start

### 1. Install

```powershell
npm.cmd --prefix client install
npm.cmd --prefix server install
```

### 2. Add environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
OPENAI_API_KEY=your_openai_api_key
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_KEY=your_tmdb_api_key
```

The OpenAI key belongs in `server/.env` as `OPENAI_API_KEY`. Never put a
secret key in a variable beginning with `REACT_APP_`, because React includes
those values in the public browser bundle.

### 3. Run

Open two terminals:

```powershell
npm.cmd --prefix server start
npm.cmd --prefix client start
```

- App: [http://localhost:3000](http://localhost:3000)
- API health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Auth Endpoints

- `POST /api/auth/signup` - Create an account
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/me` - Get the current user

## Possible Future Improvements

- Add end-to-end browser tests
- Add password reset and email verification
- Move TMDB requests behind the API for stricter key control

## Deploy to Vercel (free Hobby plan)

1. Push this repository to GitHub and import it into Vercel.
2. Keep the Vercel project **Root Directory** at the repository root.
3. Add these Vercel environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `REACT_APP_TMDB_KEY`
4. Do not add `REACT_APP_API_URL` on Vercel; the frontend and API use the same URL.
5. In MongoDB Atlas, allow Vercel connections. For a student demo, Atlas network
   access can temporarily allow `0.0.0.0/0`; use a strong database password.
6. Deploy. The included `vercel.json` builds React and routes `/api/*` to Express.

After deployment, test sign-up, sign-in, movie browsing, AI search, saving a
movie, refreshing the page, and opening a movie URL directly.

