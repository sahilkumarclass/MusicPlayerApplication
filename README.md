# Music Player API

A comprehensive REST API for a music streaming application built with Spring Boot, featuring JWT authentication, role-based access control, file upload capabilities, and Redis caching for optimal performance.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Redis Caching](#redis-caching)
- [Security](#security)
- [Error Handling](#error-handling)
- [Frontend Integration](#frontend-integration)
- [Environment Configuration](#environment-configuration)
- [Contributing](#contributing)

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Admin and User roles with different permissions
- 🎵 **Song Management** - Upload, update, delete, and stream music files
- ❤️ **Favorites System** - Users can mark songs as favorites
- 🚀 **Redis Caching** - High-performance caching for frequently accessed data
- ☁️ **Cloud Storage** - Cloudinary integration for file storage
- 🔒 **Password Encryption** - BCrypt password hashing
- 🌐 **CORS Support** - Frontend integration ready

## Technology Stack

- **Backend**: Spring Boot 2.x
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**: Spring Security
- **Password Hashing**: BCrypt

## Getting Started

### Prerequisites

- Java 8 or higher
- Maven 3.6+
- MongoDB
- Redis
- Cloudinary account (for file storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-player-api
   ```

2. **Install and Start MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt install mongodb
   sudo systemctl start mongodb
   
   # macOS
   brew install mongodb/brew/mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```

3. **Install and Start Redis**
   ```bash
   # Ubuntu/Debian
   sudo apt install redis-server
   sudo systemctl start redis
   
   # macOS
   brew install redis
   brew services start redis
   ```

4. **Configure Environment Variables**
   ```bash
   export CLOUDINARY_CLOUD_NAME=your_cloud_name
   export CLOUDINARY_API_KEY=your_api_key
   export CLOUDINARY_API_SECRET=your_api_secret
   export JWT_SECRET=your_secret_key
   export JWT_EXPIRATION=86400000
   ```

5. **Build and Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080`

## Authentication

### Register User (Default: USER role)
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```

### Create Admin
```http
POST /api/auth/create-admin
Content-Type: application/json

{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "password123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "john_doe",
    "role": "USER",
    "message": "Authentication successful"
}
```

## API Endpoints

All protected endpoints require the Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

### Admin Endpoints (ADMIN role required)

#### Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

#### Upload Song
```http
POST /api/admin/songs/upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- file: [MP3 file]
- title: "Song Title"
- artist: "Artist Name"
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Delete Song
```http
DELETE /api/admin/songs/{songId}
Authorization: Bearer <admin_token>
```

#### Update Song
```http
PUT /api/admin/songs/{songId}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "title": "Updated Title",
    "artist": "Updated Artist",
    "isFavorite": false
}
```

#### Toggle User Status
```http
PUT /api/admin/users/{userId}/status
Authorization: Bearer <admin_token>
```

#### Delete User
```http
DELETE /api/admin/users/{userId}
Authorization: Bearer <admin_token>
```

### User Endpoints (USER role required)

#### Get All Songs
```http
GET /api/user/songs
Authorization: Bearer <user_token>
```

#### Get Song by ID
```http
GET /api/user/songs/{songId}
Authorization: Bearer <user_token>
```

#### Toggle Favorite
```http
PUT /api/user/songs/{songId}/favorite
Authorization: Bearer <user_token>
```

#### Get Favorite Songs
```http
GET /api/user/songs/favorites
Authorization: Bearer <user_token>
```

### General Song Endpoints (Both ADMIN and USER)

#### Get All Songs
```http
GET /api/songs
Authorization: Bearer <token>
```

#### Get Song by ID
```http
GET /api/songs/{songId}
Authorization: Bearer <token>
```

## Redis Caching

Redis is integrated to cache frequently accessed song data, significantly improving performance and reducing database load.

### What is Cached?

- ✅ **All Songs** - `GET /api/user/songs`
- ✅ **Song by ID** - `GET /api/user/songs/{songId}`

### Configuration

Located in: `src/main/java/com/sahil/musicplyer/config/RedisConfig.java`

```java
@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    return template;
}
```

### Service Layer Implementation

Example in `SongServiceImpl.java`:

```java
@Cacheable(value = "songs")
public List<Song> getAllSongs() {
    return songRepository.findAll();
}

@Cacheable(value = "song", key = "#songId")
public Song getSongById(String songId) {
    return songRepository.findById(songId).orElseThrow();
}
```

### Cache Eviction

Cache is automatically invalidated when admin actions modify data:

```java
@CacheEvict(value = "songs", allEntries = true)
public void uploadSong(...) {
    // Invalidate cache after new upload
}
```

### Redis Configuration

Spring Boot auto-connects to Redis at `localhost:6379`. To customize, add to `application.properties`:

```properties
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.password=your_password
spring.redis.timeout=2000ms
```

## Security

### Security Features

1. **JWT Token Authentication** - All protected endpoints require valid JWT tokens
2. **Role-Based Access Control**:
   - **ADMIN**: Upload, update, delete songs and manage users
   - **USER**: View songs and manage favorites
3. **Password Encryption** - BCrypt hashing for all passwords
4. **CORS Configuration** - Configured for frontend integration
5. **Session Management** - Stateless authentication using JWT

### Token Management

- **Token Expiration**: 24 hours by default
- **Token Storage**: Store securely in localStorage or httpOnly cookies
- **Token Refresh**: Implement token refresh mechanism as needed

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
    "error": "Authentication failed: Invalid credentials"
}
```

#### 403 Forbidden
```json
{
    "error": "Access denied: Insufficient privileges"
}
```

#### 404 Not Found
```json
{
    "error": "Song not found with id: 123"
}
```

#### 400 Bad Request
```json
{
    "error": "Invalid request data",
    "details": "Username is required"
}
```

## Frontend Integration

### Implementation Guidelines

1. **Token Storage**: Store JWT token securely in localStorage or httpOnly cookies
2. **API Calls**: Include token in Authorization header for all protected endpoints
3. **Token Expiration**: Handle token expiration (24 hours default)
4. **Error Handling**: Redirect to login on 401 responses
5. **Role-Based UI**: Show/hide features based on user role

### Example JavaScript Integration

```javascript
// Store token after login
localStorage.setItem('authToken', response.data.token);

// Include token in API calls
const token = localStorage.getItem('authToken');
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

// Example API call
fetch('/api/user/songs', {
    method: 'GET',
    headers: headers
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => {
    if (error.status === 401) {
        // Redirect to login
        window.location.href = '/login';
    }
});
```

## Environment Configuration

### Required Environment Variables

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Configuration (Optional - has defaults)
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000  # 24 hours in milliseconds

# Database Configuration (Optional - has defaults)
MONGODB_URI=mongodb://localhost:27017/musicplayer
REDIS_URL=redis://localhost:6379
```

### Application Properties

```properties
# Server Configuration
server.port=8080

# MongoDB Configuration
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/musicplayer}

# Redis Configuration
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379

# File Upload Configuration
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# JWT Configuration
jwt.secret=${JWT_SECRET:mySecretKey}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Cloudinary Configuration
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
```

## Performance Optimization

### Redis Caching Benefits

- **Reduced Database Load**: Frequently accessed songs served from memory
- **Faster Response Times**: Redis retrieval significantly faster than database queries
- **Scalability**: Reduces bottlenecks on primary database
- **Cost Efficiency**: Lower database resource consumption

### Monitoring

Monitor cache performance:
```bash
# Redis CLI commands
redis-cli info memory
redis-cli keys "*"
redis-cli monitor  # Real-time monitoring
```

## Development

### Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/sahil/musicplyer/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── entity/         # Entity classes
│   │       ├── repository/     # Data repositories
│   │       ├── service/        # Business logic
│   │       └── security/       # Security configuration
│   └── resources/
│       └── application.properties
└── test/                       # Test classes
```

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package -Pprod
java -jar target/music-player-api-1.0.0.jar
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow Java naming conventions
- Write unit tests for new features
- Update documentation for API changes
- Use meaningful commit messages

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Ensure Redis server is running: `redis-server`
   - Check connection settings in application.properties

2. **MongoDB Connection Issues**
   - Verify MongoDB is running: `sudo systemctl status mongodb`
   - Check database URI in configuration

3. **File Upload Errors**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper multipart configuration

4. **Authentication Issues**
   - Verify JWT secret configuration
   - Check token expiration settings
   - Ensure proper Authorization header format

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using Spring Boot, MongoDB, and Redis**
