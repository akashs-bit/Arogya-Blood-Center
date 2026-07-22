<div align="center">

# 🩸 Arogya Blood Center

### *A Full-Stack MERN Platform for Digitalizing Blood Bank Operations & Donation Camps*

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge&logo=vercel)](https://arogya-blood-center.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-darkgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Table of Contents
- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Future Roadmap](#-future-roadmap)
- [Author](#-author)

---

## 📖 Overview

**Arogya Blood Center** is a secure, end-to-end MERN stack solution built to streamline blood bank logistics, donor scheduling, and inventory tracking. It bridges the gap between voluntary blood donors and administrative coordinators by providing automated email notifications, real-time inventory monitoring, and camp management.

> 💡 **Why this exists:** Traditional blood bank processes rely heavily on manual logs, leading to coordination delays during emergency shortages. Arogya digitizes the entire lifecycle—from donor registration to camp scheduling and stock updates.

---

## 🏗️ System Architecture

```text
  ┌─────────────────┐       HTTPS / REST API        ┌──────────────────┐
  │   React + Vite  │ ────────────────────────────> │  Express Server  │
  │  (Vercel Host)  │ <──────────────────────────── │  (Render Host)   │
  └─────────────────┘                               └────────┬─────────┘
                                                             │
                                        ┌────────────────────┼────────────────────┐
                                        │                    │                    │
                                 ┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
                                 │   MongoDB   │      │  Nodemailer │      │  Node-Cron  │
                                 │   Atlas     │      │   (Gmail)   │      │ (Reminders) │
                                 └─────────────┘      └─────────────┘      └─────────────┘
