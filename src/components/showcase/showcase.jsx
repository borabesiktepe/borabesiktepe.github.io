import React from "react";

const Showcase = ({ imageUrl, onClose }) => {
  return (
    <div className="showcase-overlay" onClick={onClose}>
      <img src={imageUrl} alt="Full Size Artwork" />
    </div>
  );
};

export default Showcase;
