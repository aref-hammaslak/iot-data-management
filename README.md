# IoT Data Management System

A **NestJS-based IoT data management system** that processes x-ray data from IoT devices using RabbitMQ, stores processed information in MongoDB, and provides comprehensive API endpoints for data retrieval and analysis.

## 🚀 **Key Features**

### **Core Functionality**

- **🔌 RabbitMQ Integration**: Robust message queue system for processing IoT x-ray data
- **📊 Data Processing**: Real-time processing of x-ray signals with automatic parameter extraction
- **🗄️ MongoDB Storage**: Efficient data persistence with optimized schema design
- **🌐 RESTful API**: Complete CRUD operations with advanced filtering and pagination
- **📱 IoT Simulator**: Producer application for simulating IoT device data transmission

### **Advanced Features**

- **🔍 Advanced Filtering**: Filter signals by device ID, time range, data volume, and data length
- **📄 Pagination Support**: Efficient data retrieval with configurable page sizes
- **🔄 Real-time Processing**: Continuous message consumption with acknowledgment handling
- **✅ Data Validation**: Comprehensive input validation using class-validator
- **📚 API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **🧪 Comprehensive Testing**: Unit tests for all core components
- **🐳 Docker Support**: Complete containerization with Docker Compose

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IoT Producer  │───▶│   RabbitMQ      │───▶│   Backend API   │
│   (Simulator)   │    │   Message Queue │    │   (NestJS)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   MongoDB       │
                                              │   Database      │
                                              └─────────────────┘
```

## 📋 **Prerequisites**

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (for containerized setup)
- **MongoDB** (v6.0 or higher) - for local development
- **RabbitMQ** (v3 or higher) - for local development

## 🚀 **Quick Start with Docker (Recommended)**

The easiest way to run the entire system is using Docker Compose with pre-built images:

### **1. Clone the Repository**

```bash
git clone https://github.com/aref-hammaslak/iot-data-management.git
cd iot-data-management
```

### **2. Create Environment File**

```bash
cp .env.example .env
```

### **3. Run with Docker Compose**

```bash
docker-compose up -d
```

This will start:

- **RabbitMQ** (port 5672, management UI: http://localhost:15672)
- **MongoDB** (port 27017)
- **Backend API** (port 3000)
- **Producer Simulator** (continuous data generation)

### **4. Access the Application**

- **API Documentation**: http://localhost:3000/api
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **API Base URL**: http://localhost:3000/api

## 🔧 **Local Development Setup**

### **Option 1: Full Local Setup**

#### **1. Install Dependencies**

```bash
npm install
```

#### **2. Start External Services**

```bash
# Start MongoDB (using Docker)
docker run -d --name mongodb -p 27017:27017 mongo:6.0

# Start RabbitMQ (using Docker)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

#### **3. Configure Environment**

```bash
cp .env.example .env
```

Edit `.env` with your local settings:

```env
RABBITMQ_URI=amqp://guest:guest@localhost:5672
MONGO_URI=mongodb://localhost:27017/pantohealth
PORT=3000
```

#### **4. Run Applications**

**Terminal 1 - Backend API:**

```bash
npm run start:dev backend
```

**Terminal 2 - Producer Simulator:**

```bash
npm run start:producer
```

### **Option 2: Hybrid Setup (Local Backend + Docker Services)**

#### **1. Start Only External Services with Docker**

```bash
docker-compose up -d rabbitmq mongo
```

#### **2. Run Backend and Producer Locally**

```bash
# Terminal 1
npm run start:dev backend

# Terminal 2
npm run start:producer
```

## 📊 **API Endpoints**

### **X-Ray Signal Management**

| Method   | Endpoint               | Description                                    |
| -------- | ---------------------- | ---------------------------------------------- |
| `POST`   | `/api/xray-signal`     | Create a new x-ray signal                      |
| `GET`    | `/api/xray-signal`     | Retrieve signals with filtering and pagination |
| `GET`    | `/api/xray-signal/:id` | Get a specific signal by ID                    |
| `DELETE` | `/api/xray-signal`     | Delete signals with optional filtering         |
| `DELETE` | `/api/xray-signal/:id` | Delete a specific signal by ID                 |

### **Query Parameters**

#### **Filtering Options**

- `deviceId`: Filter by specific device ID
- `timeStart` / `timeEnd`: Filter by time range (milliseconds)
- `dataVolumeMin` / `dataVolumeMax`: Filter by data volume range
- `dataLengthMin` / `dataLengthMax`: Filter by data length range

#### **Pagination Options**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: 'time')
- `sortOrder`: Sort direction ('asc' or 'desc')

### **Example API Usage**

#### **Create a Signal**

