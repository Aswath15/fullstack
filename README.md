# Document Management Dashboard

A full-stack web application for uploading, managing, and tracking PDF documents with real-time notifications.

## 🎯 Features

- ✅ Single & Bulk PDF Upload
- ✅ Drag-and-Drop Support
- ✅ Real-time Upload Progress Tracking
- ✅ WebSocket-based Real-time Notifications
- ✅ Persistent Notification Center
- ✅ Document Management & Download
- ✅ Responsive Design (White & Blue Theme)
- ✅ Background Processing for Bulk Uploads
- ✅ Cross-Page Notifications

## 📋 Project Structure

```
Asw/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── services/        # API Services
│   │   ├── styles/          # CSS Styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── backend/                  # Spring Boot Backend
│   ├── src/main/java/com/documentmanagement/
│   │   ├── config/          # Configuration Classes
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business Logic
│   │   ├── model/           # JPA Entities
│   │   ├── repository/      # Data Access Layer
│   │   ├── websocket/       # WebSocket Handler
│   │   └── DocumentManagementApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── uploads/         # File Storage
│   └── pom.xml
└── database/
    └── schema.sql           # Database Schema
```

## 🛠️ Technology Stack

### Frontend
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.4.0
- Axios 1.6.0

### Backend
- Spring Boot 3.2.0
- Spring Data JPA
- Spring WebSocket
- MySQL 8.0
- Lombok
- Gson

### Database
- MySQL 8.0+

## ⚙️ Prerequisites

- Node.js 16+ and npm
- Java 17+
- MySQL 8.0+
- Maven 3.8+

## 📦 Installation & Setup

### 1. Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema script
source database/schema.sql

# Verify creation
USE document_management_db;
SHOW TABLES;
```

### 2. Backend Setup

```bash
cd backend

# Build with Maven
mvn clean install

# Run Spring Boot application
mvn spring-boot:run

# The backend will start on http://localhost:8080/api
# WebSocket available at ws://localhost:8080/api/notifications
```

**Configure database credentials in `backend/src/main/resources/application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/document_management_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

## 📡 API Endpoints

### File Upload
- **POST** `/api/upload`
  - Upload single or multiple PDF files
  - Multipart form-data with `files` parameter
  - Response: List of uploaded documents

### Documents
- **GET** `/api/documents`
  - Fetch all uploaded documents
  - Response: Array of document objects

- **GET** `/api/documents/{id}`
  - Get specific document
  - Response: Document object

- **DELETE** `/api/documents/{id}`
  - Delete a document

### Download
- **GET** `/api/download/{id}`
  - Download PDF file by ID
  - Response: Binary PDF file

### Notifications
- **GET** `/api/notifications`
  - Fetch all notifications
  - Response: Array of notification objects

- **GET** `/api/notifications/unread`
  - Fetch unread notifications
  - Response: Array of unread notifications

- **GET** `/api/notifications/unread-count`
  - Get count of unread notifications
  - Response: Integer count

- **PUT** `/api/notifications/{id}/read`
  - Mark notification as read

- **PUT** `/api/notifications/read-all`
  - Mark all notifications as read

- **DELETE** `/api/notifications/{id}`
  - Delete a notification

### WebSocket
- **WS** `ws://localhost:8080/api/notifications`
  - Real-time notification streaming
  - Receives notification events as JSON

## 🎨 UI Components

### Frontend Components
- **UploadArea**: Drag-and-drop file upload with progress tracking
- **FileUploadItem**: Individual file upload status display
- **NotificationCenter**: Notification bell with badge
- **NotificationPanel**: Dropdown panel showing notifications
- **DocumentList**: Table of uploaded documents
- **App**: Main dashboard component

## 🔄 Upload Workflow

### Small Uploads (≤ 3 files)
1. User selects/drags files
2. Progress bar updates in real-time
3. Notification sent when complete
4. Files appear in document list

### Bulk Uploads (> 3 files)
1. User selects/drags files
2. Display: "Upload in progress — processing X files in background"
3. Background processing on server
4. Real-time notification when done
5. Notification persists in notification center

## 📊 Database Schema

### Documents Table
```sql
- id (BIGINT, Primary Key)
- file_name (VARCHAR)
- file_size (BIGINT)
- file_type (VARCHAR)
- upload_date (TIMESTAMP)
- status (VARCHAR)
- file_path (VARCHAR)
```

### Notifications Table
```sql
- id (BIGINT, Primary Key)
- message (TEXT)
- type (VARCHAR) - success/error/warning/info
- timestamp (TIMESTAMP)
- is_read (BOOLEAN)
```

## 🚀 Running the Application

### Terminal 1: Backend
```bash
cd backend
mvn spring-boot:run
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- WebSocket: ws://localhost:8080/api/notifications

## 🧪 Testing

### Backend Testing
- Test file upload with single and multiple files
- Verify notifications are created and sent via WebSocket
- Test file download functionality
- Verify database persistence

### Frontend Testing
- Drag-and-drop upload functionality
- Progress bar updates
- Real-time notification reception
- Document list display and download
- Notification center operations (read, mark all)

### Edge Cases to Test
- Upload empty files
- Upload non-PDF files
- Upload oversized files
- Upload with network interruption
- Navigate between pages with active uploads
- WebSocket reconnection

## 📝 Configuration

### Backend Configuration (application.properties)

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/document_management_db
spring.datasource.username=root
spring.datasource.password=password

# File Upload
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=100MB
file.upload.path=uploads

# CORS
cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration (vite.config.js)

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
  }
}
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in application.properties
- Ensure database is created with schema

### WebSocket Connection Failed
- Check if backend is running on port 8080
- Verify WebSocket handler is registered
- Check browser console for connection errors

### File Upload Fails
- Check file is PDF format
- Verify file size is within limits
- Ensure uploads directory has write permissions
- Check disk space availability

### CORS Issues
- Verify frontend URL is in allowed origins
- Check browser console for specific CORS errors
- Ensure credentials flag is set correctly

## 📄 Future Enhancements

- User authentication and authorization
- Cloud storage integration (AWS S3, Azure Blob)
- AI-powered document search and OCR
- Document preview functionality
- Search and filtering capabilities
- Role-based access control
- Advanced analytics and reporting
- Document versioning

## 📞 Support

For issues or questions, please refer to the respective documentation:
- Spring Boot: https://spring.io/projects/spring-boot
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com

## 📜 License

This project is created for educational purposes.

---

**Last Updated**: May 2026
**Version**: 1.0.0
