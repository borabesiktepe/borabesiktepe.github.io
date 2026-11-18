import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./loader.css";

// Loader after a kinetic poster: rows of LOADING in wide caps run left and
// right through one standing wave, every other row mirrored and tilted the
// other way so the stack zigzags like a Z, and the whole stack slowly sinks.
// Each row is a strip of black tape whose words alternate solid and
// outlined. The home page's panel rules draw in as the images load, and at
// 100% the sheet is wiped away upward to show the home page.

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

function Row({ r }) {
  return (
    <div className={`loader-row${r % 2 ? " loader-mirror" : ""}`}>
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
    </div>
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
      exit={{
        clipPath: "inset(0 0 100% 0)",
        transition: { duration: 0.6, ease: [0.65, 0.05, 0.12, 0.99] },
      }}
      initial={{ clipPath: "inset(0 0 0% 0)" }}
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
