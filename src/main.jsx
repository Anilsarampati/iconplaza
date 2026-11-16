import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const ASSET = "/assets/";
const brochure = `${ASSET}icon-plaza-renderings.pdf`;
const rendering = `${ASSET}pdf-page-3.png`;
const opportunityImage = `${ASSET}pdf-page-2.png`;
const buildingImages = {
  one: `${ASSET}pdf-page-4.png`,
  two: `${ASSET}pdf-page-9.png`,
  three: `${ASSET}pdf-page-15.png`,
  four: `${ASSET}pdf-page-20.png`,
  plaza: `${ASSET}pdf-page-24.png`,
};

const features = [
  ["01", "Prime positioning", "A two-minute walk from Fields West and Universal Kids Resort."],
  ["02", "Designed to gather", "Signature fountain plaza, patios, balconies and outdoor seating."],
  ["03", "Built for business", "Flexible spaces for retail, restaurants, wellness, entertainment and office."],
];

const buildings = [
  { id: "01", name: "Building One", size: "10,000 SF", detail: "Retail & restaurant · Covered patio", image: buildingImages.one },
  { id: "02", name: "Building Two", size: "13,800 SF", detail: "Retail & restaurant · North-facing", image: buildingImages.two },
  { id: "03", name: "Building Three", size: "18,600 SF", detail: "Retail below · Premium office above", image: buildingImages.three },
  { id: "04", name: "Building Four", size: "18,600 SF", detail: "Retail below · 652 SF balcony", image: buildingImages.four },
];

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Icon Plaza home">
      <span className="logo-symbol">I</span>
      <span><b>ICON <em>PLAZA</em></b><small>FRISCO, TX</small></span>
    </a>
  );
}

