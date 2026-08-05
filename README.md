# Anthem Enzyme Website 🧬

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

A comprehensive e-commerce and internal management portal built for **Anthem Biosciences**. This platform facilitates the sale, tracking, and management of sensitive biological products (enzymes) while providing a robust Role-Based Access Control (RBAC) system for Admins, Employees, and Customers.

## 🏗️ System Architecture

```mermaid
graph TD
    %% Define styles
    classDef frontend fill:#61DAFB,stroke:#20232a,stroke-width:2px,color:#20232a,font-weight:bold
    classDef backend fill:#3670A0,stroke:#333,stroke-width:2px,color:white,font-weight:bold
    classDef database fill:#FFCA28,stroke:#333,stroke-width:2px,color:#333,font-weight:bold
    classDef payment fill:#0C2340,stroke:#333,stroke-width:2px,color:white,font-weight:bold
    classDef external fill:#888888,stroke:#333,stroke-width:2px,color:white,font-weight:bold

    %% Nodes
    Client["💻 React + Vite Frontend"]:::frontend
    PyService["⚙️ Python Service (FastAPI)"]:::backend
    Firebase[("🔥 Firebase (Auth & Firestore)")]:::database
    Razorpay["💳 Razorpay Payment Gateway"]:::payment
    SMTP["📧 SMTP Server (Gmail)"]:::external

    %% Connections
    Client <-->|"REST API & Order Requests"| PyService
    Client <-->|"Client Auth & DB Reads"| Firebase
    PyService <-->|"Admin DB Operations"| Firebase
    PyService <-->|"Order Creation & Verification"| Razorpay
    PyService -->|"Order Notifications & Contact Forms"| SMTP
```

## ✨ Key Features

- **🛍️ E-Commerce Storefront:** Browse, search, and purchase Anthem's enzyme products.
- **💳 Razorpay Integration:** Seamless, secure online payment and order verification.
- **🔐 Role-Based Access Control:** Distinct dashboards and permissions for Customers, Employees, and Admins.
- **📊 Data Management:** Export user and order directories to Excel. Browse massive data sets seamlessly with customizable pagination (10/25/50/100 entries per page).
- **✉️ Automated Notifications:** In-app alerts and automatic SMTP email generation sending real-time invoice receipts to admins upon successful order placements.
- **📦 Shipment Tracking:** Real-time visual tracking of orders from placement to delivery.
- **🌓 Dark Mode:** Sleek, dynamic UI with full light/dark mode support.

## 📂 Folder Structure

```text
anthem-enzyme-website/
├── frontend/             # React + Vite Frontend Application
│   ├── public/           # Static assets (images, icons, .htaccess)
│   └── src/              # React components, pages, and context providers
│       ├── components/   # Reusable UI components (NavBar, AuthModal, Footer)
│       ├── context/      # React Context (Theme, Auth, Cart)
│       └── pages/        # Route pages (Home, Dashboard, EditShipments, etc.)
├── python-service/       # Python Backend (FastAPI, Razorpay, Chatbot, SMTP)
├── firestore.rules       # Firebase security rules and RBAC policies
└── README.md             # Project documentation
```

## 🚀 Quick Start

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Python Backend Setup
```bash
cd python-service
pip install -r requirements.txt
python main.py
```

## 🛡️ Security & Secrets
Environment variables (`.env`) and Firebase Admin SDK keys (`*firebase-adminsdk*.json`) are strictly ignored via `.gitignore` to prevent secret leaks. Ensure you have the proper `.env` files created locally before running the services.
