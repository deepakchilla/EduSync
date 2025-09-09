<<<<<<< HEAD
# EduSync Backend - Spring Boot Application

EduSync is an educational resource sharing platform that allows faculty to upload and manage educational resources, while students can view, download, and track their access to these resources.

## Technology Stack

- **Java 21**
- **Spring Boot 3.5.3**
- **MySQL Database**
- **Maven** (Build Tool)
- **Thymeleaf** (Template Engine)
- **Spring Data JPA** (Data Access)

## Features

### Faculty Features
- Upload educational resources (files stored as BLOB in database)
- Manage uploaded resources (list, edit, delete)
- View resource access statistics
- Role-based access control

### Student Features
- Browse all available resources
- View files directly in browser or download
- Track previously accessed resources
- Search functionality for resources
=======
# EduSync

EduSync is a Java Spring Boot web application designed to manage and share educational resources between faculty and students. 
The platform supports role-based authentication, file uploads, and resource management features.

## Features

- **User Authentication**
  - Signup and login for Admin and Students.
  - Role-based access control.
  - Profile display after login.
  - Password reset and Google Sign-In integration (planned).

- **Resource Management**
  - Upload resources (notes, materials, e-books) as files (BLOB storage in MySQL).
  - Files have a title and description.
  - Public access to uploaded files without login.
  - Download and view uploaded files directly from the UI.

- **Admin Dashboard**
  - Edit and delete uploaded files.
  - View file metadata (size, upload time).
  - Search and filter resources.
  - Dashboard statistics.
  - File type icons.

- **Homepage**
  - Displays uploaded resources as cards (Tailwind CSS styling).
  - Shows personalized content based on user role.
  - Tracks and displays accessed resources for students.

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.5.3
- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS
- **Database:** MySQL (MySQL Workbench)
- **Build Tool:** Maven (JAR packaging)
- **IDE:** VS Code with Java Extension Pack
>>>>>>> be16d78ae25b513705f3af51f3af084081908e3c

## Project Structure

```
<<<<<<< HEAD
src/main/java/com/jsp/edusync/
├── configs/           # Configuration classes
├── controllers/       # REST API controllers
├── exceptions/        # Custom exception classes
├── models/           # Entity classes (User, Resource, ViewedResource)
├── repositories/     # JPA repositories
├── services/         # Business logic services
└── EduSyncApplication.java
```

## Database Configuration

The application is configured to use MySQL database with the following settings:

- **Database Name**: `edusyncupdated`
- **Username**: `root`
- **Password**: `Dtss@1011`
- **Port**: `3306` (default MySQL port)

## Prerequisites

1. **Java 21** or higher
2. **Maven 3.6+**
3. **MySQL 8.0+**
4. **IDE** (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

## Setup Instructions

### 1. Database Setup

1. Install MySQL and start the MySQL service
2. Create the database:
   ```sql
   CREATE DATABASE edusyncupdated;
   ```
3. The application will automatically create tables on first run using Hibernate DDL auto-update

### 2. Clone and Build

1. Clone the repository (or extract if provided as ZIP)
2. Navigate to the project directory
3. Build the project:
   ```bash
   mvn clean install
   ```

### 3. Run the Application

```bash
mvn spring-boot:run
```

Or run the main class `EduSyncApplication.java` from your IDE.

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/session` - Get current user session

### Resource Management Endpoints
- `POST /api/resources/upload` - Upload resource (Faculty only)
- `GET /api/resources` - Get all resources
- `GET /api/resources/faculty` - Get faculty's own resources (Faculty only)
- `GET /api/resources/{id}/file` - Download/view resource file
- `PUT /api/resources/{id}` - Update resource (Faculty only)
- `DELETE /api/resources/{id}` - Delete resource (Faculty only)
- `GET /api/resources/accessed` - Get previously accessed resources (Students only)
- `GET /api/resources/search?query={query}` - Search resources

## Test Data

The application automatically creates test users on startup:

### Faculty Accounts
- Email: `faculty1@edusync.com`, Password: `faculty123`
- Email: `faculty2@edusync.com`, Password: `faculty456`
- Email: `faculty3@edusync.com`, Password: `faculty789`

### Student Accounts
- Email: `student1@edusync.com`, Password: `student123`
- Email: `student2@edusync.com`, Password: `student456`
- Email: `student3@edusync.com`, Password: `student789`
- Email: `student4@edusync.com`, Password: `student101`
- Email: `student5@edusync.com`, Password: `student202`

## Web Interface (Thymeleaf)

The application provides basic web pages for testing:

- `http://localhost:8080/` - Home page
- `http://localhost:8080/login` - Login page
- `http://localhost:8080/register` - Registration page

## React Frontend Integration

The backend is configured with CORS support for React frontend integration. Allowed origins:
- `http://localhost:3000` (Create React App default)
- `http://localhost:5173` (Vite React default)

All API responses are in JSON format, making it easy to integrate with React or any other frontend framework.

## File Upload Configuration

- Maximum file size: 50MB
- Supported file types: All (determined by file content-type)
- Storage: Files are stored as BLOB in MySQL database

## Error Handling

The application includes comprehensive error handling:
- Validation errors
- File upload errors
- Authentication/authorization errors
- Resource not found errors
- Generic exception handling

## Security Features

- Session-based authentication
- Role-based access control (Faculty/Student)
- CORS configuration for frontend integration
- Input validation
- SQL injection protection (via JPA)

## Development

### Building JAR File
```bash
mvn clean package
```

The JAR file will be created in the `target/` directory.

### Running JAR File
```bash
java -jar target/edusync-0.0.1-SNAPSHOT.jar
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Verify database credentials in `application.properties`
   - Check if database `edusyncupdated` exists

2. **Port Already in Use**
   - Change server port in `application.properties`: `server.port=8081`

3. **File Upload Issues**
   - Check file size (max 50MB)
   - Ensure sufficient disk space

### Logs

Application logs are printed to the console. For production, consider configuring log files in `application.properties`.

## Production Deployment

For production deployment:

1. Update database credentials in `application.properties`
2. Set `spring.jpa.hibernate.ddl-auto=validate` (instead of `update`)
3. Configure proper logging
4. Set up reverse proxy (nginx) if needed
5. Consider using environment variables for sensitive configuration

## License

This project is for educational purposes.
=======
com.jsp.edusync
 ├── controllers
 ├── models
 ├── repositories
 ├── services
 ├── configs
```

## Requirements

- Java JDK 21
- Maven
- MySQL Server & MySQL Workbench
- VS Code (with Java Extension Pack)
- Git

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd EduSync
   ```

2. **Configure Database**
   - Create a MySQL database named `edusync`.
   - Update the `application.properties` file with your database credentials.

3. **Build & Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Access Application**
   - Open browser and go to: `http://localhost:8080`

## Future Enhancements

- Google Sign-In integration.
- Improved analytics for admins.
- Enhanced file preview features.
- Mobile-friendly UI.

---
**Author:** Deepak Chilla  
**Project Name:** EduSync
>>>>>>> be16d78ae25b513705f3af51f3af084081908e3c
