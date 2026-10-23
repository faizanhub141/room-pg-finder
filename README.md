# Room & PG Finder (MERN)

Responsive app to find rooms, PGs and flats. Tenants search/filter, save favourites and send enquiries; owners add listings with photos and manage enquiries.

**Stack:** React (Vite) + Tailwind CSS, Node + Express, MongoDB (Mongoose), JWT auth, Multer uploads.

## Run locally
Requires Node 18+ and MongoDB (local or Atlas).

```bash
# 1. Backend
cd server
cp .env.example .env     # edit MONGO_URI and JWT_SECRET
npm install
npm run dev              # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev              # http://localhost:5173
```

Register as **owner** to add listings, and as **tenant** to search and enquire.

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/listings (city, area, type, gender, minRent, maxRent, amenities, page) | public |
| GET | /api/listings/:id | public |
| GET | /api/listings/mine | owner |
| POST / PUT / DELETE | /api/listings(/:id) | owner |
| POST | /api/enquiries | logged in |
| GET | /api/enquiries/mine, /api/enquiries/received | logged in / owner |
| GET / POST | /api/users/favorites(/:listingId) | logged in |

## Deploy
- Database: MongoDB Atlas
- Backend: Render/Railway (root `server`, start `npm start`, set env vars, `CLIENT_URL` = your frontend URL)
- Frontend: Vercel/Netlify (root `client`, build `npm run build`, set `VITE_API_URL` = backend URL)
- Note: uploaded images are stored on the server disk, which free hosts wipe on restart. For production switch `middleware/upload.js` to Cloudinary or S3.
