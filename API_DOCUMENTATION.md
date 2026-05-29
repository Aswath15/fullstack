# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
No authentication required for prototype version.

## Content-Type
All JSON responses use `application/json`

---

## 📤 File Upload

### Upload Files
**Endpoint:** `POST /upload`

**Description:** Upload single or multiple PDF files

**Request:**
```
Content-Type: multipart/form-data

Parameter name: files
Type: Multiple files (PDF)
```

**Example (cURL):**
```bash
curl -X POST http://localhost:8080/api/upload \
  -F "files=@document1.pdf" \
  -F "files=@document2.pdf"
```

**Success Response (200):**
```json
{
  "message": "Files uploaded successfully",
  "data": [
    {
      "id": 1,
      "fileName": "document1.pdf",
      "fileSize": 1024000,
      "fileType": "application/pdf",
      "uploadDate": "2024-05-29T10:30:00",
      "status": "ACTIVE",
      "filePath": "uploads/uuid_document1.pdf"
    },
    {
      "id": 2,
      "fileName": "document2.pdf",
      "fileSize": 2048000,
      "fileType": "application/pdf",
      "uploadDate": "2024-05-29T10:30:01",
      "status": "ACTIVE",
      "filePath": "uploads/uuid_document2.pdf"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "message": "Upload failed: Only PDF files are allowed",
  "data": null
}
```

---

## 📥 Download File

### Download Document
**Endpoint:** `GET /download/{id}`

**Description:** Download a PDF file by document ID

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Document ID |

**Example (cURL):**
```bash
curl -X GET http://localhost:8080/api/download/1 \
  -o downloaded_document.pdf
```

**Success Response (200):**
- Binary PDF file

**Error Response (404):**
```json
{
  "message": "Document not found",
  "error": "NOT_FOUND"
}
```

---

## 📋 Document Management

### Get All Documents
**Endpoint:** `GET /documents`

**Description:** Fetch all uploaded documents with metadata

**Example (cURL):**
```bash
curl -X GET http://localhost:8080/api/documents
```

**Response (200):**
```json
[
  {
    "id": 1,
    "fileName": "report.pdf",
    "fileSize": 1024000,
    "fileType": "application/pdf",
    "uploadDate": "2024-05-29T10:30:00",
    "status": "ACTIVE",
    "filePath": "uploads/uuid_report.pdf"
  },
  {
    "id": 2,
    "fileName": "invoice.pdf",
    "fileSize": 512000,
    "fileType": "application/pdf",
    "uploadDate": "2024-05-29T10:31:00",
    "status": "ACTIVE",
    "filePath": "uploads/uuid_invoice.pdf"
  }
]
```

### Get Document by ID
**Endpoint:** `GET /documents/{id}`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Document ID |

**Example (cURL):**
```bash
curl -X GET http://localhost:8080/api/documents/1
```

**Response (200):**
```json
{
  "id": 1,
  "fileName": "report.pdf",
  "fileSize": 1024000,
  "fileType": "application/pdf",
  "uploadDate": "2024-05-29T10:30:00",
  "status": "ACTIVE",
  "filePath": "uploads/uuid_report.pdf"
}
```

### Delete Document
**Endpoint:** `DELETE /documents/{id}`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Document ID |

**Example (cURL):**
```bash
curl -X DELETE http://localhost:8080/api/documents/1
```

**Response (200):**
```json
{
  "message": "Document deleted successfully",
  "data": null
}
```

---

## 🔔 Notifications

### Get All Notifications
**Endpoint:** `GET /notifications`

**Description:** Fetch all notifications with read status

**Example (cURL):**
```bash
curl -X GET http://localhost:8080/api/notifications
```

**Response (200):**
```json
[
  {
    "id": 5,
    "message": "3 files uploaded successfully",
    "type": "success",
    "timestamp": "2024-05-29T10:35:00",
    "isRead": false
  },
  {
    "id": 4,
    "message": "Upload complete",
    "type": "success",
    "timestamp": "2024-05-29T10:30:00",
    "isRead": true
  }
]
```

