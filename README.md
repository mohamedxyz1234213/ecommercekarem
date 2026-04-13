# 🌿 Essence — Luxury Perfume E-Commerce

A modern, full-stack MERN e-commerce platform for luxury perfumes with an elegant beige & dark green color palette, smooth animations, and a complete admin panel.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### Customer Frontend (port 3000)
- 🎨 Modern, animated UI with Framer Motion
- 🔐 Email/password login, Google OAuth, Apple login
- 🛒 Shopping cart with slide-in drawer
- 🏷️ Sale badges and sale tape ribbons on products
- 💳 Payment via Paymob integration
- 📱 InstaPay payment with proof upload
- ⭐ Product reviews and ratings
- 🔍 Search, filter, and sort products
- 📱 Fully responsive design

### Admin Panel (port 3001)
- 📊 Dashboard with revenue charts and stats
- 📦 Product management (CRUD, images, sales)
- 🏷️ Sales manager with bulk sale controls
- 📋 Order management with status tracking
- ✅ InstaPay payment approval/rejection
- 👥 User management
- ⚙️ Site settings
- 📧 Email notifications on order events

### Backend API (port 5000)
- 🔒 JWT authentication with bcrypt
- 🛡️ Helmet security headers
- 📧 Nodemailer email notifications
- 📁 Multer file uploads
- 🗃️ MongoDB Atlas with Mongoose
- 🔑 Passport.js (Local + Google OAuth)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google OAuth credentials (optional)

### 1. Clone the repository
```bash
git clone https://github.com/mohamedxyz1234213/ecommercekarem.git
cd ecommercekarem
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, email config, etc.
npm install
npm run seed   # Seed sample perfume products
npm start      # Starts on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev    # Starts on port 3000
```

### 4. Admin Panel Setup
```bash
cd admin
npm install
npm run dev    # Starts on port 3001
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark Green | `#2D5016` | Primary buttons, accents |
| Warm Beige | `#F5F0E8` | Backgrounds |
| Gold Brown | `#8B7355` | Secondary accents |
| Muted Gold | `#C4A265` | Highlights, badges |
| Off White | `#FAF8F5` | Page backgrounds |
| Deep Green | `#1A2E0A` | Dark elements |

## 💳 Payment Methods

### Paymob
Configure your Paymob API keys in the backend `.env` file.

### InstaPay
1. Customer selects InstaPay at checkout
2. Sends money to the displayed username ("New Session")
3. Uploads payment proof screenshot
4. Admin reviews and approves/rejects from admin panel
5. Confirmation email sent to customer on approval

## 📧 Email Notifications
- Order confirmation to customer
- New order notification to admin
- InstaPay approval/rejection to customer
- Order status updates to customer

## 🗂️ Project Structure
```
ecommercekarem/
├── backend/          # Express.js API server
│   ├── config/       # DB & Passport config
│   ├── controllers/  # Route controllers
│   ├── middleware/    # Auth & upload middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── utils/        # Email & utilities
│   └── uploads/      # Uploaded files
├── frontend/         # React customer app (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── api/
├── admin/            # React admin panel (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── api/
└── README.md
```

## 📝 Environment Variables

See `backend/.env.example` for all required environment variables.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Framer Motion, React Router, Axios
- **Admin**: React 19, Vite, Recharts, Framer Motion
- **Backend**: Express.js, MongoDB/Mongoose, Passport.js, JWT, Nodemailer
- **Styling**: Custom CSS with CSS Variables, Google Fonts (Playfair Display + Lato)

## 📄 License
MIT