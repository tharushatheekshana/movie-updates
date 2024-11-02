import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./MovieDetails.css";
import Navbar from "../NavBar/Navbar";
import RainbowText from "../Components/RainbowText/RainbowText";
import Footer from "../Footer/Footer";
import { ScaleLoader } from "react-spinners";

function MovieDetails() {
  const { id } = useParams();

  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [movieName, setMovieName] = useState(null);
  const [torrentLinks, setTorrentLinks] = useState([]);
  const [imdbID, setImdbID] = useState(null);
  const [tmdbMovieDetails, setTmdbMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  useEffect(() => {
    if (tmdbMovieDetails) {
      fetchTrailerUrl();
    }
  }, [tmdbMovieDetails]);

  useEffect(() => {
    document.body.classList.add("movie-details-body");

    if (movieDetails) {
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${tmdbMovieDetails.backdrop_path}`;
      img.onload = () => {
        document.body.style.transition = "background-image 1s ease-in-out";
        document.body.style.backgroundImage = `url(${img.src})`;
      };
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundAttachment = "fixed";
    }

    window.scrollTo(0, 0);

    return () => {
      document.body.classList.remove("movie-details-body");
      document.body.style.removeProperty("background-image");
      document.body.style.removeProperty("background-size");
      document.body.style.removeProperty("background-position");
      document.body.style.removeProperty("background-repeat");
      document.body.style.removeProperty("background-attachment");
    };
  }, [movieDetails]);

  useEffect(() => {
    if (movieDetails?.Title) {
      setMovieName(movieDetails.Title);
      document.title = movieDetails.Title;
    }

    if (movieDetails?.imdbID) {
      setImdbID(movieDetails.imdbID);
    }
  }, [movieDetails]);

  useEffect(() => {
    if (imdbID) {
      fetchTorrentLinks();
    }
  }, [imdbID]);

  // useEffect(() => {
  //   if (posterLoaded && videoLoaded) {
  //     setLoading(false);
  //   }
  // }, [posterLoaded, videoLoaded]);

  async function fetchMovieDetails() {
    try {
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
      );
      const imdbId = tmdbResponse.data.imdb_id;
      setImdbID(imdbId);
      setTmdbMovieDetails(tmdbResponse.data);

      const omdbResponse = await axios.get(
        `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
      );
      if (omdbResponse.data.Response === "False") {
        setMovieDetails(tmdbResponse.data);
      } else {
        setMovieDetails(omdbResponse.data);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }

  async function fetchTorrentLinks() {
    try {
      const response = await axios.get(
        `https://yts.mx/api/v2/movie_details.json?imdb_id=${imdbID}`
      );
      const torrents = response.data.data.movie.torrents;
      setTorrentLinks(torrents);
    } catch (error) {
      console.error("Error fetching torrent links:", error);
    }
  }

  async function fetchTrailerUrl() {
    try {
      const data = {
        api_key: TMDB_API_KEY,
        language: tmdbMovieDetails.original_language || "en-US",
      };

      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        { params: data }
      );
      const trailers = response.data.results
        .filter((video) => video.type === "Trailer" || video.type === "Teaser")
        .sort((a, b) => (a.type === "Trailer" ? -1 : 1));
      if (trailers.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailers[0].key}`);
        return;
      }

      data.language = "en-US";
      const englishResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        { params: data }
      );
      const englishTrailers = englishResponse.data.results;
      if (englishTrailers.length > 0) {
        setTrailerUrl(
          `https://www.youtube.com/watch?v=${englishTrailers[0].key}`
        );
        return;
      }
    } catch (error) {
      console.error("Error fetching trailer URL:", error);
    }
  }

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="loader">
          <ScaleLoader color="#FF5722" height={100} width={5} radius={10} />
        </div>
      ) : (
        <div className="moviepage-details-container">
          {movieDetails && (
            <div className="moviepage-details-card">
              <h1 className="moviepage-title">
                <RainbowText>
                  {movieDetails.Title || tmdbMovieDetails.title}
                </RainbowText>
              </h1>
              <div className="moviepage-poster">
                <img
                  src={
                    movieDetails.Poster ||
                    `https://image.tmdb.org/t/p/w300${tmdbMovieDetails.poster_path}`
                  }
                  alt={movieDetails.Title}
                  onLoad={() => setPosterLoaded(true)}
                />
                {/* {console.log(posterLoaded)} */}
              </div>
              <div className="moviepage-meta">
                <p>
                  IMDB Rating ⭐️:{" "}
                  {movieDetails.imdbRating && movieDetails.imdbRating !== "N/A"
                    ? movieDetails.imdbRating
                    : tmdbMovieDetails.vote_average}
                  /10
                </p>
                {movieDetails.imdbRating &&
                  movieDetails.imdbRating !== "N/A" && (
                    <p>
                      ({movieDetails.imdbRating} based on{" "}
                      {movieDetails.imdbVotes} user ratings) |{" "}
                      {movieDetails.Rated} | {movieDetails.Runtime}
                    </p>
                  )}
                <p>
                  Release Info:{" "}
                  {movieDetails.Released && movieDetails.Released !== "N/A"
                    ? movieDetails.Released
                    : tmdbMovieDetails.release_date}
                </p>
                <p>
                  Genre:{" "}
                  {movieDetails.Genre && movieDetails.Genre !== "N/A"
                    ? movieDetails.Genre
                    : tmdbMovieDetails.genres
                        .map((genre) => genre.name)
                        .join(", ")}
                </p>
                <p>
                  Language:{" "}
                  {movieDetails.Language && movieDetails.Language !== "N/A"
                    ? movieDetails.Language
                    : tmdbMovieDetails.original_language}
                </p>
                <p>
                  Country of Origin:{" "}
                  {movieDetails.Country && movieDetails.Country !== "N/A"
                    ? movieDetails.Country
                    : tmdbMovieDetails.origin_country.join(", ")}
                </p>
                <p>
                  Storyline:{" "}
                  {movieDetails.Plot && movieDetails.Plot !== "N/A"
                    ? movieDetails.Plot
                    : tmdbMovieDetails.overview}
                </p>
                {movieDetails.Title && movieDetails.Title !== "N/A" && (
                  <div>
                    <p>Directors: {movieDetails.Director}</p>
                    <p>Writers: {movieDetails.Writer}</p>
                    <p>Stars: {movieDetails.Actors}</p>
                  </div>
                )}
                <a
                  href={`https://www.imdb.com/title/${movieDetails.imdbID} `}
                  target="_blank"
                  className="imdb-link"
                >
                  Read More on IMDb{" "}
                </a>
              </div>
            </div>
          )}

          <div className="movie-trailer-card">
            {trailerUrl && (
              <>
                <h2>Movie Trailer</h2>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${
                    trailerUrl.split("v=")[1]
                  }`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Trailer"
                  onLoad={() => setVideoLoaded(true)}
                ></iframe>
                {/* {console.log(videoLoaded)} */}
              </>
            )}
            {torrentLinks && torrentLinks.length > 0 && (
              <div className="torrent-links">
                <>
                  <h2>Download Torrents</h2>
                  <ul>
                    {torrentLinks.map((torrent) => (
                      <li key={torrent.url}>
                        <a
                          href={torrent.url}
                          /*target="_blank"*/ rel="noreferrer"
                        >
                          {torrent.quality} {torrent.video_codec} {torrent.type}{" "}
                          {torrent.size}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              </div>
            )}
            {/* {movieDetails.language == "ta" && (
              <>
                <p>Download links are available in the respective language</p>
                <a href={`https://www.1tamilmv.org/index.php?/search/&q=${movieName}`} target="_blank">Click here to download</a>
              </>
            )} */}
          </div>
        </div>
      )}
    </>
  );
}

export default MovieDetails;
