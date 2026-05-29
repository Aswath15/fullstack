# Testing Guide

## Unit Testing & Integration Testing

### Backend Testing (Spring Boot)

#### Dependencies (add to pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>
```

#### File Service Tests

```java
@DataJpaTest
public class DocumentRepositoryTests {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Test
    public void testFindAllDocuments() {
        Document doc = Document.builder()
            .fileName("test.pdf")
            .fileSize(1024)
            .fileType("application/pdf")
            .build();
        
        entityManager.persistAndFlush(doc);
        
        List<Document> documents = documentRepository.findAll();
        assertThat(documents).contains(doc);
    }
}
```

#### Notification Service Tests

```java
@SpringBootTest
public class NotificationServiceTests {
    
    @Autowired
    private NotificationService notificationService;
    
    @MockBean
    private NotificationWebSocketHandler webSocketHandler;
    
    @Test
    public void testCreateNotification() {
        Notification notification = notificationService.createNotification(
            "Test message", "success"
        );
        
        assertNotNull(notification.getId());
        assertEquals("Test message", notification.getMessage());
        assertFalse(notification.getIsRead());
    }
}
```

### Frontend Testing (React/Jest)

#### Setup Jest

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.4",
    "vitest": "^0.34.0",
    "jsdom": "^22.1.0"
  }
}
```

#### Component Tests

```javascript
import { render, screen } from '@testing-library/react';
import UploadArea from '../components/UploadArea';

test('renders upload area', () => {
  render(<UploadArea onUploadSuccess={() => {}} />);
  const element = screen.getByText(/drag and drop/i);
  expect(element).toBeInTheDocument();
});

test('displays file list when files are selected', () => {
  render(<UploadArea onUploadSuccess={() => {}} />);
  // Test file selection logic
});
```

---

## Manual Testing Checklist

### ✅ File Upload Tests

- [ ] Single file upload (PDF)
- [ ] Multiple file upload
- [ ] Drag and drop upload
- [ ] Non-PDF file rejection
- [ ] Empty file rejection
- [ ] Large file upload (>50MB)
- [ ] Upload progress display
- [ ] Upload completion notification

### ✅ Image: Bulk Upload Tests

- [ ] Upload 3 files (normal flow)
- [ ] Upload 4 files (bulk flow)
- [ ] Upload 10 files (bulk flow)
- [ ] "Processing in background" message display
- [ ] Notification after bulk processing
- [ ] Files appear in list after upload

### ✅ Notification Tests

- [ ] Notification badge count updates
- [ ] Notification appears in bell dropdown
- [ ] Real-time notification (WebSocket)
- [ ] Mark notification as read
- [ ] Mark all notifications as read
- [ ] Notification persists after page refresh
- [ ] Notification visible in different browser tabs
- [ ] Unread count updates

### ✅ Document Management Tests

- [ ] Document list displays all files
- [ ] Document metadata shows correctly
- [ ] Download button works
- [ ] Downloaded file is correct
- [ ] Document list updates after upload
- [ ] Delete document functionality
- [ ] Document list sorted by upload date

### ✅ UI/UX Tests

- [ ] Responsive design on mobile
- [ ] Responsive design on tablet
- [ ] Responsive design on desktop
- [ ] Theme colors correct (white/blue)
- [ ] Animations smooth
- [ ] Loading indicators visible
- [ ] Error messages display
- [ ] No console errors

### ✅ Cross-browser Tests

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### ✅ Edge Cases

- [ ] Network timeout during upload
- [ ] Browser refresh during upload
- [ ] Tab close during upload
- [ ] WebSocket disconnection
- [ ] Database connection loss
- [ ] File system full
- [ ] Missing file on disk
- [ ] Corrupted PDF file
- [ ] Simultaneous uploads

### ✅ Performance Tests

- [ ] Upload 100MB file
- [ ] Upload 50+ files simultaneously
- [ ] Notification delivery < 2 seconds
- [ ] Page load time < 3 seconds
- [ ] List render with 100+ documents

### ✅ Accessibility Tests

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] ARIA labels present
- [ ] Tab order logical

---

## API Testing with Postman

### Test Scenarios

#### Scenario 1: Complete Upload Workflow

1. **Upload Files**
   - Request: POST /upload
   - Files: document1.pdf, document2.pdf
   - Verify: Response 200, files listed

2. **Get Documents**
   - Request: GET /documents
   - Verify: Both files present in list

