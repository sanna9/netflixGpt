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
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_TMDB_KEY=your_tmdb_api_key
REACT_APP_OPENAI_KEY=your_openai_api_key
```

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

## Next Steps

- Watchlist and saved movies
- Personalized recommendations
- More movie details and ratings
- Accessibility, performance, and test improvements

