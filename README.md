# ✈️ Flight Booking Management System

## 📖 Introduction

The **Flight Booking Management System** allows airline administrators and staff to manage the entire lifecycle of a flight operation. From scheduling flights and managing airport data to selling tickets and analyzing revenue through visual charts, the system provides a seamless experience with role-based access control.

## 🛠️ Technologies Used

### Backend
* **Framework:** NestJS 11.0 (Node.js)
* **Database:** PostgreSQL (Neon Cloud)
* **ORM:** TypeORM 0.3
* **Authentication:** JWT (Passport), Bcrypt
* **Tools:** Swagger API Docs, Nodemailer

### Frontend
* **Framework:** React 19.1.1
* **Build Tool:** Vite 7.1
* **Styling:** Tailwind CSS 4.1
* **HTTP Client:** Axios
* **Export:** ExcelJS (Professional styling), File-saver

### DevOps & Infrastructure
* **Containerization:** Docker & Docker Compose
* **Web Server:** Nginx

## ✨ Key Features

* **🔐 Authentication & Authorization:** Secure login with JWT. Role-Based Access Control (RBAC) for Admin, Board of Directors, and Staff.
* **🛫 Flight Management:** CRUD operations for Flights, Airports, and Airplanes. Seat capacity management logic.
* **🎟️ Ticket Booking:** Real-time ticket issuance, customer information management, and automatic seat availability updates.
* **📊 Advanced Reporting:**
    * Monthly and Yearly revenue statistics.
    * Interactive charts (Donut charts) for financial analysis.
    * **Professional Excel Export:** High-quality report generation with styling, formatting, and auto-calculation.
* **⚙️ System Settings:** Configurable flight rules (min flight time, max stopovers, etc.).

## 🚀 How to Run

### Prerequisites
* [Docker](https://www.docker.com/) and Docker Compose installed on your machine.
* Git.

### Installation Steps

1.  **Clone the repository.**

2.  **Environment Setup:**
    Create a `.env` file in the `backend` folder and contact us to get the source

3.  **Run with Docker:**
    Open your terminal in the root directory and run:
    ```bash
    docker-compose up -d --build
    ```

4.  **Access the Application:**
    * **Frontend:** http://localhost:8081
    * **Backend API:** http://localhost:3000

---
*University Project - SE104.Q13*
