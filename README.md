# Room & PG Finder

A responsive web app for finding rooms, PGs and flats to rent. Tenants can search by city, budget and amenities, save places they like and message the owner. Owners can post their property with photos and see every enquiry in one place.

Built with the MERN stack: MongoDB, Express, React and Node.js.

## Features

**For tenants**
- Sign up and log in securely
- Search by city and area
- Filter by type (room, PG, flat), boys or girls, rent range and amenities
- View photos, rent, deposit, amenities and the location on a map
- Save listings and view them later
- Send a message to the owner from the listing page

**For owners**
- Post a room, PG or flat with up to 5 photos
- Mark a listing as taken or available again
- Delete listings
- Read all enquiries received, with the tenant's name, email and phone

**General**
- Fully responsive: works on phones, tablets and laptops
- Hamburger menu and collapsible filters on small screens
- Password hashing and token-based login

## Tech stack

| Part | Tools |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcryptjs |
| Uploads | Multer |

## Project structure

```
room-pg-finder/
├── client/                 React frontend
│   └── src/
│       ├── components/     Navbar, ListingCard
│       ├── pages/          Listings, ListingDetail, AuthPages, Favorites, Dashboard, AddListing
│       ├── context/        AuthContext (who is logged in)
│       └── api.js          Axios setup
└── server/                 Express backend
    ├── models/             User, Listing, Enquiry
    ├── routes/             auth, listings, enquiries, users
    ├── middleware/         auth check, photo upload
    └── server.js
```

## Run it on your computer

You need Node.js 18 or newer and a MongoDB database. A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works well.

**1. Download the project**

```bash
git clone https://github.com/faizanhub141/room-pg-finder.git
cd room-pg-finder
```

You can also use the green Code button on GitHub and choose Download ZIP.

**2. Start the backend**

```bash
cd server
copy .env.example .env      # on Mac or Linux: cp .env.example .env
npm install
npm run dev
```

Open the new `.env` file and fill in your own values (see the table below). When it works, the terminal shows `Server running on port 5000`.

**3. Start the frontend** in a second terminal

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

**4. Try it out**
1. Sign up as an owner and post a room with photos.
2. Log out and sign up as a tenant.
3. Search for the room and send the owner a message.

## Environment variables

Create `server/.env` with these values. Never upload this file to GitHub.

| Name | What it is |
|---|---|
| `PORT` | Port for the backend. Use `5000`. |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| `CLIENT_URL` | Frontend address. Use `http://localhost:5173` while testing. |

For the frontend, set `VITE_API_URL` in `client/.env` only when the backend is hosted somewhere else. Leave it empty on your own computer.

## API overview

| Method | Route | Who can use it |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | Anyone |
| GET | `/api/auth/me` | Logged in |
| GET | `/api/listings` (city, area, type, gender, minRent, maxRent, amenities, page) | Anyone |
| GET | `/api/listings/:id` | Anyone |
| GET | `/api/listings/mine` | Owner |
| POST, PUT, DELETE | `/api/listings` and `/api/listings/:id` | Owner |
| POST | `/api/enquiries` | Logged in |
| GET | `/api/enquiries/mine` | Logged in |
| GET | `/api/enquiries/received` | Owner |
| GET | `/api/users/favorites` | Logged in |
| POST | `/api/users/favorites/:listingId` | Logged in |

## Known limits

- Photos are saved on the server's disk. Free hosting services clear that disk when they restart, so switch to Cloudinary or Amazon S3 before going live.
- There is no admin panel yet. The `admin` role exists in the database but has no screens.
- Owners can delete a listing or mark it taken, but cannot edit the text of an existing listing from the dashboard. The API already supports editing.

## Ideas for the next version

- Edit listing page for owners
- Admin panel to approve listings
- Cloudinary photo storage
- Map view with pins for all search results
- Email or SMS alert to the owner on a new enquiry

## Deploying

- Database: MongoDB Atlas
- Backend: Render or Railway. Use the `server` folder, start command `npm start`, and add the four environment variables.
- Frontend: Vercel or Netlify. Use the `client` folder, build command `npm run build`, and set `VITE_API_URL` to your backend address.

## Author

Made by **Faizan Khan**.
GitHub profile :https://github.com/faizanhub141
Linkdin: faizankhan8
