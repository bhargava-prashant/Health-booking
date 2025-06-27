# 🏥 Health Booking System

A microservice-based **Health Booking System** built using **Node.js**, **PostgreSQL**, **Docker**, and **Jenkins CI/CD**. The system enables patients to book appointments with doctors, while administrators manage services and users effectively.

---

## 📁 Repository

🔗 [GitHub – Health Booking System](https://github.com/bhargava-prashant/Health-booking)

---

## 🧱 Microservices Architecture

This system is modularized into 4 microservices:

- 🔐 **Auth Service:** Handles user login, registration, and role-based access.  
- 📅 **Booking Service:** Manages patient appointments with doctors.  
- 🩺 **Doctor Service:** Manages doctor details, specialization, and availability.  
- 🛠️ **Admin Service:** Allows admin users to manage platform-wide configurations.

Each microservice is independently containerized and connected via Docker Compose.

---

## 🐳 Docker Setup

Every service includes its own `Dockerfile`.  
Below is an example for the **Auth Service**:

```Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
````

> Services run on ports:
> 🔹 3000 - Auth
> 🔹 4000 - Booking
> 🔹 5000 - Doctor
> 🔹 6000 - Admin

---

## 📦 Docker Compose Configuration

The `docker-compose.yml` orchestrates all services along with a PostgreSQL database.

```yaml
version: '3.7'

services:
  auth-service:
    build: ./auth-service
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - health-net

  booking-service:
    build: ./booking-service
    ports:
      - "4000:4000"
    depends_on:
      - db
    networks:
      - health-net

  doctor-service:
    build: ./doctor-service
    ports:
      - "5000:5000"
    depends_on:
      - db
    networks:
      - health-net

  admin-service:
    build: ./admin-service
    ports:
      - "6000:6000"
    depends_on:
      - db
    networks:
      - health-net

  db:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: health_booking
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - health-net

networks:
  health-net:
    driver: bridge

volumes:
  pg_data:
```

---

## 🗄️ PostgreSQL Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50) CHECK (role IN ('patient', 'doctor', 'admin'))
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    full_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(10),
    contact_number VARCHAR(15)
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    specialty VARCHAR(255),
    experience INT,
    contact_number VARCHAR(15)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    doctor_id INT REFERENCES doctors(id),
    appointment_date DATE,
    status VARCHAR(50) CHECK (status IN ('booked', 'completed', 'cancelled'))
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    permissions VARCHAR(255)
);
```

---

## 📤 Pushing Images to Docker Hub

### 1. Login to Docker Hub

```bash
docker login
```

### 2. Tag the Images

```bash
docker tag auth-service prashantbhargava365/auth-service
docker tag booking-service prashantbhargava365/booking-service
docker tag doctor-service prashantbhargava365/doctor-service
docker tag admin-service prashantbhargava365/admin-service
```

### 3. Push the Images

```bash
docker push prashantbhargava365/auth-service
docker push prashantbhargava365/booking-service
docker push prashantbhargava365/doctor-service
docker push prashantbhargava365/admin-service
```

---

## 🔄 Jenkins CI/CD Pipeline

Below is the Jenkins pipeline used for build, push, and deployment:

```groovy
pipeline {
    agent any
    environment {
        DOCKER_HUB_REPO = 'prashantbhargava365'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/your-repo/health-booking-system.git'
            }
        }
        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                sh 'docker push ${DOCKER_HUB_REPO}/auth-service'
                sh 'docker push ${DOCKER_HUB_REPO}/booking-service'
                sh 'docker push ${DOCKER_HUB_REPO}/doctor-service'
                sh 'docker push ${DOCKER_HUB_REPO}/admin-service'
            }
        }
        stage('Deploy to Production') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
```

---


## 🔄 Jenkins Pipeline Trigger (Docker-based Jenkins)

This CI/CD pipeline is managed via a Dockerized Jenkins setup.

You can trigger the pipeline using either:
- **Manual trigger** from the Jenkins dashboard, or
- **GitHub webhook** for automatic builds on push.
---

## ✅ Summary

This project demonstrates a scalable and robust microservice-based healthcare appointment platform.
Powered by:

* 💻 Node.js (for backend services)
* 🐘 PostgreSQL (relational data storage)
* 🐳 Docker (containerization)
* 🔄 Jenkins (automated CI/CD pipeline)

---

## 📬 Contact

For any queries, feel free to reach out:

**Prashant Bhargava**
📧 [prashantbhargava365@gmail.com](mailto:prashantbhargava365@gmail.com)
🔗 Visit my portfolio: [prashant-bhargava-dev.onrender.com](https://prashant-bhargava-dev.onrender.com)

---


