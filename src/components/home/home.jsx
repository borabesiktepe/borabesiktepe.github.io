import { motion } from "framer-motion";
import Artworks from "../artworks";
import SideNavigation from "../side-navigation";
import "./home.css";

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

        <h1 className="poster-name" aria-label="Bora Beşiktepe">
          <span className="poster-name-first" aria-hidden="true">
            BORA
          </span>
          <span className="poster-name-last" aria-hidden="true">
            BEŞİKTEPE
          </span>
        </h1>

        <span className="poster-label poster-label-issue">Issue Nº01</span>
        <span className="poster-label poster-label-place">
          Illustration · Based in İstanbul
        </span>
      </div>
    </motion.main>
  );
}

export default Home;
