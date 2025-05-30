# Gamecadia: Game Discovery and Sharing Platform

## 1. Project Overview

Gamecadia is a web application designed for game enthusiasts to discover, add, share, and manage information about their favorite video games. Users can register, log in, browse a catalog of games, add new games to the platform, and manage the games they've personally contributed.

This document provides a comprehensive guide to understanding, setting up, and running the Gamecadia project.

## 2. Core Features Implemented

*   **User Authentication**:
    *   User registration with username, email, and password.
    *   Secure password hashing using `bcryptjs`.
    *   User login.
    *   Session management using a simple token-based approach (user ID stored in `localStorage`).
*   **Game Management (CRUD Operations)**:
    *   **Create**: Authenticated users can add new games with details like name, image URL, developer, release year, genres, platforms, rating, and description.
    *   **Read**:
        *   Display all games on the homepage.
        *   View detailed information for a single game.
    *   **Update**: Users can edit the details of games they have personally added.
    *   **Delete**: Users can delete games they have personally added.
*   **User Profiles**:
    *   Dedicated profile page for each user.
    *   Displays user information (username, avatar, join date).
    *   Lists games published by the user.
    *   Allows users to manage (edit/delete) their own games directly from their profile.
*   **Game Display & Interaction**:
    *   Games are displayed in interactive "tabs" or cards.
    *   Hover effects on game cards to show more details.
    *   Owner-specific controls (edit/delete buttons) appear on game cards for the user who added them.
*   **Search Functionality**:
    *   Users can search for games by name, company, or genre.
*   **Responsive Design**: Basic responsive elements for better usability on different screen sizes (though full responsiveness might require further work).
*   **Cookie Consent Banner**: A simple banner for cookie consent (stores acceptance in `localStorage`).

## 3. Technology Stack

*   **Frontend**:
    *   **React**: JavaScript library for building user interfaces.
    *   **React Router DOM**: For client-side routing and navigation.
    *   **Axios**: Promise-based HTTP client for making API requests to the backend.
    *   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Backend**:
    *   **Node.js**: JavaScript runtime environment.
    *   **Express.js**: Web application framework for Node.js, used to build the REST API.
    *   **MongoDB**: NoSQL document-oriented database to store user and game data.
    *   **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, and business logic hooks.
    *   **bcryptjs**: Library for hashing passwords securely.
    *   **dotenv**: Module to load environment variables from a `.env` file.
    *   **cors**: Middleware to enable Cross-Origin Resource Sharing.

## 4. Project Structure

The project is typically divided into two main folders: `client` (for the React frontend) and `server` (for the Node.js/Express backend).

```
gamecadia-project/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, GameTab, Forms, etc.)
│   │   ├── pages/          # Page-level components (Login, Signup, UserProfile, GameDetail, etc.)
│   │   ├── App.js          # Main application component with routing
│   │   ├── index.js        # Entry point for React app
│   │   └── App.css         # Global styles (and TailwindCSS setup via index.css or similar)
│   ├── package.json
│   └── ...
├── server/                 # Node.js Backend
│   ├── models/             # Mongoose schemas and models (User.js, Game.js)
│   ├── node_modules/
│   ├── .env                # Environment variables (!! IMPORTANT: Not committed to Git !!)
│   ├── server.js           # Main backend application file (Express setup, routes, DB connection)
│   ├── package.json
│   └── ...
└── README.md               # This file
```

## 5. Setup and Installation

Follow these steps to get the Gamecadia application running locally.

### Prerequisites

