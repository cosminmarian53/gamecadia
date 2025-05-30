import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/navbar";
import Body from "./components/body";
import Footer from "./components/footer";
import GameTab from "./components/gametab";
import Cookies from "./components/cookies";
import Spacer from "./components/spacer";
import PlayPort from "./pages/PlayPort";
import UserProfile from "./pages/UserProfile";
import GameDetail from "./pages/gamedetail";
import AddGameForm from "./components/addgame";
import EditGameForm from "./components/EditGameForm";

// Wrapper component for EditGameForm to properly use useParams hook
function EditGameWrapper({ onUpdate }) {
  const { gameId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Edit Game</h1>
      <EditGameForm
        gameId={gameId}
        onGameUpdated={onUpdate}
        onCancel={() => window.history.back()}
      />
    </div>
  );
}

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }

    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token && loggedInUser) {
      // If user data exists but no token, update the token
      const userData = JSON.parse(loggedInUser);
      localStorage.setItem("token", userData._id);
    }
  }, []);

  useEffect(() => {
    // Fetch games from the backend
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/games");
        setGames(response.data);
        console.log("Fetched games:", response.data.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData._id); // Set token
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const handleAddGame = (newGame) => {
    setGames((prevGames) => [newGame, ...prevGames]);
  };

  const handleUpdateGame = (updatedGame) => {
    setGames((prevGames) =>
      prevGames.map((g) => (g._id === updatedGame._id ? updatedGame : g))
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter games based on search query
  const filteredGames = searchQuery
    ? games.filter(
        (game) =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (game.genres &&
            game.genres.some((genre) =>
              genre.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      )
    : games;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <BrowserRouter>
        <Navbar
          onSearch={handleSearch}
          isLoggedIn={!!user}
          username={user?.username}
          onLogout={handleLogout}
        />
        <Body className="flex-grow">
          <Routes>
            <Route
              path="/login"
              element={
                user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/" /> : <Signup />}
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <UserProfile userId={user._id} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/add-game"
              element={
                user ? (
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-white mb-6">
                      Add New Game
                    </h1>
                    <AddGameForm
                      onGameAdded={handleAddGame}
                      onCancel={() => window.history.back()}
                    />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Fixed route with wrapper component */}
            <Route
              path="/edit-game/:gameId"
              element={
                user ? (
                  <EditGameWrapper onUpdate={handleUpdateGame} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/game/:gameId" element={<GameDetail />} />
            <Route path="/play/:gameId" element={<PlayPort />} />
            <Route
              path="/"
              element={
                <>
                  <Spacer />

                  <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-bold text-white">
                        {searchQuery
                          ? `Search results for: ${searchQuery}`
                          : "Featured Games"}
                      </h2>

                      <Link
                        to="/add-game"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add New Game
                      </Link>
                    </div>

                    <div className="flex flex-wrap -mx-3">
                      {loading ? (
                        // Display placeholders while loading
                        Array(8)
                          .fill()
                          .map((_, index) => (
                            <GameTab key={index} game="Placeholder" />
                          ))
                      ) : filteredGames.length > 0 ? (
                        // Display actual games
                        filteredGames.map((game) => (
                          <GameTab key={game._id} game={game} />
                        ))
                      ) : (
                        <div className="w-full p-4 text-center">
                          <p className="text-xl text-gray-400">
                            No games found. Try another search or add a new
                            game.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              }
            />
          </Routes>

          <Cookies />
        </Body>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
