import React, { useState, useEffect } from "react";
import "../styles/gametab.css"; // Make sure this path is correct

function GameTab({ game }) {
  // game prop is the structured object from the database
  const [divWidth, setDivWidth] = useState(25);

  useEffect(() => {
    const updateWidth = () => {
      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;
      if (screenHeight > screenWidth) {
        setDivWidth(90); // Adjusted for better fit on narrow screens (e.g. 1 per row)
      } else if (screenWidth < 1024) {
        // Medium screens
        setDivWidth(45); // ~2 per row
      } else {
        setDivWidth(23); // Wider screens, ~4 per row
      }
    };

    updateWidth(); // Set initial width
    window.addEventListener("resize", updateWidth); // Update width on resize

    return () => window.removeEventListener("resize", updateWidth); // Cleanup listener
  }, []);

  // Ensure game object and its properties exist before trying to render
  if (!game || typeof game !== "object") {
    return (
      <div className="gametab" style={{ width: `${divWidth}%` }}>
        <p>Game data not available.</p>
      </div>
    );
  }

  const { href, imgSrc, imgAlt, title, callToAction } = game;

  return (
    <div className="gametab" style={{ width: `${divWidth}%` }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="gametab-link"
      >
        {imgSrc && (
          <img
            src={imgSrc}
            alt={imgAlt || title || "Game image"}
            className="gametab-image"
          />
        )}
        <br />
        {title && <span className="gametab-title">{title}</span>}
        <br />
        {callToAction && <span className="gametab-cta">{callToAction}</span>}
        {!title && !imgSrc && <p>{href}</p>}{" "}
        {/* Fallback if only href is present */}
      </a>
    </div>
  );
}

export default GameTab;
