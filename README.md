
## Features
- User authentication (login/register) with protected routes
- CRUD operations for Products, Customers, and Admins
- Global notifications for API actions
- Light/Dark theme with persistence
- Responsive, modern UI with glassmorphism and animations
- Dashboard with recent transactions and analytics

## Project Structure
```
fullstack-admin/
  client/   # React frontend
  server/   # Node.js/Express backend
```

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd into the project
```

### 2. Install dependencies
#### Client
```bash
cd client
npm install
```
#### Server
```bash
cd ../server
npm install
```

### 3. Start the development servers
#### Client (React)
```bash
cd client
npm start
```
The client will run on [http://localhost:3000](http://localhost:3000)

#### Server (Express)
```bash
cd server
npm start
```
The server will run on [http://localhost:9000](http://localhost:9000) by default.

## Environment Variables
- Configure your backend environment variables as needed (e.g., database connection, JWT secret). See `server/index.js` for details.



