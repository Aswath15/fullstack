# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+
- Java 17+
- MySQL 8.0+

### Step 1: Setup Database (1 min)

```bash
# Connect to MySQL
mysql -u root -p

# Run schema
source database/schema.sql

# Exit
exit
```

### Step 2: Start Backend (2 min)

```bash
cd backend
mvn spring-boot:run
```

Wait for message: `Started DocumentManagementApplication in X seconds`

### Step 3: Start Frontend (2 min)

```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open Browser

Navigate to: **http://localhost:5173**

---

## 🎯 What to Try First

1. **Upload PDF Files**
   - Click "Upload Documents" section
   - Drag and drop a PDF or click to browse
   - Watch the progress bar

2. **Check Notifications**
   - Click the bell icon (top right)
   - See upload completion notification
   - Mark as read

3. **Download Documents**
   - Go to "Uploaded Documents" section
   - Click Download button on any file

4. **Real-time Updates**
   - Upload files from one browser tab
   - Notifications appear instantly in another tab

---

## 📊 Testing Scenarios

### Test 1: Small Upload (≤ 3 files)
- Upload 2-3 PDF files
- Normal progress display
- Immediate notification

### Test 2: Bulk Upload (> 3 files)
- Upload 5+ PDF files
- Shows "processing in background" message
- Notification after 2 seconds

### Test 3: Real-time Notification
- Open dashboard in 2 browser windows
- Upload files in one window
- Notification appears in both instantly

---

## 🔍 Verify Setup

### Backend Check
```bash
curl http://localhost:8080/api/documents
# Should return: []
```

### Database Check
```bash
mysql -u root -p
USE document_management_db;
SELECT COUNT(*) FROM documents;
```

### WebSocket Check
Open browser DevTools → Network → WS tab
Should show connection to `/api/notifications`

---

## ⚙️ Configuration Files

### Database Credentials
Edit: `backend/src/main/resources/application.properties`
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### API Proxy
Edit: `frontend/vite.config.js`
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080'
  }
}
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Database connection error | Ensure MySQL is running and schema is imported |
| Port 8080 already in use | Change port in application.properties |
| Port 5173 already in use | Vite will auto-select next available port |
| WebSocket connection failed | Backend must be running with context-path=/api |
| CORS errors | Check allowed origins in CorsConfig |
| Files not uploading | Verify uploads/ directory exists and is writable |

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `database/schema.sql` | Create database tables |
| `backend/src/main/resources/application.properties` | Backend configuration |
| `frontend/vite.config.js` | Frontend dev server config |
| `frontend/tailwind.config.js` | Tailwind CSS config |
| `backend/pom.xml` | Maven dependencies |
| `frontend/package.json` | npm dependencies |

---

**Everything working? Great! Read the full README.md for detailed documentation.**
