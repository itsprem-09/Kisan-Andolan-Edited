# Rashtriya Kishan Manch Project Documentation

## 1. Introduction

### Project Overview
The Rashtriya Kishan Manch is a full-stack MERN application built to serve as the digital platform for the organization. It provides a public-facing website to disseminate information, showcase activities, and engage with the community, alongside a comprehensive admin panel for content management and administrative tasks.

### Purpose and Goals
- To establish a strong online presence for the Rashtriya Kishan Manch.
- To provide a centralized platform for sharing information about the organization's vision, programs, projects, and team.
- To facilitate member registration and engagement through an online application process.
- To offer a secure and intuitive admin dashboard for managing all website content.
- To ensure a responsive and user-friendly experience across all devices.

### Key Features
- **Content Management:** Full CRUD (Create, Read, Update, Delete) capabilities for various content types including Media, Programs, Projects, Team Members, and more.
- **Member Registration:** A public-facing form for users to apply for membership, including document uploads and OTP verification.
- **Media & Gallery:** Sections to showcase media coverage, program photos, and project galleries.
- **File Uploads:** Integration with Cloudinary for robust cloud-based storage of images and documents.
- **User Authentication:** Secure, role-based access control using JWT (JSON Web Tokens) for the admin panel.
- **Admin Panel:** A dedicated interface for administrators to manage all aspects of the application's content.
- **Dynamic Content:** Informational sections like "Andolan" (Movements) and "Vision" are dynamically managed from the backend.

## 2. Project Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js:** (LTS version recommended)
- **npm** (Node Package Manager) or **yarn**
- **MongoDB:** A running instance of MongoDB (local or cloud-hosted like MongoDB Atlas).
- **Cloudinary Account:** For handling media uploads.

### Repository Structure
The project is a monorepo organized into two main directories:
- `frontend/`: Contains the React-based frontend application (built with Vite).
- `server/`: Contains the Node.js/Express.js backend API.

### Backend Installation
1.  Navigate to the `server` directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `server` directory. You will need to add the following variables:
    ```
    NODE_ENV=development
    PORT=5001
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_JWT_Secret>
    CLOUDINARY_CLOUD_NAME=<Your_Cloudinary_Cloud_Name>
    CLOUDINARY_API_KEY=<Your_Cloudinary_API_Key>
    CLOUDINARY_API_SECRET=<Your_Cloudinary_API_Secret>
    ```
4.  Start the development server: `npm run dev`

### Frontend Installation
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `frontend` directory and add the backend API URL:
    ```
    VITE_API_URL=http://localhost:5001
    ```
4.  Start the development server: `npm start` (which runs `vite`)

## 3. Backend Architecture

### Overview
The backend is a RESTful API built with Node.js and Express.js, using MongoDB for the database. It follows a standard feature-based structure with routes, controllers, models, and middleware.

-   **Technology Stack:**
    -   **Node.js:** JavaScript runtime.
    -   **Express.js:** Web application framework.
    -   **MongoDB:** NoSQL database.
    -   **Mongoose:** ODM library for MongoDB.
    -   **JWT (jsonwebtoken & bcryptjs):** For authentication and password hashing.
    -   **Cloudinary & Multer:** For handling `multipart/form-data` and cloud-based file uploads.
    -   **dotenv:** For managing environment variables.
    -   **cors:** For enabling Cross-Origin Resource Sharing.

-   **Directory Structure (`server/`):**
    -   `config/`: Database connection configuration.
    -   `controllers/`: Contains the business logic for each route.
    -   `middleware/`: Custom middleware for authentication (`authMiddleware`) and file uploads (`uploadMiddleware`).
    -   `models/`: Mongoose schema definitions for all database collections.
    -   `routes/`: API route definitions.
    -   `server.js`: The main application entry point.

### API Endpoints

This section provides a detailed breakdown of all available API endpoints, including request formats, response examples, and authentication requirements.

---

### **1. Authentication (`/api/auth`)**

Handles user registration and login for the admin panel.

#### **`POST /api/auth/login`**

