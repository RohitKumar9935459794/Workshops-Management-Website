## 🛠️ Workshop and Participant Management System

A full-stack web application to manage workshops and their participants. Built with **React** for the frontend, **Node.js + Express** for the backend, **MySQL** for the database, and **Nodemailer + JWT** for authentication and password reset.

---

### 📚 Features

* ✅ User Registration & Login with JWT
* 🔐 Role-based Authentication
* 📅 Create, Update, and Delete Workshops
* 👥 Add/Update/View Participants (including Excel upload)
* 🔍 Filtering by subject, date, and center
* 📥 Download Workshop Reports
* 📤 Upload Excel Sheets (.xlsx) for bulk participants
* 🔒 Forgot Password flow using OTP (random number via email)
* 📊 Dashboard with Workshop Stats
* 📦 RESTful API with Express and MySQL

---

### 🧰 Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React.js, Axios, React Router  |
| Backend    | Node.js, Express.js            |
| Database   | MySQL                          |
| Auth       | JWT, Bcrypt                    |
| Mail       | Nodemailer (Gmail SMTP)        |
| Excel      | `xlsx`, `multer`, `fs`, `path` |
| State Mgmt | React useState/useEffect/hooks |

---

### 🔑 Environment Variables (`.env`)

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=workshop_db

JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/workshop-management-system.git
cd workshop-management-system
```

#### 2. Backend Setup (Node.js + MySQL)

```bash
cd backend
npm install
node server.js
```

Make sure MySQL is running, and you've created the `workshop_db` database.

Import the SQL schema from `/backend/workshop_schema.sql` (or create manually based on your tables).

#### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

### 📁 Folder Structure

```
workshop-management-system/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
└── README.md
```

---

### 🔐 Auth Flow

* **JWT-based login/registration**
* **Protected Routes**
* **Forgot Password via Email OTP**

  * Generates 6-digit random number
  * Sent via Gmail SMTP (using Nodemailer)
  * User submits OTP → can reset password

---

### 📤 Upload Participants (Excel)

* Excel files must follow the format:

```text
REGID | NAME | EMAIL | PHONE | etc.
```

* Handled via `multer` + `xlsx` in backend.
* Parsed and inserted into MySQL.

---

### 🧪 Sample APIs

| Endpoint               | Method | Description                  |
| ---------------------- | ------ | ---------------------------- |
| `/register`            | POST   | Register a new user          |
| `/login`               | POST   | Login and get JWT token      |
| `/forgot-password`     | POST   | Send OTP to email            |
| `/reset-password`      | POST   | Reset password with OTP      |
| `/workshops`           | GET    | Get all workshops            |
| `/participants/:id`    | GET    | Get participants of workshop |
| `/upload-participants` | POST   | Upload Excel file            |

---

### ✅ To Do

* [x] JWT Authentication
* [x] Password Reset Flow with OTP
* [x] Excel Upload/Download
* [x] Filtering, Pagination
* [ ] Admin vs User Role Support
* [ ] Responsive UI

---

### 👨‍💻 Author

**Rohit Kumar**
📧 [rohit307507@gmail.com](mailto:rohit307507@gmail.com)

---

