# GameCadia Nexus - Game Listing and Management Platform

**Project Version:** 1.0.0 (as of 2025-05-30)
**Last Major Update Contributor:** cosminmarian53
**Last Update Timestamp (UTC):** 2025-05-30 23:24:01

## 1. Project Overview

GameCadia Nexus is a web application designed to display a curated list of web-based games and allow for the addition of new games to the collection. It features a React frontend for a dynamic user experience and a Node.js/Express backend connected to a MongoDB database for data persistence. The platform supports displaying games as direct links with preview images and also as embedded iframes.

The primary goal is to provide a simple interface for users to browse available games and for administrators (or future authenticated users) to expand the game library.

## 2. Features

*   **Dynamic Game Display**: Games are fetched from a backend API and displayed in a responsive card layout.
*   **Multiple Game Types**:
    *   **Link Games**: Displayed with a title, image, and a "Play Now!" link that directs to the game's URL.
    *   **Iframe Games**: Can be embedded directly onto the platform for an integrated playing experience (frontend rendering for this type is a planned enhancement).
*   **Add New Games**: A dedicated form allows users to submit new games, including details like title, URL (for links or iframe source), image URL, and call to action text.
*   **MongoDB Integration**: Game data is stored and managed in a MongoDB database (local or Atlas).
*   **RESTful API**: Backend provides API endpoints for fetching and adding game data.
*   **Responsive Design**: Game tabs adjust their width based on screen size for better viewing on different devices.
*   **CORS Enabled**: Backend allows cross-origin requests from the frontend development server.

## 3. Technologies Used

**Frontend:**
*   **React**: JavaScript library for building user interfaces.
*   **React Router (`react-router-dom`)**: For client-side routing.
*   **CSS**: For styling components (individual CSS files per component/page and global styles).
*   **Fetch API**: For making requests to the backend.

**Backend:**
*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web application framework for Node.js.
*   **MongoDB**: NoSQL document database.
*   **MongoDB Node.js Driver**: For interacting with MongoDB from Node.js.
*   **`cors`**: Express middleware for enabling Cross-Origin Resource Sharing.
*   **`dotenv`**: Module to load environment variables from a `.env` file.

**Database:**
*   MongoDB (Local instance or MongoDB Atlas)

## 4. Project Structure

```
gamecadia-nexus/
├── my-react-app/        # Frontend React Application (adjust name if different)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── model/        # UI Models like navbar, gametab
│   │   │   │   ├── gametab.js
│   │   │   │   └── ...
│   │   │   ├── AddGameForm.js
│   │   │   └── ...
│   │   ├── pages/          # Route components like Login, UserProfile
│   │   │   ├── UserProfile.js
│   │   │   └── ...
│   │   ├── styles/         # CSS files
│   │   │   ├── gametab.css
│   │   │   ├── AddGameForm.css
│   │   │   └── ...
│   │   ├── App.js          # Main application component
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── ...
├── server/                # Backend Node.js/Express Application
│   ├── node_modules/
│   ├── server.js          # Main backend server file
│   ├── package.json
│   └── .env               # Environment variables (you need to create this)
└── README.md              # This file
```

## 5. Setup and Installation

### 5.1. Prerequisites

