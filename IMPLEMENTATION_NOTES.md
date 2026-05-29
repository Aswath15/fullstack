# Implementation Documentation

## Project Overview

The Document Management Dashboard is a full-stack web application for PDF document upload, management, and real-time tracking. This document outlines all implementation details, architectural decisions, and component interactions.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌───────────────────────────┐ │
│ │ Upload Area  │ │ Notification │ │   Document List Component  │ │
│ │              │ │   Center     │ │                            │ │
│ └──────┬───────┘ └──────┬───────┘ └────────────┬───────────────┘ │
│        │                │                      │                 │
│        └────────────────┼──────────────────────┘                 │
│                         │                                         │
│                    API Service Layer                             │
│                    (Axios + Fetch)                              │
└─────────────────────────────────────────────────────────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │ REST API / WebSocket
                  ▼                 ▼
          ┌──────────────────────────────┐
          │  Backend (Spring Boot)       │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │  REST Controllers        │ │
          │ │ - FileController        │ │
          │ │ - DocumentController    │ │
          │ │ - NotificationController│ │
          │ └──────┬───────────────────┘ │
          │        │                     │
          │ ┌──────▼───────────────────┐ │
          │ │  Business Logic Layer    │ │
          │ │ - FileService           │ │
          │ │ - DocumentService       │ │
          │ │ - NotificationService   │ │
          │ └──────┬───────────────────┘ │
          │        │                     │
          │ ┌──────▼───────────────────┐ │
          │ │  WebSocket Handler       │ │
          │ │ - Real-time Events      │ │
          │ └──────┬───────────────────┘ │
          │        │                     │
          │ ┌──────▼───────────────────┐ │
          │ │  Data Access Layer (JPA) │ │
          │ │ - DocumentRepository    │ │
          │ │ - NotificationRepository│ │
          │ └──────┬───────────────────┘ │
          └────────┼───────────────────┘
                   │
                   ▼
          ┌──────────────────┐
          │   MySQL Database │
          │ - documents      │
          │ - notifications  │
          └──────────────────┘
```

---

## Frontend Architecture

### Component Structure

```
App (Root)
├── Header
│   └── NotificationCenter
│       └── NotificationPanel
├── Main Content
│   ├── UploadArea (Left Sidebar)
│   │   ├── DropZone
│   │   ├── FileUploadItem (List)
│   │   └── Upload Button
│   └── DocumentSection (Right Content)
│       └── DocumentList
│           └── DocumentTable
```

### State Management

**Global State (App Component):**
- `documents`: Array of document objects
- `notifications`: Array of notification objects
- `unreadCount`: Integer
- `loading`: Boolean

**Local State (Component Level):**
- UploadArea: `files`, `uploading`, `uploadStatus`
- NotificationCenter: `isOpen`, `localNotifications`
- DocumentList: Derived from props

### API Communication

**Axios Instance Configuration:**
```javascript
- Base URL: /api
- Timeout: 30s
- Interceptors: None (can be added)
- Error handling: Try-catch blocks
```

**Key API Calls:**
- `uploadFiles(files)` - Multipart POST
- `fetchDocuments()` - GET
- `downloadDocument(id)` - GET with blob
- `fetchNotifications()` - GET
- `markNotificationAsRead(id)` - PUT

### Real-time Communication

**WebSocket Connection:**
- URL: ws://localhost:8080/api/notifications
- Auto-reconnect: Not implemented (can add)
- Message format: JSON notification object
- Message handler: Creates notification and updates UI

---

## Backend Architecture

### Directory Structure

```
src/main/java/com/documentmanagement/
├── DocumentManagementApplication.java    # Entry point
├── config/
│   ├── WebSocketConfig.java              # WebSocket registration
│   └── CorsConfig.java                   # CORS settings
├── controller/
│   ├── FileController.java               # Upload/Download endpoints
│   ├── DocumentController.java           # Document CRUD endpoints
│   └── NotificationController.java       # Notification endpoints
├── service/
│   ├── FileService.java                  # File operations
│   ├── NotificationService.java          # Notification logic
│   └── DocumentService.java (optional)
├── model/
│   ├── Document.java                     # JPA Entity
│   └── Notification.java                 # JPA Entity
├── repository/
│   ├── DocumentRepository.java           # Spring Data JPA
│   └── NotificationRepository.java       # Spring Data JPA
└── websocket/
    └── NotificationWebSocketHandler.java # WebSocket handler
