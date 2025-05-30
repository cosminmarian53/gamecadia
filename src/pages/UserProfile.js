import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams if you were to use it for other profiles
import axios from "axios";

// GameListItem can remain largely the same, or you can integrate GameTab here.
// For simplicity, I'll keep GameListItem as is for now.
function GameListItem({ game, onDeleteGame }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isOwner =
    currentUser &&
    game.addedBy &&
    (typeof game.addedBy === "object" ? game.addedBy._id : game.addedBy) ===
      currentUser._id;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex mb-4 shadow-md hover:shadow-lg transition-all">
      <img
        src={game.imageUrl}
        alt={game.name}
        className="h-24 w-24 object-cover flex-shrink-0" // Added flex-shrink-0
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/100x100/2D3748/E2E8F0?text=Game";
        }}
      />
      <div className="p-3 flex flex-col justify-between flex-grow min-w-0">
        {" "}
        {/* Added min-w-0 for better flex behavior */}
        <div>
          <h3 className="font-semibold text-white truncate">{game.name}</h3>
          <p className="text-sm text-gray-400">
            Added on{" "}
            {new Date(game.createdAt || Date.now()).toLocaleDateString()}
          </p>
          {game.addedBy &&
            typeof game.addedBy === "object" && ( // Display who added it if populated
              <p className="text-xs text-gray-500">
                By: {game.addedBy.username}
              </p>
            )}
        </div>
        <div className="flex justify-end items-center space-x-2 mt-2">
          {isOwner &&
            onDeleteGame && ( // Ensure onDeleteGame is passed and user is owner
              <Link // Changed to Link for edit
                to={`/edit-game/${game._id}`}
                className="text-yellow-400 hover:text-yellow-300 text-xs px-2 py-1 bg-yellow-900/30 rounded"
              >
                Edit
              </Link>
            )}
          {isOwner && onDeleteGame && (
            <button
              onClick={() => onDeleteGame(game._id)}
              className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-900/30 rounded"
            >
              Delete
            </button>
          )}
          <Link
            to={`/game/${game._id}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View Game →
          </Link>
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  // const { userIdFromParams } = useParams(); // If you want to view other users' profiles
  const [profile, setProfile] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [activeTab, setActiveTab] = useState("games"); // Only one tab for now

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const currentUserFromStorage = JSON.parse(localStorage.getItem("user"));

      if (!token || !currentUserFromStorage) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        // navigate("/login"); // Optionally redirect
        return;
      }

      try {
        // Fetch the current user's full profile from /api/users/me
        // This endpoint in server.js should populate 'publishedGames'
        const profileResponse = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: { "x-auth-token": token },
          }
        );

        const fetchedProfile = profileResponse.data;
        setProfile({
          _id: fetchedProfile._id,
          username: fetchedProfile.username,
          email: fetchedProfile.email,
          profilePicture:
            fetchedProfile.profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              fetchedProfile.username
            )}&background=0D8ABC&color=fff`,
          joinedDate: fetchedProfile.createdAt || new Date().toISOString(),
          // gamesCount will be derived from userGames.length
          favoritesCount: 0, // Placeholder for favorites
        });

        // The 'publishedGames' array should be populated by the /api/users/me endpoint
        // If it's not, you might need to adjust the populate() in server.js for that route
        // For now, let's assume it's populated or we fetch it separately if needed.

        // If /api/users/me doesn't populate games, fetch them using /api/users/:userId/games
        // The token is already validated by accessing /api/users/me
        const gamesResponse = await axios.get(
          `http://localhost:5000/api/users/${currentUserFromStorage._id}/games`,
          {
            headers: { "x-auth-token": token }, // Still good practice to send token if endpoint is protected
          }
        );
        setUserGames(gamesResponse.data);
      } catch (err) {
        console.error(
          "Error fetching user data for profile:",
          err.response?.data?.message || err.message
        );
        setError(
          err.response?.data?.message ||
            "Failed to load profile data. The server might be down or an authentication error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  const handleDeleteGame = async (gameIdToDelete) => {
    if (!gameIdToDelete) return;
    if (!profile || !profile._id) {
      alert("Cannot delete game: User profile not loaded correctly.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this game? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Authentication token not found. Please log in again.");
          return;
        }
        await axios.delete(
          `http://localhost:5000/api/games/${gameIdToDelete}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        setUserGames((prevGames) =>
          prevGames.filter((game) => game._id !== gameIdToDelete)
        );
        // No need to update profile.gamesCount separately if it's derived from userGames.length
      } catch (error) {
        console.error(
          "Error deleting game from profile:",
          error.response?.data?.message || error.message
        );
        alert(
          `Failed to delete game: ${
            error.response?.data?.message || "Please try again."
          }`
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold mb-3">Error Loading Profile</h3>
          <p className="mb-4">{error}</p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-400">
        Profile data could not be loaded.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-600 mb-6 md:mb-0 md:mr-8 flex-shrink-0">
            <img
              src={profile.profilePicture}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              {profile.username}
            </h1>
            <p className="text-gray-400 mb-4">
              Member since {new Date(profile.joinedDate).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">
                  {userGames.length}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">
                  Games
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {profile.favoritesCount || 0}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">
                  Favorites
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-auto">
            <Link
              to="/add-game"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm shadow-md"
            >
              Add New Game
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-700">
        <nav className="flex">
          <button // Only one tab for now, "My Games"
            className="pb-3 px-1 mr-8 font-medium text-lg text-blue-400 border-b-2 border-blue-400"
          >
            My Games
          </button>
          {/* Add other tabs here if needed later */}
        </nav>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Published Games</h2>
          {/* "Add New Game" button is now in the profile header */}
        </div>
        {userGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {" "}
            {/* Changed to single column list */}
            {userGames.map((game) => (
              <GameListItem
                key={game._id}
                game={game}
                onDeleteGame={handleDeleteGame}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center shadow-lg">
            <p className="text-gray-400 text-lg mb-6">
              You haven't published any games yet.
            </p>
            <Link
              to="/add-game"
              className="inline-block bg-green-500 hover:bg-green-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-md"
            >
              Publish Your First Game
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
