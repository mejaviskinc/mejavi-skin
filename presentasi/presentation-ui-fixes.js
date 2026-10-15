(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);

  function injectStyles() {
    if ($('#presentationUiFixesStyle')) return;

    const style = document.createElement('style');
    style.id = 'presentationUiFixesStyle';
    style.textContent = `
      html,body{max-width:100%;overflow-x:clip}

      /* Header / action buttons */
      header{overflow:visible}
      .nav-wrap{min-width:0;gap:18px}
      .brand{flex:0 0 auto}
      #desktopNav{min-width:0;flex:1 1 auto;justify-content:center}
      #desktopNav a{white-space:nowrap}
      .header-actions{flex:0 0 auto;margin-left:auto;overflow:visible;gap:10px}
      .ghost-btn,.present-btn,.menu-btn{white-space:nowrap}
      .ghost-btn,.present-btn{display:inline-flex;align-items:center;justify-content:center;line-height:1;min-height:42px}
      .ghost-btn{min-width:122px;padding-inline:17px;background:rgba(255,255,255,.84);box-shadow:0 5px 18px rgba(32,27,20,.035)}
      .present-btn{min-width:88px;padding-inline:17px}
      .ghost-btn:focus-visible,.present-btn:focus-visible,.menu-btn:focus-visible{outline:2px solid var(--gold);outline-offset:3px}

      /* Hero stat cards */
      .hero-stats{grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;gap:12px}
      .stat{min-width:0;min-height:94px;padding:17px 18px;display:flex;flex-direction:column;justify-content:center;border-radius:20px;background:rgba(255,255,255,.64)}
      .stat strong{font-size:12px;line-height:1.32;letter-spacing:-.012em;overflow-wrap:normal;word-break:normal}
      .stat span{margin-top:6px;font-size:9px;line-height:1.5}

      /* Compact premium care guidance instead of a long thin bar */
      .ritual-note.care-note-card{width:min(100%,920px);margin:26px auto 0;padding:20px 22px;border:1px solid var(--line);border-left:1px solid var(--line);border-radius:22px;background:rgba(255,255,255,.72);color:var(--muted);display:grid;grid-template-columns:42px minmax(0,1fr);gap:15px;align-items:start;box-shadow:0 14px 38px rgba(50,38,24,.045)}
      .care-note-icon{width:42px;height:42px;border:1px solid rgba(181,139,80,.28);border-radius:14px;display:grid;place-items:center;background:rgba(181,139,80,.08);color:#936b38;font:600 17px/1 Poppins,sans-serif}
      .care-note-copy strong{display:block;color:var(--ink);font-size:10px;line-height:1.25;letter-spacing:.13em;text-transform:uppercase}
      .care-note-copy p{margin:7px 0 0;max-width:780px;color:var(--muted);font-size:11px;line-height:1.7}

      @media(max-width:1280px){
        .nav-wrap{gap:14px}
        #desktopNav{gap:15px;font-size:9px}
        .brand-copy span{display:none}
        .ghost-btn{min-width:112px;padding-inline:14px}
        .present-btn{min-width:82px;padding-inline:14px}
      }

      @media(max-width:1080px){
        .header-actions{gap:8px}
        .ghost-btn{min-width:108px}
        .hero-stats{max-width:none}
      }

      @media(max-width:820px){
        .ghost-btn{display:none}
      }

      @media(max-width:700px){
        .hero-stats{grid-template-columns:1fr 1fr;gap:10px}
        .hero-stats .stat:last-child{grid-column:1/-1}
        .stat{min-height:82px;padding:15px 16px}
        .ritual-note.care-note-card{grid-template-columns:36px minmax(0,1fr);gap:12px;padding:17px 16px;border-radius:18px}
        .care-note-icon{width:36px;height:36px;border-radius:12px;font-size:15px}
        .care-note-copy p{font-size:10px;line-height:1.65}
      }

      @media(max-width:430px){
        .hero-stats{grid-template-columns:1fr}
        .hero-stats .stat:last-child{grid-column:auto}
      }
    `;
    document.head.appendChild(style);
  }

  function polishHeroStats() {
    const stats = document.querySelectorAll('.hero-stats .stat');
    if (stats.length < 3) return;

    const title = $('strong', stats[2]);
    const copy = $('span', stats[2]);
    if (title) title.textContent = 'Presentation Ready';
    if (copy) copy.textContent = 'English-only deck for meetings, pitches and collaborations.';
  }

  function polishMainWebsiteButton() {
    const button = $('.header-actions .ghost-btn');
    if (!button) return;
    button.setAttribute('aria-label', 'Open the Mejavi Skin+ main website in a new tab');
    button.title = 'Open main website';
  }

  function polishCareNote() {
    const note = $('.ritual-note');
    if (!note || note.classList.contains('care-note-card')) return;

    note.classList.add('care-note-card');
    note.innerHTML = `
      <div class="care-note-icon" aria-hidden="true">♡</div>
      <div class="care-note-copy">
        <strong>Care Guidance</strong>
        <p>Results and individual skin responses can vary. Follow each product's directions, introduce new products gradually, and discontinue use if discomfort occurs. For sensitive skin, keep the routine simple, careful and consistent.</p>
      </div>
    `;
  }

  function init() {
    injectStyles();
    polishHeroStats();
    polishMainWebsiteButton();
    polishCareNote();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
