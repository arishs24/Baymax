import React from "react";

function EmotionDisplay({ emotion }) {
  const emotionColors = {
    happy: "yellow",
    sad: "blue",
    stressed: "red",
  };

  const backgroundColor = emotionColors[emotion] || "gray";

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div
        style={{
          backgroundColor,
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          display: "inline-block",
        }}
      ></div>
      <p style={{ marginTop: "10px", fontSize: "20px" }}>
        Current Emotion: {emotion.toUpperCase()}
      </p>
    </div>
  );
}

export default EmotionDisplay;