*   **Node.js and npm**: Ensure you have Node.js (which includes npm) installed. You can download it from [nodejs.org](https://nodejs.org/). (LTS version recommended).
*   **Git**: For cloning the repository.
*   **MongoDB Atlas Account**: You'll need a cloud-hosted MongoDB database. We'll use MongoDB Atlas, which offers a generous free tier.

### Steps

#### A. Clone the Repository (If applicable)

If the project is in a Git repository:
```bash
git clone <repository-url>
cd gamecadia-project
```

#### B. Backend Setup (Server-side)

1.  **Navigate to the Server Directory**:
    ```bash
    cd server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    This will install Express, Mongoose, bcryptjs, cors, dotenv, etc., as defined in `server/package.json`.

3.  **MongoDB Atlas Setup**:
    This is crucial for the backend to connect to a database.

    *   **Create a MongoDB Atlas Account**:
        *   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
    *   **Create a New Cluster**:
        *   Once logged in, create a new project.
        *   Within the project, click "Build a Database".
        *   Choose the **Shared** (Free Tier) option.
        *   Select a cloud provider and region (choose one geographically close to you). Default settings for cluster tier (M0 Sandbox) are fine.
        *   Give your cluster a name (e.g., `GamecadiaCluster`).
        *   Click "Create Cluster". Provisioning might take a few minutes.
    *   **Create a Database User**:
        *   In your cluster view, go to "Database Access" under the "Security" section.
        *   Click "Add New DatabaseUser".
        *   Choose "Password" as the Authentication Method.
        *   Enter a **Username** (e.g., `dbking` as used in your example, or choose your own).
        *   Enter a **Password**. Make sure it's strong and **save it securely**. You'll need this for the connection string.
        *   Under "Database User Privileges", select "Read and write to any database" (for development) or specify privileges for a particular database.
        *   Click "Add User".
    *   **Whitelist Your IP Address**:
        *   Go to "Network Access" under the "Security" section.
        *   Click "Add IP Address".
        *   For local development, you can click "Allow Access From My Current IP Address". If your IP changes or you're deploying, you might need to add `0.0.0.0/0` (Allow Access From Anywhere - less secure, use with caution).
        *   Click "Confirm".
    *   **Get Your Connection String**:
        *   Go back to your Cluster's "Overview" page.
        *   Click the "Connect" button.
        *   Choose "Connect your application".
        *   Select "Node.js" as your driver and the latest version.
        *   **Copy the Connection String**. It will look something like this:
            `mongodb+srv://<username>:<password>@yourcluster.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=<YourAppName>`
            You will need to replace `<username>` and `<password>` with the database user credentials you created. You can also specify a database name in the string before the `?`, like:
            `mongodb+srv://<username>:<password>@yourcluster.xxxx.mongodb.net/gamecadiaDB?retryWrites=true&w=majority&appName=<YourAppName>`
            (Our `server.js` uses `gamecadiaDB` as the database name in the URI).

4.  **Set Up Environment Variables (`.env` file)**:
    The backend server needs to know your database connection string and the port it should run on. This is done using a `.env` file, which is **never committed to version control (Git)** because it contains sensitive information.

    *   In the `server` directory, create a new file named `.env`.
    *   Add the following content to your `.env` file:

        ```env
        PORT=5000
        MONGODB_URI=mongodb+srv://your_db_username:your_db_password@yourcluster.xxxx.mongodb.net/gamecadiaDB?retryWrites=true&w=majority&appName=YourAppName
        ```

    *   **IMPORTANT**:
        *   Replace `your_db_username` with the MongoDB Atlas database username you created (e.g., `dbking`).
        *   Replace `your_db_password` with the password for that database user.
        *   Replace `yourcluster.xxxx.mongodb.net` with the actual address of your MongoDB Atlas cluster.
        *   Replace `YourAppName` with the appName specified in your connection string (often pre-filled, like Cluster0).
        *   Ensure the database name (`gamecadiaDB` in this example) is included in the URI if you want Mongoose to connect to/create that specific database.

5.  **Run the Backend Server**:
    ```bash
    nodemon server.js
    ```
    (This usually runs `node server.js` as defined in `package.json`'s `scripts` section).
    You should see console logs indicating the server is running and connected to MongoDB.

#### C. Frontend Setup (Client-side)

1.  **Navigate to the Client Directory**:
    Open a new terminal window/tab.
    ```bash
    cd client
    ```
    (If you're in the `server` directory, you might do `cd ../client`).

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    This installs React, React Router, Axios, Tailwind CSS, etc., as defined in `client/package.json`.

3.  **Run the Frontend Development Server**:
    ```bash
    npm start
    ```
    This will typically open the Gamecadia application in your default web browser at `http://localhost:3000`. The React app will make API calls to your backend server (running on `http://localhost:5000` by default).

You should now have both the backend and frontend running!

## 6. Understanding MongoDB and Mongoose

### MongoDB Basics

*   **NoSQL Database**: MongoDB is a document-oriented NoSQL database. Unlike SQL databases (like MySQL, PostgreSQL) which use tables, rows, and columns, MongoDB stores data in flexible, JSON-like documents.
*   **Documents**: A document is a set of key-value pairs, similar to a JSON object. Values can be various data types, including other documents, arrays, and arrays of documents.
    ```json
    // Example of a MongoDB document for a game
    {
      "_id": "someObjectId", // Automatically generated unique ID
      "name": "Cyberpunk 2077",
      "releaseYear": 2020,
      "genres": ["RPG", "Action"],
      "developer": { "name": "CD Projekt Red", "country": "Poland" }
    }
    ```
*   **Collections**: Documents are stored in collections. A collection is analogous to a table in a SQL database. However, collections in MongoDB do not enforce a strict schema by default (though Mongoose helps with this).
*   **Databases**: Collections are grouped within databases. A single MongoDB server can host multiple databases.
*   **BSON**: Internally, MongoDB stores documents in a binary-encoded format called BSON (Binary JSON), which supports more data types than JSON.

### Mongoose (ODM for MongoDB in Node.js)

Mongoose is an Object Data Modeling (ODM) library that provides a straightforward, schema-based solution to model your application data. It sits on top of the native MongoDB driver.

*   **Schemas**:
    *   A Mongoose schema defines the structure of the documents within a collection, the data types for each field, default values, validation rules, etc.
    *   This brings a level of structure and predictability to your NoSQL data.
    *   Example (`Game.js` model):
        ```javascript
        const gameSchema = new mongoose.Schema({
          name: { type: String, required: true },
          releaseYear: { type: Number, required: true },
          addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
          // ... other fields
        });
        ```
*   **Models**:
    *   A Mongoose model is a constructor compiled from a Schema definition. An instance of a model represents a MongoDB document and can be saved to the database or retrieved from it.
    *   Models are responsible for creating, reading, updating, and deleting documents.
    *   Example (`Game.js` model):
        ```javascript
        const Game = mongoose.model('Game', gameSchema);
        // Now you can do: const newGame = new Game({ ... }); await newGame.save();
        // Or: const games = await Game.find({ releaseYear: 2024 });
        ```
*   **Validation**: Mongoose has built-in validation capabilities (e.g., `required`, `min`, `max`, `match` for regex, custom validators). If validation fails when saving a document, Mongoose throws an error.
*   **Middleware (Hooks)**: Mongoose schemas support middleware (also called pre and post hooks). These are functions that execute during an asynchronous function's lifecycle (e.g., before or after `save`, `validate`, `remove`).
    *   In `User.js`, we use a `pre('save')` hook to hash the user's password before it's saved to the database.
*   **Populate**: Mongoose has a powerful `populate()` method to replace specified paths (like `addedBy` in the `Game` model which stores a User's `ObjectId`) with the actual document(s) from other collections. This is like doing a JOIN in SQL.
    ```javascript
    const game = await Game.findById(someId).populate('addedBy', 'username email');
    // game.addedBy will now be the user object { username: '...', email: '...' }
    // instead of just the ObjectId.
    ```

## 7. Key Backend Logic Explained (`server.js`)

*   **Middleware Setup**:
    *   `cors()`: Enables requests from different origins (e.g., your React app on `localhost:3000` to your server on `localhost:5000`).
    *   `express.json()`: Parses incoming requests with JSON payloads (e.g., when you send game data from a form).
*   **MongoDB Connection**: Establishes and maintains the connection to your MongoDB Atlas database.
*   **`auth` Middleware**:
    *   This function is used to protect routes that require a user to be logged in.
    *   It expects an `x-auth-token` header in the request. For this project, the token is simply the user's `_id` string from MongoDB.
    *   It verifies if the token is a valid `ObjectId` and if a user with that ID exists.
    *   If valid, it attaches `req.user = { id: user._id.toString() }` to the request object, making the authenticated user's ID available to subsequent route handlers.
*   **User Routes (`/api/users/`)**:
    *   `/register`: Creates a new user, hashes their password using the `pre('save')` hook in `User.js`, and saves them to the database.
    *   `/login`: Finds a user by email, compares the provided password with the hashed password in the database (using `user.comparePassword()`), and returns a token (user ID) if successful.
    *   `/me`: (Protected by `auth`) Fetches the profile of the currently authenticated user, populating their `publishedGames`.
*   **Game Routes (`/api/games/`)**:
    *   `GET /`: Fetches all games, populating the `username` of the user who added each game.
    *   `GET /:id`: Fetches a single game by its ID, also populating `addedBy`.
    *   `POST /`: (Protected by `auth`) Creates a new game.
        *   **Crucially, it sets the `addedBy` field of the new game to `req.user.id` (the ID of the authenticated user).** This links the game to its creator.
        *   It also updates the `publishedGames` array in the `User` document.
    *   `PUT /:id`: (Protected by `auth`) Updates an existing game. It first checks if the game exists and then **verifies that the `addedBy` field of the game matches `req.user.id`**, ensuring only the owner can edit their game.
    *   `DELETE /:id`: (Protected by `auth`) Deletes a game. Similar ownership check as `PUT`. It also removes the game's ID from the user's `publishedGames` array.
*   **Static File Serving (Production)**: Configured to serve the `client/build` folder when `NODE_ENV` is `production`.

## 8. Key Frontend Logic Explained

*   **`App.js`**:
    *   **Routing**: Uses `react-router-dom` (`BrowserRouter`, `Routes`, `Route`) to define navigation paths and render corresponding page components.
    *   **Global State**: Manages global state for the currently logged-in `user` and the list of all `games` fetched from the backend.
    *   **Authentication Handling**:
        *   `handleLogin`: Updates `user` state and stores user data + token in `localStorage`.
        *   `handleLogout`: Clears `user` state and removes data from `localStorage`.
        *   `useEffect` hook to load user from `localStorage` on initial app load to maintain session.
    *   **Game State Management**:
        *   `handleAddGame`: Adds a newly created game to the local `games` state.
        *   `handleUpdateGame`: Updates a game in the local `games` state after editing.
        *   `handleDeleteGameClient`: Removes a deleted game from the local `games` state.
*   **Authentication Components (`Login.js`, `Signup.js`)**:
    *   Manage form input.
    *   Make API calls to `/api/users/login` or `/api/users/register`.
    *   On success, call `handleLogin` from `App.js`.
*   **`UserProfile.js`**:
    *   Fetches data for the currently logged-in user using `/api/users/me` or fetches specific user games using `/api/users/:userId/games`.
    *   Displays user information and a list of games they've published (`userGames` state).
    *   Provides functionality to delete games owned by the user, making API calls and updating its local `userGames` state.
*   **`GameTab.js` (and `GameListItem.js`)**:
    *   Responsible for displaying individual game cards.
    *   **Ownership Check**: Includes logic in `useEffect` to check if the currently logged-in user (from `localStorage`) is the owner of the game (`game.addedBy === currentUser._id`).
    *   Conditionally renders "Edit" and "Delete" buttons/icons if the user is the owner.
    *   The "Delete" button in `GameTab` calls `handleDelete` which makes an API request and then calls `onDeleteGameClient` (passed from `App.js`) to update the global game list.
*   **Forms (`AddGameForm.js`, `EditGameForm.js`)**:
    *   Manage form state for game details.
    *   On submit, they retrieve the auth token from `localStorage`.
    *   Make `POST` (for add) or `PUT` (for edit) requests to the backend API (`/api/games`), including the `x-auth-token` header.
*   **`localStorage`**:
    *   Used to persist user data (`user` object) and the authentication token (`token`, which is the user's ID) across browser sessions. This allows the user to stay logged in.
*   **Axios**: Used for all HTTP requests to the backend. It's configured to send the `x-auth-token` in headers for protected routes.

## 9. How Data Flows (Example: Adding a Game)

1.  **User Action (Frontend)**: User fills out the `AddGameForm.js` and clicks "Submit".
2.  **Frontend Request**:
    *   `AddGameForm.js` retrieves the auth token (user ID) from `localStorage`.
    *   It constructs the game data payload.
    *   It makes a `POST` request to `http://localhost:5000/api/games` using Axios, including the game data in the request body and the token in the `x-auth-token` header.
3.  **Backend Processing (`server.js`)**:
    *   The request hits the `POST /api/games` route.
    *   The `auth` middleware runs first:
        *   It extracts the `x-auth-token`.
        *   It verifies the token (checks if a user with that ID exists).
        *   If valid, it attaches `req.user = { id: 'userIdString' }` to the request.
    *   The route handler for `POST /api/games` executes:
        *   It destructures game details from `req.body`.
        *   It creates a new `Game` model instance, crucially setting `addedBy: req.user.id`.
        *   It calls `newGame.save()` to persist the game to the MongoDB database.
        *   It updates the `User` document by adding the new game's ID to the `publishedGames` array.
        *   It sends a `201 Created` response back to the frontend with the saved game data.
4.  **Frontend Response Handling**:
    *   `AddGameForm.js` receives the response from the server.
    *   If successful, it calls `onGameAdded` (which is `handleAddGame` in `App.js`).
    *   `handleAddGame` in `App.js` updates the global `games` state, causing the UI (e.g., homepage game list) to re-render and show the new game.
    *   The user is typically navigated to their profile or the homepage.

## 10. Troubleshooting Common Issues

*   **Database Connection Fails (Server Logs)**:
    *   Check your `MONGODB_URI` in `.env` for typos, correct username/password, and correct cluster address.
    *   Ensure your IP address is whitelisted in MongoDB Atlas Network Access.
    *   Check your internet connection.
*   **Games Not Saving / Not Associated with User**:
    *   **Check Server Logs**: Look for errors during the `POST /api/games` request. Specifically, Mongoose validation errors or database save errors.
    *   **`addedBy` field**: Verify in `server.js` (`POST /api/games`) that `addedBy: req.user.id` is being set correctly.
    *   **Token**: Ensure the frontend is correctly sending the `x-auth-token` and that the `auth` middleware is correctly extracting `req.user.id`.
    *   **MongoDB Compass/Shell**: Directly inspect the `games` collection. Are documents being created? Does the `addedBy` field contain the correct `ObjectId` of the user?
*   **User Profile Not Showing User's Games**:
    *   **`UserProfile.js` Fetch Logic**: Ensure it's fetching games using `/api/users/:userId/games` or that `/api/users/me` correctly populates `publishedGames`.
    *   **Comparison Logic**: When filtering or checking ownership, ensure you're comparing IDs correctly (e.g., `game.addedBy.toString() === currentUser._id.toString()` if `game.addedBy` is an ObjectId).
*   **Edit/Delete Buttons Not Appearing or Not Working**:
    *   **`GameTab.js` / `GameListItem.js` Ownership Check**: Double-check the logic that sets `isOwner`. Compare `game.addedBy` (which might be an object if populated, so use `game.addedBy._id`, or just a string ID) with `currentUser._id`.
    *   **API Endpoints**: Ensure the `PUT` and `DELETE` requests in the frontend are hitting the correct URLs and that the server-side ownership checks are working.
*   **CORS Errors (Browser Console)**:
    *   Ensure `app.use(cors());` is correctly set up early in your `server.js` middleware stack.
*   **`.env` File Not Loaded**:
    *   Make sure `require('dotenv').config();` is at the very top of your `server.js`.
    *   Ensure the `.env` file is in the root of your `server` directory.
*   **Frontend Not Updating After DB Change**:
    *   Ensure that after successful API calls (add, update, delete), you are updating the relevant React state (`games`, `userGames`) to trigger a re-render.

## 11. Potential Further Development

*   **Advanced Search/Filtering**: Implement more complex filtering options (by platform, release year range, etc.).
*   **User Reviews and Ratings**: Allow users to rate and review games.
*   **Favorite/Wishlist System**: Users can mark games as favorites or add to a wishlist.
*   **Image Uploads**: Instead of URLs, allow users to upload game cover images.
*   **Admin Panel**: For managing users and games.
*   **More Robust Authentication**: Implement JWT (JSON Web Tokens) for authentication instead of just sending user IDs.
*   **Testing**: Add unit and integration tests for both frontend and backend.
*   **Deployment**: Deploy the application to a platform like Heroku, Vercel, or Netlify.

---
