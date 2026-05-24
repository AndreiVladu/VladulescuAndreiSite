(function () {
  const emailUser = 'vladulescuandrei6';
  const emailDomain = 'gmail.com';
  const email = emailUser + '@' + emailDomain;
  const phoneText = '+40 762 309 113';
  const phoneHref = '+40762309113';

  const footerHtml = `
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="footer-logo">Andrei Vladulescu</a>
        <p class="footer-tagline">Videograf de Nuntă</p>
      </div>
      <div class="footer-nav">
        <h4 class="footer-title">Navigare</h4>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="portofoliu.html">Portofoliu</a></li>
          <li><a href="despre.html">Despre</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="fq.html">F&Q</a></li>
        </ul>
      </div>
      <div class="footer-social">
        <h4 class="footer-title">Social</h4>
        <ul class="footer-links">
          <li><a href="https://www.instagram.com/andrei.vladulescu/">Instagram</a></li>
          <li><a href="https://www.facebook.com/vladulescu.andrei.52">Facebook</a></li>
          <li><a href="https://www.youtube.com/watch?v=ew_LOu42hwY&list=PLWAviscOy8TmkK8KoADyk1QSXtL0xjzTn">YouTube</a></li>
          <li><a href="https://www.fotografi-cameramani.ro/admin_membru/video/videoclipuri" class="text-gold">Fotografi-Cameramani →</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4 class="footer-title">Contact</h4>
        <ul class="footer-links">
          <li><a href="mailto:${email}">${email}</a></li>
          <li><a href="tel:${phoneHref}">${phoneText}</a></li>
          <li><span>Târgu-Jiu, România</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Andrei Vladulescu. Toate drepturile rezervate.</p>
    </div>
  </footer>`;

  const footerCss = `
    .text-gold { color: var(--gold) !important; }
    .footer { background: var(--bg-dark); padding: 4rem 2rem 2rem; }
    .footer-grid { width: min(100%, 1440px); margin: 0 auto; display: grid; grid-template-columns: 1.1fr 0.8fr 0.8fr 1fr; gap: 4rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .footer-logo { display: block; margin-bottom: 0.5rem; font-family: var(--font-display); font-size: 1.25rem; color: var(--text-light); }
    .footer-tagline, .footer-links a, .footer-links span { font-size: 0.875rem; color: rgba(255,255,255,0.68); }
    .footer-title { margin-bottom: 1rem; font-size: 0.7rem; font-weight: 500; color: var(--gold); text-transform: uppercase; letter-spacing: 0.15em; }
    .footer-links { list-style: none; }
    .footer-links li { margin-bottom: 0.75rem; }
    .footer-links a { transition: color 0.2s ease; }
    .footer-links a:hover { color: var(--gold); }
    .footer-bottom { width: min(100%, 1440px); margin: 0 auto; padding-top: 2rem; text-align: center; }
    .footer-bottom p { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
    @media (max-width: 1100px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem; } }
    @media (max-width: 768px) { .footer { padding: 3rem 1.5rem 2rem; } .footer-grid { grid-template-columns: 1fr; gap: 2rem; text-align: center; } }
  `;

  function syncFooter() {
    if (!document.getElementById('shared-footer-style')) {
      const style = document.createElement('style');
      style.id = 'shared-footer-style';
      style.textContent = footerCss;
      document.head.appendChild(style);
    }
    const currentFooter = document.querySelector('footer.footer');
    if (currentFooter) currentFooter.outerHTML = footerHtml;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncFooter);
  } else {
    syncFooter();
  }
})();
