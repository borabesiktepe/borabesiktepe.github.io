import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./loader.css";

// Loader after a kinetic poster: rows of LOADING in wide caps run left and
// right through one standing wave, every other row mirrored and tilted the
// other way so the stack zigzags like a Z, and the whole stack slowly sinks.
// Each row is a strip of black tape whose words alternate solid and
// outlined. The home page's panel rules draw in as the images load. At
// 100% the strips are cut away one by one, bottom up, each snapping shut
// in three hard steps; then the sheet is gone in one frame and the home
// page's panels drop in.

// Eight rows on a wide screen; a tall phone gets more, smaller rows so the
// letters are not cut to a few giant ones.
function rowCount() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const bar = w <= 820 ? 48 : 56;
  const font = Math.min(((h - bar) / 8) * 0.86, w * 0.12);
  return Math.max(8, Math.round((h - bar) / (font / 0.86)));
}
const PHRASE = "LOADING ";
const COPIES = 8; // phrases per row: enough to cover the widest screen twice
// Extra rows waiting above the screen: the stack slowly sinks, so these
// come into view while the loader runs.
const ABOVE = 6;

// Three hard steps, like the name's echoes landing.
const hard = (t) => Math.min(1, Math.ceil(t * 3) / 3);

const SHEET = { gone: {} };
// Strips go bottom up over 0.4s, timed by where each one sits on screen at
// that moment (the stack has been sinking), so rows still above the screen
// add no wait.
const STRIP = {
  gone: (el) => {
    const r = el.current?.getBoundingClientRect();
    const h = window.innerHeight;
    const up = r ? Math.min(1, Math.max(0, (h - r.bottom) / h)) : 0;
    return { scaleY: 0, transition: { duration: 0.24, ease: hard, delay: up * 0.4 } };
  },
};

function Row({ r }) {
  const el = useRef(null);
  return (
    <motion.div
      ref={el}
      custom={el}
      className={`loader-row${r % 2 ? " loader-mirror" : ""}`}
      variants={STRIP}
    >
      <div className="loader-track">
        {Array.from({ length: COPIES }, (_, c) => (
          <span key={c} className={c % 2 ? "loader-phrase loader-hollow" : "loader-phrase"}>
            {[...PHRASE].map((ch, i) => (
              <i
                key={i}
                className={ch === " " ? "loader-ch loader-sp" : "loader-ch"}
                style={{ "--i": i }}
              >
                {ch === " " ? "" : ch}
              </i>
            ))}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Loader({ progress }) {
  const root = useRef(null);
  const [rows, setRows] = useState(rowCount);

  // Two phrases (one solid, one outlined) make one loop, so the loop is
  // seamless and the wave stays put while the letters run through it.
  useLayoutEffect(() => {
    const el = root.current;
    const measure = () => {
      const p = el.querySelectorAll(".loader-phrase");
      if (p[2]) {
        el.style.setProperty("--pw", `${p[2].offsetLeft - p[0].offsetLeft}px`);
      }
    };
    const onResize = () => {
      setRows(rowCount());
      measure();
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.div
      ref={root}
      className="loader"
      role="status"
      aria-live="polite"
      aria-label={`Loading, ${progress}%`}
      variants={SHEET}
      exit="gone"
      style={{
        "--rows": rows,
        "--above": ABOVE,
        "--step": `${360 / PHRASE.length}deg`,
      }}
    >
      <div className="loader-top t-mono">
        <span>Portfolio · 2019—2026</span>
        <span className="loader-pct">
          Loading {String(progress).padStart(3, "0")}%
        </span>
      </div>
      {/* The home page's four panel rules draw in
          as the images load, under the LOADING rows. */}
      <div className="loader-rules" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <motion.i
            key={i}
            style={{ left: `${(i + 1) * 20}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress >= (i + 1) * 20 ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0.05, 0.12, 0.99] }}
          />
        ))}
      </div>
      <div className="loader-rows" aria-hidden="true">
        {Array.from({ length: rows + ABOVE }, (_, r) => (
          <Row key={r} r={r} />
        ))}
      </div>
    </motion.div>
  );
}
