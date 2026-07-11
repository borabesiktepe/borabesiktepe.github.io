import Menu from "../menu";
import { DarkModeSwitch } from "../darkmode";
import "./side-navigation.css";

export default function SideNavigation() {
  return (
    <nav className="portfolio-navigation" aria-label="Site navigation">
      <div className="portfolio-navigation-theme">
        <DarkModeSwitch />
      </div>
      <Menu />
      <div className="portfolio-navigation-signature">BORA BEŞİKTEPE</div>
    </nav>
  );
}
