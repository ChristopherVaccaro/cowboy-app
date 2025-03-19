import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const TMDB_API_KEY = "YOUR_TMDB_API_KEY"; // 🔥 Replace with your actual API key

const cowboyNames = [
  "The Man with No Name",
  "Wyatt Earp",
  "Butch Cassidy",
  "The Sundance Kid",
  "Marshal Reuben J. Cogburn",
  "Django",
  "Doc Holliday"
];

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x400?text=No+Image";

function CowboyApp() {
  const [selectedCowboy, setSelectedCowboy] = useState(cowboyNames[0]);
  const [cowboyData, setCowboyData] = useState({
    name: cowboyNames[0],
    image: PLACEHOLDER_IMAGE,
    description: "Loading...",
    wikiUrl: "#"
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cowboy details
  const fetchCowboyData = useCallback(async (cowboy) => {
    setLoading(true); // Show transition effect
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cowboy)}`
      );
      const data = await response.json();

      setTimeout(() => { // Smooth loading delay to prevent flashing
        setCowboyData({
          name: cowboy,
          image: data.thumbnail?.source || PLACEHOLDER_IMAGE,
          description: data.extract || "No description available.",
          wikiUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${cowboy.replace(" ", "_")}`
        });
        setLoading(false); // End transition effect
      }, 300); // 300ms fade-in effect

    } catch (error) {
      console.error("Error fetching Wikipedia data:", error);
      setCowboyData({
        name: cowboy,
        image: PLACEHOLDER_IMAGE,
        description: "Unable to load cowboy information.",
        wikiUrl: `https://en.wikipedia.org/wiki/${cowboy.replace(" ", "_")}`
      });
      setLoading(false);
    }
  }, []);

  // ✅ Fetch movies
  const fetchMovies = useCallback(async (cowboy) => {
    setMovies([]); // Reset movie list for smooth transition
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cowboy)}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setMovies(data.results.slice(0, 5));
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error fetching TMDb movies:", error);
      setMovies([]);
    }
  }, []);

  // ✅ Update content only (no full refresh)
  useEffect(() => {
    fetchCowboyData(selectedCowboy);
    fetchMovies(selectedCowboy);
  }, [selectedCowboy, fetchCowboyData, fetchMovies]);

  return (
    <div className="app-container">
      {/* ✅ Left Navigation with Cowboy Names */}
      <nav className="cowboy-nav">
        <div className="skull-logo"></div>
        <h2 className="nav-title">Legendary Cowboys</h2>
        <ul>
          {cowboyNames.map((name) => (
            <li
              key={name}
              className={`cowboy-item ${selectedCowboy === name ? "selected" : ""}`}
              onClick={() => setSelectedCowboy(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      </nav>

      {/* ✅ Main Content (Only Image & Text Change) */}
      <div className="content">
        <div className={`image-container ${loading ? "fade-out" : "fade-in"}`}>
          <img src={cowboyData.image} alt={cowboyData.name} />
        </div>

        <div className={`info-container ${loading ? "fade-out" : "fade-in"}`}>
          <h2>{cowboyData.name}</h2>
          <p>{cowboyData.description}</p>

          {movies.length > 0 && (
            <div>
              <h3>Movies & Appearances:</h3>
              <ul>
                {movies.map((movie, index) => (
                  <li key={index}>
                    <a
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="movie-link"
                    >
                      {movie.title} ({movie.release_date ? movie.release_date.split("-")[0] : "N/A"})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p>
            <a href={cowboyData.wikiUrl} target="_blank" rel="noopener noreferrer" className="wiki-link">
              Read more on Wikipedia →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CowboyApp;
