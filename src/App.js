import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  // Fetch movie list on page load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.movies))
      .catch(() => setError("Failed to load movies"));
  }, []);

  const getRecommendations = async () => {
    if (!selectedMovie) {
      setError("Please select a movie");
      return;
    }

    setError("");
    setRecommendations([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ movie: selectedMovie })
      });

      const data = await response.json();
      setRecommendations(data.recommended_movies);
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🎬 Movie Recommendation System</h1>

      <select
        value={selectedMovie}
        onChange={(e) => setSelectedMovie(e.target.value)}
        style={{ padding: "10px", width: "320px" }}
      >
        <option value="">-- Select a movie --</option>
        {movies.map((movie, index) => (
          <option key={index} value={movie}>
            {movie}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={getRecommendations} style={{ padding: "10px 20px" }}>
        Recommend
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {recommendations.map((m, index) => (
          <li key={index}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
