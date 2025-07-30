# CIS5500 Project

## Live Demo

- `Video Demo/`: https://drive.google.com/file/d/1b8NNYqxzf7Nx9LA1NcDgTMlnce9EfJ8y/view?usp=sharing
- `Visit/`: https://cis5500-project.vercel.app/

## Project Structure

The project is divided into two main parts:
- `client/`: Frontend React application
- `server/`: Backend Node.js/Express server

## Technology Stack

### Frontend (Client)
- React 16.12.0
- React Router DOM for navigation
- React Bootstrap for UI components
- Recharts for data visualization
- Firebase integration
- React Slider for interactive components

### Backend (Server)
- Node.js (>=14.0.0)
- Express.js
- MySQL and PostgreSQL database support
- CORS enabled
- Body-parser for request parsing

## Setup Instructions

### Prerequisites
- Node.js (>=14.0.0)
- npm or yarn
- MySQL/PostgreSQL database

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database connection in `db-config.js`
4. Start the server:
   ```bash
   npm start
   ```

## Deployment

The application is configured for deployment on Vercel, with separate configurations for both client and server components.

## License

MIT License


