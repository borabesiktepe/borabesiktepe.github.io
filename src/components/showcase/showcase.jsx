import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./showcase.css";

const SWIPE_DISTANCE = 60;
const SWIPE_SPEED = 0.4; // px per ms

const Showcase = ({ items, index, onIndexChange, onClose }) => {
  const [direction, setDirection] = useState(0);
  const swipeStart = useRef(null);
  const swiped = useRef(false);
  const total = items.length;
  const item = items[index];

  const go = useCallback(
    (step) => {
      setDirection(step);
      onIndexChange((index + step + total) % total);
    },
    [index, total, onIndexChange]
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (!item) return null;

  const stop = (event) => event.stopPropagation();

  return (
    <motion.div
      className="showcase-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Artwork viewer"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="showcase-bar" onClick={stop}>
        <span className="showcase-counter">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="showcase-close"
          onClick={onClose}
          aria-label="Close"
        >
          Close
        </button>
      </div>

      <div
        className="showcase-stage"
        onPointerDown={(event) => {
          swiped.current = false;
          swipeStart.current = {
            x: event.clientX,
            y: event.clientY,
            t: event.timeStamp,
          };
        }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start || total < 2) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          const speed = Math.abs(dx) / Math.max(event.timeStamp - start.t, 1);
          if (Math.abs(dx) < Math.abs(dy)) return;
          if (
            Math.abs(dx) > SWIPE_DISTANCE ||
            (Math.abs(dx) > 20 && speed > SWIPE_SPEED)
          ) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
        onClickCapture={(event) => {
          if (swiped.current) {
            swiped.current = false;
            event.stopPropagation();
          }
        }}
      >
        <motion.img
          key={item.imageUrl}
          src={item.imageUrl}
          alt={item.year ? `Bora Beşiktepe, artwork from ${item.year}` : "Bora Beşiktepe, featured artwork"}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          onClick={stop}
          draggable={false}
        />
      </div>

      <div className="showcase-footer" onClick={stop}>
        {total > 1 && (
          <button
            type="button"
            className="showcase-nav"
            onClick={() => go(-1)}
            aria-label="Previous artwork"
          >
            ←
          </button>
        )}
        <span className="showcase-caption">
          {item.caption ?? `${item.year} · ${item.date}`}
        </span>
        {total > 1 && (
          <button
            type="button"
            className="showcase-nav"
            onClick={() => go(1)}
            aria-label="Next artwork"
          >
            →
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Showcase;
