import { useEffect, useRef, useState } from "react";
import "./TVSeries.css";
import axios from "axios";
import Navbar from "../NavBar/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function TVSeries() {
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [series, setSeries] = useState([]);
  const [hasMoreSeries, setHasMoreSeries] = useState(true);

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

  const animatedComponents = makeAnimated();

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

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    document.body.classList.add("series-body");
    document.title = "TV Series";
    return () => {
      document.body.classList.remove("series-body");
      toast.dismiss();
    };
  }, []);

  useEffect(() => {
    // console.log(page);
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading, hasMoreSeries]);

  useEffect(() => {
    fetchSeries(page);
  }, [page]);

  useEffect(() => {
    setHasMoreSeries(true);
    window.scrollTo(0, 0);
    setSeries([]);
    setPage(0);
    fetchSeries(0);
  }, [year, genre, minRating, maxRating, language]);

  async function fetchSeries(page) {
    if (page === 0 || !hasMoreSeries) return;

    setLoading(true);
    const toastId = toast.loading("Fetching series...");

    try {
      const config = {
        params: {
          api_key: TMDB_API_KEY,
          first_air_date_year: year,
          with_genres: genre.join(","),
          "vote_average.gte": minRating,
          "vote_average.lte": maxRating,
          with_original_language: language,
          page: page,
        },
      };
      // console.log(config);
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/tv`,
        config
      );
      const seriesData = response.data.results.filter(
        (movie) => movie.poster_path
      );
      
      if (seriesData.length === 0) {
        toast.warn("No more series to show");
        setHasMoreSeries(false);
        toast.dismiss(toastId);
        return;
      }

      const loadImagePromises = seriesData.map((movie) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
          img.onload = resolve;
        });
      });

      await Promise.all(loadImagePromises);

      setSeries((prevSeries) => [...prevSeries, ...seriesData]);
    } catch (error) {
      console.error("Error fetching series:", error);
      toast.dismiss(toastId);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
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
      const languages = response.data.sort((a, b) =>
        a.english_name.localeCompare(b.english_name)
      );
      setLanguages(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  }

  const fetchSeriesByYear = (selectedOption) => {
    setYear(selectedOption.value);
  };

  const fetchSeriesByGenre = (selectedOptions) => {
    setGenre(selectedOptions.map((option) => option.value));
  };

  const fetchSeriesByRating = (selectedOption) => {
    const [min, max] = selectedOption.value.split("-");
    setMinRating(min);
    setMaxRating(max);
  };

  const fetchSeriesByLanguage = (selectedOption) => {
    setLanguage(selectedOption.value);
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="series-side-nav">
          <p>Series</p>
          <br />

          <div className="conatiner">
            <label>Filter by year</label>
            <br />
            <Select
              defaultValue={year}
              onChange={fetchSeriesByYear}
              options={yearOptions}
              styles={colourStyles}
            />

            <label>Filter by language</label>
            <br />
            <Select
              defaultValue={languages.find(
                (lang) => lang.iso_639_1 === language
              )}
              onChange={fetchSeriesByLanguage}
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
              components={animatedComponents}
              onChange={fetchSeriesByGenre}
              options={genreOptions}
              styles={colourStyles}
            />

            <label>Filter by rating</label>
            <br />
            <Select
              defaultValue={`${minRating}-${maxRating}`}
              onChange={fetchSeriesByRating}
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
          {series.map((tv, index) => (
            <div
              className="series-card"
              key={`${tv.id}-${index}`}
              onClick={() => window.open(`#/series/${tv.id}`, "_blank")}
            >
              <div className="image-box">
                <img
                  src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
                  alt={tv.title}
                  onLoad={() => {
                    if (index === series.length - 1) {
                      setLoading(false);
                    }
                  }}
                />
              </div>
              <div className="content">
                <h2>{tv.name}</h2>
                <p>{tv.overview}</p>
              </div>
            </div>
          ))}
        </div>
        <div ref={loader} />
      </div>
    </>
  );
}

export default TVSeries;
