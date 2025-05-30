import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddGameForm({ onGameAdded, onCancel }) {
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Get current user for debugging
      const currentUser = JSON.parse(localStorage.getItem("user"));
      console.log("Current user ID when adding game:", currentUser?._id);

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
        addedBy: currentUser?._id, // EXPLICITLY ADD THE USER ID HERE
      };

      console.log("Sending game data:", gameData);

      const response = await axios.post(
        "http://localhost:5000/api/games",
        gameData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      console.log("Response from server:", response.data);

      if (onGameAdded) {
        onGameAdded(response.data);
      }
      navigate("/profile"); // Go to profile instead of home
    } catch (error) {
      console.error("Error adding game:", error);
      setError(
        error.response?.data?.message || "Failed to add game. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-700">
        Add New Game
      </h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
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
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {loading ? (
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
                Adding Game...
              </span>
            ) : (
              "Add Game"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddGameForm;
