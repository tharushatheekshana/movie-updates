import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/Navbar";
import "./Home.css";
import axios from "axios";
import Carousels from "../Components/Carousels/Carousels";
import "react-loading-skeleton/dist/skeleton.css";
import RainbowText from "../Components/RainbowText/RainbowText";
import { BarLoader, BounceLoader, HashLoader } from "react-spinners";
import Footer from "../Footer/Footer";

function Home() {
  const [thisweek, setthisweek] = useState([]);
  const [thisweekmovies, setthisweekmovies] = useState([]);
  const [thisweektv, setthisweektv] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(window.innerHeight);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchThisWeek();
    fetchThisWeekMovies();
    fetchThisWeekTV();
    fetchNowPlaying();
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
  }, []);

  useEffect(() => {
    document.body.classList.add("home-body");
    document.title = "TMIDB";
    return () => {
      document.body.classList.remove("home-body");
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
    });
  };

  const fetchThisWeek = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const results = response.data.results;

    const imagePromises = results
      .slice(0, 2)
      .map((item) =>
        loadImage(`https://image.tmdb.org/t/p/original${item.backdrop_path}`)
      );

    await Promise.all(imagePromises);
    setthisweek(results);
  };

  const fetchThisWeekMovies = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const results = response.data.results;

    const imagePromises = results.map((item) =>
      loadImage(`https://image.tmdb.org/t/p/w300${item.poster_path}`)
    );

    await Promise.all(imagePromises);
    setthisweekmovies(results);
  };

  const fetchThisWeekTV = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const results = response.data.results;

    const imagePromises = results.map((item) =>
      loadImage(`https://image.tmdb.org/t/p/w300${item.poster_path}`)
    );

    await Promise.all(imagePromises);
    setthisweektv(results);
  };

  const fetchNowPlaying = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const results = response.data.results;

    const imagePromises = results.map((item) =>
      loadImage(`https://image.tmdb.org/t/p/w300${item.poster_path}`)
    );

    await Promise.all(imagePromises);
    setNowPlaying(results);
  };

  const fetchPopularMovies = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const results = response.data.results;

    const imagePromises = results.map((item) =>
      loadImage(`https://image.tmdb.org/t/p/w300${item.poster_path}`)
    );

    await Promise.all(imagePromises);
    setPopularMovies(results);
  };

  const fetchTopRatedMovies = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const results = response.data.results;

    const imagePromises = results.map((item) =>
      loadImage(`https://image.tmdb.org/t/p/w300${item.poster_path}`)
    );

    await Promise.all(imagePromises);
    setTopRatedMovies(results);
  };

  const fetchUpcomingMovies = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const results = response.data.results;

    const imagePromises = results.map((item) =>
      loadImage(`https://image.tmdb.org/t/p/w300${item.poster_path}`)
    );

    await Promise.all(imagePromises);
    setUpcomingMovies(results);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchThisWeek(),
        fetchThisWeekMovies(),
        fetchThisWeekTV(),
        fetchNowPlaying(),
        fetchPopularMovies(),
        fetchTopRatedMovies(),
        fetchUpcomingMovies(),
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            marginTop: "-150px",
            position: "relative",
          }}
        >
          <HashLoader color="#FF5722" size={100} />
          <span
            style={{
              position: "absolute",
              fontSize: "2.0rem",
              fontWeight: "bold",
              color: "white",
              marginTop: "200px",
            }}
          >
            TMIDB
          </span>
        </div>
      ) : (
        <>
          <Navbar />
          <Carousels>
            {thisweek.map((movie) => (
              <div key={movie.id}>
                <div className="slide-title">
                  <h1>{movie.title || movie.name}</h1>
                </div>
                <div className="slide-overview">
                  <p>{movie.overview}</p>
                </div>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  onClick={() =>
                    window.open(
                      movie.title
                        ? `#/movies/${movie.id}`
                        : `#/series/${movie.id}`,
                      "_blank"
                    )
                  }
                />
              </div>
            ))}
          </Carousels>
          <div className="home-titles">
            <h1>
              <RainbowText> Trending Movies This Week</RainbowText>
            </h1>
            <p onClick={() => window.open("#/thisweekmovies", "_blank")}>
              SEE ALL
            </p>
          </div>
          <div className="slider-body">
            <div className="slider-wrapper">
              <div className="slider-track">
                {thisweekmovies.slice(0, 20).map((movie, index) => (
                  <div
                    className="slide"
                    key={`${movie.id}-${index}`}
                    onClick={() =>
                      window.open(`#/movies/${movie.id}`, "_blank")
                    }
                  >
                    <img
                      key={movie.id}
                      src={
                        `https://image.tmdb.org/t/p/w300${movie.poster_path}` ||
                        "https://placehold.co/300x450/1A1A1A/FFF?text=TMIDB"
                      }
                      alt={movie.title}
                      className="custom-image"
                    />
                    <p>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div id="trending-tv-shows" className="home-titles">
            <h1>
              <RainbowText>Trending TV Shows This Week</RainbowText>
            </h1>
            <p onClick={() => window.open("#/thisweekseries", "_blank")}>
              SEE ALL
            </p>
          </div>
          <div className="slider-body">
            <div className="slider-wrapper">
              <div className="slider-track">
                {thisweektv.slice(0, 20).map((tv, index) => (
                  <div
                    className="slide"
                    key={`${tv.id}-${index}`}
                    onClick={() => window.open(`#/series/${tv.id}`, "_blank")}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
                      alt={tv.name}
                      className="custom-image"
                    />
                    <p>{tv.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="home-titles">
            <h1>
              <RainbowText> Now Playing in Theaters</RainbowText>
            </h1>
            <p onClick={() => window.open("#/nowplaying", "_blank")}>SEE ALL</p>
          </div>
          <div className="slider-body">
            <div className="slider-wrapper">
              <div className="slider-track">
                {nowPlaying.slice(0, 20).map((movie, index) => (
                  <div
                    className="slide"
                    key={`${movie.id}-${index}`}
                    onClick={() =>
                      window.open(`#/movies/${movie.id}`, "_blank")
                    }
                  >
                    <img
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="custom-image"
                    />
                    <p>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="home-titles">
            <h1>
              <RainbowText>Popular Movies</RainbowText>
            </h1>
            <p onClick={() => window.open("#/popularmovies", "_blank")}>
              SEE ALL
            </p>
          </div>

          <div className="slider-body">
            <div className="slider-wrapper">
              <div className="slider-track">
                {popularMovies.slice(0, 20).map((movie, index) => (
                  <div
                    className="slide"
                    key={`${movie.id}-${index}`}
                    onClick={() =>
                      window.open(`#/movies/${movie.id}`, "_blank")
                    }
                  >
                    <img
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="custom-image"
                    />
                    <p>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="home-titles">
            <h1>
              <RainbowText>Top Rated Movies</RainbowText>
            </h1>
            <p onClick={() => window.open("#/top-rated-movies", "_blank")}>
              SEE ALL
            </p>
          </div>
          <div className="slider-body">
            <div className="slider-wrapper">
              <div className="slider-track">
                {topRatedMovies.slice(0, 20).map((movie, index) => (
                  <div
                    className="slide"
                    key={`${movie.id}-${index}`}
                    onClick={() =>
                      window.open(`#/movies/${movie.id}`, "_blank")
                    }
                  >
                    <img
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="custom-image"
                    />
                    <p>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="home-titles">
            <h1>
              <RainbowText>Upcoming Movies</RainbowText>
            </h1>
            <p onClick={() => window.open("#/upcoming-movies", "_blank")}>
              SEE ALL
            </p>
          </div>
          <div className="slider-body">
            <div className="slider-wrapper">
              <div className="slider-track">
                {upcomingMovies.slice(0, 20).map((movie, index) => (
                  <div
                    className="slide"
                    key={`${movie.id}-${index}`}
                    onClick={() =>
                      window.open(`#/movies/${movie.id}`, "_blank")
                    }
                  >
                    <img
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="custom-image"
                    />
                    <p>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <footer>
            <Footer />
          </footer>
        </>
      )}
    </>
  );
}

export default Home;
