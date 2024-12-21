# Task Management App

## Description
Task Management App is a robust application designed to help users manage their tasks efficiently. It is built using Node.js, TypeScript, and other modern technologies to ensure a seamless development and user experience.

---

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16 or later)
- **Yarn** (latest version recommended)
- **Docker** (for database setup)

---

## Getting Started

Follow these steps to set up and run the Task Management App locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-app
```

### 2. Run the Database
Start the required services (Redis and MongoDB) using Docker Compose:
```bash
docker compose up
```
Ensure Docker is running before executing this command.

### 3. Install Dependencies
Install the required packages using Yarn:
```bash
yarn
```

### 4. Start the Application in Development Mode
Run the application in development mode:
```bash
yarn start:dev
```
This command will use `ts-node-dev` to transpile and restart the server automatically on file changes.

---

## Scripts
The application provides several scripts to simplify development and production tasks:

- **Start Production Server:**
  ```bash
  yarn start
  ```
  Starts the built application from the `dist` directory.

- **Build Application:**
  ```bash
  yarn build
  ```
  Compiles TypeScript code and copies necessary views and types to the `dist` directory.

- **Run Tests:**
  ```bash
  yarn test
  ```
  Executes all tests using Jest.

- **Watch Tests:**
  ```bash
  yarn test:watch
  ```
  Runs tests in watch mode for continuous testing during development.

- **Prepare Git Hooks:**
  ```bash
  yarn prepare
  ```
  Sets up Husky for pre-commit hooks (only relevant during development).

---

## Development Notes

### Postman Collection
A Postman collection is included in the repository to simplify API testing. Import the collection into Postman to interact with the available endpoints.

### Ports
The application runs on **port 5000** by default. Ensure this port is not in use before starting the app.

---

## Technologies Used

- **Node.js**
- **TypeScript**
- **NestJS**
- **Docker**
- **Redis**
- **MongoDB**
- **Jest** (for testing)

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Commit your changes with a descriptive message.
4. Open a pull request against the main repository.

---

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

## Contact
For any questions or support, please reach out to the project maintainers.