function App() {
  const videoRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);
  const [activeBuilding, setActiveBuilding] = useState("01");
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState("idle");

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 }
    );
    document.querySelectorAll(".reveal").forEach((item) => reveal.observe(item));
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    const video = videoRef.current;
    video?.play().catch((error) => {
      console.warn("Hero video autoplay was blocked by the browser.", error);
    });
    const carousel = window.setInterval(() => {
      setActiveBuilding((current) => buildings[(buildings.findIndex((building) => building.id === current) + 1) % buildings.length].id);
    }, 6500);
    return () => {
      window.clearInterval(carousel);
      reveal.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const submitForm = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setFormState("sent");
    form.reset();
  };

  return (
    <div className="site" id="top">
      <header className="nav-wrap">
        <nav className={`nav container ${scrolled ? "nav-scrolled" : ""}`}>
          <Logo />
          <button className="menu-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span />
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {["Buildings", "Brands", "Location", "Experience", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
            ))}
            <a className="nav-cta" href={brochure} download>Download Brochure <span>↗</span></a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" aria-label="Icon Plaza introduction">
          <div className={`hero-poster ${videoVisible ? "fade-out" : ""}`} style={{ backgroundImage: `url(${rendering})` }} />
          <video ref={videoRef} className={`hero-video ${videoVisible ? "show" : ""}`} src={`${ASSET}icon-plaza-tour.mp4`} poster={rendering} autoPlay loop playsInline preload="auto" />
          <div className="hero-shade" />
          <div className="hero-grid container">
            <div className="hero-content reveal is-visible">
              <p className="eyebrow light">Frisco's next destination</p>
              <h1>Make your mark<br /><i>at Icon Plaza.</i></h1>
              <p className="hero-copy">Prime location. Stronger business. A new address for the brands shaping Frisco.</p>
              <div className="hero-actions">
                <a className="button gold" href="#contact">Start a conversation <span>↗</span></a>
                <a className="underlined" href="#experience">Explore the plaza</a>
              </div>
            </div>
            <div className="hero-meta"><span>12901 Dallas Pkwy</span><span>Frisco, Texas</span></div>
          </div>
          <div className="hero-bottom container"><span>Retail · Restaurant · Lifestyle · Community</span><span className="scroll-cue">Scroll to explore ↓</span></div>
        </section>

        <section className="buildings section container" id="buildings">
          <div className="section-top reveal"><div className="section-label"><span>01</span><span>THE BUILDINGS</span></div><h2>Four addresses.<br /><i>One iconic destination.</i></h2></div>
          <div className="building-carousel reveal">
            <div className="building-stage">
              <img src={buildings.find((item) => item.id === activeBuilding)?.image || rendering} alt={`${buildings.find((item) => item.id === activeBuilding)?.name} rendering`} />
              <div className="building-stage-shade" />
              <div className="image-note">Icon Plaza · Frisco, TX</div>
              <div className="image-counter">0{activeBuilding} / 04</div>
              <div className="building-stage-copy"><p className="eyebrow light">Now exploring</p><h3>{buildings.find((item) => item.id === activeBuilding)?.name}</h3><p>{buildings.find((item) => item.id === activeBuilding)?.size} · {buildings.find((item) => item.id === activeBuilding)?.detail}</p></div>
            </div>
            <div className="building-controls">
              {buildings.map((building) => (
                <button className={`building-dot ${activeBuilding === building.id ? "active" : ""}`} onClick={() => setActiveBuilding(building.id)} key={building.id}>
                  <span>{building.id}</span><b>{building.name}</b><small>{building.size}</small><i>↗</i>
                </button>
              ))}
            </div>
          </div>
          <div className="carousel-footer"><span>Auto-rotating collection</span></div>
        </section>

        <section className="brands section" id="brands">
          <div className="container">
            <div className="brands-intro reveal"><div><div className="section-label"><span>02</span><span>NEARBY BRANDS</span></div><h2>Already in the<br /><i>neighborhood.</i></h2></div><p>Icon Plaza sits inside one of North Texas' fastest-growing lifestyle corridors, surrounded by the names people already know and love.</p></div>
            <div className="brand-wall reveal">{["sweetgreen", "Alo", "ARHAUS", "Crate & Barrel", "Room & Board", "SEPHORA", "Texas Capital"].map((brand) => <div className={`brand-logo brand-${brand.replace(/[^a-z]/gi, "").toLowerCase()}`} key={brand}>{brand}</div>)}</div>
            <div className="brand-marquee"><div>{["sweetgreen", "Alo", "ARHAUS", "Crate & Barrel", "Room & Board", "SEPHORA", "Texas Capital", "sweetgreen", "Alo", "ARHAUS"].map((brand, index) => <span key={`${brand}-${index}`}>{brand}</span>)}</div></div>
          </div>
        </section>

        <section className="opportunity section container reveal" id="location">
          <div className="opportunity-heading">
            <div className="section-label"><span>03</span><span>THE OPPORTUNITY</span></div>
            <p>POSITIONED FOR THE NEXT CHAPTER</p>
          </div>
          <div className="opportunity-grid">
            <div className="opportunity-visual">
              <img src={opportunityImage} alt="Icon Plaza location near Fields West and Universal Kids Resort" />
              <div className="opportunity-visual-shade" />
              <span className="opportunity-index">01 <i>/ 04</i></span>
              <span className="opportunity-caption">Dallas North Tollway · Frisco, Texas</span>
            </div>
            <div className="opportunity-copy">
              <h2>Where retail, dining and lifestyle <i>come together.</i></h2>
              <p>Icon Plaza is a premium destination at the center of Frisco's next chapter. With excellent Dallas North Tollway visibility and a two-minute walk to Fields West and Universal Kids Resort, every detail is designed around discovery, connection and growth.</p>
              <a className="text-link" href="#contact">Discover the opportunity <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="experience section" id="experience">
          <div className="container">
            <div className="section-top reveal"><div className="section-label light-label"><span>04</span><span>THE EXPERIENCE</span></div><h2>A vibrant destination,<br /><i>made to linger.</i></h2></div>
            <div className="feature-cards">
              {features.map(([number, title, copy], index) => (
                <article className={`feature-card reveal card-${index + 1}`} key={number}>
                  <div className="feature-number">{number}</div><div><h3>{title}</h3><p>{copy}</p></div><span className="card-arrow">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="numbers section">
          <div className="container numbers-grid">
            <div className="numbers-title reveal"><p className="eyebrow">The numbers</p><h2>Built for scale.<br /><i>Made for growth.</i></h2></div>
            <div className="number-list">
              {[["4", "Premium buildings"], ["10K", "SF building one"], ["13.8K", "SF building two"], ["2027", "A new chapter begins"]].map(([number, label]) => (
                <div className="number-item reveal" key={label}><strong>{number}</strong><span>{label}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section className="plaza-image" id="fountain-plaza">
          <div className="plaza-overlay container"><p className="eyebrow light">05 · Fountain Plaza</p><h2>Great vibe.<br /><i>Signature moments.</i></h2><p>Patios, balconies, outdoor seating and a setting made for the everyday escape.</p></div>
        </section>

        <section className="contact section" id="contact"><div className="container contact-grid"><div className="contact-copy reveal"><p className="eyebrow light">Leasing & inquiries</p><h2>Let's build<br /><i>what's next.</i></h2><p>Tell us about your brand, your vision and the space you are looking for.</p><div className="address">12901 Dallas Pkwy<br />Frisco, TX 75033</div></div><form className="inquiry-form reveal" onSubmit={submitForm}><div className="form-grid"><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@company.com" /></label><label>Phone<input name="phone" placeholder="(555) 555-5555" /></label><label>Interested in<select required name="interest"><option value="">Select one</option><option>Retail</option><option>Restaurant</option><option>Office</option><option>Purchase</option></select></label><label className="wide">Message<textarea required name="message" rows="4" placeholder="Tell us about your requirements" /></label></div><button className="button gold" type="submit">{formState === "sent" ? "Inquiry sent ✓" : "Send inquiry ↗"}</button></form></div></section>
      </main>

      <footer className="footer"><div className="container footer-grid"><div><Logo /><p>A premium retail, restaurant and lifestyle destination at the center of Frisco's next chapter.</p></div><div><p className="footer-heading">Explore</p><a href="#location">Location</a><a href="#buildings">Buildings</a><a href="#fountain-plaza">Fountain Plaza</a><a href="#contact">Contact</a></div><div><p className="footer-heading">Stay connected</p><p>Join our community for the latest Icon Plaza updates.</p><a className="text-link" href="#contact">Get in touch ↗</a></div></div><div className="container footer-bottom"><span>© 2026 Icon Plaza. All rights reserved.</span><span>Frisco, Texas</span></div></footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
