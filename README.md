# 🍕 Food Ordering System - A Full-Stack Food Delivery Platform

A modern, full-stack food ordering application built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform allows customers to browse food items, place orders, and make payments, while admins can manage orders and users.

## 🌐 Live Demo

- **Frontend:** https://food-ordering-system-e1acb.web.app
- **Backend API:** https://food-ordering-system-server-five.vercel.app

## Test Credentials
 Admin Login

Email: admin@gmail.com
Password: 123456

Customer Login

Email: customer28@gmail.com
Password: 123456

## 📁 Repository Links

- **Client:** https://github.com/xunaiet-faruk/Food-Ordering-System
- **Server:** https://github.com/xunaiet-faruk/Food-Ordering-System-Server

## ✨ Key Features

### 👤 User Features
- User Authentication: Sign up and login with email/password
- Browse Foods: View all available food items with categories (Pizza, Burger, Cake, etc.)
- Search & Filter: Search for specific foods and filter by categories
- Cart Management: Add items to cart, update quantities, and remove items
- Order Placement: Place orders with delivery details
- Payment Integration: Secure payment processing via PayHere (Sandbox mode)
- Order History: View all past and pending orders
- Responsive Design: Fully responsive for mobile, tablet, and desktop

### 👑 Admin Features
- Dashboard: Admin dashboard to manage all orders
- Order Management: View all orders, update order status (Pending → On the way → Delivered)
- Status Updates: Mark orders as "On the way", "Delivered", or "Cancelled"
- User Management: View registered users
- Food Management: Add, edit, or delete food items

### 🛠️ Technical Features
- Authentication: Firebase Authentication for secure user management
- Database: MongoDB Atlas for data storage
- Payment Gateway: PayHere integration for secure payments
- API Security: CORS enabled for secure cross-origin requests
- Real-time Updates: Live order status tracking
- Image Upload: Cloud-based image hosting for food items
- Responsive UI: Tailwind CSS with Framer Motion animations

## 🏗️ Tech Stack

### Frontend
- Framework: React.js with Vite
- Styling: Tailwind CSS
- Animations: Framer Motion
- State Management: React Hooks (useState, useEffect, useContext)
- Routing: React Router DOM v6
- HTTP Client: Axios
- Authentication: Firebase
- Icons: React Icons
- UI Components: Custom components with Tailwind

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: Firebase Admin SDK
- Payment Gateway: PayHere API
- Environment Variables: dotenv
- CORS: Enabled for specific origins

### Deployment
- Frontend: Firebase Hosting
- Backend: Vercel (Serverless Functions)

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Firebase account (for authentication)
- PayHere Sandbox account (for payment testing)

### Step 1: Clone the Repositories

```bash
# Clone the client repository
git clone https://github.com/xunaiet-faruk/Food-Ordering-System.git
cd Food-Ordering-System

# Clone the server repository
git clone https://github.com/xunaiet-faruk/Food-Ordering-System-Server.git
cd Food-Ordering-System-Server

For Server (Food-Ordering-System-Server)

PORT=5000

# MongoDB
USER_NAME=your_mongodb_username
USER_PASSWORD=your_mongodb_password

# PayHere - Merchant (Production - web.app Integration)
PAYHERE_MERCHANT_ID=1236464
PAYHERE_SECRET=your_payhere_secret

# PayHere - API Keys
PAYHERE_APP_ID=your_payhere_app_id
PAYHERE_APP_SECRET=your_payhere_app_secret

# PayHere - URLs
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_RETURN_URL=http://localhost:5173/payment-success
PAYHERE_CANCEL_URL=http://localhost:5173/payment-cancel
PAYHERE_NOTIFY_URL=http://localhost:5000/payment-notify


Step 3: Install Dependencies
bash
# For Client
cd Food-Ordering-System
npm install

# For Server
cd Food-Ordering-System-Server
npm install
Step 4: Run the Applications
bash
# Run Client (in Food-Ordering-System directory)
npm run dev
# The client will run on http://localhost:5173

# Run Server (in Food-Ordering-System-Server directory)
node index.js
# The server will run on http://localhost:5000
Step 5: Test the Application
Open your browser and navigate to http://localhost:5173

Create an account or login with test credentials

Browse food items, add to cart, and place an order

Test payment using PayHere Sandbox



PayHere Sandbox Test Card
Card Number: 4111 1111 1111 1111

Expiry Date: Any future date (e.g., 12/25)

CVV: Any 3-digit number (e.g., 123)

📝 Important Notes for Local Development
MongoDB Connection: Make sure your MongoDB Atlas IP whitelist includes your local IP or 0.0.0.0/0

Firebase Configuration: Replace Firebase config values with your own from Firebase Console

PayHere Sandbox: Use sandbox credentials for testing; live credentials for production

CORS: The server is configured to accept requests from http://localhost:5173

Image Hosting: Set up image hosting (like ImgBB) for food images

🚢 Deployment
Deploy Client (Firebase)
bash
npm run build
firebase deploy
Deploy Server (Vercel)
bash
vercel --prod
📊 API Endpoints
Users
GET /users - Get all users (Admin only)

POST /users - Create a new user

GET /users/email/:email - Get user by email

PUT /users/:id - Update user

DELETE /users/:id - Delete user

Foods
GET /foods - Get all food items

POST /foods - Add new food item (Admin)

PUT /foods/:id - Update food item (Admin)

DELETE /foods/:id - Delete food item (Admin)

Cart
GET /cart/:email - Get cart by email

POST /cart - Save/Update cart

DELETE /cart/:email - Clear cart

DELETE /cart/:email/item/:itemId - Remove item from cart

Orders
GET /orders - Get all orders (Admin)

GET /orders/:email - Get orders by email

POST /orders - Place a new order

PUT /orders/:id - Update order status

PUT /orders/status-update/:id - Update order status (Admin)

DELETE /orders/:id - Delete order

Payment
POST /create-payment-v2 - Initiate PayHere payment

POST /payment-notify - PayHere webhook endpoint

🤝 Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request


GitHub: https://github.com/xunaiet-faruk

Email: xunaietfaruk@gmail.com

🙏 Acknowledgments
React for the frontend framework

Tailwind CSS for styling

Firebase for authentication and hosting

Vercel for server deployment

MongoDB for database

PayHere for payment processing

Framer Motion for animations

