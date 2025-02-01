# Property Manager API

A backend solution recruitment task for property management with integrated weather data, built using NestJS, MongoDB, and Docker.

## ⚙️ Technologies

- **Framework**: NestJS 10
- **Database**: MongoDB 7
- **ORM**: Mongoose
- **Containerization**: Docker + Compose
- **Environment**: Node.js 20

## 📋 Prerequisites

- Node.js 20+
- Docker Desktop 4.25+ (for macOS/Windows)
- NestJS CLI (`npm i -g @nestjs/cli`)

## 🛠️ Getting Started

1. **Clone repository**
```bash
git clone https://github.com/your-username/property-manager-api.git
cd property-manager-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Start services**
```bash
docker compose up --build
```

## 🔧 Environment Variables

Create .env file:
```ini
MONGODB_URI=mongodb://mongo:27017/property-manager
WEATHERSTACK_API_KEY=your_api_key_here
NODE_ENV=development
```

🔼 Coming Soon

- GraphQL API endpoints
- Property management features
- Weather integration
