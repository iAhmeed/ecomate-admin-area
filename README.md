# EcoMate Admin Area

Welcome to the **EcoMate Admin Area**, the full-stack management dashboard for the EcoMate online agency. This platform allows administrators to securely manage the agency's services, trusted partners (brands), and client feedback testimonials. 

It is built with a modern Next.js 16 (App Router) foundation, secured by custom JWT authentication middleware, and styled with Tailwind CSS v4 to exactly match the dark-theme aesthetic of the EcoMate landing page.

![EcoMate Admin Dashboard Presentation](https://via.placeholder.com/800x400.png?text=EcoMate+Admin+Dashboard)

## 🚀 Key Features

- **Secure Authentication:** Custom JWT-based session management, password hashing (bcrypt), and a complete forgot/reset password email flow (Nodemailer).
- **Service Management:** Full CRUD operations for agency services, including Cloudinary-powered image/icon uploads.
- **Partner Management:** Maintain a list of trusted brands and clients with direct logo uploads.
- **Feedback Moderation:** Filter, approve, unapprove, and delete client testimonials to control what appears on the public landing page.
- **Modern Dark UI:** A stunning, responsive dark mode interface emphasizing large typography, glowing gradients, and smooth animations optimized for desktop browsers.

---

## 📁 Project Structure

This application follows the Next.js App Router architecture, cleanly separating the frontend UI from the backend API services and Mongoose models.

```text
ecomate-admin-area/
├── app/
│   ├── (dashboard)/        # Protected routes (Requires Auth)
│   │   ├── layout.tsx      # Sidebar navigation and top header
│   │   ├── home/           # Main stats overview dashboard
│   │   ├── services/       # Services CRUD page
│   │   ├── partners/       # Partners & Brands CRUD page
│   │   ├── feedbacks/      # Client Feedback moderation page
│   │   └── settings/       # Admin password change functionality
│   ├── api/                # Backend API Endpoints
│   │   ├── login/          # Authentication verification
│   │   ├── logout/         # Session destruction
│   │   ├── forgot-password/# Password reset email generation
│   │   ├── reset-password/ # Secure token validation
│   │   ├── change-password/# Logged-in password update
│   │   ├── services/       # GET/POST/PUT/DELETE for Services
│   │   ├── partners/       # GET/POST/PUT/DELETE for Partners
│   │   ├── clients-feedbacks/# GET/PUT(Approve)/DELETE for Feedbacks
│   │   ├── upload/         # Cloudinary image upload handler
│   │   └── validate-session/# JWT token verification
│   ├── login/              # Public login page
│   ├── forgot-password/    # Public forgot password page
│   ├── reset-password/     # Public reset password page
│   ├── globals.css         # Tailwind v4 directives, custom CSS variables & animations
│   ├── layout.tsx          # Root HTML injected with Poppins/Inter fonts
│   └── page.tsx            # Root redirect (points to /login)
├── models/                 # MongoDB Mongoose Schemas
│   ├── Admin.js            # User credentials & session tokens
│   ├── Service.js          # Service schema with image references
│   ├── Partner.js          # Trusted brand schema
│   ├── Feedback.js         # Client testimonials schema
│   └── Image.js            # Reusable image data schema (URL/PublicId)
├── public/                 # Static assets (images, favicons)
├── proxy.js                # Next.js Middleware -> intercepts routes for JWT Auth
└── tailwind.config.* / postcss.config.* / tsconfig.json # Standard configurations
```

---

## ⚙️ How to Run Locally

Follow these steps to set up the development environment on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** cluster (e.g., MongoDB Atlas)
- **Cloudinary** account (for image hosting)
- **SMTP/Email server** (for password reset emails)
- An **Abstract API Key** (for backend email validation checks)

### 2. Clone and Install
Clone the repository and install the dependencies:
```bash
git clone https://github.com/iAhmeed/ecomate-admin-area.git
cd ecomate-admin-area
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with your specific credentials:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecomate

# Authentication Secrets
SESSION_SECRET=your_super_secret_jwt_string_here
SIGNUP_SECRET=your_secret_admin_creation_code # Required to hit the signup endpoint

# Third-Party API Keys
ABSTRACT_API_KEY=your_abstract_api_key

# Nodemailer / Email Settings
EMAIL_USER=your_sending_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Start the Application
Run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Unauthenticated visitors will automatically be redirected to `/login`, ready for you to access your new Admin Area!
