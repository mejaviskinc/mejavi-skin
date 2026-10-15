(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const productCopy = {
    body: {
      desc: 'Radiance Treatment Body Serum is a daily body-care serum designed for use after bathing to help the skin feel softer, more moisturized and comfortably cared for. Its presentation highlights a blend of selected cosmetic ingredients including niacinamide, collagen, ginseng root extract, ethyl ascorbic acid, licorice extract, aloe vera, vitamin E and sodium DNA as part of a routine focused on moisture, softness and a brighter-looking body complexion.',
      benefit: 'Supports daily body-skin moisture, softness and a smoother, brighter-looking appearance while complementing antioxidant-focused body care. The lightweight serum format makes it easy to include in a consistent post-shower routine.',
      use: 'After bathing, apply an adequate amount to clean, dry body skin. Spread evenly over the desired areas and massage gently until absorbed, paying extra attention to areas that feel dry. Use consistently according to the directions on the product packaging.'
    },
    cleanser: {
      desc: 'Brightening Gentle Cleanser is the first step in the Mejavi Skin+ facial routine. It is designed to help lift away everyday dirt, residue and excess oil while keeping the cleansing experience comfortable, preparing the skin for serum and moisturizer. The formula presentation includes selected ingredients such as sodium hyaluronate, aloe vera, green tea, niacinamide, centella asiatica, ginseng, jojoba oil and tea tree oil.',
      benefit: 'Helps cleanse daily impurities and excess oil while supporting a fresh, moisturized and well-cared-for complexion. It creates a clean starting point so the next skincare steps can be applied to freshly cleansed skin.',
      use: 'Wet the face and neck first. Apply an appropriate amount of cleanser, massage gently in circular motions for about 1–2 minutes, then rinse thoroughly with clean water. Pat dry with a soft towel instead of rubbing the skin.'
    },
    serumiser: {
      desc: 'Plump+Bright Serumiser is a lightweight facial serum created to sit between cleansing and moisturizing in the Mejavi Skin+ routine. Its presentation focuses on hydration, softness, firmness and a brighter-looking complexion, with selected formula components including niacinamide, inulin, acetyl hexapeptide-8, sunflower seed oil and vitamin E.',
      benefit: 'Helps the skin feel moisturized, softer and more supple while supporting a firmer feel and brighter-looking appearance. The lightweight texture is intended to layer comfortably before a facial cream.',
      use: 'After cleansing and drying the face, apply an adequate amount of serumiser. Spread it gently and evenly over the facial skin, then allow it to absorb before moving to the moisturizer step.'
    },
    fresh: {
      desc: 'Fresh Hydra Cream is a facial cream designed to complete a morning or evening skincare routine with a comfort-focused moisturizing step. The cream may naturally be presented in white, light brown or pink variations while serving the same care purpose, making it a flexible moisturizer option within the Mejavi Skin+ routine.',
      benefit: 'Supports daily moisture, softness and skin comfort while helping the complexion look well cared for. It can be positioned as an alternative facial moisturizer according to skin needs, routine preference and individual compatibility.',
      use: 'Apply an appropriate amount evenly to the face and neck after cleansing and serum. Use in the morning or evening according to the directions on the packaging and adjust the amount based on how the skin feels.'
    },
    lumiere: {
      desc: 'Lumiere Essence Hydra Cream is a 15 g facial moisturizer developed to help dry-feeling skin feel softer, smoother and more comfortable. It is presented as a moisture-supporting step that also complements a brighter-looking complexion and antioxidant-focused skincare, making it suitable for the moisturizer stage after cleanser and serumiser.',
      benefit: 'Helps maintain skin moisture and comfort, supports a softer feel and complements a brighter-looking, well-maintained complexion. Its role in the routine is to seal in the previous skincare steps with a thin, even moisturizing layer.',
      use: 'After Brightening Gentle Cleanser and Plump+Bright Serumiser, apply a thin and even layer to the face and neck. Adjust the amount to the skin’s needs and observe individual compatibility, especially when introducing a new product to sensitive skin.'
    },
    herbal: {
      desc: 'Herbal Relaxing Cream is a 35 g special-care cream created as a complementary comfort step after daily activity. Rather than replacing the core facial routine, it is presented as an additional self-care product focused on a relaxed, cared-for skin experience and should be used according to the product directions.',
      benefit: 'Complements a comfort-focused self-care routine and helps the skin feel cared for after activity. It is positioned as an additional special-care product that can be used according to personal needs and comfort.',
      use: 'Apply an appropriate amount to the desired area according to the directions on the packaging. Spread gently and adjust the amount based on personal comfort and individual skin compatibility.'
    }
  };

  const ingredientCopy = {
    'Niacinamide': 'Niacinamide is a widely used form of vitamin B3 in modern skincare. In cosmetic formulas it is commonly selected to support a brighter-looking, more even complexion, help maintain the appearance of a healthy skin barrier and complement routines focused on moisture and daily skin comfort.',
    'Sodium': '“Sodium” can refer to several different sodium-based cosmetic ingredients, and the role depends on the exact compound used in the formula. Depending on the ingredient, sodium-based materials can support hydration, texture, cleansing performance, formula stability or overall skin-conditioning performance.',
    'Collagen': 'Collagen in topical cosmetic products is commonly used as a skin-conditioning and moisture-supporting ingredient. On the skin surface it can help contribute to a smoother, softer and more hydrated feel as part of a consistent skincare or body-care routine.',
    'Aloe Vera Extract': 'Aloe vera extract is a botanical ingredient widely used in skincare because it pairs well with moisture- and comfort-focused formulas. It is commonly included to support a soothing skin feel, hydration and a softer, more comfortable finish.',
    'Licorice Extract': 'Licorice root extract is frequently used in cosmetic formulas designed around a calmer and brighter-looking complexion. It also fits antioxidant-focused skincare concepts and can complement routines that aim to keep the skin looking even, comfortable and well cared for.',
    'Ethyl Ascorbic Acid': 'Ethyl Ascorbic Acid, also known as 3-O-Ethyl Ascorbic Acid, is a vitamin C derivative used in cosmetic formulas. It is commonly selected for antioxidant support and for skincare concepts focused on a brighter-looking, more even and well-maintained complexion.',
    'Sodium DNA': 'Sodium DNA is used in selected cosmetic formulations as part of skin-conditioning and hydration-focused product concepts. In presentation language, its role is best described as supporting a moisturized, cared-for skin feel within the overall formula rather than as a stand-alone treatment claim.',
    'Titanium Dioxide': 'Titanium Dioxide is a mineral ingredient used in many types of cosmetic products. Depending on the formulation, it can contribute to opacity, visual appearance, texture and overall formula performance; its exact function should always be understood in the context of the specific product label.'
  };

  function setText(selector, text, root = document) {
    const node = $(selector, root);
    if (node) node.textContent = text;
  }

  function enrichProductData() {
    if (typeof products === 'undefined' || !Array.isArray(products)) return;
    products.forEach(product => {
      const copy = productCopy[product.id];
      if (!copy) return;
      product.desc = copy.desc;
      product.benefit = copy.benefit;
      product.use = copy.use;
    });

    if (typeof renderProducts === 'function') renderProducts('all');
    if (typeof setShowcase === 'function') setShowcase(0);
  }

  function enrichIngredientData() {
    if (typeof ingredients === 'undefined' || !Array.isArray(ingredients)) return;
    ingredients.forEach(item => {
      if (ingredientCopy[item.name]) item.desc = ingredientCopy[item.name];
    });
    if (ingredients[0]) setText('#ingredientDesc', ingredients[0].desc);
  }

  function enrichPageCopy() {
    setText('.hero-copy > p', 'Mejavi Skin+ is a modern Indonesian skin and body care brand built around a simple idea: everyday skincare should feel clear, comfortable and easy to follow. The presentation brings together the brand story, six core products, a complete daily-care set, selected ingredients, BPOM registration references and collaboration opportunities in one English-language experience created for meetings, pitches, events and partner presentations.');
    setText('.hero-media-card p', 'Explore the official Mejavi Skin+ visual identity, product lineup, daily ritual, selected ingredients and brand direction. Click this video area to open the brand film in full screen with sound.');

    setText('#story .section-head p', 'As demand grows, Mejavi Skin+ continues to strengthen its identity through a more refined visual system, clearer product communication and a presentation style that feels premium while remaining approachable. The brand direction keeps sensitive-skin comfort, consistent daily routines and thoughtful product experiences at the center of the story.');
    setText('#story .story-card.dark p', 'Mejavi Skin+ turns skincare into an easy-to-explain daily ritual: cleanse, support with serum, moisturize and continue care for the body. The brand combines selected cosmetic ingredients, clear usage guidance and a modern cream-and-gold identity so the product experience feels organized, contemporary and ready to be introduced to consumers, partners and collaborators.');
    const storyPoints = $$('#story .story-point span');
    const storyTexts = [
      'Comfort-first routines designed to be understandable, repeatable and easy to include in everyday skin care.',
      'Selected cosmetic ingredients presented with clear, responsible explanations focused on moisture, softness, skin comfort and a well-cared-for appearance.',
      'A cleaner and more premium brand identity developed to support product presentations, digital channels, retail conversations and future growth.',
      'An open-collaboration mindset for retailers, distributors, creators, communities, event partners and strategic business relationships.'
    ];
    storyPoints.forEach((node, index) => { if (storyTexts[index]) node.textContent = storyTexts[index]; });

    setText('#products .section-head p', 'The lineup covers facial cleansing, serum, moisturizing, body care and special care. Each product is shown with its official presentation size, BPOM registration reference, expanded product description, key presentation benefits and routine guidance. Retail pricing and checkout actions remain intentionally removed so this website can stay focused on professional brand and product presentation.');
    setText('.package-copy p', 'The Mejavi Skin+ Complete Package presents the core daily-care sequence in one coordinated set: Brightening Gentle Cleanser, Plump+Bright Serumiser, Lumiere Essence Hydra Cream, Fresh Hydra Cream and Radiance Treatment Body Serum. It is designed to help audiences understand how the products work together as a routine, while retail pricing remains intentionally omitted from this presentation website.');

    setText('#ingredients .section-head p', 'These ingredient stories translate selected cosmetic ingredients into clear presentation language for partners and audiences. Tap each ingredient to explore its general cosmetic role, while remembering that every Mejavi Skin+ product has its own specific formula and the product label remains the reference for the exact ingredient list and directions.');

    setText('#ritual .section-head p', 'The core routine is organized into a clear sequence so audiences can quickly understand where each Mejavi Skin+ product fits. The steps move from cleansing to serum and moisturizer, followed by body care after bathing; product amount and frequency should always be adjusted to the directions on the packaging and individual skin compatibility.');
    const ritualTexts = [
      'Wet the face and neck, apply Brightening Gentle Cleanser, massage gently in circular motions, rinse thoroughly and pat dry with a soft towel. This creates a clean and comfortable starting point for the next steps.',
      'Apply Plump+Bright Serumiser to freshly cleansed skin. Spread an appropriate amount gently and evenly, then allow the lightweight serum to absorb before applying moisturizer.',
      'Apply Lumiere Essence Hydra Cream in a thin, even layer to the face and neck after serumiser. Adjust the amount based on the skin’s moisture needs and comfort.',
      'Fresh Hydra Cream can be used as an alternative moisturizer in the morning or evening. Apply evenly to the face and neck and observe individual skin compatibility.',
      'After bathing, apply Radiance Treatment Body Serum to clean, dry body skin. Spread evenly and massage gently until absorbed, especially over areas that feel dry.'
    ];
    $$('#ritual .ritual-step p').forEach((node, index) => { if (ritualTexts[index]) node.textContent = ritualTexts[index]; });
    setText('.ritual-note', 'Presentation note: skincare results and individual skin responses can vary. Follow the directions on each product package, introduce new products gradually and reduce or discontinue use if the skin feels uncomfortable. For sensitive skin, a careful and consistent routine is more important than using too many products at once.');

    setText('#standards .section-head p', 'Professional presentations need more than visual appeal, so this version keeps key trust information visible while removing shopping mechanics. Product-level BPOM registration references, halal documentation context and sensitive-skin positioning help partners understand how Mejavi Skin+ communicates product responsibility and brand readiness.');
    const standards = $$('#standards .standard p');
    const standardTexts = [
      'Each core product in this presentation includes its BPOM registration reference so partners and audiences can identify the product clearly during brand introductions, meetings and collaboration discussions.',
      'Halal documentation is maintained as part of the official Mejavi Skin+ product information set and can support partner, retail and business discussions when documentation is required.',
      'The brand presentation focuses on daily skin comfort, moisture support, careful product use and easy-to-understand routines for audiences interested in sensitive-skin care.'
    ];
    standards.forEach((node, index) => { if (standardTexts[index]) node.textContent = standardTexts[index]; });

    setText('.collab-inner p', 'Mejavi Skin+ is open to building meaningful partnerships with retailers, distributors, resellers, creators, beauty communities, event organizers and strategic collaborators. The goal is to create partnerships that introduce the brand responsibly, communicate the product story clearly and expand Mejavi Skin+ through channels that fit its modern sensitive-skin positioning.');
  }

  function addVideoExperience() {
    const heroMedia = $('.hero-media');
    const heroVideo = $('.hero-media video');
    if (!heroMedia || !heroVideo || $('#presentationVideoViewer')) return;

    heroMedia.classList.add('is-video-trigger');
    heroMedia.setAttribute('role', 'button');
    heroMedia.setAttribute('tabindex', '0');
    heroMedia.setAttribute('aria-label', 'Play Mejavi Skin+ brand video full screen with sound');

    const style = document.createElement('style');
    style.textContent = `
      .hero-media.is-video-trigger{cursor:pointer}
      .hero-video-play{position:absolute;z-index:6;top:24px;right:24px;display:inline-flex;align-items:center;gap:9px;padding:11px 14px;border:1px solid rgba(255,255,255,.5);border-radius:999px;background:rgba(17,16,14,.35);color:#fff;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);font:500 9px/1 Poppins,sans-serif;letter-spacing:.12em;text-transform:uppercase;transition:.2s}
      .hero-video-play:before{content:'▶';font-size:11px}
      .hero-media:hover .hero-video-play{background:rgba(17,16,14,.58);transform:translateY(-1px)}
      .video-viewer{position:fixed;z-index:1000;inset:0;display:none;align-items:center;justify-content:center;background:#000;padding:0}
      .video-viewer.open{display:flex}
      .video-viewer video{width:100%;height:100%;object-fit:contain;background:#000}
      .video-viewer-close{position:absolute;z-index:4;top:max(18px,env(safe-area-inset-top));right:max(18px,env(safe-area-inset-right));width:48px;height:48px;border:1px solid rgba(255,255,255,.34);border-radius:50%;background:rgba(0,0,0,.45);color:#fff;font-size:28px;line-height:1;cursor:pointer;backdrop-filter:blur(10px)}
      .video-viewer-label{position:absolute;z-index:3;left:max(20px,env(safe-area-inset-left));bottom:max(20px,env(safe-area-inset-bottom));padding:10px 13px;border-radius:999px;background:rgba(0,0,0,.48);color:#fff;font:500 9px/1 Poppins,sans-serif;letter-spacing:.13em;text-transform:uppercase;pointer-events:none}
      @media(max-width:620px){.hero-video-play{top:16px;right:16px;padding:10px 12px}.video-viewer-close{width:44px;height:44px}}
    `;
    document.head.appendChild(style);

    const playHint = document.createElement('div');
    playHint.className = 'hero-video-play';
    playHint.textContent = 'Play Fullscreen · Sound On';
    heroMedia.appendChild(playHint);

    const viewer = document.createElement('div');
    viewer.id = 'presentationVideoViewer';
    viewer.className = 'video-viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-hidden', 'true');
    viewer.setAttribute('aria-label', 'Mejavi Skin+ brand film');
    viewer.innerHTML = `
      <button class="video-viewer-close" type="button" aria-label="Close video">×</button>
      <video id="presentationFullVideo" controls playsinline preload="metadata" poster="../produk.png">
        <source src="../mejavi-hero.mp4" type="video/mp4">
      </video>
      <div class="video-viewer-label">Mejavi Skin+ Brand Film · Sound On</div>
    `;
    document.body.appendChild(viewer);

    const fullVideo = $('#presentationFullVideo');
    const closeButton = $('.video-viewer-close', viewer);
    let closing = false;

    const restoreBodyLock = () => {
      const anotherOverlayOpen = $('#productModal')?.classList.contains('open') || $('#mobileMenu')?.classList.contains('open');
      if (!anotherOverlayOpen) document.body.classList.remove('lock');
    };

    const closeVideo = async (exitFullscreen = true) => {
      if (!viewer.classList.contains('open') || closing) return;
      closing = true;
      fullVideo.pause();
      fullVideo.currentTime = 0;
      viewer.classList.remove('open');
      viewer.setAttribute('aria-hidden', 'true');
      restoreBodyLock();
      if (exitFullscreen && document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch (_) {}
      }
      try { await heroVideo.play(); } catch (_) {}
      closing = false;
      heroMedia.focus({ preventScroll: true });
    };

    const openVideo = () => {
      if (viewer.classList.contains('open')) return;
      heroVideo.pause();
      viewer.classList.add('open');
      viewer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lock');
      fullVideo.currentTime = 0;
      fullVideo.muted = false;
      fullVideo.volume = 1;

      const playPromise = fullVideo.play();
      let fullscreenPromise;
      if (viewer.requestFullscreen) fullscreenPromise = viewer.requestFullscreen();
      else if (fullVideo.requestFullscreen) fullscreenPromise = fullVideo.requestFullscreen();
      else if (typeof fullVideo.webkitEnterFullscreen === 'function') {
        try { fullVideo.webkitEnterFullscreen(); } catch (_) {}
      }
      if (playPromise?.catch) playPromise.catch(() => {});
      if (fullscreenPromise?.catch) fullscreenPromise.catch(() => {});
    };

    heroMedia.addEventListener('click', openVideo);
    heroMedia.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openVideo();
      }
    });
    closeButton.addEventListener('click', event => {
      event.stopPropagation();
      closeVideo(true);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && viewer.classList.contains('open')) {
        event.preventDefault();
        closeVideo(true);
      }
    });
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && viewer.classList.contains('open') && !closing) closeVideo(false);
    });
    fullVideo.addEventListener('ended', () => {
      fullVideo.currentTime = 0;
    });
  }

  function init() {
    enrichProductData();
    enrichIngredientData();
    enrichPageCopy();
    addVideoExperience();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
