# Environment Configuration Examples

## Backend Configuration

### application.properties (Development)

```properties
spring.application.name=document-management-dashboard
server.port=8080
server.servlet.context-path=/api

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/document_management_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=100MB
file.upload.path=uploads

# Logging
logging.level.root=INFO
logging.level.com.documentmanagement=DEBUG

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.max-age=3600
```

### application-prod.properties (Production)

```properties
spring.application.name=document-management-dashboard
server.port=8080
server.servlet.context-path=/api

# MySQL Database Configuration (Remote)
spring.datasource.url=jdbc:mysql://<DATABASE_HOST>:3306/document_management_db?useSSL=true&serverTimezone=UTC
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# File Upload Configuration
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=200MB
file.upload.path=/var/uploads

# Logging
logging.level.root=INFO
logging.level.com.documentmanagement=WARN
```

## Frontend Configuration

### .env.development

```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/api
VITE_NODE_ENV=development
```

### .env.production

```
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com/api
VITE_NODE_ENV=production
```

## Docker Setup (Optional)

### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: document_management_db
    volumes:
      - mysql-data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/document_management_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root_password
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:8080/api

volumes:
  mysql-data:
```

### Docker Run Commands

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v
```

## Environment Variables

### Backend (Spring Boot)

| Variable | Default | Description |
|----------|---------|-------------|
| SPRING_DATASOURCE_URL | jdbc:mysql://localhost:3306/document_management_db | Database URL |
| SPRING_DATASOURCE_USERNAME | root | Database username |
| SPRING_DATASOURCE_PASSWORD | password | Database password |
| SERVER_PORT | 8080 | Backend server port |
| FILE_UPLOAD_PATH | uploads | File upload directory |
| LOGGING_LEVEL_ROOT | INFO | Root logging level |

### Frontend (React/Vite)

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:8080/api | Backend API URL |
| VITE_WS_URL | ws://localhost:8080/api | WebSocket URL |
| VITE_NODE_ENV | development | Environment mode |

---

## Quick Setup with Different Configurations

### Local Development
```bash
# Use default application.properties
mvn spring-boot:run
npm run dev
```

### Production with Docker
```bash
docker-compose up -d
# Access at http://localhost
```

### Remote Database
```bash
# Update application.properties with remote DB credentials
DATABASE_HOST=production-db.example.com
DB_USER=prod_user
DB_PASSWORD=secure_password
```
