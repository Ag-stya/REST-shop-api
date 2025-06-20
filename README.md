# RESTful API Shop - Node.js & MongoDB Project

A robust **RESTful API** for e-commerce-style operations built with **Node.js**, **Express**, and **MongoDB**. It supports full CRUD functionality for products and orders, JWT-based user authentication, and integrates a modern DevOps CI/CD pipeline using Jenkins.

> 🚀 Built by **Agastya Srivastava**.

---

## 🔧 Features

* ✅ User registration and JWT login
* ✅ Product and Order CRUD operations
* ✅ Secure password hashing using `bcrypt`
* ✅ File uploads using `multer`
* ✅ MVC folder structure
* ✅ Centralized error handling and logging using `morgan`
* ✅ Environment variable management using `dotenv`
* ✅ CI/CD integration with **Jenkins**, **SonarQube**, **OWASP Dependency Check**, **Trivy**, and optional **Docker Compose**

---

## 🛠️ Tech Stack

| Layer       | Tech                                |
| ----------- | ----------------------------------- |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB with Mongoose ODM           |
| Security    | bcrypt, JWT                         |
| File Upload | multer                              |
| Logging     | morgan                              |
| CI/CD       | Jenkins, SonarQube, Trivy, OWASP DC |
| Deployment  | Docker (Optional)                   |

---

## 📁 API Endpoints

### 👤 User

| Method | Endpoint       | Description         | Access |
| ------ | -------------- | ------------------- | ------ |
| POST   | /user/signup   | Register new user   | Public |
| POST   | /user/login    | Login existing user | Public |
| DELETE | /user/\:userId | Delete user         | Admin  |

### 📦 Products

| Method | Endpoint              | Description          | Access        |
| ------ | --------------------- | -------------------- | ------------- |
| GET    | /products             | Get all products     | Public        |
| POST   | /products             | Add new product      | Authenticated |
| GET    | /products/\:productId | Get product by ID    | Public        |
| PATCH  | /products/\:productId | Update product by ID | Authenticated |
| DELETE | /products/\:productId | Delete product by ID | Authenticated |

### 🧾 Orders

| Method | Endpoint          | Description        | Access        |
| ------ | ----------------- | ------------------ | ------------- |
| GET    | /orders           | Get all orders     | Authenticated |
| POST   | /orders           | Create new order   | Authenticated |
| GET    | /orders/\:orderId | Get order by ID    | Authenticated |
| DELETE | /orders/\:orderId | Delete order by ID | Authenticated |

---

## ⚙️ CI/CD Pipeline - Jenkins

A complete Jenkins pipeline is used to automate building, testing, and analyzing the application code.

### 🧪 Jenkinsfile Stages

1. **Clone Repository**

   * Pulls code from GitHub

2. **SonarQube Code Quality Analysis**

   * Uses `sonar-scanner` to scan for code smells, bugs, vulnerabilities

3. **Install Dependencies**

   * Runs `npm install`

4. **OWASP Dependency Check**

   * Checks for known vulnerabilities in dependencies

5. **Sonar Quality Gate**

   * Validates against quality gates

6. **Trivy File System Scan**

   * Scans filesystem for security issues with Trivy
   * Generates `trivy-fs-report.txt`

7. **Deploy via Docker Compose** *(optional)*

   * Executes if `docker-compose.yml` exists in repo

8. **Post Build Cleanup**

   * Cleans Jenkins workspace

### Tools Required

* Jenkins (Installed on EC2 or local)
* SonarQube server (running on port 9000)
* Trivy installed on Jenkins server (v0.63.0)
* OWASP Dependency-Check plugin installed in Jenkins

---

## 🔃 How to Setup CI/CD

1. **Push the code to GitHub**

   ```bash
   git clone https://github.com/Ag-stya/REST-shop-api.git
   ```

2. **Create a Jenkins Pipeline Project**

   * Add GitHub URL
   * Use a valid `Jenkinsfile` in root directory

3. **Install Jenkins Plugins**

   * SonarQube Scanner
   * Dependency Check
   * Pipeline Utility Steps

4. **Configure Jenkins**

   * Manage Jenkins → Global Tool Configuration

     * Add SonarQube → ID: `Sonar`
     * Add `sonar-scanner`
     * Set `NodeJS`, etc.

5. **Configure SonarQube**

   * Create new project
   * Generate token
   * Use `sonar.projectKey` and `sonar.login` in scanner script

6. **Run Jenkins Build**

   * Make sure `.tpl` or report files (like `html.tpl`) are present if needed

---

## 🚀 Installation & Running Locally

1. **Clone Repo**

```bash
git clone https://github.com/Ag-stya/REST-shop-api.git
cd REST-shop-api
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Variables**
   Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb+srv://sagastya58:iF8UQYUdHbfgli0b@cluster0.rl2vvoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_KEY=SECRET
```

4. **Start the Server**

```bash
npm start
```

API will be running at: `http://localhost:3000`

---

## 📎 Contact

**Agastya Srivastava**
📞 9870322603
📧 [sagastya58@gmail.com](mailto:sagastya58@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/agastya-srivastava-b6681a269)
🧠 [LeetCode](https://leetcode.com/u/aggastyaa/)

---






