import { useEffect } from "react";
import "./About.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "../NavBar/Navbar";
import Footer from "../Footer/Footer";

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("about-page");
    document.title = "About";
    return () => {
      document.body.classList.remove("about-page");
    };
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <div className="about-container">
        <h1 className="site-name">Television & Movie Information Database</h1>

        <section className="about-section">
          <h2>About</h2>
          <p>
            Television & Movie Information Database is a web application that
            provides information about movies and TV series. It is a project
            that is built using ReactJS and external APIs to fetch data about
            movies and TV series and display it to the user.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul>
            <li>Search for movies and TV series</li>
            <li>View information about movies and TV series</li>
            <li>View trailers of movies and TV series</li>
            <li>View cast and crew of movies and TV series</li>
            <li>View similar movies and TV series</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>APIs</h2>
          <ul>
            <li>TMDb API</li>
            <li>OMDb API</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Developers</h2>
          <ul>
            <li>Tharusha Theekshana</li>
            <ul className="socials">
              <li className="item">
                <a
                  href="https://github.com/tharushatheekshana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github icon"></i>
                </a>
              </li>
              <li className="item">
                <a
                  href="https://linkedin.com/in/tharushatheekshana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin icon"></i>
                </a>
              </li>
              <li className="item">
                <a
                  href="https://facebook.com/Mr.Theekshana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook icon"></i>
                </a>
              </li>
              <li className="item">
                <a
                  href="https://t.me/tharushatheekshana"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-telegram icon"></i>
                </a>
              </li>
            </ul>
          </ul>
        </section>

        <section className="about-section dis">
          <h2>Disclaimer</h2>
          <p>
            The Television & Movie Information Database web application is a
            project built for educational purposes only. It is not intended for
            commercial use. Please note that this site relies on third-party
            services to fetch data about movies and TV series. In the event that
            these services are unavailable, down, or discontinued, the site's
            functionality may be limited or non-operational. The developers do
            not guarantee the availability of these external services.
          </p>
        </section>

        <section className="about-section">
          <h2>Feedback & Contact</h2>
          <p>
            We welcome any feedback about the Television & Movie Information
            Database web application.
            <br /> Please contact us at the following email address:
            <a href="mailto:email@example.com">
              {" "}
              tharushatheekshana25@gmail.com{" "}
            </a>
            or you can reach out to me via Telegram at{" "}
            <a href="https://t.me/tharushatheekshana">@tharushatheekshana</a>
          </p>
          <p>
            For any inquiries or support, please reach out via the same email.
          </p>
          <h3>Connect With Us</h3>
          <p>Connect with us on social media.</p>
        </section>
      </div>
    </>
  );
}

export default About;
