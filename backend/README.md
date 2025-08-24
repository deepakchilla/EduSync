# EduSync Backend - Spring Boot API

This is the Spring Boot backend for the EduSync React frontend application.

## Technology Stack

- **Java 21**
- **Spring Boot 3.5.3**
- **Maven** (Build Tool)
- **MySQL Database**
- **Spring Data JPA** (Data Access)

## Project Structure

```
backend/
├── src/main/java/com/jsp/edusync/
│   ├── config/          # Configuration classes
│   ├── controllers/     # REST API controllers
│   ├── models/         # Entity classes (User, Resource, AccessedResource)
│   ├── repositories/   # JPA repositories
│   ├── services/       # Business logic services
│   └── EduSyncBackendApplication.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Database Configuration

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edusyncupdated
spring.datasource.username=root
spring.datasource.password=Dtss@1011
```

## API Endpoints

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current user session

### Resource Management APIs
- `GET /api/resources` - Get all resources
- `GET /api/resources/my-resources` - Get faculty's own resources
- `GET /api/resources/recent` - Get recently accessed resources (students)
- `POST /api/resources/upload` - Upload resource (faculty only)
- `PUT /api/resources/{id}` - Update resource (faculty only)
- `DELETE /api/resources/{id}` - Delete resource (faculty only)
- `GET /api/resources/{id}/download` - Download resource file
- `GET /api/resources/search?query={query}` - Search resources

## Setup Instructions

### 1. Prerequisites
- Java 21
- Maven 3.6+
- MySQL 8.0+
- Your React frontend running on http://localhost:3000 or http://localhost:5173

### 2. Database Setup
```sql
CREATE DATABASE edusyncupdated;
```

### 3. Run the Backend
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Build for Production
```bash
mvn clean package
java -jar target/edusync-backend-0.0.1-SNAPSHOT.jar
```

## React Frontend Integration

### Update Your React Frontend Auth Context

Replace the mock authentication in your `AuthContext.tsx`:

```typescript
const login = async (email: string, password: string, role: 'faculty' | 'student'): Promise<boolean> => {
  setLoading(true);
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, role })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('edusync_user', JSON.stringify(data.user));
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      return false;
    }
  } catch (error) {
    setLoading(false);
    return false;
  }
};
```

### Update Your React Frontend Resource Context

Replace the mock resource management in your `ResourceContext.tsx`:

```typescript
const addResource = async (resourceData: Omit<Resource, 'id' | 'uploadedAt' | 'lastModified'>) => {
  const formData = new FormData();
  formData.append('title', resourceData.title);
  formData.append('description', resourceData.description);
  // Add file handling here
  
  try {
    const response = await fetch('http://localhost:8080/api/resources/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    const data = await response.json();
    if (data.success) {
      // Update local state
      fetchResources();
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Test Data

The backend automatically creates test users:

### Faculty Accounts
- Email: `faculty1@edusync.com`, Password: `faculty123`
- Email: `faculty2@edusync.com`, Password: `faculty456`

### Student Accounts  
- Email: `student1@edusync.com`, Password: `student123`
- Email: `student2@edusync.com`, Password: `student456`
- Email: `student3@edusync.com`, Password: `student789`

## Features

- **Session-based Authentication** with CORS support for React
- **File Upload/Download** with BLOB storage in MySQL
- **Role-based Access Control** (Faculty vs Student)
- **Resource Management** (CRUD operations)
- **Access Tracking** for students
- **Search Functionality**
- **Recent Resources** tracking

## CORS Configuration

The backend is configured to work with React development servers:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## Production Deployment

1. Build the React frontend: `npm run build`
2. Copy the build files to `backend/src/main/resources/static/`
3. Build the Spring Boot JAR: `mvn clean package`
4. Deploy the JAR file to your server

The Spring Boot application will serve both the React frontend and the API endpoints.
