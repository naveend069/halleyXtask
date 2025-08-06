output link:https://drive.google.com/file/d/1B_QxIUWUj3A2gNxBWFF51nPHEn0Pwkhv/view?usp=sharing
# HalleyX SaaS Admin & Customer Portal

A full-stack web application built to simulate a clean SaaS-style BSS (Business Support System) platform like Halleyx. It features modern UI/UX and robust backend architecture with admin and customer portals.

## 🔧 Tech Stack

### 🚀 Frontend
- **Framework:** Next.js (App Router)
- **Styling:** CSS (Custom), Tailwind
- **Features:** Responsive UI, Light/Dark mode toggle, Tutorial embed, AI exercise assistant

### 🔐 Backend
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Authentication:** JWT (admin/customer roles)
- **Database:** PostgreSQL / SQLite (dev)
- **Modules:** Auth, Products, Orders, Customers, Cart

---

## ✨ Features

### 🔒 Authentication
- Admin and Customer registration/login
- JWT-based session handling
- Role-based access control

### 👤 Admin Dashboard
- View and manage customers
- Manage products
- View and manage orders
- Impersonate customer view (simulate login)

### 🛍️ Customer Dashboard
- View available products
- Add items to cart
- Place orders
- View past orders and status
- Workout tracking (sets, reps, dates)
- Embedded exercise tutorials
- AI-powered exercise suggestions

---

## ⚙️ Installation

### 1. Clone the repo
```bash
git clone https://github.com/naveend069/halleyXtask.git
cd halleyXtask
2. Setup Backend (NestJS)
bash
Copy
Edit
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
3. Setup Frontend (Next.js)
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
📁 Folder Structure
csharp
Copy
Edit
halleyXtask/
│
├── backend/         # NestJS app
│   ├── src/
│   └── prisma/
│
├── frontend/        # Next.js app
│   ├── app/
│   └── public/
│
└── .gitignore
✅ To-Do
 Role-based login

 Admin dashboard

 Customer dashboard

 Product management

 Cart and order system

 Embedded tutorials

 AI assistant for workouts

 Admin analytics (future)

 Email notifications (future)

📜 License
MIT License. © 2025 Naveen D

👨‍💻 Author
Built with ❤️ by Naveen D for the Halleyx EGS 2025 Coding Challenge.


