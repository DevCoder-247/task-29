import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL
function App() {
  const [videoList, setVideoList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const videoRef = useRef();
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API}/videos`)
      .then(res => {
        setVideoList(res.data);
        if (res.data.length > 0) setSelectedVideo(res.data[0]);
      })
      .catch(err => {
        console.error("Failed to load video list:", err);
        setError("Failed to load video list");
      });
  }, []);

  const handleChange = (e) => {
    setSelectedVideo(e.target.value);
    setError("");
  };

  const handleError = () => {
    setError("Failed to load video. Please try another one.");
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>🎬 Node.js Video Streaming App</h1>

      {error && <div style={styles.error}>{error}</div>}

      <form style={styles.form}>
        <label htmlFor="videoSelect" style={styles.label}>Select a Video:</label>
        <select
          id="videoSelect"
          onChange={handleChange}
          value={selectedVideo}
          style={styles.select}
        >
          {videoList.map((video, idx) => (
            <option key={idx} value={video}>{video}</option>
          ))}
        </select>
      </form>

      {selectedVideo && (
        <div style={styles.videoContainer}>
          <video
            ref={videoRef}
            key={selectedVideo}
            controls
            style={styles.video}
            onError={handleError}
          >
            <source 
              src={`${API}/videos/${selectedVideo}`} 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default App;

const styles = {
  error: {
    color: "#ff6b6b",
    margin: "1rem 0",
    fontSize: "1.1rem",
  },
  app: {
    background: "linear-gradient(to right, #1f1c2c, #928dab)",
    color: "#fff",
    minHeight: "100vh",
    padding: "3rem 1rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "2rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  form: {
    marginBottom: "2rem",
  },
  label: {
    fontSize: "1.2rem",
    marginRight: "1rem",
  },
  select: {
    padding: "0.6rem 1rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "none",
    background: "#fff",
    color: "#333",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    cursor: "pointer",
  },
  videoContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  },
  video: {
    width: "90%",
    maxWidth: "800px",
    borderRadius: "15px",
    border: "4px solid #fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
};