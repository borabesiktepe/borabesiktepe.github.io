import { Link, NavLink, useLocation } from "react-router-dom";
import artworks from "../artworks-page/artworks.json";
import "./site-header.css";

// One bar, one job per control: the name goes home, each tab opens its page.
export default function SiteHeader() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header className="site-header">
      {isHome ? (
        <span className="site-header-issue t-mono">
          Portfolio · 2019—2026
        </span>
      ) : (
        <Link to="/" className="site-header-mark t-display">
          {/* Written in capitals: CSS uppercasing would turn the i into I, not İ. */}
          BORA BEŞİKTEPE
        </Link>
      )}

      <span className="site-header-role t-mono">
        Illustrator / Visual Artist · İstanbul
      </span>

      <nav className="site-header-nav t-mono" aria-label="Main">
        <NavLink to="/artworks">
          Works <span className="site-header-count">{artworks.length}</span>
        </NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}
