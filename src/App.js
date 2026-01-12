import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./App.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [posters, setPosters] = useState({});
  const [error, setError] = useState("");
  const API_BASE ='https://movie-recommendation-system-backend-5b9h.onrender.com'

  const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
  }),
  option: (base, state) => ({
    ...base,
    color: "#000",
    backgroundColor: state.isFocused ? "#eee" : "#fff",
  }),
};

  useEffect(() => {
    axios.get(`${API_BASE}/movies`)
      .then(res => {
        const options = res.data.movies.map(m => ({
          label: m,
          value: m
        }));
        setMovies(options);
      })
      .catch(() => setError("Failed to load movies"));
  }, []);

  const fetchPoster = async (title) => {
    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: {
            api_key: TMDB_API,
            query: title
          }
        }
      );
      return res.data.results[0]?.poster_path
        ? TMDB_IMG + res.data.results[0].poster_path
        : null;
    } catch {
      return null;
    }
  };

  const getRecommendations = async () => {
    if (!selectedMovie) {
      setError("Please select a movie");
      return;
    }

    setError("");
    setRecommendations([]);

    try {
      const res = await axios.post(
        `${API_BASE}/recommend`,
        { movie: selectedMovie.value }
      );

      const recs = res.data.recommended_movies;
      setRecommendations(recs);

      const posterData = {};
      for (let movie of recs) {
        posterData[movie] = await fetchPoster(movie);
      }
      setPosters(posterData);
    } catch {
      setError("Recommendation failed");
    }
  };

  return (
    <div className="app">
      <h1 className="title">🎬 Movie Recommendation System</h1>

      <div className="select-box">
        <Select styles={customStyles}
          options={movies}
          onChange={setSelectedMovie}
          placeholder="Search and select a movie..."
        />
      </div>

      <button className="btn" onClick={getRecommendations}>
        Recommend
      </button>

      {error && <p className="error">{error}</p>}

      <div className="movie-grid">
        {recommendations.map((movie, index) => (
          <div key={index} className="movie-card">
            {posters[movie] ? (
              <img src={posters[movie]} alt={movie} />
            ) : (
              <div className="no-poster">No Poster</div>
            )}
            <p>{movie}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