-   **Description:** Authenticates an admin or editor user and returns a JWT.
-   **Access:** Public
-   **Request Body:** `application/json`
    ```json
    {
      "email": "admin@example.com",
      "password": "admin123"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "_id": "60d5f2f9a1b2c3d4e5f6g7h8",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
-   **Error Response (401 Unauthorized):**
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

#### **`POST /api/auth/register`**

-   **Description:** Registers a new user. Only accessible by an authenticated admin.
-   **Access:** Private/Admin
-   **Request Body:** `application/json`
    ```json
    {
      "name": "New Editor",
      "email": "editor@example.com",
      "password": "password123",
      "role": "editor"
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "_id": "60d5f3a9a1b2c3d4e5f6g7h9",
      "name": "New Editor",
      "email": "editor@example.com",
      "role": "editor",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
-   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "User already exists"
    }
    ```

#### **`GET /api/auth/profile`**

-   **Description:** Retrieves the profile of the currently logged-in user.
-   **Access:** Private (Admin/Editor)
-   **Request Headers:**
    -   `Authorization`: `Bearer <Your_JWT>`
-   **Success Response (200 OK):**
    ```json
    {
      "_id": "60d5f2f9a1b2c3d4e5f6g7h8",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
    ```

---

### **2. OTP (`/api/otp`)**

Handles sending and verifying One-Time Passwords, primarily for member registration.

#### **`POST /api/otp/send`**

-   **Description:** Sends an OTP to a user's phone number via Appwrite.
-   **Access:** Public
-   **Request Body:** `application/json`
    ```json
    {
      "phone": "+911234567890"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "OTP sent successfully.",
      "userId": "appwrite_user_id"
    }
    ```
-   **Error Response (500 Internal Server Error):**
    ```json
    {
      "message": "Failed to send OTP",
      "error": "..."
    }
    ```

#### **`POST /api/otp/verify`**

-   **Description:** Verifies an OTP submitted by the user.
-   **Access:** Public
-   **Request Body:** `application/json`
    ```json
    {
      "userId": "appwrite_user_id",
      "otp": "123456"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "OTP verified successfully."
    }
    ```
-   **Error Response (400 Bad Request):**
    ```json
    {
      "message": "Invalid OTP or verification failed"
    }
    ```

---

### **3. Members (`/api/members`)**

Manages member applications.

#### **`POST /api/members`**

-   **Description:** Submits a new member application. This is a `multipart/form-data` request.
-   **Access:** Public
-   **Form Data:**
    -   `name`: String
    -   `fatherName`: String
    -   `dob`: Date (e.g., "2000-01-15")
    -   `phone`: String
    -   `email`: String
    -   `address`: String
    -   `membershipType`: String (e.g., "Youth Leadership Program")
    -   `documents`: File (Aadhar/Voter ID)
    -   `photo`: File (Applicant's photo)
    -   `otpVerified`: Boolean (`true`)
-   **Success Response (201 Created):**
    ```json
    {
        "_id": "60d5f3a9a1b2c3d4e5f6g7h9",
        "name": "John Doe",
        "applicationStatus": "Pending",
        // ... other fields
    }
    ```

#### **`GET /api/members`**

-   **Description:** Retrieves all member applications.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    [
      {
        "_id": "60d5f3a9a1b2c3d4e5f6g7h9",
        "name": "John Doe",
        "applicationStatus": "Pending",
        // ... other fields
      }
    ]
    ```

#### **`GET /api/members/:id`**

-   **Description:** Retrieves a single member application by its ID.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "60d5f3a9a1b2c3d4e5f6g7h9",
        "name": "John Doe",
        "applicationStatus": "Pending",
        // ... other fields
    }
    ```

#### **`PUT /api/members/:id`**

-   **Description:** Updates a member's application status or notes.
-   **Access:** Private/Admin
-   **Request Body:** `application/json`
    ```json
    {
      "applicationStatus": "Approved",
      "notes": "Verified and approved."
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "60d5f3a9a1b2c3d4e5f6g7h9",
        "name": "John Doe",
        "applicationStatus": "Approved",
        "notes": "Verified and approved.",
        // ... other fields
    }
    ```

#### **`DELETE /api/members/:id`**

-   **Description:** Deletes a member application and associated files from Cloudinary.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Member application removed"
    }
    ```

---

### **4. Media (`/api/media`)**

Manages media items like news articles, videos, and press releases.

#### **`POST /api/media`**

-   **Description:** Creates a new media item. Handles file uploads for thumbnails and the main media file.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `title`: String
    -   `description`: String
    -   `category`: String (e.g., "News", "Video")
    -   `mediaFile`: File (The main image or video file)
    -   `thumbnailFile`: File (Optional thumbnail)
-   **Success Response (201 Created):**
    ```json
    {
        "_id": "...",
        "title": "New Media Item",
        "fileUrl": "http://res.cloudinary.com/...",
        // ... other fields
    }
    ```

#### **`GET /api/media`**

-   **Description:** Retrieves all media items.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    [
        {
            "_id": "...",
            "title": "New Media Item",
            // ... other fields
        }
    ]
    ```

#### **`GET /api/media/:id`**

-   **Description:** Retrieves a single media item by ID.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "title": "New Media Item",
        // ... other fields
    }
    ```

#### **`PUT /api/media/:id/view`**

