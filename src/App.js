import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"; // Make sure this exists

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Navbar from "./components/model/navbar";
import Body from "./components/model/body";
import Footer from "./components/model/footer";
import GameTab from "./components/model/gametab";
import Cookies from "./components/model/cookies";
import Spacer from "./components/model/spacer";
// import PlayPort from "./pages/PlayPort"; // Uncomment if used
import UserProfile from "./pages/UserProfile";

function App() {
  const [gameElements, setGameElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGameElements = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch("http://localhost:3000/api/elements"); // Ensure this URL is correct

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        let errorData = { message: `HTTP error! Status: ${response.status}` };
        try {
          // Try to parse a JSON error response from the server
          errorData = await response.json();
        } catch (e) {
          // If parsing JSON fails, use the status text or a generic message
          console.warn("Could not parse error response as JSON:", e);
        }
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      setGameElements(data);
    } catch (e) {
      console.error("Failed to fetch game elements:", e);
      // e.message should now be more informative
      setError(
        e.message.includes("Failed to fetch")
          ? "Network error: Could not connect to the server. Please ensure the server is running and accessible."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameElements();
  }, []);

  const handleGameAdded = (newGameFromServer) => {
    // Add the new game to the beginning of the list for immediate UI update
    setGameElements((prevElements) => [newGameFromServer, ...prevElements]);
    // Optionally, you could re-fetch the whole list if you want to be absolutely sure:
    // fetchGameElements();
  };

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Body>
          <UserProfile
            PlayerName="User1"
            PublishedGames={[
              "https://example.com/game1",
              "https://example.com/game2",
            ]}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Spacer />

          <Spacer />
          <div className="add-game-container">
            <h2>Available Games</h2>
            {loading && (
              <p style={{ textAlign: "center", padding: "20px" }}>
                Loading games...
              </p>
            )}
            {error && (
              <p style={{ textAlign: "center", padding: "20px", color: "red" }}>
                Error: {error}
              </p>
            )}
          </div>

          <div className="game-elements-container">
            {" "}
            {/* Ensure this class is styled for flex-wrap if needed */}
            {!loading && !error && gameElements.length === 0 && (
              <p>No games found. Add one above!</p>
            )}
            {!loading &&
              !error &&
              gameElements.map((element) => (
                <GameTab
                  key={element._id || element.id || element.title}
                  game={element}
                />
              ))}
          </div>

          <Spacer />
          <Cookies />
        </Body>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
