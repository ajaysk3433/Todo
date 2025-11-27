# Todo App

This is a full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

The project is divided into two main directories:

- `Client/`: Contains the React frontend application.
- `Server/`: Contains the Express backend server.

## Features

- User authentication (Sign up and Sign in)
- Create, Read, Update, and Delete Todos
- Responsive design

## Tech Stack

**Client:**

- React
- Vite
- TypeScript
- React Router
- Tailwind CSS
- Tanstack-Query
- Zod

**Server:**

- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens) for authentication
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ajaysk3433/Todo.git
    cd Todo
    ```

2.  **Install server dependencies:**

    ```bash
    cd Server
    npm install
    ```

3.  **Install client dependencies:**

    ```bash
    cd ../Client
    npm install
    ```

### Running the application

1.  **Start the server:**

    ```bash
    cd Server
    npm run dev
    ```

    The server will start on `http://localhost:3000`.

2.  **Start the client:**

    ```bash
    cd ../Client
    npm run dev
    ```

    The client will start on `http://localhost:5173`.

## Environment Variables

The server uses the following environment variables. Create a `.env` file in the `Server/` directory and add the following:

```
DB_NAME
DB_USER_NAME
DB_PASSWORD
JWT_SECRET
```
