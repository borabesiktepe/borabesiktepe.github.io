import { motion } from "framer-motion";
import "./loader.css";

// Loader: the home page's panel rules draw in as images load, while a black
// barrier tape reading LOADING runs across the middle. At 100% the tape is
// pulled away to the right and the sheet fades into the home page, whose
// panels sit on the same rules.
const RULES = 4; // dividing lines between the five home panels
const WORDS = Array.from({ length: 8 });

const Loader = ({ progress }) => (
  <motion.div
    className="loader"
    role="status"
    aria-live="polite"
    aria-label={`Loading, ${progress}%`}
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { delay: 0.45, duration: 0.35 } }}
  >
    <div className="loader-top t-mono">
      <span>Portfolio · 2019—2026</span>
      <span className="loader-pct">
        Loading {String(progress).padStart(3, "0")}%
      </span>
    </div>

    <div className="loader-rules" aria-hidden="true">
      {Array.from({ length: RULES }).map((_, i) => (
        <motion.i
          key={i}
          style={{ left: `${(i + 1) * 20}%` }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: progress >= (i + 1) * 20 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.65, 0.05, 0.12, 0.99] }}
        />
      ))}
    </div>

    <motion.div
      className="loader-band"
      aria-hidden="true"
      exit={{
        x: "120%",
        transition: { duration: 0.5, ease: [0.65, 0.05, 0.12, 0.99] },
      }}
    >
      <div className="loader-track">
        {WORDS.map((_, i) =>
          i % 2 ? <b key={i}>LOADING</b> : <span key={i}>LOADING</span>
        )}
      </div>
      <div
        className="loader-fill"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </motion.div>
  </motion.div>
);

export default Loader;
