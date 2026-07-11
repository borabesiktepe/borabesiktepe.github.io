import { useEffect, useState } from "react";
import { LiquidGlass } from "liquid-glass-web-react";
import Menu from "../menu";
import { DarkModeSwitch } from "../darkmode";
import "./side-navigation.css";

export default function SideNavigation() {
  const [railSize, setRailSize] = useState({ width: 66, height: 900 });

  useEffect(() => {
    const updateRailSize = () => {
      setRailSize({
        width: window.innerWidth <= 820 ? 50 : 66,
        height: window.innerHeight,
      });
    };

    updateRailSize();
    window.addEventListener("resize", updateRailSize);
    return () => window.removeEventListener("resize", updateRailSize);
  }, []);

  return (
    <LiquidGlass
      className="portfolio-navigation-glass"
      width={railSize.width}
      height={railSize.height}
      radius={0}
      strength={0.075}
      chromaticAberration={0.08}
      blur={0.35}
      depth={9}
      curvature={0.78}
      glow={0.12}
      edgeHighlight={0.32}
      specular={0.85}
      quality={256}
      shadow="10px 0 34px rgba(0, 0, 0, 0.2)"
    >
      <nav className="portfolio-navigation" aria-label="Site navigation">
        <div className="portfolio-navigation-theme">
          <DarkModeSwitch />
        </div>
        <Menu />
        <div className="portfolio-navigation-signature">BORA BEŞİKTEPE</div>
      </nav>
    </LiquidGlass>
  );
}
