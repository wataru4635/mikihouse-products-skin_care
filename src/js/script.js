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

  // 使い方例
  observeElements(".js-fade-up");
  observeElements(".js-title-animation");
  observeElements(".js-slide-left");
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
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList; // 各キャンバスの色情報

  function init() {
    info.seconds = 0;
    info.t = 0;
    canvasList = [];
    colorList = [];

    // クラス指定で取得
    var canvases = document.querySelectorAll(".js-wave");
    canvases.forEach((c) => {
      canvasList.push(c);
      colorList.push(["#EBF8FF"]); // 色（必要に応じて個別設定可）
      c.width = document.documentElement.clientWidth;
      c.height = 200;
      c.contextCache = c.getContext("2d");
    });

    update();
  }

  // アニメーション速度
  const SPEED = 0.007;
  const FRAME_MS = 40;

  function update() {
    canvasList.forEach((canvas, i) => {
      if (!canvas || !canvas.contextCache) return;

      if (canvas.classList.contains("reverse")) {
        drawReverse(canvas, colorList[i]); // 下側で閉じる波
      } else {
        draw(canvas, colorList[i]); // 上側で閉じる波
      }
    });

    info.seconds += SPEED;
    info.t = info.seconds * Math.PI;
    setTimeout(update, FRAME_MS);
  }

  /* 通常波（上側で閉じる） */
  function draw(canvas, color) {
    var context = canvas.contextCache;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const isMobile = window.innerWidth <= 787;
    const zoomValue = isMobile ? 1 : 2.5;

    drawWave(canvas, color[0], 1, zoomValue, 0);
  }

  /* 逆波（下側で閉じる） */
  function drawReverse(canvas, color) {
    var context = canvas.contextCache;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const isMobile = window.innerWidth <= 787;
    const zoomValue = isMobile ? 1 : 2.5;

    drawWaveReverse(canvas, color[0], 1, zoomValue, 0);
  }

  /* 上側で閉じる */
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

  /* 下側で閉じる */
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

  /* サイン波本体 */
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

  /* リサイズ対応 */
  window.addEventListener("resize", function () {
    canvasList.forEach((canvas) => {
      canvas.width = document.documentElement.clientWidth;
    });
  });

  /* ===============================================
  # 商品詳細
  =============================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // 各セクションごとに初期化
    document.querySelectorAll('.baby-skincare-about-product').forEach(initProductGallery);

    function initProductGallery(root) {
      const mainImg = root.querySelector('.js-main-img-wrap img');
      const thumbsWrap = root.querySelector('.js-thumb-images');
      if (!mainImg || !thumbsWrap) return;

      // クリックで切り替え（イベント委譲）
      thumbsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.js-thumb');
        if (!btn || !thumbsWrap.contains(btn)) return;
        activate(btn);
      });

      // キーボード操作（Enter / Space）
      thumbsWrap.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const btn = e.target.closest('.js-thumb');
        if (!btn) return;
        e.preventDefault();
        activate(btn);
      });

      function activate(btn) {
        // is-active 付け替え（同一セクション内のみ）
        root.querySelectorAll('.js-thumb.is-active').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-current', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-current', 'true');

        // サムネ画像を取得してメインに反映
        const thumbImg = btn.querySelector('img');
        if (!thumbImg) return;

        // 画像切替
        swapImage(mainImg, thumbImg);
      }

      function swapImage(main, thumb) {
        // src / alt のみでOK（srcset/sizesを使っている場合はそちらも同期）
        if (thumb.currentSrc) {
          // currentSrcがあれば実際に表示中のURLを優先（ブラウザの選択結果）
          main.src = thumb.currentSrc;
        } else {
          main.src = thumb.getAttribute('src');
        }
        main.alt = thumb.getAttribute('alt') || '';
        // srcset/sizes を使っているなら以下も必要
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
        // 遅延デコード（描画ブロックを抑制）
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

  // URL/ID から動画IDを抽出（watch / youtu.be / shorts / 直接ID に対応）
  function extractVideoId(input) {
    if (!input) return "";
    // 直接ID（11文字）ならそのまま
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

    // URLパターン
    try {
      const u = new URL(input, location.origin);

      // 短縮 youtu.be/VIDEOID
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.split("/").filter(Boolean)[0];
        if (id) return id;
      }

      // 通常 watch?v=VIDEOID
      if (u.searchParams.has("v")) {
        return u.searchParams.get("v");
      }

      // shorts/VIDEOID
      if (u.pathname.includes("/shorts/")) {
        const parts = u.pathname.split("/shorts/")[1];
        if (parts) return parts.split("/")[0];
      }

      // embed/VIDEOID
      if (u.pathname.includes("/embed/")) {
        const parts = u.pathname.split("/embed/")[1];
        if (parts) return parts.split("/")[0];
      }
    } catch (_) {
      // 相対や不正文字列でも無視して次へ
    }

    return "";
  }

  function buildEmbedSrc(videoId, params = {}) {
    const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const q = new URLSearchParams({
      autoplay: 1,
      rel: 0,
      ...params,
    });
    return `${base}?${q.toString()}`;
  }

  function openModalWithVideo(input) {
    const videoId = extractVideoId(input);
    if (!videoId) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-hidden");

    const isMobile = window.innerWidth <= 768;
    const setSrc = () => {
      iframe.src = buildEmbedSrc(videoId);
    };

    if (isMobile) {
      setSrc();
    } else {
      setTimeout(setSrc, 300); // PCはフェード演出等の猶予
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

  // イベント付与（複数サムネイル対応）
  triggers.forEach(btn => {
    btn.addEventListener("click", () => {
      openModalWithVideo(btn.dataset.video);
    });
  });

  // 背景クリック閉じ
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ボタン閉じ
  closeBtn.addEventListener("click", closeModal);

  // Esc キー閉じ
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
        hide: false, // ← Swiper側の自動フェードは使わず、手動で制御
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
        } // 画像で幅が変わる場合に備える
      }
    });

    // 初期化直後に一度遅延チェック（フォント読み込み等で幅が変わる対策）
    requestAnimationFrame(() => toggleScrollbar(swiper));

    function toggleScrollbar(swiper) {
      const scrollbarEl = swiper.scrollbar ?.el;
      if (!scrollbarEl) return;

      // 全スライドの合計幅を算出（余白も含めた実寸で判定）
      const totalWidth = Array.from(swiper.slides).reduce((sum, slide) => {
        // スライド幅 + spaceBetween を概算
        const w = slide.getBoundingClientRect().width;
        return sum + w + (swiper.params.spaceBetween || 0);
      }, 0);

      // 表示領域（コンテナの可視横幅）
      const containerWidth = swiper.width;

      // カルーセル要素を取得
      const carousel = document.querySelector('.baby-skincare-user-voice_carousel');

      if (totalWidth > containerWidth + 1) {
        // はみ出している → 表示
        scrollbarEl.style.display = "";
        // サイズ再計算（念のため）
        swiper.scrollbar.updateSize ?.();
        // カルーセルのポインターイベントを有効化
        if (carousel) {
          carousel.style.pointerEvents = "auto";
        }
      } else {
        // 収まっている → 非表示
        scrollbarEl.style.display = "none";
        // カルーセルのポインターイベントを無効化
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
      // 親要素のfaq__itemを取得
      const faqItem = question.closest('.baby-skincare-faq__item');
      // is-openクラスをトグル
      const isOpen = faqItem.classList.toggle('is-open');

      // 回答部分を取得
      const answer = faqItem.querySelector('.baby-skincare-faq__item-answer');

      if (isOpen) {
        // 開く場合は高さを設定
        const scrollHeight = answer.scrollHeight;
        answer.style.maxHeight = scrollHeight + 'px';
      } else {
        // 閉じる場合は高さを0に
        answer.style.maxHeight = '0';
      }
    });
  });
};

// ===============================
// スクロール復元を無効化（全ブラウザで安定）
// ===============================
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// （任意）初回表示時のハッシュジャンプを抑止
// 途中リロード対策として常にトップ開始にする運用なら有効
if (location.hash) {
  history.replaceState(null, '', location.pathname + location.search);
}

// ===============================
// ここから任意の他初期化（例: FAQ）
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  try {
    // あれば。無ければこの行は削除OK
    setupFaqAccordion();
  } catch (_) {}
});

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

  // ※ fromTo は進捗同期の観点では to の方が安定だが、
  //   ご要望通り現状の値でfromTo継続する場合は immediateRender:false を必ず付ける
  gsap.fromTo(".water-drop--01", { top: "-0.5%" }, { top: "90%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--02", { top: "0.6%" },  { top: "90%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--03", { top: "1.5%" },  { top: "90%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--04", { top: "3.5%" },  { top: "87%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--05", { top: "4.7%" },  { top: "70%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--06", { top: "5.5%" },  { top: "81%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--07", { top: "6.5%" },  { top: "82%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--08", { top: "8%" },    { top: "83%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--09", { top: "10%" },   { top: "84%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--10", { top: "11%" },   { top: "85%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--11", { top: "13%" },   { top: "86%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--12", { top: "14%" },   { top: "87%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--13", { top: "15%" },   { top: "88%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--14", { top: "16%" },   { top: "89%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--15", { top: "17%" },   { top: "90%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--16", { top: "18%" },   { top: "91%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--17", { top: "19%" },   { top: "92%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--18", { top: "20%" },   { top: "94%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--19", { top: "21%" },   { top: "95.5%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--20", { top: "22%" },   { top: "97%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--21", { top: "23%" },   { top: "98.1%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--22", { top: "24%" },   { top: "100%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--23", { top: "25%" },   { top: "100%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--24", { top: "26%" },   { top: "102.7%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });
  gsap.fromTo(".water-drop--25", { top: "27%" },   { top: "102%", ease: "none", immediateRender: false, scrollTrigger: baseTrigger });

  // レイアウトが落ち着いてから最終リフレッシュ（フォント/画像で高さが変わる対策）
  setTimeout(() => ScrollTrigger.refresh(), 0);
}

// ===============================
// 表示時は必ずトップへ → 安定してから初期化
// ===============================
function resetToTopAndInit() {
  // CSSの smooth-scroll の影響を避けて即座に0,0へ
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);

  // 2〜3フレーム待ってから初期化（スクロールが安定するのを待つ）
  let frames = 3;
  function tick() {
    if (frames-- <= 0) {
      html.style.scrollBehavior = prev || '';
      initDrops();
      ScrollTrigger.refresh();
    } else {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);
}

// 通常ロード時
window.addEventListener('load', () => {
  // フォント読み込みを待てる環境なら待ってから実行
  const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(() => resetToTopAndInit());
}, { once: true });

// bfcache（戻る/リロード復帰）でも必ずトップへ
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(() => resetToTopAndInit());
  }
});

/* ===============================================
# 水滴アニメーション
=============================================== */

document.querySelectorAll('.water-drop').forEach(el => {
  const img = el.querySelector('img');

  // 縦揺れ: 3.8〜5.8s
  const durY = (3.8 + Math.random() * 2).toFixed(2);
  img.style.setProperty('--dur-y', `${durY}s`);

  // 位相ずらし（同調防止）
  const phaseShift = (Math.random() * 3).toFixed(2);
  img.style.animationDelay = `-${phaseShift}s`;
});
