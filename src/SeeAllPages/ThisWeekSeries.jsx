import { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import "./AllPages.css";

function ThisWeekSeries() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  const [series, setSeries] = useState([]);
  const loader = useRef(null);

  useEffect(() => {
    document.body.classList.add("home-pages-body");
    return () => {
      document.body.classList.remove("home-pages-body");
    };
  }, []);

  useEffect(() => {
    fetchSeries();
  }, []);

  async function fetchSeries() {
    const toastId = toast.loading("Fetching series...");

    try {
      const config = {
        params: {
          api_key: TMDB_API_KEY,
        },
      };
      // console.log(config);
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const seriesData = response.data.results.filter(
        (movie) => movie.poster_path
      );

      const loadedImages = seriesData.map((movie) => {
        return new Promise((resolve) => {
          const image = new Image();
          image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
          image.onload = () => resolve(movie);
          image.onerror = () => resolve(null);
        });
      });

      await Promise.all(loadedImages);
      
      setSeries(seriesData);
      toast.dismiss(toastId);
    } catch (error) {
      console.error("Error fetching series:", error);
      toast.dismiss(toastId);
    }
  }

  return (
    <>
      <Navbar />
      <hr className="seeall-line" />
      <h1 className="seeall-heading">This Week Series</h1>
      <hr className="seeall-line" />
      <div>
        <div className="seeall-card-container">
          {series.map((movie, index) => (
            <div
              className="seeall-card"
              key={`${movie.id}-${index}`}
              onClick={() => window.open(`#/series/${movie.id}`, "_blank")}
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

export default ThisWeekSeries;
