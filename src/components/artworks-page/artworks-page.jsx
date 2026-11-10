import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../artworks-page/artworks-page.css";
import artworksData from "../artworks-page/artworks.json";
import SideNavigation from "../side-navigation";
import Showcase from "../showcase";

const ALL_YEARS = "all";

const artworks = [...artworksData].sort(
  (a, b) => Number(b.year) - Number(a.year)
);

const years = [...new Set(artworks.map((artwork) => artwork.year))];

const ArtworksPage = () => {
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [openIndex, setOpenIndex] = useState(null);

  const visibleArtworks = useMemo(
    () =>
      selectedYear === ALL_YEARS
        ? artworks
        : artworks.filter((artwork) => artwork.year === selectedYear),
    [selectedYear]
  );

  // Split the visible list into one block per year, keeping each artwork's
  // index in the flat list so the viewer can page through all of them.
  const yearGroups = useMemo(() => {
    const groups = [];
    visibleArtworks.forEach((artwork, index) => {
      let group = groups[groups.length - 1];
      if (!group || group.year !== artwork.year) {
        group = { year: artwork.year, items: [] };
        groups.push(group);
      }
      group.items.push({ artwork, index });
    });
    return groups;
  }, [visibleArtworks]);

  const filters = [ALL_YEARS, ...years];

  return (
    <motion.div
      className="artworks-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <SideNavigation />

      <div className="artworks-content">
        <header className="artworks-header">
          <h1>
            Artworks
            <span className="artworks-count">{visibleArtworks.length}</span>
          </h1>

          <nav className="artworks-filters" aria-label="Filter by year">
            {filters.map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  type="button"
                  key={year}
                  className={isActive ? "is-active" : ""}
                  aria-pressed={isActive}
                  onClick={() => setSelectedYear(year)}
                >
                  {year === ALL_YEARS ? "All" : year}
                  {isActive && (
                    <motion.span
                      className="artworks-filter-indicator"
                      layoutId="artworks-filter-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </header>

        <main className="artworks-main">
          <AnimatePresence mode="popLayout" initial={false}>
            {yearGroups.map((group) => (
              <motion.section
                key={group.year}
                className="artworks-year"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="artworks-yearband" aria-hidden="true">
                  <span>{group.year}</span>
                  <span>{group.year}</span>
                  <span>{group.year}</span>
                </div>
                <h2 className="artworks-year-label">{group.year}</h2>
                <motion.ul className="artworks-grid" layout>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {group.items.map(({ artwork, index }) => (
                      <motion.li
                        key={artwork.imageUrl}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        <button
                          type="button"
                          className="artwork-card"
                          onClick={() => setOpenIndex(index)}
                          aria-label={`Open artwork from ${artwork.date} ${artwork.year}`}
                        >
                          <span className="artwork-card-frame">
                            <img
                              src={artwork.imageUrl}
                              alt={`Bora Beşiktepe, artwork from ${artwork.year}`}
                              loading={index < 8 ? "eager" : "lazy"}
                              decoding="async"
                            />
                          </span>
                          <span className="artwork-card-meta">
                            <span>Nº {String(index + 1).padStart(3, "0")}</span>
                            <span>{artwork.date}</span>
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </motion.section>
            ))}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Showcase
            items={visibleArtworks}
            index={openIndex}
            onIndexChange={setOpenIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ArtworksPage;
