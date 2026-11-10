import { motion } from "framer-motion";
import "./about.css";

const CONTACTS = [
  {
    label: "Email",
    value: "borabesiktepe@gmail.com",
    href: "mailto:borabesiktepe@gmail.com",
  },
  {
    label: "Instagram",
    value: "@borabesiktepe",
    href: "https://www.instagram.com/borabesiktepe/",
  },
  {
    label: "ArtStation",
    value: "artstation.com/borabesiktepe",
    href: "https://www.artstation.com/borabesiktepe",
  },
];

const About = () => (
  <motion.main
    className="about"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="about-title t-display">About</h1>

    <section className="about-body">
      <p className="about-lede">
        Self-taught illustrator and engineer from İstanbul, Türkiye.
      </p>

      <div className="about-contact">
        <h2 className="t-mono">Contact</h2>
        <ul>
          {CONTACTS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <span className="about-contact-label t-mono">{c.label}</span>
                <span className="about-contact-value">{c.value}</span>
                <span className="about-contact-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <footer className="about-foot t-mono">
      <span>© {new Date().getFullYear()} Bora Beşiktepe</span>
      <span>İstanbul</span>
    </footer>
  </motion.main>
);

export default About;
