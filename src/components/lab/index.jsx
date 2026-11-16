import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LabHero from "./lab-hero";
import LabLoader from "./lab-loader";
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
  {
    id: "crash",
    round: 2,
    title: "Çarpışma",
    text: "9’un sert hâli: satırlar iki yandan hızlanarak geliyor, frensiz duruyor ve çarpma anında bütün afiş sarsılıyor. Yumuşama yok, solma yok.",
  },
  {
    id: "frames",
    round: 2,
    title: "Kare kare",
    text: "Aynı iki yandan giriş ama akıcı değil: altı sert karede, stop-motion ya da yavaş bir makine gibi ilerliyor.",
  },
  {
    id: "slices",
    round: 2,
    title: "Kayık baskı",
    text: "Her satır ortadan ikiye kesik; üst ve alt yarılar zıt yönlerden geliyor, bir an kayık baskı gibi hizasız duruyor, sonra tek karede yerine oturuyor.",
  },
  {
    id: "bars",
    round: 2,
    title: "Sansür bandı",
    text: "Her satıra kendi yanından düz bir bant fırlıyor ve onu kapatıyor, sonra bant tek karede kesilip yok oluyor, altında isim kalıyor. Renk tersleme yüzünden bant çizimlerin üstünde açık renk.",
  },
  {
    id: "stack",
    round: 2,
    title: "Yığın",
    text: "Önce BEŞİKTEPE yukarıdan düşüp şeride oturuyor, sonra BORA onun üstüne düşüyor. Sekme yok, saf yerçekimi; her inişte afiş sarsılıyor.",
  },
  {
    id: "wave",
    round: 3,
    title: "Dalga",
    text: "Harfler geniş (fontun genişlik ekseni sonuna kadar açık) ve bir sinüs dalgası üstünde kıvrılarak geliyor; dalga sönünce isim düz ve normal genişliğine oturuyor.",
  },
  {
    id: "outline",
    round: 3,
    title: "Kontur dalgası",
    text: "Aynı dalga, ama harfler önce içi boş kontur; dalga sönerken her harf tek karede dolup ismi oluşturuyor.",
  },
  {
    id: "echo",
    round: 3,
    title: "Yankı",
    text: "Posterdeki tekrar eden satırlar gibi: her satırın üstünde kontur ve dolu kopyaları yığılı, kopyalar sert adımlarla aşağı inip ismin içine çöküyor.",
  },
  {
    id: "reel",
    round: 3,
    title: "Makara",
    text: "Her satır kendi bandına kırpılmış; içinden kontur ve dolu kopyalar makara gibi akıyor, kenarlarda harfler ortadan kesik görünüyor, dolu olanda frensiz duruyor.",
  },
  {
    id: "ribbon",
    round: 3,
    title: "Şerit akışı",
    text: "Videodaki kayan satırlar gibi: her satır üç kopyalık bir şerit, yandan akıp ortadaki kopyası yerine gelince duruyor; BORA’nın üstünde ters yöne akan iki kontur şerit daha var, isim oturunca hepsi tek karede kesiliyor.",
  },
  {
    id: "lens",
    round: 3,
    title: "Mercek",
    text: "Videodaki şişen “STORIES” satırları gibi: harfler satırın ortasında büyüyüp uçlarda eziliyor, mercekten bakılıyormuş gibi, sonra düzleşip isme dönüyor.",
  },
];

// Loading screen ideas, shown on their own above the entrances.
const LOADERS = [
  {
    id: "loader",
    title: "Akan şeritler",
    text: "Paylaştığın görselden: ismin geniş harfli satırları dalgalı bir bayrak gibi kıvrılarak sağa sola akıyor, her ikinci satır ayna. Satırlar önce kontur; resimler yüklendikçe yukarıdan aşağı tek karede doluyor, yani ekranın kendisi ilerleme çubuğu. %100’de perde yukarı çekilip ana sayfa açılıyor. Burada sahte yüklemeyle sürekli tekrar ediyor.",
  },
];

const ROUND_3 = VARIANTS.filter((v) => v.round === 3);
const ROUND_1 = VARIANTS.filter((v) => !v.round);
const ROUND_2 = VARIANTS.filter((v) => v.round === 2);

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

function Card({ v, i, label }) {
  const [play, setPlay] = useState(0);
  return (
    <li className="lab-card">
      <div className="lab-card-text">
        <span className="t-mono">
          {label ?? String(i + 1).padStart(2, "0")} · {v.id}
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
          BORA BEŞİKTEPE yazısının sayfa açılırken nasıl geleceği için
          alternatifler. Hepsi gerçek ana sayfa, renk tersleme dahil, masaüstü
          ve telefon boyutunda. Her kartta “Tekrar oynat” var; tam ekran bakmak
          için başlığa tıkla.
        </p>
      </header>

      <section className="lab-round">
        <h2 className="lab-round-title t-mono">
          Yükleme ekranı · Paylaştığın görselden
        </h2>
        <ol className="lab-list">
          {LOADERS.map((v, i) => (
            <Card key={v.id} v={v} i={i} label={`L${i + 1}`} />
          ))}
        </ol>
      </section>

      <section className="lab-round">
        <h2 className="lab-round-title t-mono">
          Tur 3 · Paylaştığın videodan: dalga, kontur, tekrar, kırpık bant, akan şerit, mercek
        </h2>
        <ol className="lab-list">
          {ROUND_3.map((v) => (
            <Card key={v.id} v={v} i={VARIANTS.indexOf(v)} />
          ))}
        </ol>
      </section>

      <section className="lab-round">
        <h2 className="lab-round-title t-mono">
          Tur 2 · Brutalist, 9 “İki yandan”dan türetildi
        </h2>
        <ol className="lab-list">
          {ROUND_2.map((v) => (
            <Card key={v.id} v={v} i={VARIANTS.indexOf(v)} />
          ))}
        </ol>
      </section>

      <section className="lab-round">
        <h2 className="lab-round-title t-mono">
          Tur 1 · İlk alternatifler, şu anki hâli dahil
        </h2>
        <ol className="lab-list">
          {ROUND_1.map((v) => (
            <Card key={v.id} v={v} i={VARIANTS.indexOf(v)} />
          ))}
        </ol>
      </section>
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

  if (variant === "loader") return <LabLoader />;
  if (variant && VARIANTS.some((v) => v.id === variant)) {
    return <Single variant={variant} />;
  }
  return <Overview />;
}
