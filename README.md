# Bookly — Appointment Booking Platform

Bookly is a full-stack appointment booking platform that connects customers with professionals for services such as doctors, dentists, salons, fitness, tutors, consultants, and other service providers.

Built with **React Native (Expo)** for the mobile app and **Node.js, Express.js, and MongoDB** for the backend.

## Features

### Customer
- User registration and login
- Browse professionals by category
- Search and discover services
- View professional profiles
- View available services and pricing
- Check professional availability
- Book appointments
- Manage and cancel appointments
- Favorite professionals
- View notifications
- Submit reviews and ratings

### Professional
- Professional profile management
- Manage services
- Set availability
- Manage appointments
- View customer bookings
- Update appointment status
- Manage professional information

### Authentication & Security
- JWT authentication
- Secure token storage
- Role-based access
- Protected routes
- Password hashing with bcrypt
- Request validation
- Centralized error handling
- Rate limiting and security middleware

## Tech Stack

**Mobile**
- React Native
- Expo
- React Navigation
- Zustand
- Axios
- Expo SecureStore
- Lucide React Native

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod

**Tools**
- Git
- GitHub
- VS Code
- Postman
- npm

## Backend

The backend provides REST APIs for:

- Authentication
- Users
- Professionals
- Categories
- Services
- Appointments
- Favorites
- Notifications
- Reviews
- Availability

## Project Highlights

- Role-based customer and professional experience
- Real-time appointment availability
- Secure authentication and protected APIs
- Reusable mobile components and state management
- RESTful backend architecture
- Responsive and mobile-first interface
- Scalable structure for adding new service categories

## Running the Project

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Configure the required environment variables, including `MONGODB_URI`.

### Mobile

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

Set `EXPO_PUBLIC_API_URL` to your backend URL.

## Status

**Completed ✅**

Bookly is a complete portfolio project demonstrating full-stack mobile development with React Native, Expo, Node.js, Express.js, MongoDB, authentication, REST APIs, role-based access, appointment management, and service-provider workflows.