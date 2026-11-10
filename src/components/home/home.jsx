import { motion } from "framer-motion";
import "./home.css";

// Five featured pieces; the darkest, most finished drawing sits in the centre.
// On the home page the panels are pure display: no click, drag or selection.
const FEATURED = [
  "/art/NOfW88G.png",
  "/art/i4d67of.jpg",
  "/art/bora-besiktepe-adsiz-resim.jpg",
  "/art/EV7wJGa.png",
  "/art/S6Gf6so.png",
];

const CONTACTS = [
  { label: "Instagram", href: "https://www.instagram.com/borabesiktepe/" },
  { label: "ArtStation", href: "https://www.artstation.com/borabesiktepe" },
  { label: "Email", href: "mailto:borabesiktepe@gmail.com" },
];

const preventDrag = (event) => event.preventDefault();

function Home() {
  return (
    <motion.main
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onDragStart={preventDrag}
      onContextMenu={preventDrag}
    >
      <div className="home-panels" aria-hidden="true">
        {FEATURED.map((src, i) => (
          <div key={src} className="home-panel">
            <img src={src} alt="" decoding="async" draggable={false} />
            <span className="home-panel-num t-mono">
              Nº{String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      <div className="home-bottom">
        {/* Capitals in the source keep Ş and İ correct. */}
        <h1 className="home-name t-display">
          <span>BORA</span>
          <span>BEŞİKTEPE</span>
        </h1>

        <div className="home-strip t-mono">
          <span className="home-strip-info">Based in İstanbul</span>
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              draggable={false}
              {...(c.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {c.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

export default Home;
