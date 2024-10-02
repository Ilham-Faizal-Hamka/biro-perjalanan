# Travel Agency Admin Application

This repository contains the source code for a **Travel Agency Admin Application** built using the **NestJS** framework. The application leverages **Prisma ORM** to interact with a **MySQL** database, and it is designed for managing employees, tourists, and trips in a travel agency. Additionally, unit tests are implemented using **Jest** to ensure code quality.

## Table of Contents

- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Unit Testing](#unit-testing)
- [Technologies Used](#technologies-used)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Ilham-Faizal-Hamka/biro-perjalanan.git
   ```

2. Navigate to the project directory:

   ```bash
   cd travel-agency-admin
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```
   
## Database Setup

1. Make sure you have a **MySQL** database set up and running.
   
2. Run the following Prisma commands to set up the database:

   ```bash
   npx prisma migrate dev
   ```

   This command will apply migrations and set up the necessary tables for your application.

3. To generate Prisma client:

   ```bash
   npx prisma generate
   ```

## Running the Application

To run the application in development mode, use the following command:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Admin User Endpoints

- **Register an Admin User**
  - `POST /admin/register`
  - Request body:
    ```json
    {
      "username": "admin1",
      "name": "Admin One",
      "email": "admin1@example.com",
      "password": "password123"
    }
    ```

- **Login Admin User**
  - `POST /admin/login`
  - Request body:
    ```json
    {
      "username": "admin1",
      "password": "password123"
    }
    ```

- **Get Admin User Account**
  - `GET /admin/account`

- **Update Admin User Account**
  - `PATCH /admin/account`
  - Request body (optional):
    ```json
    {
      "name": "Updated Admin",
      "email": "updatedadmin@example.com",
      "password": "newpassword"
    }
    ```

- **Delete Admin User Account**
  - `DELETE /admin/account`

### Tourist Endpoints

- **Create a Tourist**
  - `POST /admin/tourist/create`
  - Request body:
    ```json
    {
      "nik": "1234567890",
      "name": "Tourist Name",
      "email": "tourist@example.com"
    }
    ```

- **Get Tourist Information**
  - `GET /admin/tourist/:touristId`

- **Update Tourist Information**
  - `PUT /admin/tourist/:touristId`
  - Request body:
    ```json
    {
      "name": "Updated Tourist",
      "email": "updatedtourist@example.com"
    }
    ```

- **Delete a Tourist**
  - `DELETE /admin/tourist/:touristId`

- **List All Tourists**
  - `GET /admin/tourist/`

### Trip Endpoints

- **Create a Trip**
  - `POST /admin/trip/create`
  - Request body:
    ```json
    {
      "code": "TRIP123",
      "destination": "Bali",
      "hotel": "Hotel Bali",
      "transport": "Bus",
      "startDate": "2024-10-01",
      "endDate": "2024-10-07"
    }
    ```

- **Get Trip Details**
  - `GET /admin/trip/:tripId`

- **Update a Trip**
  - `PUT /admin/trip/:tripId`
  - Request body:
    ```json
    {
      "destination": "Updated Destination",
      "hotel": "Updated Hotel"
    }
    ```

- **Delete a Trip**
  - `DELETE /admin/trip/:tripId`

- **List All Trips**
  - `GET /admin/trip/`

## Unit Testing

Unit tests are implemented using **Jest**. To run the tests, execute the following command:

```bash
npm run test
```

Test files are located in the `test` directory. Ensure that all necessary test cases are passing.

## Technologies Used

- **NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications.
- **Prisma ORM** - A next-generation ORM for TypeScript and JavaScript.
- **MySQL** - The relational database used in this project.
- **Jest** - A JavaScript testing framework for running unit tests.
- **Winston** - A logging library for logging application activities.

---

You can modify the repository URL and example data as per your actual project details.
