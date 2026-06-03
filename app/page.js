import ClientEffects from '@/components/ClientEffects'

export default function Home() {
  return (
    <>
      <ClientEffects />

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className="navbar" id="navbar">
        <div className="nav-inner">

          <a href="/" className="nav-logo">
            <div className="logo-img-crop">
              {/* Salve o logo em: public/images/logo.png */}
              <img src="/images/logo.png" alt="RG Performance" />
            </div>
          </a>

          <div className="nav-pill">
            <ul className="nav-links">
              <li><a href="#method" className="nav-link">Método</a></li>
              <li><a href="#services" className="nav-link">Serviços</a></li>
              <li><a href="#results" className="nav-link">Resultados</a></li>
              <li><a href="#about" className="nav-link">Sobre</a></li>
            </ul>
          </div>

          <a href="#contact" className="nav-cta">
            Solicitar Diagnóstico
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="hero" id="home">

        {/* Background layers */}
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-img">
            {/* Salve o consultório em: public/images/clinica.jpg */}
            <img src="/images/clinica.jpg" alt="" />
          </div>
          <div className="hero-overlay" />
          <div className="glow glow-tl" />
          <div className="glow glow-br" />
          <div className="noise" />
        </div>

        {/* Content grid */}
        <div className="hero-container">

          {/* Left: copy */}
          <div className="hero-copy" data-reveal="">

            <div className="hero-badge">
              <span className="badge-pulse" aria-hidden="true" />
              Consultoria exclusiva para médicos
            </div>

            <h1 className="hero-h1">
              Crescimento<br />
              <em className="h1-em">previsível</em><br />
              para médicos<br />
              <span className="h1-accent">que já faturam.</span>
            </h1>

            <p className="hero-body">
              Estruturamos o sistema comercial da sua clínica para gerar um fluxo
              constante de consultas particulares — com custo de aquisição
              controlado, funil estruturado e crescimento com método.
            </p>

            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
                <span className="btn-label">Quero estruturar minha clínica</span>
                <span className="btn-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a href="#method" className="btn-ghost">
                Ver o Método RG
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="hero-metrics" data-reveal="" data-reveal-delay="200">
              <div className="metric">
                <span className="metric-val">+80</span>
                <span className="metric-lbl">médicos atendidos</span>
              </div>
              <span className="metric-sep" aria-hidden="true" />
              <div className="metric">
                <span className="metric-val">5</span>
                <span className="metric-lbl">etapas estruturadas</span>
              </div>
              <span className="metric-sep" aria-hidden="true" />
              <div className="metric">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">operação remota</span>
              </div>
            </div>

          </div>

          {/* Right: founders card */}
          <div className="hero-visual" data-reveal="" data-reveal-delay="150">

            <div className="founders-card" id="foundersCard">

              <div className="fc-header">
                <span className="fc-eyebrow">// Fundadores</span>
                <a href="#about" className="fc-link" aria-label="Sobre nós">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="fc-photo-full">
                {/* Salve a foto em: public/images/fundadores.jpg */}
                <img src="/images/fundadores.jpg" alt="Gabriel e Rodrigo Pereira" />
                <div className="fc-names-box">
                  <div className="fc-name-row">
                    <span className="fc-person-name">Gabriel Pereira</span>
                    <span className="fc-person-role">Co-fundador</span>
                  </div>
                  <div className="fc-names-divider" />
                  <div className="fc-name-row">
                    <span className="fc-person-name">Rodrigo Pereira</span>
                    <span className="fc-person-role">Co-fundador</span>
                  </div>
                </div>
              </div>

              <div className="fc-footer">
                <p className="fc-quote">&ldquo;Crescimento com método.&rdquo;</p>
                <span className="fc-location">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1C4.067 1 2.5 2.567 2.5 4.5C2.5 7.25 6 11 6 11C6 11 9.5 7.25 9.5 4.5C9.5 2.567 7.933 1 6 1ZM6 6C5.172 6 4.5 5.328 4.5 4.5C4.5 3.672 5.172 3 6 3C6.828 3 7.5 3.672 7.5 4.5C7.5 5.328 6.828 6 6 6Z" fill="currentColor" />
                  </svg>
                  Porto Alegre, RS
                </span>
              </div>

            </div>

            <div className="visual-glow" aria-hidden="true" />

          </div>

        </div>

        {/* Trust marquee */}
        <div className="trust-bar" aria-label="Especialidades atendidas">
          <span className="trust-label">Especialidades</span>
          <div className="trust-marquee">
            <div className="trust-track">
              <span>Dermatologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Cirurgia Plástica</span><span className="dot" aria-hidden="true">·</span>
              <span>Oftalmologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Ortopedia</span><span className="dot" aria-hidden="true">·</span>
              <span>Ginecologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Cardiologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Urologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Endocrinologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Neurologia</span><span className="dot" aria-hidden="true">·</span>
              {/* duplicate for seamless loop */}
              <span>Dermatologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Cirurgia Plástica</span><span className="dot" aria-hidden="true">·</span>
              <span>Oftalmologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Ortopedia</span><span className="dot" aria-hidden="true">·</span>
              <span>Ginecologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Cardiologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Urologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Endocrinologia</span><span className="dot" aria-hidden="true">·</span>
              <span>Neurologia</span><span className="dot" aria-hidden="true">·</span>
            </div>
          </div>
        </div>

      </section>
    </>
  )
}
