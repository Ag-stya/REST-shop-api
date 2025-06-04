# RESTful API Shop - Node.js & MongoDB Project

A Node.js-based RESTful API built using Express.js, MongoDB, and Mongoose, designed for e-commerce-style functionality such as managing products, orders, and user authentication. Built by Agastya Srivastava.

---

## Features

- User registration and JWT login
- Order creation and tracking
- Product CRUD operations
- Secure password hashing with bcrypt
- File upload with multer
- Structured using MVC principles
- Error handling and logging with Morgan

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose ODM)
- Security: bcrypt, JWT
- File Uploads: multer
- Environment Management: dotenv
- Logging: morgan

---

## API Endpoints
USER
| Method | Endpoint        | Description         | Access |
| ------ | --------------- | ------------------- | ------ |
| POST   | `/user/signup`  | Register new user   | Public |
| POST   | `/user/login`   | Login existing user | Public |
| DELETE | `/user/:userId` | Delete user         | Admin  |

PRODUCTS
| Method | Endpoint               | Description          | Access        |
| ------ | ---------------------- | -------------------- | ------------- |
| GET    | `/products`            | Get all products     | Public        |
| POST   | `/products`            | Add new product      | Authenticated |
| GET    | `/products/:productId` | Get product by ID    | Public        |
| PATCH  | `/products/:productId` | Update product by ID | Authenticated |
| DELETE | `/products/:productId` | Delete product by ID | Authenticated |

ORDERS
| Method | Endpoint           | Description        | Access        |
| ------ | ------------------ | ------------------ | ------------- |
| GET    | `/orders`          | Get all orders     | Authenticated |
| POST   | `/orders`          | Create new order   | Authenticated |
| GET    | `/orders/:orderId` | Get order by ID    | Authenticated |
| DELETE | `/orders/:orderId` | Delete order by ID | Authenticated |

## Installation and Setup

Clone the repository:

   ```bash
   git clone https://github.com/yourusername/rest-shop-api.git
   cd rest-shop-api

Install dependencies:
    npm install


Create a .env file in the root directory with the following environment variables:
    PORT=3000
    MONGO_URI=mongodb+srv://sagastya58:iF8UQYUdHbfgli0b@cluster0.rl2vvoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_KEY=SECRET



Start the server:
    npm start


Access the API:
    The API will be running at http://localhost:3000.







AGASTYA SRIVATAVA 
9870322603
sagastya58@gmail.com
https://leetcode.com/u/aggastyaa/
www.linkedin.com/in/agastya-srivastava-b6681a269




