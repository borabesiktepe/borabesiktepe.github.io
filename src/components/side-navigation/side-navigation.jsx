import Menu from "../menu";
import "./side-navigation.css";

export default function SideNavigation() {
  return (
    <div className="portfolio-navigation-shell">
      <div className="portfolio-navigation-surface" aria-hidden="true" />

      <nav className="portfolio-navigation" aria-label="Site navigation">
        <Menu />
        <div className="portfolio-navigation-signature">BORA BEŞİKTEPE</div>
      </nav>
    </div>
  );
}
