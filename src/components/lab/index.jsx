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
    text: "Karşılaştırma için: iki satır sırayla hafifçe yukarı kayarak beliriyor.",
  },
  {
    id: "mask",
    title: "Maske",
    text: "Her satır kendi çizgisinin altından yukarı çıkıyor, sanki bir yarıktan beliriyor. Klasik editoryal giriş.",
  },
  {
    id: "letters",
    title: "Harf harf",
    text: "Harfler soldan sağa tek tek, hafif eğik gelip yerine oturuyor.",
  },
  {
    id: "wipe",
    title: "Silme",
    text: "İsim soldan sağa doğru açılıyor, matbaadan basılıyormuş gibi.",
  },
  {
    id: "slam",
    title: "Çarpma",
    text: "Satırlar büyük ve bulanık gelip sertçe yerine çakılıyor. En gürültülüsü.",
  },
  {
    id: "stretch",
    title: "Genişleme",
    text: "Harfler dar hâlden tam genişliğe açılıyor. Archivo fontunun genişlik ekseniyle, siteye özgü.",
  },
  {
    id: "stamp",
    title: "Daktilo",
    text: "Harfler yumuşama olmadan tek tek basılıyor, sitedeki mono yazılarla uyumlu.",
  },
  {
    id: "scan",
    title: "Tarayıcı",
    text: "Her satırın üstünden düz bir bant geçiyor; renk tersleme yüzünden geçtiği çizimleri de ters çeviriyor, arkasında isim kalıyor.",
  },
  {
    id: "sides",
    title: "İki yandan",
    text: "BORA soldan, BEŞİKTEPE sağdan kayarak gelip ortada buluşuyor.",
  },
];

// An iframe drawn at a real device size and scaled down to the box width,
// so the hero lays out exactly as it would on that screen. Changing `play`
// reloads it, which replays the entrance.
function Frame({ id, width, height, label, play }) {
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
          key={play}
          title={`${id} ${label}`}
          src={`/lab?v=${id}&p=${play}`}
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

function Card({ v, i }) {
  const [play, setPlay] = useState(0);
  return (
    <li className="lab-card">
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
        <button
          type="button"
          className="lab-replay t-mono"
          onClick={() => setPlay((n) => n + 1)}
        >
          ↻ Tekrar oynat
        </button>
      </div>
      <div className="lab-card-frames">
        <Frame id={v.id} width={2560} height={1264} label="Masaüstü (senin ekranın)" play={play} />
        <Frame id={v.id} width={390} height={844} label="Telefon" play={play} />
      </div>
    </li>
  );
}

function Overview() {
  return (
    <main className="lab" lang="tr">
      <header className="lab-head">
        <p className="t-mono">Lab · gizli sayfa, Google’da görünmez</p>
        <h1 className="t-display">İsmin girişi</h1>
        <p className="lab-intro">
          BORA BEŞİKTEPE yazısının sayfa açılırken nasıl geleceği için{" "}
          {VARIANTS.length - 1} alternatif, karşılaştırma için şu anki hâliyle
          birlikte. Hepsi gerçek ana sayfa, renk tersleme dahil, masaüstü ve
          telefon boyutunda. Her kartta “Tekrar oynat” var; tam
          ekran bakmak için başlığa tıkla.
        </p>
      </header>

      <ol className="lab-list">
        {VARIANTS.map((v, i) => (
          <Card key={v.id} v={v} i={i} />
        ))}
      </ol>
    </main>
  );
}

// Full-size view of one variant, with a replay button when it is not inside
// one of the overview's frames.
function Single({ variant }) {
  const [play, setPlay] = useState(0);
  const framed = window.self !== window.top;
  return (
    <>
      <LabHero key={play} variant={variant} />
      {!framed && (
        <button
          type="button"
          className="lab-replay lab-replay-fixed t-mono"
          onClick={() => setPlay((n) => n + 1)}
        >
          ↻ Tekrar oynat
        </button>
      )}
    </>
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
    return <Single variant={variant} />;
  }
  return <Overview />;
}
