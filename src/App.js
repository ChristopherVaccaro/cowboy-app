import React, { useState, useEffect } from "react";
import "./App.css";

const cowboyNames = [
  "Man with No Name",
  "Django",
  "Doc Holliday", 
  "The Lone Ranger",
  "Buffalo Bill",
  "someone new"
];

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x400?text=No+Image";

function CowboyApp() {
  const [selectedCowboy, setSelectedCowboy] = useState(cowboyNames[0]);
  const [cowboyData, setCowboyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCowboyData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedCowboy)}`
        );
        const data = await response.json();

        setCowboyData({
          name: selectedCowboy,
          image: data.thumbnail?.source || PLACEHOLDER_IMAGE, // Use Wikipedia image or placeholder
          description: data.extract || "No description available for this cowboy.",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setCowboyData({
          name: selectedCowboy,
          image: PLACEHOLDER_IMAGE, // Fallback in case of an error
          description: "Unable to load cowboy information.",
        });
      }
      setLoading(false);
    };

    fetchCowboyData();
  }, [selectedCowboy]);

  return (
    <div className="container">
      <h1>Legendary Cowboys</h1>
      <select onChange={(e) => setSelectedCowboy(e.target.value)} value={selectedCowboy}>
        {cowboyNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <div className="content">
        {loading ? (
          <p>Loading cowboy info...</p>
        ) : (
          <>
            <div className="image-container">
              <img src={cowboyData.image} alt={cowboyData.name} />
            </div>
            <div className="info-container">
              <h2>{cowboyData.name}</h2>
              <p>{cowboyData.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CowboyApp;
