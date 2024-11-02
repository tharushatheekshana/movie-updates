import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./SeriesDetails.css";
import Navbar from "../NavBar/Navbar";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";
import { ScaleLoader } from "react-spinners";

function SeriesDetails() {
  const { id } = useParams();

  const [seriesDetails, setSeriesDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [seriesName, setSeriesName] = useState(null);
  const [torrentLinks, setTorrentLinks] = useState([]);
  const [imdbID, setImdbID] = useState(null);
  const [imdbDetails, setImdbDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(true);
  const [isTrailersLoading, setIsTrailersLoading] = useState(true);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
  

  useEffect(() => {
    // setTimeout(() => setLoading(false), 3000);
    // console.log(isDetailsLoading);
    // console.log(isTrailersLoading);
    if (isDetailsLoading && isTrailersLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [seriesDetails, imdbDetails]);

  useEffect(() => {
    fetchSeriesDetails();
  }, [id]);

  useEffect(() => {
    document.body.classList.add("series-details-body");

    if (seriesDetails) {
      document.title = `${seriesDetails.original_name}`;
      const img = new Image();
      img.src = `https://image.tmdb.org/t/p/original${seriesDetails.backdrop_path}`;
      img.onload = () => {
        document.body.style.transition = "background-image 1s ease-in-out";
        document.body.style.backgroundImage = `url(${img.src})`;
      };
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundRepeat = "no-repeat";
    }

    return () => {
      document.body.classList.remove("series-details-body");
      document.body.style.removeProperty("background-image");
      document.body.style.removeProperty("background-size");
      document.body.style.removeProperty("background-position");
      document.body.style.removeProperty("background-attachment");
      document.body.style.removeProperty("background-repeat");
    };
  }, [seriesDetails]);

  useEffect(() => {
    if (imdbDetails?.Title) {
      setSeriesName(imdbDetails.Title);
    }
  }, [imdbDetails, setSeriesName]);

  // useEffect(() => {
  //   if (seriesName) {
  //     document.title = `${seriesName}`;
  //   }
  // }, [seriesName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (seriesDetails?.imdbID) {
      setImdbID(seriesDetails.imdbID);
    }
  }, [seriesDetails]);

  useEffect(() => {
    if (seriesDetails) {
      fetchSeriesTrailers();
    }
  }, [seriesDetails]);

  // useEffect(() => {
  //     if (imdbID) {
  //         fetchTorrentLinks();
  //     }
  // }, [imdbID]);

  async function fetchSeriesDetails() {
    setIsDetailsLoading(true);
    // const toastId = toast.loading("Fetching series details...");

    try {
      // Fetch TMDB series details
      const tmdbResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}`
      );
      setSeriesDetails(tmdbResponse.data);

      // console.log(tmdbResponse.data);
      // const imdbId = tmdbResponse.data.imdb_id;
      // setImdbID(imdbId);
      // console.log(imdbId);
      // console.log(tmdbResponse.data);

      const tmdbExternalIdsResponse = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${TMDB_API_KEY}`
      );
      const imdbId = tmdbExternalIdsResponse.data.imdb_id;
      // console.log(imdbId);

      const omdbResponse = await axios.get(
        `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
      );
      // console.log(omdbResponse.data);
      setImdbDetails(omdbResponse.data);
      // if (omdbResponse.data.Response === "False") {
      //     setSeriesDetails(tmdbResponse.data);
      //     toast.dismiss(toastId);
      // } else {
      //     setSeriesDetails(omdbResponse.data);
      // toast.dismiss(toastId);
      // }
      setIsDetailsLoading(false);
    } catch (error) {
      console.error("Error fetching series details:", error);
      // toast.dismiss(toastId);
    }
  }

  async function fetchSeriesTrailers() {
    setIsTrailersLoading(true);
    try {
      const data = {
        api_key: TMDB_API_KEY,
        language: seriesDetails.original_language || "en-US",
      };
      // console.log(data);
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos`,
        { params: data }
      );
      const trailers = response.data.results.filter(
        (video) => video.type === "Trailer" || video.type === "Teaser"
      );
      if (trailers.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailers[0].key}`);
        setIsTrailersLoading(false);
        return;
      }
      data.language = "en-US";
      const response2 = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos`,
        { params: data }
      );
      const trailers2 = response2.data.results.filter(
        (video) => video.type === "Trailer" || video.type === "Teaser"
      );
      if (trailers2.length > 0) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailers2[0].key}`);
        isTrailersLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching series trailers:", error);
    }
  }

  // const fetchTorrentLinks = async () => {
  //     try {
  //         const response = await axios.get(
  //             `https://yts.mx/api/v2/movie_details.json?imdb_id=${imdbID}`
  //         );
  //         const torrents = response.data.data.movie.torrents;
  //         setTorrentLinks(torrents);
  //     } catch (error) {
  //         console.error("Error fetching torrent links:", error);
  //     }
  // };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="loader">
          <ScaleLoader
            color="#FF5722"
            size={60}
            height={100}
            width={5}
            radius={10}
          />
        </div>
      ) : (
        <div className="seriespage-details-container">
          {seriesDetails && imdbDetails && (
            <div className="seriespage-details-card">
              <h1 className="seriespage-title">
                {imdbDetails.Title || seriesDetails.original_name}
                {/* <span className="year">({movieDetails.Year})</span> */}
              </h1>
              <div className="seriespage-poster">
                <img
                  src={
                    imdbDetails.Poster && imdbDetails.Poster !== "N/A"
                      ? imdbDetails.Poster
                      : `https://image.tmdb.org/t/p/w300${seriesDetails.poster_path}`
                  }
                  alt={imdbDetails.Title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://image.tmdb.org/t/p/w300${seriesDetails.poster_path}`;
                  }}
                />
              </div>
              <div className="seriespage-meta">
                <p>
                  IMDB Rating ⭐️:{" "}
                  {imdbDetails.imdbDetails && imdbDetails.imdbRating !== "N/A"
                    ? imdbDetails.imdbRating
                    : seriesDetails.vote_average}
                  /10
                </p>
                {imdbDetails.imdbRating && imdbDetails.imdbRating !== "N/A" && (
                  <p>
                    ({imdbDetails.imdbRating} based on {imdbDetails.imdbVotes}{" "}
                    user ratings)
                  </p>
                )}
                <p>
                  Release Info:{" "}
                  {imdbDetails.Released && imdbDetails.Released !== "N/A"
                    ? imdbDetails.Released
                    : seriesDetails.first_air_date}
                </p>
                <p>
                  Genre:{" "}
                  {seriesDetails.genres.map((genre) => genre.name).join(", ")}
                </p>
                <p>
                  Language:{" "}
                  {imdbDetails.Language && imdbDetails.Language !== "N/A"
                    ? imdbDetails.Language
                    : seriesDetails.original_language}
                </p>
                <p>
                  Country of Origin:{" "}
                  {imdbDetails.Country && imdbDetails.Country !== "N/A"
                    ? imdbDetails.Country
                    : seriesDetails.origin_country.join(", ")}
                </p>
                <p>
                  Storyline:{" "}
                  {seriesDetails.overview && seriesDetails.overview !== "N/A"
                    ? seriesDetails.overview
                    : imdbDetails.Plot}
                </p>
                <p>Actors: {imdbDetails.Actors}</p>
                <p>
                  Created by:{" "}
                  {seriesDetails.created_by
                    .map((creator) => creator.name)
                    .join(", ")}
                </p>
                <p>
                  Networks:{" "}
                  {seriesDetails.networks
                    .map((network) => network.name)
                    .join(", ")}
                </p>
                <p>
                  Production Companies:{" "}
                  {seriesDetails.production_companies
                    .map((company) => company.name)
                    .join(", ")}
                </p>
                <p>
                  Production Countries:{" "}
                  {seriesDetails.production_countries
                    .map((country) => country.name)
                    .join(", ")}
                </p>
                <div className="last-episode">
                  <h3>
                    Last Episode to Air:{" "}
                    {seriesDetails.last_episode_to_air?.name}
                  </h3>
                  <p>
                    Air Date:{" "}
                    {new Date(
                      seriesDetails.last_episode_to_air?.air_date
                    ).toLocaleDateString()}
                  </p>
                  <p>Overview: {seriesDetails.last_episode_to_air?.overview}</p>
                  <p>
                    Rating: {seriesDetails.last_episode_to_air?.vote_average}
                  </p>
                </div>
                {seriesDetails.next_episode_to_air && (
                  <div className="next-episode">
                    <h3>
                      Next Episode to Air:{" "}
                      {seriesDetails.next_episode_to_air?.name}
                    </h3>
                    <p>
                      Air Date:{" "}
                      {new Date(
                        seriesDetails.next_episode_to_air?.air_date
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Overview: {seriesDetails.next_episode_to_air?.overview}
                    </p>
                  </div>
                )}
                <div className="seasons-info">
                  <h3>Seasons:</h3>
                  {seriesDetails.seasons.map((season) => (
                    <div key={season.id}>
                      <p>
                        Season {season.season_number} - {season.episode_count}{" "}
                        episodes
                      </p>
                      <p>
                        Air Date:{" "}
                        {new Date(season.air_date).toLocaleDateString()}
                      </p>
                      <p>Rating: {season.vote_average}</p>
                    </div>
                  ))}
                </div>
                <p>
                  <a
                    href={seriesDetails.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Website
                  </a>
                </p>
                <a
                  href={`https://www.imdb.com/title/${seriesDetails.external_ids?.imdb_id}`}
                  target="_blank"
                  className="imdb-link"
                >
                  Read More on IMDb{" "}
                </a>
              </div>
            </div>
          )}

          {trailerUrl && (
            <div className="series-trailer-card">
              <>
                <h2>Series Trailer</h2>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${trailerUrl.split("v=")[1]
                    }`} 
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Trailer"
                ></iframe>
              </>
              <div className="torrent-links-card">
              <h2>Torrent Links</h2>
              <ul>
                
                <li>
                  <a
                    href={`https://1337x.to/search/${seriesName.replace(/\s+/g, "+")}/1/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on 1337x
                  </a>
                </li>
                {/* <li>
                  <a
                    href={`https://www.limetorrents.info/search/all/${seriesName.replace(/\s+/g, "+")}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on LimeTorrents
                  </a>
                </li> */}
                <li>
                  <a
                    href={`https://pahe.ink/?s=${seriesName.replace(/\s+/g, "+")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on Pahe Ink
                  </a>
                </li>
                <li>
                  <a
                    href={`https://psa.wf/?s=${seriesName.replace(/\s+/g, "+")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on PSA
                  </a>
                </li>
                <li>
                  <a
                    href={`https://thepiratebay.org/search.php?q=${seriesName.replace(/\s+/g, "+")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on The Pirate Bay
                  </a>
                </li>
                <li>
                  <a
                    href={`https://torrentgalaxy.to/torrents.php?search=${seriesName.replace(/\s+/g, "+")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Search on TorrentGalaxy
                  </a>
                </li>
              </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SeriesDetails;