3. **Get Notifications**
   - Request: GET /notifications
   - Verify: Upload success notification present

4. **Download File**
   - Request: GET /download/1
   - Verify: PDF file downloaded

5. **Mark as Read**
   - Request: PUT /notifications/1/read
   - Verify: isRead changed to true

#### Scenario 2: Bulk Upload Workflow

1. **Upload 5 Files**
   - Request: POST /upload
   - Files: 5 PDF files
   - Verify: Response 200

2. **Wait for Processing**
   - Wait 2 seconds

3. **Check Notification**
   - Request: GET /notifications
   - Verify: "5 files uploaded successfully"

4. **Mark All as Read**
   - Request: PUT /notifications/read-all
   - Verify: Response 200

#### Scenario 3: Error Handling

1. **Upload Non-PDF File**
   - Request: POST /upload with text file
   - Verify: Error response 400

2. **Download Non-existent File**
   - Request: GET /download/999
   - Verify: Error response 404

3. **Mark Non-existent Notification**
   - Request: PUT /notifications/999/read
   - Verify: Error response 404

### Sample Test Data

```csv
file_name,file_size,file_type
sample1.pdf,1024000,application/pdf
sample2.pdf,2048000,application/pdf
sample3.pdf,512000,application/pdf
```

---

## WebSocket Testing

### Using wscat

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8080/api/notifications

# Upload file in another terminal
# Should see notification in wscat terminal
```

### Using JavaScript Console

```javascript
// Open browser console and run:
const ws = new WebSocket('ws://localhost:8080/api/notifications');

ws.onmessage = (event) => {
  console.log('Message:', JSON.parse(event.data));
};

// Upload files in another tab
// You'll see notification in console
```

---

## Performance Testing

### Load Testing with Apache JMeter

#### Thread Group
- Number of Threads: 50
- Ramp-up: 10 seconds
- Loop Count: 10

#### HTTP Request Sampler
- Method: POST
- Path: /upload
- Files: Sample PDFs

#### Results
- Throughput
- Response Time
- Error Rate

---

## Security Testing

### 1. File Upload Security
- [ ] Validate file type
- [ ] Check file size limits
- [ ] Scan for malware (future)
- [ ] Prevent path traversal

### 2. API Security
- [ ] Validate all inputs
- [ ] Check for SQL injection
- [ ] Prevent XSS attacks
- [ ] Rate limiting (future)

### 3. WebSocket Security
- [ ] Authenticate connections (future)
- [ ] Validate message format
- [ ] Check origin header

### 4. Database Security
- [ ] Use parameterized queries (done with JPA)
- [ ] Encrypt sensitive data (future)
- [ ] Regular backups (manual)

---

## Regression Testing

### After Code Changes

1. Run all unit tests
2. Run integration tests
3. Manual smoke testing
4. API endpoint testing
5. WebSocket functionality
6. UI component testing
7. Cross-browser testing

### Command

```bash
# Backend
cd backend
mvn clean test

# Frontend
cd frontend
npm test

# Run all tests
npm run test:all
```

---

## Test Coverage

### Target Coverage

- Backend: 80%+ code coverage
- Frontend: 70%+ component coverage
- Critical paths: 100%

### Run Coverage Report

```bash
# Backend
mvn clean test jacoco:report
# Report: backend/target/site/jacoco/index.html

# Frontend
npm run test:coverage
# Report: frontend/coverage/index.html
```

---

## CI/CD Testing

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '17'
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && mvn test
      - run: cd frontend && npm test
```

---

## Troubleshooting Failed Tests

### Database Connection
```bash
# Ensure MySQL is running
mysql -u root -p
SHOW DATABASES;
```

### Port Already in Use
```bash
# Kill process on port 8080
lsof -i :8080
kill -9 <PID>
```

### Missing Dependencies
```bash
# Backend
mvn clean install -DskipTests

# Frontend
npm install
```

---

## Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X
- Success Rate: X%

## Results
- [Component/API]: PASS/FAIL
- [Component/API]: PASS/FAIL

## Issues Found
- Issue 1
- Issue 2

## Recommendations
- Recommendation 1
- Recommendation 2

## Next Steps
- [ ] Fix failed tests
- [ ] Update documentation
- [ ] Deploy to staging
```

---

**Last Updated**: May 2026
**Testing Framework**: JUnit 5, Jest, Postman