```bash
curl -X POST http://localhost:3000/api/xray-signal \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "66bb584d4ae73e488c30a072",
    "time": 1735683480000,
    "data": [
      [762, [51.339764, 12.339223, 1.2038]],
      [1766, [51.339777, 12.339211, 1.53]]
    ]
  }'
```

#### **Get Signals with Filtering**

```bash
curl "http://localhost:3000/api/xray-signal?signalQueryFilter[deviceId]=66bb584d4ae73e488c30a072&pagination[page]=1&pagination[limit]=10"
```

## 🗄️ **Data Model**

### **X-Ray Signal Schema**

```typescript
{
  deviceId: string;           // Device identifier
  time: number;              // Timestamp (milliseconds)
  dataLength: number;        // Length of data array
  dataVolume: number;        // Size of x-ray data in bytes
  rawData?: Array<[number, [number, number, number]]>; // Original data
}
```

### **Data Format**

The system processes x-ray data in the following format:

```json
{
  "deviceId": "66bb584d4ae73e488c30a072",
  "data": [
    [762, [51.339764, 12.339223, 1.2038]], // [time, [x-coordinate, y-coordinate, speed]]
    [1766, [51.339777, 12.339211, 1.53]]
  ],
  "time": 1735683480000
}
```

## 🧪 **Testing**

### **Run Unit Tests**

```bash
npm run test
```

### **Run Tests with Coverage**

```bash
npm run test:cov
```

### **Run Tests in Watch Mode**

```bash
npm run test:watch
```

## 🐳 **Docker Commands**

### **Build Images Locally**

```bash
# Build backend image
docker build -f Dockerfile.backend -t iot-backend .

# Build producer image
docker build -f Dockerfile.producer -t iot-producer .
```

### **Run Individual Services**

```bash
# Run backend only
docker run -p 3000:3000 --env-file .env iot-backend

# Run producer only
docker run --env-file .env iot-producer
```

## 🔍 **Monitoring and Debugging**

### **RabbitMQ Management**

- **URL**: http://localhost:15672
- **Username**: `guest`
- **Password**: `guest`
- **Features**: Queue monitoring, message inspection, connection status

### **MongoDB Access**

```bash
# Connect to MongoDB shell
docker exec -it mongodb mongosh

# Or for local MongoDB
mongosh mongodb://localhost:27017/pantohealth
```

### **Application Logs**

```bash
# Docker Compose logs
docker-compose logs -f backend
docker-compose logs -f producer

# Individual container logs
docker logs <container-name>
```

## 🛠️ **Development Commands**

```bash
# Build the project
npm run build

# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod

```

## 📁 **Project Structure**

```
iot-data-management/
├── apps/
│   ├── backend/                 # Main NestJS application
│   │   ├── src/
│   │   │   ├── configs/         # Configuration files
│   │   │   ├── modules/         # Application modules
│   │   │   │   ├── database/    # Database models and configuration
│   │   │   │   ├── rabbitmq/    # RabbitMQ service and configuration
│   │   │   │   └── xray/        # X-ray signal processing
│   │   │   └── main.ts          # Application entry point
│   │   └── test/                # Test files
│   └── producer/                # IoT data producer simulator
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile.backend           # Backend Dockerfile
├── Dockerfile.producer          # Producer Dockerfile
└── package.json                 # Project dependencies
```

## 🔧 **Configuration**

### **Environment Variables**

| Variable       | Description                | Default                                 |
| -------------- | -------------------------- | --------------------------------------- |
| `RABBITMQ_URI` | RabbitMQ connection string | `amqp://guest:guest@localhost:5672`     |
| `MONGO_URI`    | MongoDB connection string  | `mongodb://localhost:27017/pantohealth` |
| `PORT`         | Backend API port           | `3000`                                  |
| `XRAY_QUEUE`   | RabbitMQ queue name        | `x-ray`                                 |

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(scope): add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Troubleshooting**

### **Common Issues**

#### **RabbitMQ Connection Failed**

- Ensure RabbitMQ is running: `docker ps | grep rabbitmq`
- Check connection string in `.env` file
- Verify RabbitMQ management UI is accessible

#### **MongoDB Connection Failed**

- Ensure MongoDB is running: `docker ps | grep mongo`
- Check MongoDB connection string
- Verify database permissions

#### **Producer Not Sending Messages**

- Check RabbitMQ queue exists
- Verify producer environment variables
- Check producer logs for errors

#### **API Not Responding**

- Ensure backend service is running
- Check port conflicts
- Verify all dependencies are started

### **Logs and Debugging**

```bash
# Check all service status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend
```

---

**For additional support or questions, please refer to the API documentation at http://localhost:3000/api**