*   **Node.js and npm**: Download and install from [nodejs.org](https://nodejs.org/). npm is included with Node.js. (v14.x or higher recommended).
*   **Git**: For cloning the repository.
*   **MongoDB**: A running MongoDB instance (local or Atlas).

### 5.2. MongoDB Installation & Setup

#### A. Local MongoDB Installation (MongoDB Community Server)

1.  **Download**: Go to the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and select the version for your OS.
2.  **Installation**:
    *   **Windows**: Use the MSI installer and follow the prompts. You can install it as a service.
    *   **macOS**: Use Homebrew: `brew tap mongodb/brew` followed by `brew install mongodb-community`.
    *   **Linux**: Follow the specific instructions for your distribution (e.g., using `apt` or `yum`) available in the [MongoDB Manual](https://www.mongodb.com/docs/manual/administration/install-on-linux/).
3.  **Start MongoDB Service**:
    *   **Windows**: If installed as a service, it should start automatically. Otherwise, run `mongod.exe` from the installation's `bin` directory (you might need to create a data directory, e.g., `C:\data\db`).
    *   **macOS (Homebrew)**: `brew services start mongodb-community`.
    *   **Linux**: `sudo systemctl start mongod` (or similar, depending on your init system).
4.  **Verify**: Open a new terminal and run `mongo` (or `mongosh` for newer versions). It should connect to your local instance.

#### B. MongoDB Atlas (Cloud Option)

1.  **Sign Up/Login**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account or log in.
2.  **Create a Cluster**: Follow the instructions to create a new cluster (the free tier "M0 Sandbox" is sufficient for development).
3.  **Database User**: Create a database user with a username and password (e.g., `dbking` / `dbking123` as seen in your URI). Grant this user appropriate permissions (e.g., "Read and write to any database").
4.  **Network Access**: Add your current IP address to the IP Access List to allow connections to your cluster. For development, you can add `0.0.0.0/0` (Allow Access From Anywhere), but **this is not recommended for production**.
5.  **Get Connection String**: Click "Connect" for your cluster, choose "Connect your application", select the Node.js driver, and copy the connection string. It will look like: `mongodb+srv://<username>:<password>@yourcluster.mongodb.net/<dbname>?retryWrites=true&w=majority`.
    *   Replace `<username>` and `<password>` with your database user credentials.
    *   Replace `<dbname>` with your desired database name (e.g., `gamecadiaDataB`). This will be your `MONGO_URI`.

#### C. MongoDB Compass (GUI for MongoDB)

1.  **Download**: Get MongoDB Compass from the [MongoDB Download Center](https://www.mongodb.com/try/download/compass).
2.  **Install**: Follow the installer instructions.
3.  **Connect**:
    *   **To Local Instance**: Open Compass. The default connection string `mongodb://localhost:27017` should work if your local MongoDB is running on the default port. Click "Connect".
    *   **To MongoDB Atlas**: Paste your Atlas connection string (from step 5.2.B.5) into Compass. Click "Connect".
4.  **Navigate**: Once connected, you can see your databases, collections, and documents. You can also perform CRUD operations via the GUI.

### 5.3. Project Setup

1.  **Clone the Repository** (if applicable, otherwise navigate to your project directory):
    ```bash
    git clone <your-repository-url>
    cd gamecadia-nexus
    ```

2.  **Backend Setup**:
    ```bash
    cd server
    npm install
    ```
    You will need to install `dotenv` and `cors` if they aren't already in your `package.json` dependencies:
    ```bash
    npm install express mongodb cors dotenv
    ```

3.  **Create Backend Environment File**:
    In the `server` directory, create a file named `.env`. Add the following variables, replacing the placeholder values with your actual MongoDB Atlas URI or local setup:

    ```ini name=server/.env
    # MongoDB Configuration
    MONGO_URI="mongodb+srv://dbking:dbking123@cluster0.9foznzi.mongodb.net/gamecadiaDataB?retryWrites=true&w=majority" # Replace with your actual URI
    DB_NAME="gamecadiaDataB"
    COLLECTION_NAME="gameElements"

    # Server Configuration
    PORT=3000
    ```
    *   **MONGO_URI**: Your full MongoDB connection string.
    *   **DB_NAME**: The name of your database.
    *   **COLLECTION_NAME**: The name of the collection for game data.
    *   **PORT**: The port your backend server will run on.

4.  **Modify `server.js` to use `.env` variables**:
    At the very top of your `server/server.js` file, add:
    ```javascript
    require('dotenv').config();
    ```
    Then, replace hardcoded values with `process.env.VARIABLE_NAME`:
    ```javascript
    // server/server.js

    // require('dotenv').config(); // Already added at the top

    // const express = require("express"); // ... and other requires

    // const port = process.env.PORT || 3000;
    // const mongoUrl = process.env.MONGO_URI;
    // const effectiveDbName = process.env.DB_NAME || "gamecadiaDataB";
    // const collectionName = process.env.COLLECTION_NAME || "gameElements";

    // ... rest of your server.js
    ```
    Make sure to update these lines in your actual `server.js`.

5.  **Frontend Setup**:
    Navigate to your React app's directory (e.g., `my-react-app`):
    ```bash
    cd ../my-react-app  # Or your frontend directory name
    npm install
    ```

### 5.4. Running the Application

1.  **Start the Backend Server**:
    Open a terminal in the `server` directory:
    ```bash
    npm start 
    # OR if you don't have a start script in package.json:
    # node server.js
    ```
    Look for console messages like "Successfully connected to MongoDB Atlas" and "Server listening at http://localhost:3000".

2.  **Start the Frontend Development Server**:
    Open a new terminal in your React app's directory (e.g., `my-react-app`):
    ```bash
    npm start
    ```
    This will usually open the application in your default web browser (e.g., at `http://localhost:3001` or another port).

3.  **Access the Application**:
    Open your browser and navigate to the URL provided by the React development server (usually `http://localhost:3001`).

## 6. Database (MongoDB)

### 6.1. Connection
The backend server connects to MongoDB using the `MONGO_URI` specified in the `server/.env` file. The `MongoDB Node.js Driver` is used for all database interactions.

### 6.2. Data Structure / Schema
Game data is stored in the collection specified by `COLLECTION_NAME` (e.g., `gameElements`). Each document in this collection represents a game and typically has the following structure:

```json
{
  "_id": "<ObjectId>", // Automatically generated by MongoDB
  "id": "<Number>",      // Custom sequential ID for initial data or manual entries
  "type": "'link' | 'iframe'", // Type of game entry
  "title": "<String>",   // Title of the game
  "href": "<String>",    // URL for 'link' type games (optional for 'iframe')
  "imgSrc": "<String>",  // URL for the game's preview image (optional)
  "imgAlt": "<String>",  // Alt text for the image (optional)
  "callToAction": "<String>", // Text for the play button/link (e.g., "Play Now!")
  "iframeSrc": "<String>", // Source URL for 'iframe' type games (optional for 'link')
  "iframeStyleProto": {   // Suggested styles for iframe (optional for 'iframe')
    "width": "<String>",
    "height": "<String>",
    // ... other CSS properties
  },
  "iframeAttributes": {   // HTML attributes for iframe (optional for 'iframe')
    "scrolling": "'yes' | 'no' | 'auto'"
  },
  "addedBy": "<String>", // Username of the person who added the game
  "addedAt": "<ISODate>" // Timestamp of when the game was added
}
```

### 6.3. Initial Data
The `server.js` file contains an `initialGameData` array. If the game collection is empty when the server starts, this data will be automatically inserted. This is useful for populating the database with a default set of games.

### 6.4. Manual Data Management

*   **MongoDB Compass**:
    *   Connect to your database.
    *   Navigate to your database (e.g., `gamecadiaDataB`) and collection (e.g., `gameElements`).
    *   You can view, add, edit, and delete documents using the GUI.
    *   To add a document: Click "ADD DATA" -> "Insert Document", then paste or type the JSON for the new game.

*   **Mongo Shell / `mongosh`**:
    1.  Connect to your MongoDB instance:
        *   Local: `mongosh`
        *   Atlas: `mongosh "your-atlas-connection-string"`
    2.  Switch to your database: `use gamecadiaDataB;`
    3.  Example commands:
        *   Find all games: `db.gameElements.find().pretty();`
        *   Find a specific game: `db.gameElements.findOne({ title: "Slope (Embedded Game)" });`
        *   Insert one game:
            ```javascript
            db.gameElements.insertOne({
              id: 8, // Ensure unique custom ID if you use it
              type: "link",
              title: "New Awesome Game",
              href: "https://example.com/newgame",
              imgSrc: "https://example.com/newgame.png",
              callToAction: "Try It!",
              addedBy: "admin",
              addedAt: new Date() // Current date and time
            });
            ```
        *   Insert multiple games (like the ones provided for manual addition):
            ```javascript
            db.gameElements.insertMany([
              { /* game 1 object */ },
              { /* game 2 object */ }
            ]);
            ```

## 7. API Endpoints (Backend)

The backend server exposes the following RESTful API endpoints:

*   **`GET /api/elements`**
    *   **Description**: Fetches a list of all game elements from the database.
    *   **Method**: `GET`
    *   **Response**:
        *   `200 OK`: An array of game objects.
            ```json
            [
              { "_id": "...", "id": 1, "type": "link", "title": "...", ... },
              { "_id": "...", "id": 2, "type": "iframe", "title": "...", ... }
            ]
            ```
        *   `500 Internal Server Error`: If there's an issue fetching from the database.
        *   `503 Service Unavailable`: If the database is not connected.

*   **`POST /api/elements`**
    *   **Description**: Adds a new game element to the database.
    *   **Method**: `POST`
    *   **Request Body** (JSON):
        ```json
        {
          "type": "link", // or "iframe"
          "title": "My New Game",
          "href": "https://example.com/mygame", // Required if type is 'link'
          "imgSrc": "https://example.com/image.jpg", // Optional
          "imgAlt": "My new game image", // Optional
          "callToAction": "Play!", // Optional, defaults can be set on frontend/backend
          "iframeSrc": "https://embed.example.com/mygame", // Required if type is 'iframe'
          // ... other optional fields like iframeStyleProto, iframeAttributes
          "addedBy": "cosminmarian53" // Can be set by frontend
        }
        ```
    *   **Response**:
        *   `201 Created`: The newly created game object (including its `_id`).
            ```json
            { "_id": "...", "type": "link", "title": "My New Game", ... }
            ```
        *   `400 Bad Request`: If required fields are missing.
        *   `500 Internal Server Error`: If there's an issue saving to the database.
        *   `503 Service Unavailable`: If the database is not connected.

## 8. Key Project Developments (Changelog Highlights)

This project has evolved through several key stages based on recent interactions:

*   **Initial Setup**: Basic React frontend and Node.js backend structure.
*   **Data Storage Shift**: Transitioned from potentially storing raw JSX/HTML for games to storing **structured data** in MongoDB. This involved defining a clear schema for game objects with fields like `type`, `href`, `imgSrc`, `title`, `iframeSrc`, etc.
*   **Backend API Implementation**:
    *   Created `GET /api/elements` endpoint to fetch all game data.
    *   Created `POST /api/elements` endpoint to allow new games to be added.
*   **Frontend Integration**:
    *   Modified the `GameTab` component to dynamically render games based on the structured data fetched from the API, instead of using hardcoded placeholders or `dangerouslySetInnerHTML` with pre-formatted JSX.
    *   Developed an `AddGameForm` component in React to capture user input for new games and submit it to the backend `POST` endpoint.
    *   Implemented `fetch` calls in `App.js` to consume the backend API, including loading states and error handling.
*   **Database Connectivity**:
    *   Configured the backend to connect to MongoDB Atlas using a connection string.
    *   Implemented logic for `initialGameData` to populate the database on first run if the collection is empty.
*   **CORS Configuration**: Added `cors` middleware to the Express server to handle cross-origin requests from the React development server.
*   **Environment Variables**: Introduced the use of a `.env` file in the backend to manage sensitive information like database connection strings and port numbers, promoting better security and configuration management.
*   **Enhanced Data Model**: Added a `type` field (`'link'` or `'iframe'`) to game objects to differentiate how they should be handled and rendered. Also included fields like `addedBy` and `addedAt` for better data tracking.
*   **Error Handling**: Improved error handling in both frontend fetch calls and backend API responses to provide more meaningful error messages.

## 9. Future Enhancements & TODOs

*   **Full Iframe Rendering**: Implement robust rendering for `type: 'iframe'` games within the `GameTab` component, including responsive iframe styling.
*   **User Authentication**:
    *   Implement user registration and login.
    *   Restrict game addition/management to authenticated users/administrators.
*   **Game Management**:
    *   Add functionality to edit existing game details.
    *   Add functionality to delete games.
*   **Advanced Filtering & Sorting**: Allow users to filter games by type, genre (if added), or sort by title, date added, etc.
*   **Pagination**: Implement pagination for the game list if it grows large.
*   **Improved UI/UX**:
    *   More polished styling.
    *   Loading skeletons or more sophisticated loading indicators.
    *   Better feedback messages for form submissions.
*   **Input Validation**: More comprehensive validation on both frontend and backend for submitted game data.
*   **Testing**:
    *   Unit tests for frontend components and utility functions.
    *   Integration tests for API endpoints.
*   **Deployment**:
    *   Instructions for deploying the React frontend (e.g., to Netlify, Vercel, GitHub Pages).
    *   Instructions for deploying the Node.js backend (e.g., to Heroku, AWS, DigitalOcean).
*   **Image Uploads**: Instead of URL for `imgSrc`, allow direct image uploads for game previews.

---

This README provides a comprehensive guide to understanding, setting up, and using the GameCadia Nexus project. Remember to keep it updated as the project evolves!