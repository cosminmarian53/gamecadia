import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditGameForm({ gameId, onGameUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    company: "",
    releaseYear: new Date().getFullYear(),
    genres: "",
    platforms: "",
    rating: 50,
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch the game data when component mounts
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/games/${gameId}`
        );
        const game = response.data;

        // Transform arrays back to comma-separated strings for form input
        setFormData({
          name: game.name || "",
          imageUrl: game.imageUrl || "",
          company: game.company || "",
          releaseYear: game.releaseYear || new Date().getFullYear(),
          genres: game.genres ? game.genres.join(", ") : "",
          platforms: game.platforms ? game.platforms.join(", ") : "",
          rating: game.rating || 50,
          description: game.description || "",
        });
      } catch (error) {
        console.error("Error fetching game:", error);
        setError("Failed to load game data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Convert comma-separated strings to arrays
      const gameData = {
        ...formData,
        genres: formData.genres
          .split(",")
          .map((genre) => genre.trim())
          .filter((genre) => genre),
        platforms: formData.platforms
          .split(",")
          .map((platform) => platform.trim())
          .filter((platform) => platform),
        releaseYear: parseInt(formData.releaseYear),
        rating: parseInt(formData.rating),
      };

      const response = await axios.put(
        `http://localhost:5000/api/games/${gameId}`,
        gameData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (onGameUpdated) {
        onGameUpdated(response.data);
      }
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error updating game:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update game. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this game? This action cannot be undone."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

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

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-auto mb-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Edit Game</h2>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Delete Game
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Game Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-300"
            >
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/game-image.jpg"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Developer/Publisher */}
          <div className="space-y-2">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-300"
            >
              Developer/Publisher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Game Studio, Inc."
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Release Year */}
          <div className="space-y-2">
            <label
              htmlFor="releaseYear"
              className="block text-sm font-medium text-gray-300"
            >
              Release Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="releaseYear"
              name="releaseYear"
              min="1970"
              max={new Date().getFullYear() + 5}
              value={formData.releaseYear}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <label
              htmlFor="genres"
              className="block text-sm font-medium text-gray-300"
            >
              Genres (comma-separated)
            </label>
            <input
              type="text"
              id="genres"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="Action, Adventure, RPG"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">
              Example: Action, Adventure, RPG
            </p>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <label
              htmlFor="platforms"
              className="block text-sm font-medium text-gray-300"
            >
              Platforms (comma-separated)
            </label>
            <input
              type="text"
              id="platforms"
              name="platforms"
              value={formData.platforms}
              onChange={handleChange}
              placeholder="PC, PlayStation, Xbox"
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">
              Example: PC, PlayStation 5, Xbox Series X/S
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6 space-y-2">
          <label className="flex items-center justify-between">
            <span className="block text-sm font-medium text-gray-300">
              Rating (0-100)
            </span>
            <span className="text-yellow-400 font-bold">
              {formData.rating}/100
            </span>
          </label>
          <input
            type="range"
            id="rating"
            name="rating"
            min="0"
            max="100"
            value={formData.rating}
            onChange={handleChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Poor</span>
            <span className="text-xs text-gray-400">Average</span>
            <span className="text-xs text-gray-400">Excellent</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Provide a brief description of the game..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Preview */}
        {formData.imageUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-2">
              Image Preview
            </h3>
            <div className="bg-gray-700 p-2 rounded-md inline-block">
              <img
                src={formData.imageUrl}
                alt="Game preview"
                className="max-h-40 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400?text=Image+Error";
                }}
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {updating ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditGameForm;
