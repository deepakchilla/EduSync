# EduSync Backend

This is the Spring Boot backend for the EduSync application with real authentication using JWT tokens and MySQL database.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Setup Instructions

### 1. Database Setup

1. **Start MySQL server**
2. **Create the database and tables:**
   ```sql
   -- Run the schema.sql file in your MySQL client
   -- Or manually create the database:
   CREATE DATABASE edusync;
   USE edusync;
   ```

### 2. Configuration

Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

**Default configuration:**
- Username: `root`
- Password: `password`
- Database: `edusync`
- Port: `9090`

### 3. Build and Run

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:9090/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/auth/session` - Session check

### Request/Response Format

**Register User:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Login:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "message": "Login successful"
  }
}
```

## Security Features

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Password Encryption**: BCrypt password hashing
- **Role-based Access**: STUDENT and FACULTY roles
- **CORS Configuration**: Configured for frontend integration

## Database Schema

- **Users Table**: Stores user information and credentials
- **Resources Table**: Stores educational resources uploaded by users
- **Proper Indexing**: Optimized for performance
- **Foreign Key Constraints**: Maintains data integrity

## Development Notes

- Uses MySQL 8.0 dialect
- JPA with Hibernate ORM
- Spring Security for authentication
- Stateless session management
- CORS enabled for frontend integration
