import { motion } from "framer-motion";
import artworks from "../artworks-page/artworks.json";
import "./about.css";

const CONTACTS = [
  { label: "Email", href: "mailto:borabesiktepe@gmail.com" },
  { label: "Instagram", href: "https://www.instagram.com/borabesiktepe/" },
  { label: "ArtStation", href: "https://www.artstation.com/borabesiktepe" },
];

// The bio set as a poster. Display words are written in capitals in the
// source so Turkish İ stays correct (CSS uppercasing would give I).
const About = () => (
  <motion.main
    className="about"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="about-sr">About Bora Beşiktepe</h1>

    <p
      className="about-manifesto"
      aria-label="Self-taught illustrator and engineer, drawing digital portraits, from İstanbul, Türkiye."
    >
      <span className="about-line" aria-hidden="true">
        <b className="about-box">SELF-TAUGHT</b> <i>illustrator</i>
      </span>
      <span className="about-line" aria-hidden="true">
        <i>&amp;</i> ENGINEER <i>drawing</i>
      </span>
      <span className="about-line" aria-hidden="true">
        <b className="about-box">DIGITAL</b> PORTRAITS
      </span>
      <span className="about-line" aria-hidden="true">
        <i>from</i> İSTANBUL,
      </span>
      <span className="about-line" aria-hidden="true">
        TÜRKİYE.
      </span>
    </p>

    <div className="about-strip t-mono">
      <span className="about-strip-info">
        {artworks.length} works · © {new Date().getFullYear()}
      </span>
      {CONTACTS.map((c) => (
        <a
          key={c.label}
          href={c.href}
          {...(c.href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
        >
          {c.label} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  </motion.main>
);

export default About;
