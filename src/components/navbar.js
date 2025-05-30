import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/Logo.png"; // Adjust the path as necessary
import axios from "axios";

function Navbar({ onSearch, isLoggedIn, username, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicks outside of the search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchFilteredGames(searchTerm);
      } else {
        setFilteredGames([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchFilteredGames = async (term) => {
    if (!term) return;

    setIsLoading(true);
    try {
      // You can either use an API endpoint or filter from a local cache
      const response = await axios.get(`http://localhost:5000/api/games`);
      const games = response.data.filter(
        (game) =>
          game.name.toLowerCase().includes(term.toLowerCase()) ||
          game.company.toLowerCase().includes(term.toLowerCase()) ||
          (game.genres &&
            game.genres.some((genre) =>
              genre.toLowerCase().includes(term.toLowerCase())
            ))
      );

      setFilteredGames(games.slice(0, 5)); // Limit to 5 results for dropdown
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error fetching filtered games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSearchResults(false);
    onSearch(searchTerm);
    navigate("/");
  };

  const handleGameSelect = (game) => {
    setSearchTerm(game.name);
    setShowSearchResults(false);
    navigate(`/game/${game._id}`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img className="h-8 w-auto" src={logo} alt="Gamecadia" />
                <span className="ml-2 text-xl font-bold text-white">
                  Gamecadia
                </span>
              </Link>
            </div>
          </div>

          {/* Search Form */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search games..."
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-700 focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    onClick={() => {
                      if (searchTerm && filteredGames.length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => {
                        setSearchTerm("");
                        setFilteredGames([]);
                        setShowSearchResults(false);
                      }}
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-400">
                      <div className="animate-spin inline-block w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full mr-2"></div>
                      Searching...
                    </div>
                  ) : filteredGames.length > 0 ? (
                    <ul>
                      {filteredGames.map((game) => (
                        <li
                          key={game._id}
                          onClick={() => handleGameSelect(game)}
                          className="cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center px-4 py-3">
                            <div
                              className="w-12 h-12 bg-gray-900 rounded overflow-hidden mr-3 flex-shrink-0"
                              style={{ minWidth: "48px" }}
                            >
                              <img
                                src={game.imageUrl}
                                alt={game.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/48x48?text=Game";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {game.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {game.company} ({game.releaseYear})
                              </p>
                            </div>
                            <div className="ml-2">
                              <span className="bg-yellow-500 text-yellow-900 font-bold text-xs rounded-full px-2 py-1">
                                {Math.round(game.rating)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                      {filteredGames.length > 0 && (
                        <li>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setShowSearchResults(false);
                              onSearch(searchTerm);
                              navigate("/");
                            }}
                            className="w-full text-center py-2 text-blue-400 hover:bg-gray-700 text-sm"
                          >
                            Show all results for "{searchTerm}"
                          </button>
                        </li>
                      )}
                    </ul>
                  ) : searchTerm ? (
                    <div className="p-4 text-center text-gray-400">
                      No games found matching "{searchTerm}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {/* Authentication Links */}
            <div className="hidden md:flex md:items-center">
              {isLoggedIn ? (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleProfileMenu}
                      className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                    >
                      <span className="mr-2 font-medium">{username}</span>
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        {username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </button>
                  </div>

                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10">
                      <div className="py-1 rounded-md bg-gray-800 ring-1 ring-black ring-opacity-5">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/add-game"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Add New Game
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-3">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <svg
                  className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - Rest of the code remains the same */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-800"
          >
            Home
          </Link>
          <Link
            to="/games"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Games
          </Link>
          <Link
            to="/explore"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Explore
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
          >
            About
          </Link>
        </div>

        <div className="pt-4 pb-3 border-t border-gray-700">
          {isLoggedIn ? (
            <>
              <div className="flex items-center px-5">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  {username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {username}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Your Profile
                </Link>
                <Link
                  to="/add-game"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Add New Game
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-500"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
