<div align="center">

  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/droplet.svg" alt="Arogya Logo" width="80" height="80" />

  # 🩸 Arogya Blood Center
  ### *Next-Gen Full-Stack MERN Platform for Blood Bank Digitization & Emergency Logistics*

  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-arogya--blood--center.vercel.app-red?style=for-the-badge&logo=vercel)](https://arogya-blood-center.vercel.app)
  [![Backend Status](https://img.shields.io/badge/API_Server-Render_Online-46E3B7?style=for-the-badge&logo=render)](https://arogya-blood-center.onrender.com)

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-ui--application-showcase">UI Showcase</a> •
    <a href="#-system-architecture--data-flow">Architecture</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-getting-started">Installation</a>
  </p>

  [![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
  [![JWT](https://img.shields.io/badge/Auth-JWT_%2B_Bcrypt-000000?style=flat-square&logo=json-web-tokens)](https://jwt.io/)
  [![Nodemailer](https://img.shields.io/badge/Services-Nodemailer_%2B_Node--Cron-007ACC?style=flat-square)](https://nodemailer.com/)

</div>

---

## 🌐 Live Demo & Testing Credentials

> **Live Application URL:** [https://arogya-blood-center.vercel.app](https://arogya-blood-center.vercel.app)  
> **API Server URL:** `https://arogya-blood-center.onrender.com/api`

### 🔑 Quick Test Credentials
To explore the administrative features without creating a new account:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@arogya.com` | `Admin@123` | Full Dashboard, Inventory, Camp & User Management |
| **Donor / User** | `donor@arogya.com` | `Donor@123` | Camp Registration, Profile, Booking History |

---

## 📖 Overview

**Arogya Blood Center** is an end-to-end web application built to eliminate inefficiencies in traditional blood donation drives. By digitalizing donor registrations, camp scheduling, automated email reminders, and blood stock tracking, Arogya ensures zero coordination friction between voluntary donors, blood banks, and hospital coordinators.

### 🎯 Key Problem Solved
Traditional blood banks rely heavily on offline registers and manual outreach, leading to high drop-off rates and critical delay times during emergency shortages. Arogya streamlines this entire pipeline into a real-time, cloud-connected dashboard with automated background notifications.

---

## 🎨 UI & Application Showcase

<div align="center">

| 📱 User Portal (Camp Selection & Booking) | 🛡️ Admin Dashboard (Inventory & Analytics) |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350/0f172a/ffffff?text=User+Camp+Registration+UI" alt="User Portal" width="100%" /> | <img src="https://via.placeholder.com/600x350/0f172a/ffffff?text=Admin+Analytics+Dashboard" alt="Admin Dashboard" width="100%" /> |

| 🔐 Authentication & Role Access | 📊 Real-Time Blood Stock Tracking |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x350/0f172a/ffffff?text=Secure+JWT+Login+UI" alt="Auth Page" width="100%" /> | <img src="https://via.placeholder.com/600x350/0f172a/ffffff?text=Inventory+Management+UI" alt="Inventory Page" width="100%" /> |

</div>

*(Note: Replace placeholder links with actual screenshots from `front-end/public/screenshots/`)*

---

## ✨ System Features

### 👤 Donor / User Module
- 🔑 **Secure Authentication:** JWT-based user session handling with encrypted passwords (Bcrypt).
- 🏕️ **Interactive Camp Explorer:** Search and filter upcoming blood donation camps by date and location.
- ⚡ **1-Click Camp Registration:** Seamless registration flow with instant automated confirmation email.
- 📋 **Personal Activity Log:** View past donations, upcoming camp dates, and downloadable confirmation tickets.
- 📱 **Fully Responsive UI:** Built mobile-first using Tailwind CSS for smooth cross-device UX.

### 🛡️ Administrative Control Center
- 📊 **Executive Analytics:** High-level metrics showing total registered donors, active camps, and blood unit counts.
- 🩸 **Inventory & Stock Management:** Dynamic tracking of blood groups (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`).
- 🛠️ **Camp Lifecycle Management:** Complete CRUD interface to publish, modify, or archive donation drives.
- 📬 **Automated Cron Workflows:** Integrated `node-cron` service that runs daily background jobs to send email reminders 24h prior to camp events.

---

## 🏗️ System Architecture & Data Flow

```text
                               ┌─────────────────────────┐
                               │   User Browser / Client │
                               │  (React.js + Tailwind)  │
                               └────────────┬────────────┘
                                            │
                                  HTTPS     │  JSON / REST API
                                  Requests  │  JWT Bearer Tokens
                                            ▼
                               ┌─────────────────────────┐
                               │    Express API Gateway  │
                               │   (Node.js App Server)  │
                               └──────┬───────────┬──────┘
                                      │           │
             ┌────────────────────────┘           └────────────────────────┐
             ▼                                                             ▼
  ┌──────────────────────┐                                     ┌──────────────────────┐
  │   MongoDB Atlas      │                                     │  External Services   │
  ├──────────────────────┤                                     ├──────────────────────┤
  │ - Users & Roles      │                                     │ - Nodemailer (SMTP)  │
  │ - Donation Camps     │                                     │ - Node-Cron Scheduler│
  │ - Registrations      │                                     │                      │
  │ - Blood Inventory    │                                     └──────────────────────┘
  └──────────────────────┘
