import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Showcase from "../showcase";
import "./home.css";

// Five featured pieces; the darkest, most finished drawing sits in the centre.
const FEATURED = [
  "/art/NOfW88G.png",
  "/art/i4d67of.jpg",
  "/art/bora-besiktepe-adsiz-resim.jpg",
  "/art/EV7wJGa.png",
  "/art/S6Gf6so.png",
].map((imageUrl, i) => ({
  imageUrl,
  caption: `Featured · Nº${String(i + 1).padStart(2, "0")}`,
}));

const CONTACTS = [
  { label: "Instagram", href: "https://www.instagram.com/borabesiktepe/" },
  { label: "ArtStation", href: "https://www.artstation.com/borabesiktepe" },
  { label: "Email", href: "mailto:borabesiktepe@gmail.com" },
];

function Home() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <motion.main
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="home-panels">
        {FEATURED.map((item, i) => (
          <button
            type="button"
            key={item.imageUrl}
            className="home-panel"
            onClick={() => setOpenIndex(i)}
            aria-label={`View featured artwork ${i + 1} of ${FEATURED.length}`}
          >
            <img src={item.imageUrl} alt="" decoding="async" />
            <span className="home-panel-num t-mono">
              Nº{String(i + 1).padStart(2, "0")}
            </span>
          </button>
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
              {...(c.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {c.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Showcase
            items={FEATURED}
            index={openIndex}
            onIndexChange={setOpenIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default Home;
