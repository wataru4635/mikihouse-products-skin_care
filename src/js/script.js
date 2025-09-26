  /* ===============================================
  # アニメーション
  // =============================================== */
  function observeElements(selector, activeClass = "is-active") {
    const elements = document.querySelectorAll(selector);

    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(activeClass);
          observer.unobserve(entry.target);
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersect);

    elements.forEach((element) => observer.observe(element));
  }

  observeElements(".js-fade-up");
  observeElements(".js-title-animation");
  observeElements(".js-slide-right");
  observeElements(".js-step-animation");
  observeElements(".js-animation");
  observeElements(".js-mask__animation");
  observeElements(".js-blur-animation");

  // =======================
  // 文字を1文字ずつ <span> に分割
  // =======================
  function wrapTextInSpans(selector) {
    document.querySelectorAll(selector).forEach(element => {
      const text = element.textContent;
      element.setAttribute('aria-label', text);
      element.setAttribute('role', 'text');
      element.textContent = '';
      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.setProperty('--index', index);
        span.setAttribute('aria-hidden', 'true');
        element.appendChild(span);
      });
    });
  }
  wrapTextInSpans(".js-text-split");


  /* ===============================================
    # 波
    =============================================== */
  var unit = 100,
    canvasList,
    info = {},
    colorList;

  function init() {
    info.seconds = 0;
    info.t = 0;
    canvasList = [];
    colorList = [];

    var canvases = document.querySelectorAll(".js-wave");
    canvases.forEach((c) => {
      canvasList.push(c);
      colorList.push(["#EBF8FF"]);
      c.width = document.documentElement.clientWidth;
      c.height = 200;
      c.contextCache = c.getContext("2d");
    });

    update();
  }

  const SPEED = 0.007;
  const FRAME_MS = 40;

  function update() {
    canvasList.forEach((canvas, i) => {
      if (!canvas || !canvas.contextCache) return;

      if (canvas.classList.contains("reverse")) {
        drawReverse(canvas, colorList[i]);
      } else {
        draw(canvas, colorList[i]);
      }
    });

    info.seconds += SPEED;
    info.t = info.seconds * Math.PI;
    setTimeout(update, FRAME_MS);
  }

  function draw(canvas, color) {
    var context = canvas.contextCache;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const isMobile = window.innerWidth <= 787;
    const zoomValue = isMobile ? 1 : 2.5;

    drawWave(canvas, color[0], 1, zoomValue, 0);
  }

  function drawReverse(canvas, color) {
    var context = canvas.contextCache;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const isMobile = window.innerWidth <= 787;
    const zoomValue = isMobile ? 1 : 2.5;

    drawWaveReverse(canvas, color[0], 1, zoomValue, 0);
  }

  function drawWave(canvas, color, alpha, zoom, delay) {
    var context = canvas.contextCache;
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();

    drawSine(canvas, info.t / 0.5, zoom, delay);

    context.lineTo(canvas.width + 10, 0);
    context.lineTo(0, 0);

    context.closePath();
    context.fill();
  }

  function drawWaveReverse(canvas, color, alpha, zoom, delay) {
    var context = canvas.contextCache;
    context.fillStyle = color;
    context.globalAlpha = alpha;
    context.beginPath();

    drawSine(canvas, info.t / 0.5, zoom, delay);

    context.lineTo(canvas.width + 10, canvas.height);
    context.lineTo(0, canvas.height);

    context.closePath();
    context.fill();
  }

  function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height / 2);
    var yAxis = 0;
    var context = canvas.contextCache;

    var x = t;
    var y = Math.sin(x) / zoom;
    context.moveTo(yAxis, unit * y + xAxis);

    const isMobile = window.innerWidth <= 787;
    const amplitude = isMobile ? 0.3 : 0.5;

    for (let i = yAxis; i <= canvas.width + 5; i += 5) {
      x = t + (-yAxis + i) / unit / zoom;
      y = -Math.sin(x - delay) * amplitude;
      context.lineTo(i, unit * y + xAxis);
    }
  }

  init();

  window.addEventListener("resize", function () {
    canvasList.forEach((canvas) => {
      canvas.width = document.documentElement.clientWidth;
    });
  });

  /* ===============================================
  # 商品詳細
  =============================================== */
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.baby-skincare-about-product').forEach(initProductGallery);

    function initProductGallery(root) {
      const mainImg = root.querySelector('.js-main-img-wrap img');
      const thumbsWrap = root.querySelector('.js-thumb-images');
      if (!mainImg || !thumbsWrap) return;

      thumbsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-thumb');
        if (!btn || !thumbsWrap.contains(btn)) return;
        activate(btn);
      });

      thumbsWrap.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const btn = e.target.closest('.js-thumb');
        if (!btn) return;
        e.preventDefault();
        activate(btn);
      });

      function activate(btn) {
        root.querySelectorAll('.js-thumb.is-active').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-current', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-current', 'true');

        const thumbImg = btn.querySelector('img');
        if (!thumbImg) return;

        swapImage(mainImg, thumbImg);
      }

      function swapImage(main, thumb) {
        if (thumb.currentSrc) {
          main.src = thumb.currentSrc;
        } else {
          main.src = thumb.getAttribute('src');
        }
        main.alt = thumb.getAttribute('alt') || '';
        if (thumb.getAttribute('srcset')) {
          main.setAttribute('srcset', thumb.getAttribute('srcset'));
        } else {
          main.removeAttribute('srcset');
        }
        if (thumb.getAttribute('sizes')) {
          main.setAttribute('sizes', thumb.getAttribute('sizes'));
        } else {
          main.removeAttribute('sizes');
        }
        main.decoding = 'async';
      }
    }
  });

  /* ===============================================
  # YouTubeモーダル（複数動画対応）
  =============================================== */
  const modal = document.getElementById("youtubeModal");
  const iframe = document.getElementById("youtubeFrame");
  const triggers = document.querySelectorAll(".js-open-youtube");
  const closeBtn = document.querySelector(".youtube-modal__close");

  function extractVideoInfo(input) {
    if (!input) return {
      id: "",
      start: 0
    };

    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return {
      id: input,
      start: 0
    };

    try {
      const u = new URL(input, location.origin);

      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.split("/").filter(Boolean)[0];
        const start = parseStartTime(u);
        return {
          id,
          start
        };
      }

      if (u.searchParams.has("v")) {
        const id = u.searchParams.get("v");
        const start = parseStartTime(u);
        return {
          id,
          start
        };
      }

      if (u.pathname.includes("/shorts/")) {
        const parts = u.pathname.split("/shorts/")[1];
        return {
          id: parts?.split("/")[0] || "",
          start: parseStartTime(u)
        };
      }

      if (u.pathname.includes("/embed/")) {
        const parts = u.pathname.split("/embed/")[1];
        return {
          id: parts?.split("/")[0] || "",
          start: parseStartTime(u)
        };
      }
    } catch (_) {}

    return {
      id: "",
      start: 0
    };
  }

  function parseStartTime(u) {
    let t = u.searchParams.get("t") || "";
    if (!t) return 0;

    let seconds = 0;
    const match = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (match) {
      const [, h, m, s] = match.map(n => parseInt(n || "0", 10));
      seconds = h * 3600 + m * 60 + s;
    } else if (/^\d+$/.test(t)) {
      seconds = parseInt(t, 10);
    }
    return seconds;
  }

  function buildEmbedSrc(videoId, start = 0, params = {}) {
    const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const q = new URLSearchParams({
      autoplay: 1,
      rel: 0,
      start,
      ...params,
    });
    return `${base}?${q.toString()}`;
  }

  function openModalWithVideo(input) {
    const {
      id,
      start
    } = extractVideoInfo(input);
    if (!id) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-hidden");

    const isMobile = window.innerWidth <= 768;
    const setSrc = () => {
      iframe.src = buildEmbedSrc(id, start);
    };

    if (isMobile) {
      setSrc();
    } else {
      setTimeout(setSrc, 300);
    }
  }


  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-hidden");
    setTimeout(() => {
      iframe.src = "";
    }, 300);
  }

  triggers.forEach(btn => {
    btn.addEventListener("click", () => {
      openModalWithVideo(btn.dataset.video);
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  /* ===============================================
  # トップページのスライダー機能（はみ出し時のみスクロールバー表示）
  =============================================== */
  document.addEventListener("DOMContentLoaded", function () {
    const carouselWrap = document.querySelector(".baby-skincare-user-voice_carousel_wrap");

    if (!carouselWrap) return;

    const swiper = new Swiper(".baby-skincare-user-voice_carousel_wrap", {
      loop: false,
      centeredSlides: false,
      slidesPerView: "auto",
      grabCursor: true,
      scrollbar: {
        el: ".baby-skincare-user-voice_carousel_scrollbar",
        hide: false,
        draggable: true,
        dragSize: 120,
      },
      freeMode: {
        enabled: true,
        sticky: false,
        momentumBounce: false,
      },
      breakpoints: {
        800: {
          scrollbar: {
            dragSize: 200
          },
        },
      },
      on: {
        init() {
          toggleScrollbar(this);
        },
        resize() {
          toggleScrollbar(this);
        },
        update() {
          toggleScrollbar(this);
        },
        imagesReady() {
          toggleScrollbar(this);
        }
      }
    });

    requestAnimationFrame(() => toggleScrollbar(swiper));

    function toggleScrollbar(swiper) {
      const scrollbarEl = swiper.scrollbar?.el;
      if (!scrollbarEl) return;

      const totalWidth = Array.from(swiper.slides).reduce((sum, slide) => {
        const w = slide.getBoundingClientRect().width;
        return sum + w + (swiper.params.spaceBetween || 0);
      }, 0);

      const containerWidth = swiper.width;

      const carousel = document.querySelector('.baby-skincare-user-voice_carousel');

      if (totalWidth > containerWidth + 1) {
        scrollbarEl.style.display = "";
        swiper.scrollbar.updateSize?.();
        if (carousel) {
          carousel.style.pointerEvents = "auto";
        }
      } else {
        scrollbarEl.style.display = "none";
        if (carousel) {
          carousel.style.pointerEvents = "none";
        }
      }
    }
  });

  /* ===============================================
# よくある質問のアコーディオン機能
=============================================== */
  const setupFaqAccordion = () => {
    const faqQuestions = document.querySelectorAll('.js-faq-question');

    if (!faqQuestions.length) return;

    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.baby-skincare-faq__item');
        const isOpen = faqItem.classList.toggle('is-open');

        const answer = faqItem.querySelector('.baby-skincare-faq__item-answer');

        if (isOpen) {
          const scrollHeight = answer.scrollHeight;
          answer.style.maxHeight = scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    });
  };

  gsap.registerPlugin(ScrollTrigger);

  // ===============================
  // GSAP: 水滴アニメーション本体
  // ===============================
  function initDrops() {
    const baseTrigger = {
      trigger: document.documentElement,
      start: "top top",
      end: "max",
      scrub: true,
      invalidateOnRefresh: true
    };

    gsap.fromTo(".water-drop--01", {
      top: "-0.5%"
    }, {
      top: "90%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--02", {
      top: "0.6%"
    }, {
      top: "90%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--03", {
      top: "1.5%"
    }, {
      top: "90%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--04", {
      top: "3.5%"
    }, {
      top: "87%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--05", {
      top: "4.5%"
    }, {
      top: "70%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--08", {
      top: "8%"
    }, {
      top: "83%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--09", {
      top: "10%"
    }, {
      top: "84%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--12", {
      top: "14%"
    }, {
      top: "87%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--13", {
      top: "15%"
    }, {
      top: "88%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--16", {
      top: "18%"
    }, {
      top: "91%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--17", {
      top: "19%"
    }, {
      top: "92%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--18", {
      top: "20%"
    }, {
      top: "94%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--21", {
      top: "23%"
    }, {
      top: "98.1%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--23", {
      top: "25%"
    }, {
      top: "100%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
    gsap.fromTo(".water-drop--24", {
      top: "26%"
    }, {
      top: "102.7%",
      ease: "none",
      immediateRender: false,
      scrollTrigger: baseTrigger
    });
  }

  // ===============================================
  // スクロール復元の完全無効化 + アンカーのsmooth維持
  // ===============================================
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (location.hash) {
    history.replaceState(null, '', location.pathname + location.search);
  }

  const FORCE_TOP_STYLE_ID = 'force-top-style';

  function ensureForceTopStyle() {
    if (document.getElementById(FORCE_TOP_STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = FORCE_TOP_STYLE_ID;
    s.textContent = `html.is-force-top { scroll-behavior: auto !important; }`;
    document.head.appendChild(s);
  }

  function forceTop(frames = 6) {
    ensureForceTopStyle();
    const html = document.documentElement;
    html.classList.add('is-force-top');

    let canceled = false;
    const cancel = () => {
      if (canceled) return;
      canceled = true;
      html.classList.remove('is-force-top');
      window.removeEventListener('wheel', cancel, true);
      window.removeEventListener('touchstart', cancel, true);
      window.removeEventListener('keydown', cancel, true);
      window.removeEventListener('mousedown', cancel, true);
    };
    window.addEventListener('wheel', cancel, true);
    window.addEventListener('touchstart', cancel, true);
    window.addEventListener('keydown', cancel, true);
    window.addEventListener('mousedown', cancel, true);

    let n = frames;
    const step = () => {
      if (canceled) return;
      window.scrollTo(0, 0);
      if (--n > 0) requestAnimationFrame(step);
      else cancel();
    };
    requestAnimationFrame(step);
  }

  function runInits() {
    try {
      typeof setupFaqAccordion === 'function' && setupFaqAccordion();
    } catch (_) {}
    try {
      typeof initDrops === 'function' && initDrops();
    } catch (_) {}
    if (window.ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh();
    }
  }

  window.addEventListener('load', () => {
    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    forceTop(4);
    fontsReady.then(() => {
      forceTop(4);
      requestAnimationFrame(runInits);
    });
  }, {
    once: true
  });

  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    forceTop(4);
    requestAnimationFrame(runInits);
  });

  // ===============================================
  // 水滴のCSSゆらぎ（初期値だけJSで付与）
  // ===============================================
  document.querySelectorAll('.water-drop').forEach(el => {
    const img = el.querySelector('img');
    if (!img) return;
    const durY = (3.8 + Math.random() * 2).toFixed(2);
    img.style.setProperty('--dur-y', `${durY}s`);
    const phaseShift = (Math.random() * 3).toFixed(2);
    img.style.animationDelay = `-${phaseShift}s`;
  });