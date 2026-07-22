# 🩸 Arogya Blood Center

> A modern, production-ready **Full-Stack MERN Blood Bank & Donor Management System** built to bridge the gap between blood donors, emergency hospital requests, and donation camp organizers in real-time.

---

## 🌐 Quick Links

* 🚀 **Live Application:** [arogya-blood-center.vercel.app](https://arogya-blood-center.vercel.app)
* 👨‍💻 **Developer:** Akash Sb (*MERN Stack Developer*)

---

## ✨ Key System Features

### 👤 User & Donor Experience
* 🔐 **Secure Authentication:** JWT-driven authorization, password hashing with `bcryptjs`, and protected React Router routes.
* 🩸 **Smart Donor Management:** Register, update, and manage donor profiles with built-in 90-day cooldown eligibility calculations.
* 🔍 **Real-Time Stock & Donor Search:** Filter available donors and blood bags ($A+$, $B+$, $O-$, etc.) dynamically by location and blood group.
* 🏥 **Donation Camp Booking:** Browse upcoming donation drives, view camp details, and register directly online.

### 🛡️ Admin & Operational Controls
* 📊 **Interactive Admin Dashboard:** Unified overview of blood stock levels, registered donors, and active camp drives.
* ⚠️ **Inventory Status Tracking:** Visual alert system indicating stock status (`CRITICAL`, `LOW`, `STABLE`) based on available unit thresholds.
* ☁️ **Cloud Media Storage:** Direct profile image and verification uploads handled via **Multer** & **Cloudinary**.
* 📧 **Email Notifications:** Automated confirmation emails dispatches powered by **Nodemailer**.

---

## 🛠️ Tech Stack Architecture

```text
[ Client: React + Vite + Tailwind CSS ] 
                 │
            REST API (Axios)
                 │
                 ▼
[ Server: Node.js + Express.js ]
   ├── JWT & bcryptjs (Auth)
   ├── Multer + Cloudinary (Image Hosting)
   └── Nodemailer (Email Dispatch)
                 │
                 ▼
[ Database: MongoDB Atlas + Mongoose ]

⚙️ Quick Local Setup

# 1. Clone the repository
git clone [https://github.com/your-username/Arogya-Blood-Center.git](https://github.com/your-username/Arogya-Blood-Center.git)
cd Arogya-Blood-Center

# 2. Setup & Run Frontend
cd client
npm install
npm run dev

# 3. Setup & Run Backend (in a separate terminal)
cd ../server
npm install
npm run dev


🔑 Server Environment Variables (server/.env)

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password


📂 Repository Structure
Arogya-Blood-Center/
├── client/          # React.js Frontend (Vite, Tailwind, Axios)
├── server/          # Node.js + Express.js Backend (Controllers, Models, Routes)
└── README.md        # Project Documentation


👨‍💻 Developed By
Akash Sb

MERN Stack Developer

⭐ If you find this project useful, don't forget to star the repository!
