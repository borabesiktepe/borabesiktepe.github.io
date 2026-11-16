import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "../loader";
import "./lab-loader.css";

// Lab only: the site's loader on repeat with a fake load.

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
        {shown && <Loader key={run} progress={progress} />}
      </AnimatePresence>
    </div>
  );
}
