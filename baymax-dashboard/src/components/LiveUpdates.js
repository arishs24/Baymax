import React from "react";

function LiveUpdates({ heartRate, detectedEmotion }) {
  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Live Updates</h3>
      <p>Heart Rate: {heartRate} BPM</p>
      <p>Detected Emotion: {detectedEmotion.toUpperCase()}</p>
    </div>
  );
}

export default LiveUpdates;
