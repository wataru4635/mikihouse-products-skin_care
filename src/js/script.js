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
  observeElements(".js-fade-in");
  observeElements(".js-clip-img");
  observeElements(".js-scaleImg");

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

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {
    info.seconds = 0;
    info.t = 0;
		canvasList = [];
    colorList = [];
    // canvas1個めの色指定
    canvasList.push(document.getElementById("waveCanvas"));
    colorList.push(['#EBF8FF']);
	// 各キャンバスの初期化
		for(var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = document.documentElement.clientWidth; //Canvasのwidthをウィンドウの幅に合わせる
        canvas.height = 200;//波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
    // 共通の更新処理呼び出し
		update();
}

const SPEED = 0.007;   // ← 0.014 から下げてゆっくり
const FRAME_MS = 40;   // ← 35ms から少し長く（任意）

function update() {
  for (var canvasIndex in canvasList) {
    var canvas = canvasList[canvasIndex];
    draw(canvas, colorList[canvasIndex]);
  }
  info.seconds += SPEED;
  info.t = info.seconds * Math.PI;
  setTimeout(update, FRAME_MS);
}

/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
		// 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    // モバイルサイズかどうかを判定
    const isMobile = window.innerWidth <= 787;
    const zoomValue = isMobile ? 1 : 2.5;

    //波を描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
    drawWave(canvas, color[0], 1, zoomValue, 0);//drawWave(canvas, color[0],0.5, 3, 0);とすると透過50%の波が出来る
}

/**
* 波を描画
* drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
*/
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

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay) {
    var xAxis = Math.floor(canvas.height/2);
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x)/zoom;
    context.moveTo(yAxis, unit*y+xAxis); //スタート位置にパスを置く

    // モバイルサイズかどうかを判定
    const isMobile = window.innerWidth <= 787;
    // モバイルの場合は振幅を小さくする
    const amplitude = isMobile ? 0.3 : 0.5;

    // Loop to draw segments (横幅の分、波を描画)
    for (let i = yAxis; i <= canvas.width + 5; i += 5) {
      x = t + (-yAxis + i) / unit / zoom;
      y = -Math.sin(x - delay) * amplitude;  // 振幅を調整
      context.lineTo(i, unit*y + xAxis);
  }  
}

init();

// ウィンドウリサイズ時にキャンバスサイズを更新
window.addEventListener('resize', function() {
  for(var canvasIndex in canvasList) {
    var canvas = canvasList[canvasIndex];
    canvas.width = document.documentElement.clientWidth;
  }
});