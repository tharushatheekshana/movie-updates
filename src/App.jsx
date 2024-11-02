import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Movies from "./Movies/Movies";
import TVSeries from "./TVSeries/TVSeries";
import MovieDetails from "./Movie/MovieDetails";
import { ToastContainer } from "react-toastify";
import SeriesDetails from "./Series/SeriesDetails";
import SearchPage from "./SearchPage/SearchPage";
import ThisWeekMovies from "./SeeAllPages/ThisWeekMovies";
import ThisWeekSeries from "./SeeAllPages/ThisWeekSeries";
import PopularMovies from "./SeeAllPages/PopularMovies";
import NowPlaying from "./SeeAllPages/NowPlaying";
import TopRatedMovies from "./SeeAllPages/TopRatedMovies";
import UpcomingMovies from "./SeeAllPages/UpcomingMovies";
import Carousels from "./Components/Carousels/Carousels";
import About from "./About/About";
import Offline from "./Components/Offline/Offline";
import Mobile from "./Components/Mobile/Mobile";
import Footer from "./Footer/Footer";
import Navbar from "./NavBar/Navbar";

function App() {
  return (
    <>
      <Offline>
        <Mobile>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<TVSeries />} />
              <Route path="/movies/:id" element={<><MovieDetails /><Footer /></>} />
              <Route path="/series/:id" element={<><SeriesDetails /><Footer /></>} />
              <Route path="/search/:query" element={<SearchPage />} />
              <Route path="/thisweekmovies" element={<ThisWeekMovies />} />
              <Route path="/thisweekseries" element={<ThisWeekSeries />} />
              <Route path="/nowplaying" element={<NowPlaying />} />
              <Route path="/popularmovies" element={<PopularMovies />} />
              <Route path="/popularseries" element={<ThisWeekMovies />} />
              <Route path="/top-rated-movies" element={<TopRatedMovies />} />
              <Route path="/top-rated-series" element={<ThisWeekMovies />} />
              <Route path="/upcoming-movies" element={<UpcomingMovies />} />
              <Route path="/carousel" element={<Carousels />} />
              <Route path="/about" element={<><Navbar/><About /><Footer /></>} />
            </Routes>
          </HashRouter>
        </Mobile>
      </Offline>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "white",
          color: "#333",
        }}
      />
    </>
  );
}

export default App;
