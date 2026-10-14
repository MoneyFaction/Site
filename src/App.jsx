import React from 'react';

const repositoryUrl = 'https://github.com/MoneyFaction/Site';

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="MoneyFaction home">
          <span className="wordmark-symbol">MF</span>
          <span>MoneyFaction</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#resources">Resources</a>
          <a href="#newsletter">Newsletter</a>
          <a className="nav-github" href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="live-mark" /> FIELD NOTES FOR TORN</p>
            <h1 id="hero-title">Play the<br />long game.</h1>
            <p className="hero-description">
              Field notes and practical resources for the MoneyFaction crew.
            </p>
            <a className="primary-link" href="#resources">
              Explore resources <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=85"
              alt="Colorful lights in a gaming room"
            />
            <figcaption><span>MF / FIELD NOTES</span><span>EST. 2026</span></figcaption>
          </figure>
          <div className="hero-index" aria-hidden="true">01 — 02</div>
        </section>

        <section className="resources" id="resources" aria-labelledby="resources-title">
          <div className="section-heading">
            <p className="eyebrow">THE TOOLKIT <span> / 01</span></p>
            <h2 id="resources-title">Useful things,<br />made for the crew.</h2>
          </div>
          <article className="resource-item" id="newsletter">
            <div className="resource-number">01</div>
            <div className="resource-copy">
              <p className="resource-status"><span /> IN DEVELOPMENT</p>
              <h3>Offshore Newsletter</h3>
              <p>The newsletter is being shaped into an interactive tool. It will live here when it is ready.</p>
            </div>
            <span className="resource-arrow" aria-hidden="true">↗</span>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">
          <span className="wordmark-symbol">MF</span>
          <span>MoneyFaction</span>
        </a>
        <span>Field notes for the long game.</span>
        <a href={repositoryUrl} target="_blank" rel="noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  );
}

export default App;