```

### Data Models

**Document Entity:**
```java
- id (Long, PK)
- fileName (String)
- fileSize (Long)
- fileType (String)
- uploadDate (LocalDateTime)
- status (String)
- filePath (String)
```

**Notification Entity:**
```java
- id (Long, PK)
- message (String)
- type (String) // success, error, warning, info
- timestamp (LocalDateTime)
- isRead (Boolean)
```

### Service Layer

**FileService:**
- `uploadFile(MultipartFile)`: Validate, store, create record
- `getAllDocuments()`: Query DB
- `getDocument(Long)`: Find by ID
- `downloadFile(Long)`: Read from disk
- `deleteFile(Long)`: Remove file and record

**NotificationService:**
- `createNotification(message, type)`: Create + WebSocket send
- `getAllNotifications()`: Query all
- `getUnreadNotifications()`: Query unread
- `markAsRead(Long)`: Update DB
- `markAllAsRead()`: Batch update
- `getUnreadCount()`: Count query

### Request Flow

**Upload Request:**
1. Frontend sends multipart POST to /upload
2. FileController receives request
3. FileService validates and stores file
4. Document record created in DB
5. If bulk upload (>3), async notification processing
6. WebSocket handler sends notification to all clients
7. Frontend receives update via WebSocket
8. UI updates document list

**Notification Request:**
1. Frontend sends GET to /notifications
2. NotificationController queries DB
3. NotificationRepository returns records
4. Convert to JSON and return
5. Frontend updates notification list

---

## Database Design

### Schema

**documents table:**
```sql
CREATE TABLE documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    file_path VARCHAR(500) NOT NULL,
    INDEX idx_status (status),
    INDEX idx_upload_date (upload_date)
);
```

**notifications table:**
```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    INDEX idx_is_read (is_read),
    INDEX idx_timestamp (timestamp)
);
```

### Relationships
- No direct foreign keys (no user authentication)
- One-to-many would be: User (1) → Documents (Many)
- One-to-many would be: User (1) → Notifications (Many)

---

## File Storage

### Directory Structure
```
project/backend/uploads/
├── uuid_filename1.pdf
├── uuid_filename2.pdf
└── uuid_filename3.pdf
```

### File Naming Convention
- Pattern: `{UUID}_{original_filename}`
- Purpose: Prevent filename conflicts
- Retrieval: Stored path in DB

### Storage Limitations
- Current: Local file system
- Future: Cloud storage (S3, Azure Blob, GCS)

---

## WebSocket Implementation

### Handler Class
```java
NotificationWebSocketHandler extends TextWebSocketHandler
- sessions: Set<WebSocketSession>
- afterConnectionEstablished(): Add to set
- handleTextMessage(): Log message
- afterConnectionClosed(): Remove from set
- sendToAllClients(): Broadcast to all
```

### Configuration
```java
WebSocketConfig implements WebSocketConfigurer
- registerWebSocketHandlers()
- Path: /notifications
- CORS: * (all origins)
```

### Communication Pattern
1. Client connects to WS
2. Server adds session to set
3. Notification created in DB
4. Service calls handler.sendToAllClients()
5. Handler broadcasts to all connected clients
6. Client receives JSON and updates UI

---

## Error Handling

### Frontend
```javascript
try {
    await uploadFiles(files)
    // Success
} catch (error) {
    // Show error message
    console.error(error)
}
```

### Backend
```java
@ExceptionHandler(Exception.class)
public ResponseEntity<?> handleException(Exception e) {
    return ResponseEntity.status(500)
        .body(new ApiResponse(e.getMessage(), null));
}
```

---

## Async Processing

### Bulk Upload Handling
```java
@Async
private void processUploadNotification(int totalFiles, int successCount) {
    // Simulate processing
    if (totalFiles > 3) {
        Thread.sleep(2000);
    }
    // Create notification
    notificationService.createNotification(message, "success");
}
```

### Configuration
```java
@EnableAsync
// in main application class
```

---

## CORS Configuration

**Allowed Origins:**
- http://localhost:5173
- http://localhost:3000
- http://127.0.0.1:5173

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- * (all)

**Max Age:** 3600 seconds

---

## Upload Flow Diagram

```
User selects files
        │
        ▼
