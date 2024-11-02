import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import "./AllPages.css";

function PopularMovies() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  const [movies, setMovies] = useState([]);
  const loader = useRef(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("home-pages-body");
    return () => {
      document.body.classList.remove("home-pages-body");
    };
  }, []);

  useEffect(() => {
    fetchMovies(page);
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

  async function fetchMovies(page) {
    if (page === 0) {
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Fetching movies...");

    try {
      const config = {
        params: {
          api_key: TMDB_API_KEY,
          page: page,
        },
      };
      // console.log(config);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const moviesData = response.data.results.filter(
        (movie) => movie.poster_path
      );

      const loadedImages = moviesData.map((movie) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          image.onload = () => resolve(movie);
          image.onerror = () => resolve(null);
        });
      });

      await Promise.all(loadedImages);
      
      setMovies((prev) => [...prev, ...moviesData]);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.dismiss(toastId);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <hr className="seeall-line" />
      <h1 className="seeall-heading">Popular Movies</h1>
      <hr className="seeall-line" />
      <div>
        <div className="seeall-card-container">
          {movies.map((movie, index) => (
            <div
              className="seeall-card"
              key={`${movie.id}-${index}`}
              onClick={() => window.open(`#/movies/${movie.id}`, "_blank")}
            >
              <div className="seeall-image-box">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
              <div className="seeall-content">
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={loader} />
      </div>
    </>
  );
}

export default PopularMovies;
