import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const TMDB_API_KEY = "YOUR_TMDB_API_KEY";

const cowboyNames = [
  "The Man with No Name",
  "Wyatt Earp",
  "Butch Cassidy",
  "The Sundance Kid",
  "The Lone Ranger",
  "Buffalo bill",
  "Doc Holliday",
  "Django"
];

const PLACEHOLDER_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

function CowboyApp() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cowboyData, setCowboyData] = useState({
    name: cowboyNames[0],
    image: PLACEHOLDER_IMAGE,
    description: "Loading...",
    wikiUrl: "#"
  });
  const [movies, setMovies] = useState([]);
  // const [loading, setLoading] = useState(false);

  const selectedCowboy = cowboyNames[selectedIndex];

  // ✅ Fetch cowboy details
  const fetchCowboyData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedCowboy)}`
      );
      const data = await response.json();
  
      // ✅ Check if Wikipedia provides an image
      const imageUrl = data.thumbnail?.source || PLACEHOLDER_IMAGE;
  
      setTimeout(() => {
        setCowboyData({
          name: selectedCowboy,
          image: imageUrl,
          description: data.extract || "No description available.",
          wikiUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${selectedCowboy.replace(" ", "_")}`
        });
      }, 300);
    } catch (error) {
      console.error("Error fetching Wikipedia data:", error);
      setCowboyData({
        name: selectedCowboy,
        image: PLACEHOLDER_IMAGE,
        description: "Unable to load cowboy information.",
        wikiUrl: `https://en.wikipedia.org/wiki/${selectedCowboy.replace(" ", "_")}`
      });
    }
  }, [selectedCowboy]);

  // ✅ Fetch movies
  const fetchMovies = useCallback(async () => {
    setMovies([]);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(selectedCowboy)}`
      );
      const data = await response.json();
      setMovies(data.results ? data.results.slice(0, 5) : []);
    } catch (error) {
      console.error("Error fetching TMDb movies:", error);
      setMovies([]);
    }
  }, [selectedCowboy]);

  // ✅ Update content when cowboy changes
  useEffect(() => {
    fetchCowboyData();
    fetchMovies();
  }, [fetchCowboyData, fetchMovies]);

  // ✅ Handle "Next" & "Previous" button clicks
  const handleNext = () => {
    if (selectedIndex < cowboyNames.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div className="app-container">
      {/* ✅ Left Navigation (Still Available) */}
      <nav className="cowboy-nav">
        <div class="skull-logo"></div>
        <h2 className="nav-title">Legendary Gunslingers</h2>
        <ul>
          {cowboyNames.map((name, index) => (
            <li
              key={name}
              className={`cowboy-item ${selectedIndex === index ? "selected" : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              {name}
            </li>
          ))}
        </ul>
      </nav>

      {/* ✅ Main Content */}
      <div className="content">
        <div className="image-container">
          <img src={cowboyData.image} alt={cowboyData.name} />
        </div>

        <div className="info-container">
          <h2>{cowboyData.name}</h2>
          <p>{cowboyData.description}</p>

          {/* ✅ Movie Appearances */}
          {movies.length > 0 && (
            <div>
              <h3>Movies & Appearances:</h3>
              <ul>
                {movies.map((movie, index) => (
                  <li key={index}>
                    <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                      {movie.title} ({movie.release_date ? movie.release_date.split("-")[0] : "N/A"})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Wikipedia Link */}
          <div className="wiki-nav-container">
  <a href={cowboyData.wikiUrl} target="_blank" rel="noopener noreferrer" className="wiki-link">
    Read more on Wikipedia →
  </a>
  
  <div className="button-container">
    <button onClick={handlePrevious} disabled={selectedIndex === 0} className="nav-button">
      ◀ Previous
    </button>
    <button onClick={handleNext} disabled={selectedIndex === cowboyNames.length - 1} className="nav-button">
      Next ▶
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}

export default CowboyApp;
