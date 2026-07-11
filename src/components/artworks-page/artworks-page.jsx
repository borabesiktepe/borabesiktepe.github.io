import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../artworks-page/artworks-page.css";
import artworksData from "../artworks-page/artworks.json";
import SideNavigation from "../side-navigation";
import Showcase from "../showcase";

const ALL_YEARS = "all";

const ArtworksPage = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);

  const years = useMemo(
    () => [...new Set(artworksData.map((artwork) => artwork.year))].sort(
      (a, b) => Number(b) - Number(a),
    ),
    [],
  );

  const visibleYears = selectedYear === ALL_YEARS ? years : [selectedYear];

  return (
    <motion.div
      className="artworks-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <SideNavigation />

      <aside className="artworks-index" aria-label="Artwork filters">
        <h1>ARTWORKS</h1>

        <div className="artworks-filters">
          <button
            type="button"
            className={selectedYear === ALL_YEARS ? "is-active" : ""}
            onClick={() => setSelectedYear(ALL_YEARS)}
          >
            All
          </button>

          {years.map((year) => (
            <button
              type="button"
              key={year}
              className={selectedYear === year ? "is-active" : ""}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

      </aside>

      <main className="artworks-main">
          <div className="artworks-groups">
            {visibleYears.map((year) => {
              const yearArtworks = artworksData.filter(
                (artwork) => artwork.year === year,
              );

              return (
                <section className="artwork-year-group" key={year}>
                  <header className="artwork-year-header">
                    <h2>{year}</h2>
                    <div className="artwork-timeline" aria-hidden="true">
                      <span className="artwork-timeline-line" />
                    </div>
                  </header>

                  <div className="artworks-gallery">
                    {yearArtworks.map((artwork, index) => (
                      <motion.button
                        type="button"
                        className="gallery-item"
                        key={artwork.imageUrl}
                        onClick={() => setSelectedArtwork(artwork.imageUrl)}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(index * 0.06, 0.3),
                        }}
                        aria-label={`${year} tarihli eseri aç, ${artwork.date}`}
                      >
                        <img
                          src={artwork.imageUrl}
                          alt={`Bora Beşiktepe, ${year} tarihli eser`}
                          loading="lazy"
                        />
                        <span className="gallery-item-date">{artwork.date}</span>
                      </motion.button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
      </main>

      <AnimatePresence>
        {selectedArtwork && (
          <Showcase
            imageUrl={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
            key={selectedArtwork}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArtworksPage;
