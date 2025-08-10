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

## Project Structure

```
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
