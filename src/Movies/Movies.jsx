import { useEffect, useRef, useState } from "react";
import "./Movies.css";
import axios from "axios";
import Navbar from "../NavBar/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;


function Movies() {
  const [movies, setMovies] = useState([]);
  const [year, setYear] = useState(null);
  const [genre, setGenre] = useState([]);
  const [vote_average, setRating] = useState(1);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moviesData, setMoviesData] = useState([]);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [page, setPage] = useState(0);
  const loader = useRef(null);

  // const genreMap = {
  //   Action: 28,
  //   Adventure: 12,
  //   Animation: 16,
  //   Comedy: 35,
  //   Crime: 80,
  //   Documentary: 99,
  //   Drama: 18,
  //   Family: 10751,
  //   Fantasy: 14,
  //   History: 36,
  //   Horror: 27,
  //   Music: 10402,
  //   Mystery: 9648,
  //   Romance: 10749,
  //   "Science Fiction": 878,
  //   "TV Movie": 10770,
  //   Thriller: 53,
  //   War: 10752,
  //   Western: 37,
  // };

  const genreOptions = [
    { value: 28, label: "Action" },
    { value: 12, label: "Adventure" },
    { value: 16, label: "Animation" },
    { value: 35, label: "Comedy" },
    { value: 80, label: "Crime" },
    { value: 99, label: "Documentary" },
    { value: 18, label: "Drama" },
    { value: 10751, label: "Family" },
    { value: 14, label: "Fantasy" },
    { value: 36, label: "History" },
    { value: 27, label: "Horror" },
    { value: 10402, label: "Music" },
    { value: 9648, label: "Mystery" },
    { value: 10749, label: "Romance" },
    { value: 878, label: "Science Fiction" },
    { value: 10770, label: "TV Movie" },
    { value: 53, label: "Thriller" },
    { value: 10752, label: "War" },
    { value: 37, label: "Western" },
  ];

  const yearOptions = [
    { label: "All", value: "" },
    ...Array.from({ length: 137 }, (_, i) => {
      const year = 2024 - i;
      return { label: year.toString(), value: year.toString() };
    }),
  ];

  const colourStyles = {
    option: (styles) => ({
      ...styles,
      color: "black",
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "rosybrown",
      color: "black",
    }),
  };

  const animatedComponents = makeAnimated();

  useEffect(() => {
    fetchLanguages(); 
  }, []);

  useEffect(() => {
    document.body.classList.add("movies-body");
    document.title = "Movies";
    return () => {
      document.body.classList.remove("movies-body");
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  useEffect(() => {
    setHasMoreMovies(true);
    // handleObserver([{ isIntersecting: true }]);
    // console.log('setting movies');
    window.scrollTo(0, 0);
    setMovies([]);
    setPage(0);
    fetchMovies(0);
  }, [year, genre, minRating, maxRating, language]);

  useEffect(() => {
    // console.log(page);
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading, hasMoreMovies]);

  function handleObserver(entities) {
    const target = entities[0];
    if (target.isIntersecting && !loading /* && hasMoreMovies */) {
      setPage((prevPage) => prevPage + 1);
    }
  }

  const fetchMoviesByYear = (selectedOption) => {
    setYear(selectedOption.value);
  };

  const fetchMoviesByGenre = (selectedOptions) => {
    setGenre(selectedOptions.map((option) => option.value));
  };

  const fetchMoviesByRating = (selectedOption) => {
    const [min, max] = selectedOption.value.split("-");
    setMinRating(min);
    setMaxRating(max);
  };

  const fetchMoviesByLanguage = (selectedOption) => {
    setLanguage(selectedOption.value);
  };

  async function fetchMovies(page) {
    if (page === 0 || !hasMoreMovies) return;

    setLoading(true);
    const toastId = toast.loading("Fetching movies...");

    try {
      const config = {
        params: {
          api_key: TMDB_API_KEY,
          primary_release_year: year,
          with_genres: genre.join(","),
          "vote_average.gte": minRating,
          "vote_average.lte": maxRating,
          with_original_language: language,
          page: page,
        },
      };

      // console.log(config);
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie`,
        config
      );
      const moviesData = response.data.results.filter(
        (movie) => movie.poster_path
      );
      setMoviesData(moviesData);
      if (moviesData.length === 0) {
        toast.dismiss(toastId);
        setHasMoreMovies(false);
        toast.warn("No more movies to show");
        return;
      }

      const loadImagePromises = moviesData.map((movie) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          img.onload = resolve;
        });
      });

      await Promise.all(loadImagePromises);

      setMovies((prevMovies) => [...prevMovies, ...moviesData]);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.dismiss(toastId);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }

  async function fetchLanguages() {
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/configuration/languages",
        {
          params: { api_key: TMDB_API_KEY },
        }
      );
      response.data.sort((a, b) =>
        a.english_name.localeCompare(b.english_name)
      );
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  }

  return (
    <>
      <Navbar />
      <div>
        <div className="movies-side-nav">
          <p>Movies</p>
          <br />

          <div className="container">
            <label>Filter by year</label>
            <br />
            <Select
              defaultValue={year}
              onChange={fetchMoviesByYear}
              options={yearOptions}
              styles={colourStyles}
            />

            <label>Filter by language</label>
            <br />
            <Select
              defaultValue={languages.find(
                (lang) => lang.iso_639_1 === language
              )}
              onChange={fetchMoviesByLanguage}
              options={[
                { value: "", label: "All" },
                ...languages.map((lang) => ({
                  value: lang.iso_639_1,
                  label: lang.english_name,
                })),
              ]}
              styles={colourStyles}
            />

            <label>Filter by genre</label>
            <br />
            <Select
              isMulti
              defaultValue={genre}
              onChange={fetchMoviesByGenre}
              options={genreOptions}
              styles={colourStyles}
              components={animatedComponents}
            />

            <label>Filter by rating</label>
            <br />
            <Select
              defaultValue={`${minRating}-${maxRating}`}
              onChange={fetchMoviesByRating}
              options={[
                { value: "0", label: "All" },
                { value: "1-2", label: "1 - 2" },
                { value: "2-3", label: "2 - 3" },
                { value: "3-4", label: "3 - 4" },
                { value: "4-5", label: "4 - 5" },
                { value: "5-6", label: "5 - 6" },
                { value: "6-7", label: "6 - 7" },
                { value: "7-8", label: "7 - 8" },
                { value: "8-9", label: "8 - 9" },
                { value: "9-10", label: "9 - 10" },
              ]}
              styles={colourStyles}
            />
          </div>
        </div>

        <div className="card-container">
          {movies.map((movie, index) => (
            <div
              className="movie-card"
              key={`${movie.id}-${index}`}
              // onClick={() => (window.location.href = `#/movies/${movie.id}`)}
              onClick={() => window.open(`#/movies/${movie.id}`, "_blank")}
            >
              <div className="image-box">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
              <div className="content">
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={loader} />
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Movies;
