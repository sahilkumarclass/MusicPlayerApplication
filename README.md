# 🎵 Music Player Application

A full-stack music player application built with Spring Boot (Backend) and React + TypeScript (Frontend).

## 🚀 Features

### Backend (Spring Boot)
- **Authentication & Authorization**: JWT-based authentication with role-based access (USER/ADMIN)
- **Song Management**: Upload, play, update, delete, and favorite songs
- **User Management**: Admin can manage users (enable/disable, delete)
- **Caching**: Redis integration for improved performance
- **Rate Limiting**: API rate limiting with configurable limits
- **File Storage**: Cloudinary integration for song file storage
- **Health Monitoring**: System health checks and cache statistics
- **API Documentation**: Swagger/OpenAPI documentation

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Login/Register with form validation
- **Music Player**: Full-featured audio player with controls
- **Song Library**: Browse, search, and manage songs
- **Favorites**: Add/remove songs from favorites
- **Admin Dashboard**: Statistics and user management (Admin only)
- **Dark Mode**: Built-in dark/light theme support
- **Real-time Updates**: React Query for efficient data fetching

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** with JWT
- **Spring Data MongoDB**
- **Redis** for caching
- **Cloudinary** for file storage
- **Maven** for dependency management

### Frontend
- **React 18**
- **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for state management
- **React Hook Form** for forms
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📁 Project Structure

```
MusicPlayerApplication/
├── src/                          # Spring Boot Backend
│   ├── main/java/com/sahil/musicplayer/
│   │   ├── controllers/          # REST API endpoints
│   │   ├── service/              # Business logic
│   │   ├── repository/           # Data access layer
│   │   ├── model/                # Entity classes
│   │   ├── dto/                  # Data transfer objects
│   │   ├── config/               # Configuration classes
│   │   ├── exception/            # Custom exceptions
│   │   └── aspect/               # AOP aspects
│   └── resources/
│       └── application.properties
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── common/          # Shared components
│   │   │   ├── player/          # Music player components
│   │   │   ├── user/            # User-specific components
│   │   │   └── admin/           # Admin components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React contexts
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   └── App.tsx              # Main app component
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MongoDB
- Redis
- Cloudinary account

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MusicPlayerApplication
   ```

2. **Configure environment variables**
   Create `src/main/resources/application.properties`:
   ```properties
   # Database
   spring.data.mongodb.uri=mongodb://localhost:27017/musicplayer
   
   # Redis
   spring.redis.host=localhost
   spring.redis.port=6379
   
   # JWT
   jwt.secret=your-secret-key-here
   jwt.expiration=86400000
   
   # Cloudinary
   cloudinary.cloud-name=your-cloud-name
   cloudinary.api-key=your-api-key
   cloudinary.api-secret=your-api-secret
   ```

3. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

## 🔐 Authentication

### Demo Admin Credentials
- **Username**: `sahilkumarclass10` or `sahilkumarclass@gmail.com`
- **Password**: `Sahil@2003`

### User Registration
- Regular users can register through the frontend
- Admin users can be created using the `/api/auth/create-admin` endpoint

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/create-admin` - Create admin user

### Songs (User & Admin)
- `GET /api/songs` - Get all songs
- `GET /api/songs/{id}` - Get song by ID
- `PUT /api/songs/{id}/favorite` - Toggle favorite status
- `GET /api/user/songs/favorites` - Get user's favorite songs

### Songs (Admin Only)
- `POST /api/songs/upload` - Upload new song
- `PUT /api/songs/{id}` - Update song
- `DELETE /api/songs/{id}` - Delete song

### Admin Management
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/status` - Toggle user status
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/cache/stats` - Get cache statistics
- `POST /api/admin/rate-limit/reset/{identifier}` - Reset rate limit

### Health Check
- `GET /api/health` - System health status

## 🎵 Music Player Features

- **Play/Pause**: Control playback
- **Seek**: Navigate through song timeline
- **Volume Control**: Adjust audio volume
- **Favorites**: Add/remove songs from favorites
- **Search**: Find songs by title or artist
- **Queue Management**: Add songs to playlist

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Client-side validation with error messages
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Configuration

### Backend Configuration
- **CORS**: Configured for frontend integration
- **Rate Limiting**: Configurable per endpoint
- **Caching**: Redis-based caching for songs
- **Security**: JWT-based authentication with role-based access

### Frontend Configuration
- **API Base URL**: Configured in `src/services/api.ts`
- **Environment Variables**: Use `.env` file for configuration
- **Build Optimization**: Vite for fast development and optimized builds

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
   ```bash
   ./mvnw clean package
   ```
2. Run the JAR:
   ```bash
   java -jar target/music-player-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

## 🧪 Testing

### Backend Testing
```bash
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Monitoring

- **Health Checks**: `/api/health` endpoint
- **Cache Statistics**: `/api/admin/cache/stats` (Admin only)
- **Rate Limit Monitoring**: Built-in rate limiting with statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the logs for error messages
2. Verify your configuration
3. Ensure all services (MongoDB, Redis) are running
4. Check the API documentation at `/swagger-ui.html`

## 🔄 Updates

- **Backend**: Update dependencies in `pom.xml`
- **Frontend**: Update dependencies in `frontend/package.json`

---

**Happy Coding! 🎵**
