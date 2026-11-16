import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LabHero from "./lab-hero";
import "./lab.css";

// Unlisted test page (noindex, not in the sitemap). /lab shows every variant
// of the home hero at desktop and phone size; /lab?v=<id> shows one at the
// real size of the window.

const VARIANTS = [
  {
    id: "now",
    title: "Şu anki hâli",
    text: "Karşılaştırma için: siyah yazı, koyu çizimin üstünde kayboluyor.",
  },
  {
    id: "stroke",
    title: "Kağıt rengi kontur",
    text: "Harflerin etrafında arka plan renginde ince bir çizgi. Yazı siyah kalıyor, koyu alanda kenarı belli oluyor.",
  },
  {
    id: "halo",
    title: "Yumuşak hale",
    text: "Kontur yerine harflerin etrafına kağıt renginde yumuşak bir parıltı. Daha sisli, baskı gibi duruyor.",
  },
  {
    id: "difference",
    title: "Renk tersleme",
    text: "Yazı açık zeminde siyah, koyu çizimin üstünde otomatik beyaz. Harfin içinde bile renk değişiyor.",
  },
  {
    id: "split",
    title: "Panele göre renk",
    text: "Sadece N°03 panelinin içinde kalan harf parçaları kağıt rengi ve ince siyah konturlu, gerisi aynı.",
  },
  {
    id: "fade",
    title: "Çizimler aşağıda soluyor",
    text: "Bütün çizimler aşağıya doğru kağıda karışarak kayboluyor, isim temiz bir zeminde kalıyor.",
  },
  {
    id: "fade3",
    title: "Sadece N°03 soluk",
    text: "Yalnızca koyu çizimin alt yarısı kağıt rengiyle açılıyor; diğer paneller olduğu gibi.",
  },
  {
    id: "band",
    title: "Kağıt bant",
    text: "İsim üstünde ince çizgi olan düz bir kağıt bandın üstüne oturuyor; çizimler bandın üstünde bitiyor.",
  },
];

// An iframe drawn at a real device size and scaled down to the box width,
// so the hero lays out exactly as it would on that screen.
function Frame({ id, width, height, label }) {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = box.current;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / width)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <figure className="lab-frame">
      <div
        ref={box}
        className="lab-frame-box"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <iframe
          title={`${id} ${label}`}
          src={`/lab?v=${id}`}
          width={width}
          height={height}
          loading="lazy"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
      <figcaption className="t-mono">
        {label} · {width}×{height}
      </figcaption>
    </figure>
  );
}

function Overview() {
  return (
    <main className="lab" lang="tr">
      <header className="lab-head">
        <p className="t-mono">Lab · gizli sayfa, Google&apos;da görünmez</p>
        <h1 className="t-display">İsim okunurluğu</h1>
        <p className="lab-intro">
          Büyük isim N°03&apos;teki koyu çizimin üstüne gelince ŞİK harfleri
          kayboluyor. Aşağıda {VARIANTS.length} farklı çözüm var; her biri
          gerçek ana sayfa, gerçek görsellerle, masaüstü ve telefon boyutunda.
          Animasyonu tekrar görmek için sayfayı yenile; tam ekran bakmak için
          başlığa tıkla.
        </p>
      </header>

      <ol className="lab-list">
        {VARIANTS.map((v, i) => (
          <li key={v.id} className="lab-card">
            <div className="lab-card-text">
              <span className="t-mono">
                {String(i + 1).padStart(2, "0")} · {v.id}
              </span>
              <h2>
                <a href={`/lab?v=${v.id}`} target="_blank" rel="noreferrer">
                  {v.title} <span aria-hidden="true">↗</span>
                </a>
              </h2>
              <p>{v.text}</p>
            </div>
            <div className="lab-card-frames">
              <Frame id={v.id} width={2560} height={1264} label="Masaüstü (senin ekranın)" />
              <Frame id={v.id} width={390} height={844} label="Telefon" />
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default function Lab() {
  const [params] = useSearchParams();
  const variant = params.get("v");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (variant && VARIANTS.some((v) => v.id === variant)) {
    return <LabHero variant={variant} />;
  }
  return <Overview />;
}
