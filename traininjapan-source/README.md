# Train In Japan - Full Source Code

## Application Stack
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: FastAPI (Python 3.11)
- **Database**: MongoDB
- **Authentication**: Emergent Auth + JWT
- **Payments**: Stripe

## What's Included

```
traininjapan-source/
├── backend/              (FastAPI backend)
│   ├── server.py        (Main application)
│   ├── requirements.txt (Python dependencies)
│   └── .env            (Environment variables - CONFIGURE THIS)
│
├── frontend/            (React frontend)
│   ├── src/            (Source code)
│   ├── public/         (Static assets)
│   ├── package.json    (Node dependencies)
│   └── .env           (Frontend config - CONFIGURE THIS)
│
└── traininjapan-app.zip (Complete zipped application)
```

## Quick Start

### 1. Prerequisites
- Node.js 18+ or 20+
- Python 3.11+
- MongoDB (or MongoDB Atlas account)

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Edit .env file with your credentials
nano .env

# Run
python server.py
```

### 3. Frontend Setup
```bash
cd frontend
yarn install

# Edit .env if needed
nano .env

# Development
yarn start

# Production build
yarn build
```

## Environment Variables Required

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017  # or Atlas connection string
DB_NAME=traininjapan
JWT_SECRET_KEY=your-random-secret-key
STRIPE_API_KEY=sk_test_your_stripe_key
CORS_ORIGINS=*
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=              # Leave empty for same domain
REACT_APP_AUTH_URL=https://auth.emergentagent.com
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here  # Optional
```

## Deployment

### Option 1: Download the Zip
```bash
# Download traininjapan-app.zip from this repository
# Extract and follow deployment guide
```

### Option 2: Clone Source Code
```bash
# Clone this repository
git clone https://github.com/administration-TMJ/images.git
cd images/traininjapan-source

# Follow setup instructions above
```

## Deployment Guides Included

All deployment guides are in the zip file:
- `DIGITALOCEAN_DEPLOYMENT.md` - Complete DigitalOcean guide
- `DEPLOYMENT_GUIDE.md` - General deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Quick reference

## Features

- ✅ Bilingual (English/Japanese) with i18n
- ✅ User authentication (Email/Password + Google OAuth)
- ✅ School registration & management
- ✅ Program creation & browsing
- ✅ Booking system
- ✅ Payment processing (Stripe)
- ✅ Admin dashboard
- ✅ Student dashboard
- ✅ School dashboard
- ✅ Responsive design

## Tech Stack Details

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Shadcn UI components
- i18next (internationalization)
- Axios (API calls)

### Backend
- FastAPI
- Motor (async MongoDB driver)
- Pydantic (data validation)
- PassLib + Bcrypt (password hashing)
- JWT authentication
- Stripe integration

### Database Schema
- Users
- Schools
- Programs (Courses)
- Bookings
- Sessions
- Locations
- Instructors

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Programs
- `GET /api/programs` - List all programs
- `GET /api/programs/{id}` - Get program details
- `POST /api/courses` - Create program (school owner)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings

### Admin
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/schools` - All schools
- `PUT /api/schools/{id}/approve` - Approve school

## Support

For deployment help, see the included guides:
- DIGITALOCEAN_DEPLOYMENT.md
- DEPLOYMENT_GUIDE.md

## License

All rights reserved - Train In Japan

## Contact

Email: admin@traininjapan.com
Website: https://traininjapan.com

---

*Last Updated: November 2025*
