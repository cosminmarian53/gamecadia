import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import EditGameForm from "../components/EditGameForm";

function GameDetail() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/games/${gameId}`
        );
        setGame(response.data);

        // Check if current user is the owner of this game
        if (currentUser && response.data.addedBy) {
          setIsOwner(response.data.addedBy === currentUser._id);
        }
      } catch (err) {
        setError("Failed to load game details. Please try again later.");
        console.error("Error fetching game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId, currentUser]);

  const handleDeleteGame = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this game? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/games/${gameId}`, {
          headers: {
            "x-auth-token": token,
          },
        });
        navigate("/profile");
      } catch (error) {
        console.error("Error deleting game:", error);
        setError(
          error.response?.data?.message ||
            "Failed to delete game. Please try again."
        );
      }
    }
  };

  const handleUpdateGame = (updatedGame) => {
    setGame(updatedGame);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg">
          <p>{error}</p>
          <Link
            to="/"
            className="text-blue-400 hover:underline mt-2 inline-block"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-300">Game not found</p>
          <Link
            to="/"
            className="text-blue-400 hover:underline mt-2 inline-block"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // If in editing mode, show the edit form
  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Edit Game</h1>
        <EditGameForm
          gameId={gameId}
          onGameUpdated={handleUpdateGame}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-400 hover:text-blue-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Games
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={game.imageUrl}
              alt={game.name}
              className="w-full h-auto object-cover md:h-full"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-white">{game.name}</h1>
              <div className="bg-yellow-400 text-black font-bold rounded-full h-12 w-12 flex items-center justify-center">
                {Math.round(game.rating)}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-lg">
                {game.company} ({game.releaseYear})
              </p>
              {game.addedBy && (
                <p className="text-gray-400 text-sm mt-1">
                  Added by:{" "}
                  {game.addedBy === currentUser?._id ? "You" : "Another user"}
                </p>
              )}
              <p className="text-gray-400 text-sm mt-1">
                Last updated: {new Date(game.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-6">
              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-blue-900/40 text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {game.platforms && game.platforms.length > 0 && (
                <div className="text-gray-400 mt-2">
                  <span className="font-semibold text-gray-300">
                    Available on:{" "}
                  </span>
                  {game.platforms.join(", ")}
                </div>
              )}
            </div>

            <div className="mb-6 bg-gray-700/30 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">
                Description
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {game.description || "No description available for this game."}
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Game
                  </button>
                  <button
                    onClick={handleDeleteGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Game
                  </button>
                </>
              )}
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;