Validate file type & size
        │
        ├─ Valid
        │   ├─ Add to upload queue
        │   └─ Display in pending list
        │
        └─ Invalid
            └─ Show error message

User clicks upload
        │
        ▼
Start upload process
        │
        ├─ If files ≤ 3
        │   └─ Normal progress
        │
        └─ If files > 3
            └─ Background processing message

Files sent to server
        │
        ▼
Server validates & stores
        │
        ├─ Success
        │   ├─ Create DB record
        │   ├─ Generate notification
        │   ├─ Send via WebSocket
        │   └─ Return 200 OK
        │
        └─ Failure
            └─ Return 400/500 error

Frontend receives update
        │
        ├─ Success
        │   ├─ Show completion message
        │   ├─ Update document list
        │   └─ Update notification
        │
        └─ Error
            └─ Show error message
```

---

## Security Considerations

### Implemented
- ✅ File type validation (PDF only)
- ✅ File size limits (50MB)
- ✅ Parameterized queries (JPA)
- ✅ CORS configuration
- ✅ Input sanitization

### Future Enhancements
- User authentication
- Authorization (role-based)
- File encryption
- API rate limiting
- Request signing
- Audit logging
- Malware scanning

---

## Performance Optimization

### Current Implementation
- Single-page application (no page reloads)
- WebSocket for real-time updates
- Tailwind CSS for optimized styling
- Lazy component loading

### Potential Improvements
- Pagination for document list
- Lazy loading for notifications
- Image optimization
- Database query optimization
- Caching layer (Redis)
- Compression (GZIP)

---

## Deployment Considerations

### Development
```bash
# Backend
mvn spring-boot:run

# Frontend
npm run dev
```

### Production
```yaml
# Use Docker for containerization
# Use nginx for frontend
# Use managed databases (RDS)
# Use cloud storage (S3)
# Use CDN for assets
# Enable HTTPS/SSL
```

---

## Development Guidelines

### Code Style
- Follow Google Java Style Guide (Backend)
- Follow Airbnb React Style Guide (Frontend)
- Use consistent naming conventions
- Add comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit regularly
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create PR for review
# Merge to main after approval
```

### Documentation
- Update README.md for major changes
- Add inline comments for complex code
- Keep API documentation current
- Document assumptions and constraints

---

## Maintenance Tasks

### Regular
- [ ] Monitor error logs
- [ ] Check disk space
- [ ] Test backup/restore
- [ ] Update dependencies monthly

### Periodic
- [ ] Security updates
- [ ] Performance review
- [ ] Database optimization
- [ ] Code refactoring

### Annual
- [ ] Architecture review
- [ ] User feedback collection
- [ ] Technology stack evaluation
- [ ] Capacity planning

---

## Known Limitations

1. No user authentication (prototype)
2. Local file storage only
3. No file preview
4. No search functionality
5. No pagination
6. No audit logging
7. No encryption
8. No backup mechanism

---

## Future Enhancement Roadmap

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| High | User Authentication | 5 days | Critical |
| High | Cloud Storage | 3 days | High |
| Medium | Search & Filter | 2 days | Medium |
| Medium | Document Preview | 3 days | Medium |
| Low | OCR Support | 5 days | Low |
| Low | Mobile App | 10 days | Medium |

---

**Last Updated**: May 2026
**Implementation Status**: Complete
**Version**: 1.0.0
