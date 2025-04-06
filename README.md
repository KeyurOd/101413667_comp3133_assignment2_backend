# Employee Management Backend

This is the backend API for the Employee Management System, built with Node.js, Express, and MongoDB. It handles authentication, employee CRUD operations, and file uploads.

## Prerequisites
- Node.js (v16.x or later)
- npm (v8.x or later)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd employee-management-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create a `.env` file in the root directory with:
     ```plaintext
     PORT=5001
     MONGODB_URI=mongodb://localhost:27017/employee-management
     JWT_SECRET=your-secret-key-here
     ```
   - Replace `MONGODB_URI` with your MongoDB connection string and `JWT_SECRET` with a secure key.

4. **Run the Application**
   ```bash
   npm start
   ```
   - The server will run at `http://localhost:5001`.

## Project Structure
```
src/
├── models/
│   ├── employee.model.js    # Employee schema (MongoDB)
│   └── user.model.js        # User schema (MongoDB)
├── routes/
│   ├── auth.routes.js       # Login/signup endpoints
│   ├── employee.routes.js   # Employee CRUD endpoints
│   └── file.routes.js       # File upload endpoints
├── middleware/
│   └── auth.middleware.js   # JWT authentication
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   ├── employee.controller.js # Employee CRUD logic
│   └── file.controller.js   # File upload logic
├── config/
│   └── db.config.js         # MongoDB connection
└── server.js                # Entry point
```

## API Endpoints
- **Authentication**:
  - `POST /api/auth/login` - Login with email/password, returns JWT.
  - `POST /api/auth/signup` - Register a new user.
- **Employees**:
  - `GET /api/employees` - List employees (optional filters: `department`, `position`).
  - `GET /api/employees/:id` - Get employee by ID.
  - `POST /api/employees` - Create an employee.
  - `PUT /api/employees/:id` - Update an employee.
  - `DELETE /api/employees/:id` - Delete an employee.
- **File Upload**:
  - `POST /api/upload` - Upload a profile picture, returns file path.

## Features
- **Authentication**: JWT-based user authentication.
- **Employee Management**: CRUD operations with MongoDB storage.
- **File Upload**: Supports profile picture uploads, stored on the server.

## Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `jsonwebtoken` - JWT authentication
- `multer` - File upload handling
- `dotenv` - Environment variables

## Usage
1. Start MongoDB (e.g., `mongod` if local).
2. Run the backend server (`npm start`).
3. Use the frontend or tools like Postman to interact with the API.
   - Example: `POST http://localhost:5001/api/auth/login` with `{ "email": "user@example.com", "password": "pass123" }`.

## Notes
- Ensure MongoDB is running and accessible.
- Uploaded files are served from a static directory (e.g., `/uploads`).
- Secure the `JWT_SECRET` in production.
