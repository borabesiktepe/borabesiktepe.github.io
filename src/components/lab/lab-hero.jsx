import { FEATURED, HOME_SIZES, artImage } from "../../utils/art";
import "../home/home.css";
import "./lab-hero.css";

// Lab only: a copy of the home hero with a variant class, so each entrance
// for the name can be tried without touching the real page. Some variants
// animate letter by letter, so each line can be split into letters.

const CONTACTS = ["Instagram", "ArtStation", "Email"];
const LINES = ["BORA", "BEŞİKTEPE"];
const SPLIT = new Set(["letters", "stamp", "wave", "outline", "lens"]);
const ECHOES = 3;
const REEL = ["fill", "outline", "fill", "outline"];

function Line({ text, line, split, sliced, variant }) {
  // Round 3: copies of the line stacked above it (alternating outline and
  // fill) that collapse down into it.
  if (variant === "echo") {
    return (
      <span className="lab-stack" aria-label={text}>
        <i className="lab-real" aria-hidden="true">{text}</i>
        {Array.from({ length: ECHOES }, (_, k) => (
          <i
            key={k}
            aria-hidden="true"
            className={`lab-copy lab-echo${k % 2 ? "" : " lab-outline"}`}
            style={{ "--k": k + 1, "--line": line }}
          >
            {text}
          </i>
        ))}
      </span>
    );
  }
  // Round 3: the line rides a ribbon of three copies that scrolls in from
  // the side and stops with its middle copy in place; BORA also gets two
  // outline ribbons above it running the other way, like the video.
  if (variant === "ribbon") {
    const ribbon = (cls, style) => (
      <i className={`lab-ribbon ${cls}`} aria-hidden="true" style={style}>
        {[0, 1, 2].map((k) => (
          <b key={k}>{text}</b>
        ))}
      </i>
    );
    return (
      <span className="lab-stack" aria-label={text}>
        <i className="lab-ghost" aria-hidden="true">{text}</i>
        {ribbon("lab-ribbon-main", { "--dir": line ? 1 : -1, "--line": line })}
        {line === 0 &&
          [1, 2].map((k) => (
            <i key={k} className="lab-ribbon-row" aria-hidden="true" style={{ "--k": k }}>
              {ribbon("lab-outline lab-ribbon-echo", { "--dir": k % 2 ? 1 : -1, "--line": 0 })}
            </i>
          ))}
      </span>
    );
  }
  // Round 3: the line is a clipped band; a reel of copies rolls through it
  // and stops on the filled one.
  if (variant === "reel") {
    return (
      <span className="lab-stack lab-band" aria-label={text}>
        <i className="lab-ghost" aria-hidden="true">{text}</i>
        <i className="lab-reel" aria-hidden="true" style={{ "--line": line }}>
          {REEL.map((kind, k) => (
            <b key={k} className={kind === "outline" ? "lab-outline" : ""}>
              {text}
            </b>
          ))}
        </i>
      </span>
    );
  }
  if (sliced) {
    return (
      <span aria-label={text}>
        <i aria-hidden="true" className="lab-sl-a">
          {text}
        </i>
        <i aria-hidden="true" className="lab-sl-b">
          {text}
        </i>
      </span>
    );
  }
  if (!split) return <span>{text}</span>;
  return (
    <span aria-label={text}>
      {[...text].map((ch, i) => (
        <i
          key={i}
          aria-hidden="true"
          className="lab-ch"
          style={{
            "--i": i + (line ? 4 : 0),
            // -1 at the line's left end, 1 at its right end.
            "--c": ((2 * i) / Math.max(1, [...text].length - 1) - 1).toFixed(3),
          }}
        >
          {ch}
        </i>
      ))}
    </span>
  );
}

export default function LabHero({ variant }) {
  const split = SPLIT.has(variant);
  const sliced = variant === "slices";
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
        <h1 className="home-name t-display">
          {LINES.map((text, line) => (
            <Line
              key={text}
              text={text}
              line={line}
              split={split}
              sliced={sliced}
              variant={variant}
            />
          ))}
        </h1>

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
