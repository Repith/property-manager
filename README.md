# Property Manager API

A backend solution recruitment task for property management with integrated weather data, built using **NestJS**, **MongoDB**, and **Docker**.

## ⚙️ Technologies

- **Framework**: NestJS 10
- **Database**: MongoDB 7
- **ODM**: Mongoose
- **Containerization**: Docker + Compose
- **Environment**: Node.js 20
- **GraphQL**: API with schema-first design

## 📋 Prerequisites

To run this project, ensure you have the following installed:

- **Node.js**: v20+
- **Docker Desktop**: v4.25+ (for macOS/Windows)
- **NestJS CLI**: `npm install -g @nestjs/cli`

## 🛠️ Getting Started

Follow these steps to get the project up and running locally:

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Repith/property-manager.git
cd property-manager
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables
Create a .env file in the root directory with the following variables:
```ini
MONGODB_URI=mongodb://root:covertree@localhost:27017/property-manager?authSource=admin
WEATHERAPI_API_KEY=your_weatherapi_key_here
NODE_ENV=development
```
Replace your_weatherapi_key_here with your API key from WeatherAPI.

### 4️⃣ Start the application with Docker
```
docker compose up --build
```

This will:
- Build and start the API service.
- Spin up a MongoDB database instance.
- Automatically apply the seed script to populate the database.

---

## 🚀 Features

- **GraphQL API**:
  - Query properties, filter, and sort them.
  - Retrieve detailed weather information for properties.
- **Property Management**:
  - Add, delete, and query properties with associated weather data.
- **Weather Integration**:
  - Seamlessly fetch weather data from WeatherAPI during property creation.
- **Seed Data**:
  - Populate the database with example properties upon startup.

---

## 🔧 Environment Variables

The application requires the following environment variables:

| Variable Name         | Description                                      | Example Value                                 |
|-----------------------|--------------------------------------------------|---------------------------------------------|
| `MONGODB_URI`         | MongoDB connection URI                          | `mongodb://mongo:27017/property-manager`     |
| `WEATHERAPI_API_KEY`  | API key for WeatherAPI                          | `your_api_key_here`                          |
| `NODE_ENV`            | Environment mode (development/production)       | `development`                                |

---

## 📚 GraphQL Endpoints

Once the application is running, you can access the GraphQL Playground at:  
`http://localhost:4000/graphql`

### Available Operations:

1. **Query all properties**:
```graphql
   query GetAllProperties {
     properties {
       _id
       city
       state
       zipCode
       weatherData
       createdAt
     }
   }
```

2. **Query sorted properties**:

```graphql
query GetSortedProperties {
  properties(sort: { sortByCreatedAt: DESC }) {
    _id
    city
    createdAt
  }
}
```

3. **Filter properties by city/state/zip**:

```graphql
query GetFilteredProperties {
  properties(filter: { city: "Phoenix", state: "AZ" }) {
    _id
    city
    state
    zipCode
  }
}
```

4. **Get details of a specific property**:
```graphql
query GetProperty($id: String!) {
  property(id: $id) {
    _id
    city
    weatherData
  }
}
```

5. **Add a new property:**:
```graphql
mutation CreateProperty($input: CreatePropertyInput!) {
  createProperty(input: $input) {
    _id
    city
    weatherData
  }
}
```

6. **Delete a property:**:
```graphql
mutation DeleteProperty($id: String!) {
  deleteProperty(id: $id)
}
```

### 🛠️ Development Tips
**Seed the database**
The database will automatically seed with example data on startup. If you need to rerun the seed script manually:
```bash
npm run seed
```

**Run the project locally**
To start the project without Docker:
```bash
npm run start:dev
```
Ensure your local MongoDB is running, and set the MONGODB_URI variable accordingly in .env.

### 🐳 Docker Setup
**Start services**
```bash
docker compose up --build
```

---
### 📋 Notes
**WeatherAPI**: Ensure you have a valid API key with sufficient request quota.
**MongoDB**: The database runs on Docker and requires no manual setup.