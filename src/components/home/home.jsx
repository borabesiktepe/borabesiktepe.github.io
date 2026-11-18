import { motion } from "framer-motion";
import { FEATURED, HOME_SIZES, artImage } from "../../utils/art";
import "./home.css";

// Five featured pieces (see utils/art.js); the darkest, most finished drawing
// sits in the centre. On the home page the panels are pure display: no click,
// drag or selection.

const CONTACTS = [
  { label: "Instagram", href: "https://www.instagram.com/borabesiktepe/" },
  { label: "ArtStation", href: "https://www.artstation.com/borabesiktepe" },
  { label: "Email", href: "mailto:borabesiktepe@gmail.com" },
];

const preventDrag = (event) => event.preventDefault();

// Capitals in the source keep Ş and İ correct.
const LINES = ["BORA", "BEŞİKTEPE"];
const ECHOES = 3;

// The name comes in like the repeated lines of a kinetic poster: copies of
// each line (outline, fill, outline) stand stacked above it, then drop into
// it one by one in hard steps and vanish as they land, leaving the name.
function NameLine({ text, line }) {
  return (
    <span className="home-line" aria-label={text}>
      <i className="home-line-real" aria-hidden="true" style={{ "--line": line }}>
        {text}
      </i>
      {Array.from({ length: ECHOES }, (_, k) => (
        <i
          key={k}
          aria-hidden="true"
          className={`home-echo${k % 2 ? "" : " home-echo-outline"}`}
          style={{ "--k": k + 1, "--line": line }}
        >
          {text}
        </i>
      ))}
    </span>
  );
}

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
            <img
              {...artImage(src)}
              sizes={HOME_SIZES}
              alt=""
              decoding="async"
              draggable={false}
            />
            <span className="home-panel-num t-mono">
              Nº{String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      <div className="home-bottom">
        <h1 className="home-name t-display">
          {LINES.map((text, line) => (
            <NameLine key={text} text={text} line={line} />
          ))}
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
