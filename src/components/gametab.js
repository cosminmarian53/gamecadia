import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Make sure to pass onDeleteGameClient from App.js
function GameTab({ game, onDeleteGameClient }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const parsedUser = JSON.parse(userFromStorage);
      setCurrentUser(parsedUser); // Store the full user object
      if (game && game.addedBy && parsedUser) {
        // game.addedBy might be an object (if populated) or a string ID.
        // Ensure comparison is with parsedUser._id (which is a string)
        const ownerId =
          typeof game.addedBy === "object"
            ? game.addedBy._id.toString()
            : game.addedBy.toString();
        setIsOwner(ownerId === parsedUser._id);
      } else {
        setIsOwner(false);
      }
    } else {
      setIsOwner(false);
    }
  }, [game]); // Re-run if the game prop changes

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent link navigation from card
    e.stopPropagation(); // Stop event from bubbling up to the Link

    if (!currentUser || !isOwner) {
      alert("You are not authorized to delete this game.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete "${game.name}"? This action cannot be undone.`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token not found. Please log in again.");
          return;
        }
        await axios.delete(`http://localhost:5000/api/games/${game._id}`, {
          headers: { "x-auth-token": token },
        });
        alert(`"${game.name}" has been deleted.`);
        if (onDeleteGameClient) {
          onDeleteGameClient(game._id); // Trigger state update in App.js
        }
      } catch (error) {
        console.error(
          "Error deleting game from GameTab:",
          error.response?.data?.message || error.message
        );
        alert(
          `Failed to delete game: ${
            error.response?.data?.message || "An error occurred."
          }`
        );
      }
    }
  };

  const isPlaceholder = game === "Placeholder";
  const getResponsiveWidth = () => ({
    width:
      window.innerHeight > window.innerWidth ? "100%" : "calc(25% - 1.5rem)",
    minHeight: "280px", // Ensure a minimum height for consistency
  });

  if (isPlaceholder) {
    return (
      <div
        className="rounded-lg overflow-hidden m-3 bg-gray-700 animate-pulse"
        style={getResponsiveWidth()}
      >
        <div className="h-44 w-full bg-gray-600"></div>
        <div className="p-4">
          <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!game || !game._id) return null;

  return (
    <div
      className="group relative rounded-lg overflow-hidden m-3 bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 flex flex-col"
      style={getResponsiveWidth()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/game/${game._id}`} className="block flex-grow flex flex-col">
        <div className="relative overflow-hidden h-44 w-full flex-shrink-0">
          <img
            src={game.imageUrl}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x250/2D3748/E2E8F0?text=No+Image";
            }}
          />
          <div className="absolute top-2 right-2 bg-black/60 text-yellow-400 rounded-full px-2.5 py-1 text-xs font-bold shadow">
            {game.rating}/100
          </div>
          {isOwner && ( // Use the state variable isOwner
            <div className="absolute top-2 left-2 bg-blue-600/90 text-white rounded px-2 py-1 text-xs font-semibold shadow">
              My Game
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="font-semibold text-white text-lg truncate mb-1 group-hover:text-blue-400 transition-colors">
              {game.name}
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              {game.company} ({game.releaseYear})
            </p>
            {game.addedBy && typeof game.addedBy === "object" && (
              <p className="text-xs text-gray-500 mb-2">
                Added by:{" "}
                <span className="font-medium">{game.addedBy.username}</span>
              </p>
            )}
          </div>

          {(isHovered || isOwner) &&
            game.genres &&
            game.genres.length > 0 && ( // Show genres if hovered or owner
              <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                {game.genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-blue-300 px-2 py-0.5 rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
        </div>
      </Link>
      {/* Edit and Delete Buttons for Owner - Placed outside the main Link to prevent nested links */}
      {isOwner &&
        (isHovered || window.innerWidth < 768) && ( // Show on hover, or always on small screens
          <div className="absolute bottom-3 right-3 flex gap-2 z-10">
            <Link
              to={`/edit-game/${game._id}`}
              className="p-2 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-md transition-colors"
              title="Edit Game"
              onClick={(e) => e.stopPropagation()} // Important: stop propagation
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 text-xs bg-red-600 hover:bg-red-500 text-white rounded-md shadow-md transition-colors"
              title="Delete Game"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
    </div>
  );
}

export default GameTab;
