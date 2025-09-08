# EduSync - Educational Resource Management Platform

## 🎯 Project Overview

EduSync is a comprehensive educational platform designed to bridge the gap between educators and students through seamless resource sharing and collaborative learning. Built for modern educational institutions, it provides a centralized hub for managing, accessing, and distributing educational materials.

## 🚀 Key Features

### For Students
- **Resource Discovery**: Browse and search through thousands of educational materials
- **Instant Access**: View resources online or download for offline study
- **Personal Dashboard**: Track learning progress and access history
- **Profile Management**: Customize profile and academic preferences

### For Faculty
- **Resource Upload**: Easy file upload with support for multiple formats
- **Content Management**: Organize and categorize educational materials
- **Student Analytics**: Track resource usage and engagement
- **Dedicated Dashboard**: Specialized interface for faculty operations

### Platform Features
- **Role-Based Access Control**: Separate interfaces for students and faculty
- **Secure Authentication**: JWT-based authentication system
- **File Management**: Support for PDFs, images, videos, and documents
- **Responsive Design**: Optimized for all devices and screen sizes
- **Modern UI/UX**: Clean, professional interface with consistent theming

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router DOM** for navigation
- **Shadcn UI** for component library
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching
- **Lucide React** for icons

### Backend
- **Spring Boot 3.5.3** with Java 21
- **Spring Data JPA** for database operations
- **Spring Web** for REST APIs
- **MySQL** for data persistence
- **Maven** for dependency management
- **Jakarta Validation** for input validation

### Database
- **MySQL** with normalized schema
- **Foreign key relationships** for data integrity
- **Proper indexing** for performance optimization

## 📁 Project Structure

```
project/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/edusync/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data repositories
│   │   └── service/          # Business logic
│   └── src/main/resources/
│       └── application.properties
├── src/                       # React frontend
│   ├── components/           # Reusable components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Page components
│   ├── services/            # API services
│   └── lib/                 # Utility functions
└── uploads/                 # File storage directory
```

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup
1. Navigate to the backend directory
2. Update `application.properties` with your database credentials
3. Run the database migration script
4. Start the Spring Boot application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup
1. Create a MySQL database named `edusyncupdated`
2. Run the migration script in `backend/database-migration.sql`
3. Update connection details in `application.properties`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/reset-password` - Password reset

### Resources
- `GET /api/resources/health` - Health check
- `POST /api/resources/upload` - Upload resource (Faculty only)
- `GET /api/resources/list` - Get all resources
- `GET /api/resources/my-resources` - Get user's resources
- `GET /api/resources/download/{id}` - Download resource
- `GET /api/resources/view/{id}` - View resource
- `DELETE /api/resources/{id}` - Delete resource

### User Profile
- `GET /api/user/profile` - Get user profile
- `POST /api/user/profile/update` - Update profile
- `POST /api/user/profile/upload-picture` - Upload profile picture
- `POST /api/user/profile/remove-picture` - Remove profile picture

## 🎨 Design System

### Color Palette
- **Primary**: Navy Blue (#0f1a2a)
- **Secondary**: White (#ffffff)
- **Background**: Off-white (#fafafa)
- **Text**: Dark navy (#1e293b)
- **Muted**: Light gray (#64748b)

### Typography
- **Font Family**: Inter (system fallback)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible sizing

### Components
- **Buttons**: Sharp corners (0.375rem radius)
- **Cards**: Subtle shadows, clean borders
- **Forms**: Consistent input styling
- **Navigation**: Intuitive, role-based

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation for all inputs
- **File Type Validation**: Restricted file uploads
- **CORS Configuration**: Proper cross-origin setup
- **Role-Based Access**: Faculty vs Student permissions

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl
- **Touch-Friendly**: Appropriate touch targets
- **Cross-Browser**: Compatible with modern browsers

## 🧪 Testing & Quality

- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during operations
- **Form Validation**: Client and server-side validation
- **Type Safety**: Full TypeScript implementation

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Efficient image handling
- **API Caching**: TanStack Query for data caching
- **Bundle Optimization**: Vite for fast builds

## 📊 Development Team

This project was developed by a team of 6 passionate developers:

1. **Alex Smith** - Full-Stack Developer & Lead Architect
2. **Sarah Chen** - Frontend Specialist & UI/UX Expert
3. **Michael Rodriguez** - Backend Engineer & Database Specialist
4. **David Kim** - DevOps Engineer & System Administrator
5. **Emma Johnson** - Quality Assurance & Testing Specialist
6. **James Wilson** - Project Manager & Technical Lead

## 🎯 Hackathon Highlights

- **Complete Full-Stack Solution**: Both frontend and backend fully functional
- **Professional UI/UX**: Clean, modern design suitable for production
- **Scalable Architecture**: Built with enterprise-grade practices
- **Comprehensive Features**: All core educational platform features implemented
- **Production Ready**: Error handling, validation, and security measures

## 🔮 Future Enhancements

- Real-time notifications
- Advanced search and filtering
- Analytics dashboard
- Mobile app development
- Integration with LMS systems
- Advanced file preview capabilities

## 📞 Support

For technical support or questions about this project, please contact the development team or refer to the documentation in the respective directories.

---

**Built with ❤️ for the future of education**
