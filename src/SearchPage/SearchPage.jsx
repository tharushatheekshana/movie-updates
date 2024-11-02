import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./SearchPage.css";
import Navbar from "../NavBar/Navbar";
import { toast } from "react-toastify";

const SearchPage = () => {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  const { query } = useParams();

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const loader = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSearchResults([]);
    setPage(0);
    fetchSearchResults();
  }, [query]);

  useEffect(() => {
    document.body.classList.add("search-results-body");

    return () => {
      document.body.classList.remove("search-results-body");
    };
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchSearchResults(page);
    }
  }, [page]);

  useEffect(() => {
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
  }, [loading]);

  function handleObserver(entities) {
    const target = entities[0];
    if (target.isIntersecting && !loading) {
      setPage((prev) => prev + 1);
    }
  }

  const handleClick = (mediaType, id) => {
    if (mediaType === "movie") {
      window.location.href = `#/movies/${id}`;
    } else if (mediaType === "tv") {
      window.location.href = `#/series/${id}`;
    }
  };

  const fetchSearchResults = async (page) => {
    if (page === 0) return;
    setLoading(true);
    const toastId = toast.loading("Fetching search results...");

    try {
      const config = {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          page: page,
        },
      };

      const response = await axios.get(
        "https://api.themoviedb.org/3/search/multi",
        config
      );

      setSearchResults((prevResults) => [
        ...prevResults,
        ...response.data.results,
      ]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch search results!");
      setLoading(false);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="search-results-heading">Search Results for "{query}"</h1>
      <div className="search-results-container">
        <ul>
          {searchResults
            .filter(
              (result) =>
                result.media_type === "movie" || result.media_type === "tv"
            )
            .map((result, index) => (
              <li
                key={index}
                className="result-item"
                onClick={() => handleClick(result.media_type, result.id)}
              >
                <h2 className="result-title">{result.title || result.name}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                  alt={result.title || result.name}
                  className="result-poster"
                />
                <p>{result.overview}</p>
                <p>
                  Release Date: {result.release_date || result.first_air_date}
                </p>
                <p>
                  Rating: {result.vote_average} ({result.vote_count} votes)
                </p>
                <p>Media Type: {result.media_type}</p>
                <p>Language: {result.original_language}</p>
                <p>ID: {result.id}</p>
              </li>
            ))}
        </ul>
        <div ref={loader} />
      </div>
    </>
  );
};

export default SearchPage;
