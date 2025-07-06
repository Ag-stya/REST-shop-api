# RESTful API Shop - Node.js, MongoDB, and Redis

A robust, high-performance RESTful API built with Node.js, Express, and MongoDB for e-commerce-style operations. It now includes **Redis integration for caching, rate limiting, and JWT blacklisting**, delivering improved speed, security, and reliability.

🚀 Built by Agastya Srivastava

---

## 🔧 Key Features

✅ User registration and secure JWT login  
✅ Product and Order CRUD operations  
✅ Secure password hashing using `bcrypt`  
✅ Image uploads and resizing with `multer` + `sharp`  
✅ Redis-powered features:
- 🔥 Caching for `/products` and individual product routes
- 🚀 Fast repeated access via Redis cache
- 🛡️ JWT blacklist for secure logout
- ⚡ Global rate limiting per IP (60s window)
✅ MVC folder structure  
✅ Centralized error handling and logging using `morgan`  
✅ Environment variable management with `dotenv`  
✅ CI/CD integration with Jenkins, SonarQube, Trivy, OWASP Dependency Check  
✅ Optional Docker deployment

---

## 🛠️ Tech Stack

| Layer       | Tech                           |
|------------|--------------------------------|
| Backend     | Node.js, Express.js            |
| Database    | MongoDB with Mongoose ODM      |
| Caching     | Redis                          |
| Security    | Bcrypt, JWT, JWT Blacklisting  |
| File Upload | Multer, Sharp                  |
| Logging     | Morgan                         |
| DevOps      | Jenkins, SonarQube, Trivy, OWASP DC |
| Deployment  | Docker (optional)              |

---

## 🧾 API Endpoints

### 👤 User
| Method | Endpoint        | Description         | Access      |
|--------|------------------|---------------------|-------------|
| POST   | `/user/signup`   | Register new user   | Public      |
| POST   | `/user/login`    | Login user          | Public      |
| POST   | `/user/logout`   | Logout user (JWT blacklist) | Authenticated |
| DELETE | `/user/:userId`  | Delete user         | Admin       |

### 📦 Products
| Method | Endpoint               | Description              | Access      |
|--------|------------------------|--------------------------|-------------|
| GET    | `/products`            | Get all products (cached) | Public      |
| POST   | `/products`            | Add new product           | Authenticated |
| GET    | `/products/:productId` | Get product by ID (cached) | Public      |
| PATCH  | `/products/:productId` | Update product by ID      | Authenticated |
| DELETE | `/products/:productId` | Delete product by ID      | Authenticated |

### 🧾 Orders
| Method | Endpoint             | Description             | Access      |
|--------|----------------------|-------------------------|-------------|
| GET    | `/orders`            | Get all orders          | Authenticated |
| POST   | `/orders`            | Create new order        | Authenticated |
| GET    | `/orders/:orderId`   | Get order by ID         | Authenticated |
| DELETE | `/orders/:orderId`   | Delete order by ID      | Authenticated |

---

## 🚀 Redis-Powered Features

### 1. 🧠 Redis Caching
- Caches product list (`/products`)
- Caches individual product (`/products/:id`)
- Auto-expiry after 60–120 seconds
- Reduces DB load and improves performance

### 2. 🛡️ JWT Blacklist for Logout
- Secure logout by storing tokens in Redis blacklist
- Prevents reuse of tokens after logout

### 3. ⚡ Rate Limiting
- IP-based rate limit (e.g. 60s window)
- Blocks excessive requests from same IP
- Redis TTLs manage expiration efficiently

---

## ⚙️ CI/CD Pipeline - Jenkins

Full DevOps automation using Jenkins, Trivy, SonarQube, and Dependency Check:

### 🧪 Jenkinsfile Stages
1. **Clone Repository**
2. **SonarQube Code Quality Analysis**
3. **Install Dependencies**
4. **OWASP Dependency Check**
5. **Sonar Quality Gate Validation**
6. **Trivy Filesystem Scan**
7. **Optional Docker Compose Deployment**
8. **Post Build Cleanup**

---

## 🚀 Installation & Running Locally

```bash
git clone https://github.com/Ag-stya/REST-shop-api.git
cd REST-shop-api
npm install
Setup .env
PORT=3000
MONGO_URI=your-mongo-uri
JWT_KEY=your-secret

START SERVER_npm start
## Redis Setup
brew install redis
redis-server

## 📎 Contact

**Agastya Srivastava**
📞 9870322603
📧 [sagastya58@gmail.com](mailto:sagastya58@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/agastya-srivastava-b6681a269)
🧠 [LeetCode](https://leetcode.com/u/aggastyaa/)

---






