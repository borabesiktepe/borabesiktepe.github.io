import { FEATURED, HOME_SIZES, artImage } from "../../utils/art";
import "../home/home.css";
import "./lab-hero.css";

// Lab only: a copy of the home hero with a variant class, so each fix for the
// name over the dark drawing can be tried without touching the real page.
// The "split" variant adds a second, clipped copy of the name.

const CONTACTS = ["Instagram", "ArtStation", "Email"];

function Name({ className = "" }) {
  return (
    <h1 className={`home-name t-display ${className}`}>
      <span>BORA</span>
      <span>BEŞİKTEPE</span>
    </h1>
  );
}

export default function LabHero({ variant }) {
  return (
    <main className={`home lab-v-${variant}`}>
      <div className="home-panels" aria-hidden="true">
        {FEATURED.map((src, i) => (
          <div key={src} className="home-panel">
            <img
              {...artImage(src)}
              sizes={HOME_SIZES}
              alt=""
              decoding="async"
              draggable={false}
            />
            <span className="home-panel-num t-mono">
              Nº{String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      <div className="home-bottom">
        <div className="lab-name-stack">
          <Name />
          {variant === "split" && <Name className="lab-name-overlay" />}
        </div>

        <div className="home-strip t-mono">
          <span className="home-strip-info">Based in İstanbul</span>
          {CONTACTS.map((label) => (
            <a key={label} href="#" onClick={(e) => e.preventDefault()}>
              {label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