-   **Description:** Increments the view count of a media item.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
        "viewCount": 101
    }
    ```

#### **`PUT /api/media/:id`**

-   **Description:** Updates a media item. Can include new file uploads.
-   **Access:** Private/Admin
-   **Form Data:** (Similar to create)
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "title": "Updated Media Item",
        // ... other fields
    }
    ```

#### **`DELETE /api/media/:id`**

-   **Description:** Deletes a media item and its associated files from Cloudinary.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Media removed"
    }
    ```

---

### **5. Programs (`/api/programs`)**

Manages the organization's programs and events.

#### **`POST /api/programs`**

-   **Description:** Creates a new program. Supports `multipart/form-data` for a cover image and a gallery of images.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `name`: String
    -   `description`: String
    -   `status`: String (e.g., "Upcoming", "Completed")
    -   `coverImage`: File (Single file)
    -   `gallery`: Array of Files
-   **Success Response (201 Created):**
    ```json
    {
        "_id": "...",
        "name": "New Program",
        "coverImage": "http://res.cloudinary.com/...",
        "gallery": [ { "url": "...", "publicId": "..." } ],
        // ... other fields
    }
    ```

#### **`GET /api/programs`**

-   **Description:** Retrieves all programs.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    [
        {
            "_id": "...",
            "name": "New Program",
            // ... other fields
        }
    ]
    ```

#### **`GET /api/programs/:id`**

-   **Description:** Retrieves a single program by ID.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "name": "New Program",
        // ... other fields
    }
    ```

#### **`PUT /api/programs/:id`**

-   **Description:** Updates a program. Can handle new file uploads and updates to the gallery.
-   **Access:** Private/Admin
-   **Form Data:** (Similar to create)
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "name": "Updated Program",
        // ... other fields
    }
    ```

#### **`DELETE /api/programs/:id`**

-   **Description:** Deletes a program and all associated images from Cloudinary.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Program removed"
    }
    ```

---

### **6. Projects (`/api/projects`)**

Manages the organization's upcoming or ongoing projects.

#### **`POST /api/projects`**

-   **Description:** Creates a new project. Supports `multipart/form-data` for a cover image and gallery.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `name`: String
    -   `description`: String
    -   `budget`: String
    -   `targetFarms`: String
    -   `status`: String (e.g., "Planned", "In Progress")
    -   `coverImage`: File
    -   `gallery`: Array of Files
-   **Success Response (201 Created):**
    ```json
    {
        "_id": "...",
        "name": "New Project",
        "status": "Planned",
        // ... other fields
    }
    ```

#### **`GET /api/projects`**

-   **Description:** Retrieves all projects.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    [
        {
            "_id": "...",
            "name": "New Project",
            // ... other fields
        }
    ]
    ```

#### **`GET /api/projects/:id`**

-   **Description:** Retrieves a single project by ID.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "name": "New Project",
        // ... other fields
    }
    ```

#### **`PUT /api/projects/:id`**

-   **Description:** Updates a project.
-   **Access:** Private/Admin
-   **Form Data:** (Similar to create)
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "name": "Updated Project",
        // ... other fields
    }
    ```

#### **`DELETE /api/projects/:id`**

-   **Description:** Deletes a project and all associated images.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Project removed successfully"
    }
    ```

---

### **7. Team (`/api/team`)**

Manages profiles of team members.

#### **`POST /api/team`**

-   **Description:** Creates a new team member profile. Requires a photo upload.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `name`: String
    -   `role`: String
    -   `description`: String
    -   `photo`: File
-   **Success Response (201 Created):**
    ```json
    {
        "_id": "...",
        "name": "Team Member Name",
        "role": "Core Team",
        "photo": "http://res.cloudinary.com/...",
        // ... other fields
    }
    ```

#### **`GET /api/team`**

-   **Description:** Retrieves all team members.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    [
        {
            "_id": "...",
            "name": "Team Member Name",
            // ... other fields
        }
    ]
    ```

#### **`GET /api/team/:id`**

-   **Description:** Retrieves a single team member by ID.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "name": "Team Member Name",
        // ... other fields
    }
    ```

#### **`PUT /api/team/:id`**

-   **Description:** Updates a team member's profile. Can include a new photo.
-   **Access:** Private/Admin
-   **Form Data:** (Similar to create)
-   **Success Response (200 OK):**
    ```json
    {
        "_id": "...",
        "name": "Updated Name",
        // ... other fields
    }
    ```

#### **`DELETE /api/team/:id`**

-   **Description:** Deletes a team member and their photo.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Team member removed"
    }
    ```

---

### **8. Andolan (Movements) (`/api/andolan`)**

Manages timeline events for the "Andolan" page.

#### **`POST /api/andolan`**

-   **Description:** Creates a new Andolan timeline event.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `year`: String
    -   `title`: String
    -   `description`: String
    -   `image`: File (Optional)
