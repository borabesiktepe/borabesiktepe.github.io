import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Artworks from "../artworks";
import SideNavigation from "../side-navigation";
import "./home.css";

const LINKS = [
  { label: "Artworks", to: "/artworks" },
  { label: "About", to: "/about" },
  { label: "Instagram", href: "https://www.instagram.com/borabesiktepe/" },
  { label: "ArtStation", href: "https://www.artstation.com/borabesiktepe" },
];

function Home() {
  return (
    <motion.main
      className="poster-home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SideNavigation />

      <div className="poster-stage">
        <Artworks />

        <div className="poster-top">
          <span className="poster-based">Based in İstanbul</span>
          <span className="poster-issue">Issue Nº01</span>
        </div>

        <div className="poster-bottom">
          <h1 className="poster-name">
            <span>BORA</span>
            <span>BEŞİKTEPE</span>
          </h1>

          <div className="poster-sub">
            <span>Illustrator / Visual Artist</span>
            <span className="poster-rule" aria-hidden="true" />
            <Link className="poster-cta" to="/artworks">
              Explore works <span aria-hidden="true">→</span>
            </Link>
          </div>

          <nav className="poster-links" aria-label="Sections">
            {LINKS.map((link, i) => {
              const text = (
                <>
                  <span className="poster-links-num">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>{" "}
                  {link.label}
                </>
              );
              return link.to ? (
                <Link key={link.label} to={link.to}>
                  {text}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.main>
  );
}

export default Home;