### Get Unread Notifications
**Endpoint:** `GET /notifications/unread`

**Description:** Fetch only unread notifications

**Example (cURL):**
```bash
curl -X GET http://localhost:8080/api/notifications/unread
```

**Response (200):**
```json
[
  {
    "id": 5,
    "message": "3 files uploaded successfully",
    "type": "success",
    "timestamp": "2024-05-29T10:35:00",
    "isRead": false
  }
]
```

### Get Unread Count
**Endpoint:** `GET /notifications/unread-count`

**Description:** Get total count of unread notifications

**Example (cURL):**
```bash
curl -X GET http://localhost:8080/api/notifications/unread-count
```

**Response (200):**
```json
3
```

### Mark Notification as Read
**Endpoint:** `PUT /notifications/{id}/read`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Notification ID |

**Example (cURL):**
```bash
curl -X PUT http://localhost:8080/api/notifications/5/read
```

**Response (200):**
```json
{
  "id": 5,
  "message": "3 files uploaded successfully",
  "type": "success",
  "timestamp": "2024-05-29T10:35:00",
  "isRead": true
}
```

### Mark All as Read
**Endpoint:** `PUT /notifications/read-all`

**Description:** Mark all notifications as read

**Example (cURL):**
```bash
curl -X PUT http://localhost:8080/api/notifications/read-all
```

**Response (200):**
```json
{
  "message": "All notifications marked as read",
  "data": null
}
```

### Delete Notification
**Endpoint:** `DELETE /notifications/{id}`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | Notification ID |

**Example (cURL):**
```bash
curl -X DELETE http://localhost:8080/api/notifications/5
```

**Response (200):**
```json
{
  "message": "Notification deleted successfully",
  "data": null
}
```

---

## 🔗 WebSocket

### Real-time Notifications
**Endpoint:** `WS /notifications`

**Description:** WebSocket connection for real-time notification streaming

**Connection (JavaScript):**
```javascript
const ws = new WebSocket('ws://localhost:8080/api/notifications');

ws.onopen = (event) => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('Notification received:', notification);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log('WebSocket closed');
};
```

**Message Format (JSON):**
```json
{
  "id": 6,
  "message": "5 files uploaded successfully",
  "type": "success",
  "timestamp": "2024-05-29T10:40:00",
  "isRead": false
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request: File is empty",
  "data": null
}
```

### 404 Not Found
```json
{
  "message": "Document not found",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "message": "Upload failed: Internal server error",
  "data": null
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

No rate limiting implemented in prototype version.

## Pagination

No pagination implemented. All endpoints return complete datasets.

## Filters

No filtering implemented. Endpoints return all records or filtered by ID only.

---

## Common Response Format

All API responses follow this standard format:

```json
{
  "message": "Descriptive message",
  "data": {}  // or null, or array
}
```

Exception: File download returns binary content
Exception: WebSocket returns JSON notification directly

---

## API Testing with Postman

### Import Collection
1. Open Postman
2. Create new collection "Document Management Dashboard"
3. Add requests for each endpoint

### Example Request Setup

**POST /upload**
- Method: POST
- URL: http://localhost:8080/api/upload
- Headers: Auto (multipart/form-data)
- Body: Form-data
  - Key: files, Value: Select file(s)

**GET /documents**
- Method: GET
- URL: http://localhost:8080/api/documents
- Headers: None needed

**PUT /notifications/{id}/read**
- Method: PUT
- URL: http://localhost:8080/api/notifications/1/read
- Headers: None needed

---

## API Response Times (Expected)

| Endpoint | Time |
|----------|------|
| Upload (10MB) | 1-2s |
| GET documents | <100ms |
| Notification send | <500ms |
| WebSocket message | <100ms |

---

**Last Updated**: May 2026
**API Version**: 1.0