-   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "year": "2023",
        "title": "Historic Protest",
        // ... other fields
      }
    }
    ```

#### **`GET /api/andolan`**

-   **Description:** Retrieves all Andolan events.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "year": "2023",
          "title": "Historic Protest"
        }
      ]
    }
    ```

#### **`PUT /api/andolan/:id`**

-   **Description:** Updates an Andolan event.
-   **Access:** Private/Admin
-   **Form Data:** (Similar to create)
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "Updated Title",
        // ... other fields
      }
    }
    ```

#### **`DELETE /api/andolan/:id`**

-   **Description:** Deletes an Andolan event.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```

---

### **9. Information (`/api/information`)**

Manages generic information items (articles, news, announcements).

#### **`POST /api/information`**

-   **Description:** Creates a new information item.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `title`: String
    -   `content`: String
    -   `category`: String ("Article", "Announcement", "News")
    -   `status`: String ("draft", "published")
    -   `image`: File (Optional)
-   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "New Announcement",
        "category": "Announcement",
        // ... other fields
      }
    }
    ```

#### **`GET /api/information`**

-   **Description:** Retrieves all information items.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "...",
          "title": "New Announcement"
        }
      ]
    }
    ```

#### **`PUT /api/information/:id`**

-   **Description:** Updates an information item.
-   **Access:** Private/Admin
-   **Form Data:** (Similar to create)
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "Updated Announcement",
        // ... other fields
      }
    }
    ```

#### **`DELETE /api/information/:id`**

-   **Description:** Deletes an information item.
-   **Access:** Private/Admin
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {}
    }
    ```

---

### **10. Vision (`/api/vision`)**

Manages the single "Vision & Mission" document for the organization.

#### **`POST /api/vision`**

-   **Description:** Creates or updates the Vision & Mission statement. Only one document is allowed in the collection.
-   **Access:** Private/Admin
-   **Form Data:**
    -   `title`: String
    -   `description`: String
    -   `image`: File (Optional)
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "Our Vision & Mission",
        "description": "A detailed description...",
        // ... other fields
      }
    }
    ```

#### **`GET /api/vision`**

-   **Description:** Retrieves the Vision & Mission statement.
-   **Access:** Public
-   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "_id": "...",
        "title": "Our Vision & Mission",
        "description": "A detailed description..."
      }
    }
    ```

### Database Models
Mongoose schemas define the structure for each collection in MongoDB. Key models include:
-   `User`: Stores admin user credentials and roles.
-   `Member`: Stores member application data.
-   `Media`: Stores links and metadata for news articles, videos, etc.
-   `Program`: Stores details about organizational programs and events.
-   `Project`: Stores details about organizational projects.
-   `Team`: Stores profiles of team members.
-   `Andolan`, `Information`, `Vision`: Store content for the respective informational pages.
-   `OTP`: Temporarily stores OTPs for phone verification.

## 4. Frontend Architecture

### Overview
The frontend is a modern Single-Page Application (SPA) built with React and Vite, styled with Tailwind CSS. It provides a fast, responsive interface for public users and administrators.

-   **Technology Stack:**
    -   **React:** UI library for building components.
    -   **Vite:** Fast frontend build tool and development server.
    -   **React Router DOM:** For client-side routing.
    -   **Redux Toolkit:** For global state management.
    -   **Axios:** For making HTTP requests to the backend API.
    -   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
    -   **Framer Motion:** For animations.
    -   **Lucide React:** For icons.
    -   **Recharts:** For data visualization in the admin dashboard.

-   **Directory Structure (`frontend/src/`):**
    -   `components/`: Reusable UI components (e.g., Header, Footer, Cards).
    -   `pages/`: Top-level components representing application pages (e.g., HomePage, AboutPage, AdminDashboard).
    -   `redux/` or `store/`: Contains Redux Toolkit slices and store configuration.
    -   `hooks/`: Custom React hooks.
    -   `utils/`: Utility functions.
    -   `App.jsx`: Main application component where routing is defined.
    -   `main.jsx`: The entry point for the React application.

### Routing
Client-side routing is managed by `react-router-dom`. Routes are defined in `App.jsx`, separating public-facing pages from protected admin routes. A `ProtectedRoute` component likely guards admin pages, redirecting unauthenticated users to the login page.

### State Management
-   **Redux Toolkit:** Used for managing global application state, such as user authentication status, and caching fetched data from the API to reduce redundant network requests.
-   **React Hooks:** `useState`, `useEffect`, and `useContext` are used for managing local component state (e.g., form inputs, loading indicators).

### Styling
-   **Tailwind CSS:** The primary styling solution. Utility classes are used directly in the JSX for most styling.
-   **`index.css`:** Contains base styles, Tailwind directives, and any global custom styles.
