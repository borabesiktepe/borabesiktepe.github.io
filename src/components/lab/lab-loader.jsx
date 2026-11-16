import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./lab-loader.css";

// Lab only: a loader after the kinetic ribbon reference. Rows of LOADING in
// wide caps run left and right through one standing wave, every other row
// mirrored, each row tilted the other way so the stack zigzags like a Z,
// and the whole stack slowly sinks. Each row is a strip of black tape like
// the live loader's, and its words alternate solid and outlined like that
// tape's; the panel rules and the percentage show the progress.

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
    <div className={`ll-row${r % 2 ? " ll-mirror" : ""}`}>
      <div className="ll-track">
        {Array.from({ length: COPIES }, (_, c) => (
          <span key={c} className={c % 2 ? "ll-phrase ll-hollow" : "ll-phrase"}>
            {[...PHRASE].map((ch, i) => (
              <i
                key={i}
                className={ch === " " ? "ll-ch ll-sp" : "ll-ch"}
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

function KineticLoader({ progress }) {
  const root = useRef(null);
  const [rows, setRows] = useState(rowCount);

  // Two phrases (one solid, one outlined) make one loop, so the loop is
  // seamless and the wave stays put while the letters run through it.
  useLayoutEffect(() => {
    const el = root.current;
    const measure = () => {
      const p = el.querySelectorAll(".ll-phrase");
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
      className="ll"
      role="status"
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
      <div className="ll-top t-mono">
        <span>Portfolio · 2019—2026</span>
        <span className="ll-pct">
          Loading {String(progress).padStart(3, "0")}%
        </span>
      </div>
      {/* The live loader's sheet: the home page's four panel rules draw in
          as the images load, under the LOADING rows. */}
      <div className="ll-rules" aria-hidden="true">
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
      <div className="ll-rows" aria-hidden="true">
        {Array.from({ length: rows + ABOVE }, (_, r) => (
          <Row key={r} r={r} />
        ))}
      </div>
    </motion.div>
  );
}

// Fakes a load from 0 to 100% in uneven steps, exits, and starts again, so
// the whole cycle can be watched on repeat.
export default function LabLoader() {
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    setProgress(0);
    setShown(true);
    const timers = [];
    let t = 300;
    let p = 0;
    while (p < 100) {
      p = Math.min(100, p + 6 + Math.round(Math.random() * 14));
      const v = p;
      t += 120 + Math.random() * 260;
      timers.push(setTimeout(() => setProgress(v), t));
    }
    timers.push(setTimeout(() => setShown(false), t + 700));
    timers.push(setTimeout(() => setRun((n) => n + 1), t + 2200));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return (
    <div className="ll-stage">
      <p className="ll-under t-mono">Ana sayfa burada açılır</p>
      <AnimatePresence>
        {shown && <KineticLoader key={run} progress={progress} />}
      </AnimatePresence>
    </div>
  );
}
