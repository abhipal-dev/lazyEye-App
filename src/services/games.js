// Clinical Dichoptic Games for LazyEye Therapy
// 11 Comprehensive Vision Training Engines with Chromatic Anaglyph Filtering

export const GAME_IMAGES = {
  snake: require('../assets/games/snake.png'),
  flappy: require('../assets/games/flappy.png'),
  menja: require('../assets/games/menja.png'),
  tetris: require('../assets/games/tetris.png'),
  bubbleshooter: require('../assets/games/bubbleshooter.png'),
  pingpong: require('../assets/games/pingpong.png'),
  stickyholds: require('../assets/games/stickyholds.png'),
  maze: require('../assets/games/maze.png'),
  ballcatcher: require('../assets/games/ballcatcher.png'),
  bouncingball: require('../assets/games/bouncingball.png'),
  bricksbreaker: require('../assets/games/bricksbreaker.jpeg'),
};

export const GAMES = [
  // 1. Snake Game
  {
    id: 'snake',
    title: 'Snake Macular Fixation',
    category: 'Binocular Focus',
    badgeClass: 'badge-emerald',
    description: 'Guide the snake to hunt moving targets. Red-cyan filtering splits the snake and food between eyes to break suppression.',
    image: GAME_IMAGES.snake,
    iconLibrary: 'MaterialCommunityIcons',
    iconName: 'snake',
    duration: 20,
    route: '/game1snake',
    getUrl: () => 'https://lazyeye.onrender.com/game1snake',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Snake Macular Fixation</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #090D1A; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 10px)); }
    .hud { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: rgba(19, 29, 54, 0.85); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; margin-bottom: 6px; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; width: 100%; height: 100%; min-height: 0; display: flex; align-items: center; justify-content: center; }
    canvas { background: #000000; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 10px; display: block; touch-action: none; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Apples: <span class="score-box" id="score">0</span></span>
    <span>L: <span style="color:${leftColor}">●</span> R: <span style="color:${rightColor}">●</span></span>
    <span style="font-size:11px; color:#94A3B8;">Swipe to turn</span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <script>
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const snakeColor = '${leftColor}';
    const appleColor = '${rightColor}';
    let COLS = 16, ROWS = 24;
    let grid = 18;
    function resize() {
      const availW = wrap.clientWidth || (window.innerWidth - 16);
      const availH = wrap.clientHeight || (window.innerHeight - 56);
      const targetGrid = Math.max(14, Math.min(24, Math.floor(availW / 16)));
      COLS = Math.floor(availW / targetGrid);
      ROWS = Math.floor(availH / targetGrid);
      grid = targetGrid;
      canvas.width = COLS * grid;
      canvas.height = ROWS * grid;
    }
    resize();
    window.addEventListener('resize', resize);
    let snake = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
    let dir = { x: 1, y: 0 }, nextDir = { x: 1, y: 0 };
    let apple = { x: 11, y: 10 }, score = 0, speedCounter = 0;
    function respawnApple() {
      apple.x = Math.floor(Math.random() * (COLS - 2)) + 1;
      apple.y = Math.floor(Math.random() * (ROWS - 2)) + 1;
    }
    function loop() {
      requestAnimationFrame(loop);
      if (++speedCounter < 8) return;
      speedCounter = 0;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0) head.x = COLS - 1; else if (head.x >= COLS) head.x = 0;
      if (head.y < 0) head.y = ROWS - 1; else if (head.y >= ROWS) head.y = 0;
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        snake = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
        dir = { x: 1, y: 0 }; nextDir = { x: 1, y: 0 };
        return;
      }
      snake.unshift(head);
      if (head.x === apple.x && head.y === apple.y) {
        score++;
        document.getElementById('score').innerText = score;
        respawnApple();
      } else { snake.pop(); }
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = appleColor;
      context.beginPath();
      context.arc((apple.x + 0.5) * grid, (apple.y + 0.5) * grid, (grid - 2) / 2, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = snakeColor;
      snake.forEach(s => context.fillRect(s.x * grid + 1, s.y * grid + 1, grid - 2, grid - 2));
    }
    requestAnimationFrame(loop);
    function setUp() { if (dir.y === 0) nextDir = { x: 0, y: -1 }; }
    function setDown() { if (dir.y === 0) nextDir = { x: 0, y: 1 }; }
    function setLeft() { if (dir.x === 0) nextDir = { x: -1, y: 0 }; }
    function setRight() { if (dir.x === 0) nextDir = { x: 1, y: 0 }; }
    
    // Smooth Touch Swipe Gestures
    let touchX = 0, touchY = 0;
    window.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) setRight();
        else if (dx < -20) setLeft();
      } else {
        if (dy > 20) setDown();
        else if (dy < -20) setUp();
      }
    }, { passive: true });
  </script>
</body>
</html>`,
  },

  // 2. Flappy Bird
  {
    id: 'flappy',
    title: 'Flappy Bird Dual Flight',
    category: 'Depth Perception',
    badgeClass: 'badge-sky',
    description: 'Navigate altitude obstacles with saccadic eye movements. Color separation forces both eyes to coordinate clearances.',
    image: GAME_IMAGES.flappy,
    iconLibrary: 'Ionicons',
    iconName: 'airplane-outline',
    duration: 15,
    route: '/game2flappybird',
    getUrl: () => 'https://lazyeye.onrender.com/game2flappybird',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Flappy Bird Dual Flight</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #090D1A; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #020617; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Passed: <span class="score-box" id="score">0</span></span>
    <span>Bird: <span style="color:${leftColor}">●</span> Pipes: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Tap anywhere on screen to flap altitude</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const birdColor = '${leftColor}';
    const pipeColor = '${rightColor}';
    function resize() {
      const w = Math.min(360, wrap.clientWidth);
      const h = Math.min(520, wrap.clientHeight);
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener('resize', resize);
    let birdY = 200, birdV = 0, gravity = 0.35, lift = -6;
    let pipes = [], frame = 0, score = 0, gameOver = false;
    function flap() {
      if (gameOver) {
        birdY = canvas.height / 2; birdV = 0; pipes = []; score = 0; gameOver = false;
        document.getElementById('score').innerText = 0;
        return;
      }
      birdV = lift;
    }
    window.addEventListener('pointerdown', flap);
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!gameOver) {
        birdV += gravity;
        birdY += birdV;
        if (birdY > canvas.height - 20) { birdY = canvas.height - 20; gameOver = true; }
        if (birdY < 10) birdY = 10;
        if (frame++ % 90 === 0) {
          const gap = 120;
          const topH = Math.floor(Math.random() * (canvas.height - gap - 60)) + 30;
          pipes.push({ x: canvas.width, top: topH, bottom: canvas.height - topH - gap, passed: false });
        }
        pipes.forEach(p => {
          p.x -= 2.2;
          if (!p.passed && p.x < 60) {
            p.passed = true; score++;
            document.getElementById('score').innerText = score;
          }
          if (p.x < 80 && p.x + 40 > 50) {
            if (birdY - 14 < p.top || birdY + 14 > canvas.height - p.bottom) { gameOver = true; }
          }
        });
        pipes = pipes.filter(p => p.x > -50);
      }
      ctx.fillStyle = pipeColor;
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 42, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, 42, p.bottom);
      });
      ctx.fillStyle = birdColor;
      ctx.beginPath();
      ctx.arc(65, birdY, 15, 0, Math.PI * 2);
      ctx.fill();
      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Tap to Restart Flight', canvas.width / 2, canvas.height / 2);
      }
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>`,
  },

  // 3. Menja 3D (Block Slicing)
  {
    id: 'menja',
    title: 'Menja 3D Geometric Slicing',
    category: 'Spatial Reflex',
    badgeClass: 'badge-indigo',
    description: 'Dynamic 3D block slicing challenge. Exercises rapid cortical reaction velocity, stereoscopic depth, and contrast sensitivity.',
    image: GAME_IMAGES.menja,
    iconLibrary: 'Ionicons',
    iconName: 'cube-outline',
    duration: 20,
    route: '/game12menja',
    getUrl: () => 'https://lazyeye.onrender.com/game12menja',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Menja 3D Slicing</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #050814; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: radial-gradient(circle at center, #0F172A 0%, #020617 100%); border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Sliced: <span class="score-box" id="score">0</span></span>
    <span>L: <span style="color:${leftColor}">●</span> R: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Swipe your finger across flying 3D blocks to slice them</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const c1 = '${leftColor}';
    const c2 = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    let cubes = [], score = 0, trail = [];
    function spawnCube() {
      const isLeft = Math.random() > 0.5;
      cubes.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 5 - 8,
        size: Math.random() * 20 + 32,
        rot: 0,
        rotV: (Math.random() - 0.5) * 0.1,
        color: isLeft ? c1 : c2,
        sliced: false
      });
    }
    let spawnTimer = 0;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (++spawnTimer % 45 === 0) spawnCube();
      cubes.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.22;
        c.rot += c.rotV;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();
      });
      cubes = cubes.filter(c => c.y < canvas.height + 60 && !c.sliced);
      if (trail.length > 1) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
      trail = trail.slice(-6);
    }
    requestAnimationFrame(loop);
    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const tx = e.touches[0].clientX - rect.left;
      const ty = e.touches[0].clientY - rect.top;
      trail.push({ x: tx, y: ty });
      cubes.forEach(c => {
        const dist = Math.hypot(c.x - tx, c.y - ty);
        if (dist < c.size) {
          c.sliced = true; score += 10;
          document.getElementById('score').innerText = score;
        }
      });
    }, { passive: true });
    canvas.addEventListener('touchend', () => { trail = []; });
  </script>
</body>
</html>`,
  },

  // 4. Tetris Fusion
  {
    id: 'tetris',
    title: 'Tetris Fusion Alignment',
    category: 'Pattern Synthesis',
    badgeClass: 'badge-purple',
    description: 'Falling-block puzzle adapted for vision therapy. Color-filtered tetrominoes train simultaneous cortical vision and hand-eye sync.',
    image: GAME_IMAGES.tetris,
    iconLibrary: 'Ionicons',
    iconName: 'grid-outline',
    duration: 20,
    route: '/game8tetris',
    getUrl: () => 'https://lazyeye.onrender.com/game8tetris',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Tetris Fusion Alignment</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #090D1A; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 10px)); box-sizing: border-box; }
    .hud { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: rgba(19, 29, 54, 0.85); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; margin-bottom: 6px; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; width: 100%; height: 100%; min-height: 0; display: flex; align-items: center; justify-content: center; }
    canvas { background: #000000; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 10px; display: block; touch-action: none; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Score: <span class="score-box" id="score">0</span></span>
    <span>Lines: <span id="lines" style="color:#A7F3D0">0</span></span>
    <span>L: <span style="color:${leftColor}">●</span> R: <span style="color:${rightColor}">●</span></span>
    <span style="font-size:11px; color:#94A3B8;">Tap: Rotate • Swipe: Move</span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <script>
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const leftEyeColor = '${leftColor}';
    const rightEyeColor = '${rightColor}';
    const COLS = 10, ROWS = 20;
    function resize() {
      const availW = wrap.clientWidth || (window.innerWidth - 16);
      const availH = wrap.clientHeight || (window.innerHeight - 56);
      const grid = Math.max(14, Math.min(Math.floor(availW / COLS), Math.floor(availH / ROWS)));
      canvas.width = grid * COLS; canvas.height = grid * ROWS; window.grid = grid;
    }
    resize();
    window.addEventListener('resize', resize);
    const tetrominos = {
      'I': [[1,1,1,1]], 'J': [[1,0,0],[1,1,1]], 'L': [[0,0,1],[1,1,1]], 'O': [[1,1],[1,1]], 'S': [[0,1,1],[1,1,0]], 'Z': [[1,1,0],[0,1,1]], 'T': [[0,1,0],[1,1,1]]
    };
    let playfield = [];
    for (let r = 0; r < ROWS; r++) playfield[r] = new Array(COLS).fill(0);
    let current = null, score = 0, lines = 0, gameOver = false, dropCounter = 0;
    function spawnPiece() {
      const keys = Object.keys(tetrominos);
      const name = keys[Math.floor(Math.random() * keys.length)];
      const matrix = tetrominos[name];
      current = { name, matrix, row: 0, col: Math.floor((COLS - matrix[0].length) / 2) };
      if (!isValid(current.matrix, current.row, current.col)) gameOver = true;
    }
    function isValid(matrix, r, c) {
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (matrix[row][col]) {
            const nr = r + row, nc = c + col;
            if (nc < 0 || nc >= COLS || nr >= ROWS) return false;
            if (nr >= 0 && playfield[nr][nc]) return false;
          }
        }
      }
      return true;
    }
    function rotate(matrix) { return matrix[0].map((_, idx) => matrix.map(row => row[idx]).reverse()); }
    function lock() {
      for (let r = 0; r < current.matrix.length; r++) {
        for (let c = 0; c < current.matrix[r].length; c++) {
          if (current.matrix[r][c]) playfield[current.row + r][current.col + c] = 1;
        }
      }
      for (let r = ROWS - 1; r >= 0; r--) {
        if (playfield[r].every(v => v === 1)) {
          playfield.splice(r, 1); playfield.unshift(new Array(COLS).fill(0));
          lines++; score += 100;
          document.getElementById('lines').innerText = lines;
          document.getElementById('score').innerText = score;
          r++;
        }
      }
      spawnPiece();
    }
    spawnPiece();
    function loop() {
      requestAnimationFrame(loop);
      if (gameOver) {
        context.fillStyle = 'rgba(0,0,0,0.7)'; context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#FFFFFF'; context.font = 'bold 20px sans-serif'; context.textAlign = 'center';
        context.fillText('Therapy Done!', canvas.width / 2, canvas.height / 2);
        return;
      }
      if (++dropCounter > 28) {
        dropCounter = 0;
        if (isValid(current.matrix, current.row + 1, current.col)) current.row++; else lock();
      }
      const grid = window.grid || 18;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = rightEyeColor;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (playfield[r][c]) context.fillRect(c * grid + 1, r * grid + 1, grid - 2, grid - 2);
        }
      }
      if (current) {
        context.fillStyle = leftEyeColor;
        for (let r = 0; r < current.matrix.length; r++) {
          for (let c = 0; c < current.matrix[r].length; c++) {
            if (current.matrix[r][c]) context.fillRect((current.col + c) * grid + 1, (current.row + r) * grid + 1, grid - 2, grid - 2);
          }
        }
      }
    }
    requestAnimationFrame(loop);
    function moveLeft() { if (current && isValid(current.matrix, current.row, current.col - 1)) current.col--; }
    function moveRight() { if (current && isValid(current.matrix, current.row, current.col + 1)) current.col++; }
    function moveDown() { if (current && isValid(current.matrix, current.row + 1, current.col)) { current.row++; score++; document.getElementById('score').innerText = score; } }
    function hardDrop() { if (current) { while (isValid(current.matrix, current.row + 1, current.col)) current.row++; lock(); } }

    // Smooth Touch Gestures: Swipe left/right to move, swipe down to soft-drop, swipe up to hard-drop, tap to rotate
    let touchX = 0, touchY = 0, touchTime = 0;
    window.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      touchTime = Date.now();
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      const elapsed = Date.now() - touchTime;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18 && elapsed < 320) {
        tryRotate();
      } else if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) moveRight();
        else if (dx < -20) moveLeft();
      } else {
        if (dy > 25) moveDown();
        else if (dy < -25) hardDrop();
      }
    }, { passive: true });
  </script>
</body>
</html>`,
  },

  // 5. Bubble Shooter
  {
    id: 'bubbleshooter',
    title: 'Bubble Shooter Foveal Aim',
    category: 'Foveal Targeting',
    badgeClass: 'badge-amber',
    description: 'Aim and pop matching bubble clusters to stimulate foveal fixation, peripheral stereopsis, and non-dominant eye acuity.',
    image: GAME_IMAGES.bubbleshooter,
    iconLibrary: 'Ionicons',
    iconName: 'radio-button-on-outline',
    duration: 15,
    route: '/game9bubbleshooter',
    getUrl: () => 'https://lazyeye.onrender.com/game9bubbleshooter',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Bubble Shooter Foveal Aim</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #000; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #FACC15; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #070D1B; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Score: <span class="score-box" id="score">0</span></span>
    <span>Aim: <span style="color:${leftColor}">●</span> Clusters: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Tap to aim and fire the calibrated chromatic bubble</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const cAim = '${leftColor}';
    const cTarget = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    const R = 16, COLS = 10;
    let grid = [];
    for (let r = 0; r < 5; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = { color: Math.random() > 0.4 ? cTarget : cAim, active: true };
      }
    }
    let ball = { x: canvas.width / 2, y: canvas.height - 35, vx: 0, vy: 0, flying: false, color: cAim };
    let score = 0;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const b = grid[r][c];
          if (b.active) {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(c * R * 2 + R + 10, r * R * 2 + R + 10, R - 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      if (ball.flying) {
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x < R || ball.x > canvas.width - R) ball.vx = -ball.vx;
        if (ball.y < 120) {
          ball.flying = false; score += 20;
          document.getElementById('score').innerText = score;
          ball.x = canvas.width / 2; ball.y = canvas.height - 35;
          ball.color = Math.random() > 0.5 ? cAim : cTarget;
        }
      }
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
    }
    requestAnimationFrame(loop);
    canvas.addEventListener('pointerdown', (e) => {
      if (ball.flying) return;
      const rect = canvas.getBoundingClientRect();
      const tx = e.clientX - rect.left, ty = e.clientY - rect.top;
      const angle = Math.atan2(ty - ball.y, tx - ball.x);
      ball.vx = Math.cos(angle) * 12;
      ball.vy = Math.sin(angle) * 12;
      ball.flying = true;
    });
  </script>
</body>
</html>`,
  },

  // 6. Ping-Pong 3D
  {
    id: 'pingpong',
    title: 'Ping-Pong 3D Dynamic Rally',
    category: 'Speed Tracking',
    badgeClass: 'badge-teal',
    description: 'High-velocity dichoptic paddle response. Challenges binocular alignment, reaction speed, and dynamic stereoscopic motion pursuit.',
    image: GAME_IMAGES.pingpong,
    iconLibrary: 'Ionicons',
    iconName: 'tennisball-outline',
    duration: 15,
    route: '/game10pingpong',
    getUrl: () => 'https://lazyeye.onrender.com/game10pingpong',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Ping-Pong 3D Dynamic Rally</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #000; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #081024; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Rally: <span class="score-box" id="score">0</span></span>
    <span>Paddle: <span style="color:${leftColor}">●</span> Ball: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Drag horizontally to move your paddle and return the ball</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const paddleColor = '${leftColor}';
    const ballColor = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    let paddleW = 75, paddleH = 14;
    let playerX = (canvas.width - paddleW) / 2;
    let aiX = (canvas.width - paddleW) / 2;
    let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 3, vy: 4, r: 10 };
    let score = 0;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2); ctx.stroke();
      ctx.setLineDash([]);
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx = -ball.vx;
      aiX += (ball.x - (aiX + paddleW / 2)) * 0.08;
      ctx.fillStyle = '#64748B';
      ctx.fillRect(aiX, 20, paddleW, paddleH);
      if (ball.y - ball.r < 34 && ball.x > aiX && ball.x < aiX + paddleW) {
        ball.vy = Math.abs(ball.vy) + 0.1;
      }
      if (ball.y + ball.r > canvas.height - 40 && ball.x > playerX && ball.x < playerX + paddleW) {
        ball.vy = -Math.abs(ball.vy) - 0.1;
        score++; document.getElementById('score').innerText = score;
      }
      if (ball.y < 0 || ball.y > canvas.height) {
        ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 3, vy: 4, r: 10 };
      }
      ctx.fillStyle = paddleColor;
      ctx.fillRect(playerX, canvas.height - 35, paddleW, paddleH);
      ctx.fillStyle = ballColor;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(loop);
    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      playerX = Math.max(0, Math.min(canvas.width - paddleW, e.touches[0].clientX - rect.left - paddleW / 2));
    }, { passive: true });
  </script>
</body>
</html>`,
  },

  // 7. Sticky Holds (Climbing Agility)
  {
    id: 'stickyholds',
    title: 'Sticky Holds Cliff Agility',
    category: 'Agility Fixation',
    badgeClass: 'badge-slate',
    description: 'Rock climbing agility puzzle. Demands sustained visual fixation, depth estimation, and bilateral coordination to bridge gaps.',
    image: GAME_IMAGES.stickyholds,
    iconLibrary: 'Ionicons',
    iconName: 'finger-print-outline',
    duration: 15,
    route: '/game11stickyholds',
    getUrl: () => 'https://lazyeye.onrender.com/game11stickyholds',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Sticky Holds Cliff Agility</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #070B18; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #020617; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Score: <span class="score-box" id="score">0</span></span>
    <span>Stick: <span style="color:${leftColor}">●</span> Cliffs: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Hold screen to grow bridge length, release to drop across</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const stickCol = '${leftColor}';
    const cliffCol = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    let p1 = { x: 30, w: 70 }, p2 = { x: 170, w: 60 };
    let stickH = 0, growing = false, dropped = false, angle = 0, score = 0;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const groundY = canvas.height - 120;
      ctx.fillStyle = cliffCol;
      ctx.fillRect(p1.x, groundY, p1.w, 120);
      ctx.fillRect(p2.x, groundY, p2.w, 120);
      if (growing) stickH += 3;
      ctx.save();
      ctx.translate(p1.x + p1.w, groundY);
      if (dropped) {
        if (angle < Math.PI / 2) angle += 0.08;
      }
      ctx.rotate(angle);
      ctx.fillStyle = stickCol;
      ctx.fillRect(-2, -stickH, 5, stickH);
      ctx.restore();
      if (dropped && angle >= Math.PI / 2) {
        const landing = p1.x + p1.w + stickH;
        if (landing >= p2.x && landing <= p2.x + p2.w) {
          score++; document.getElementById('score').innerText = score;
          p1 = { x: 30, w: 65 };
          p2 = { x: Math.random() * 100 + 150, w: Math.random() * 30 + 40 };
        }
        stickH = 0; angle = 0; dropped = false; growing = false;
      }
    }
    requestAnimationFrame(loop);
    window.addEventListener('pointerdown', () => { if (!dropped) growing = true; });
    window.addEventListener('pointerup', () => { if (growing) { growing = false; dropped = true; } });
  </script>
</body>
</html>`,
  },

  // 8. Maze Labyrinth
  {
    id: 'maze',
    title: 'Maze Labyrinth Mapping',
    category: 'Spatial Search',
    badgeClass: 'badge-yellow',
    description: 'Solve intricate labyrinth paths with split chromatic visual cues, boosting foveal searching efficiency and spatial mapping.',
    image: GAME_IMAGES.maze,
    iconLibrary: 'Ionicons',
    iconName: 'git-network-outline',
    duration: 15,
    route: '/game5maze',
    getUrl: () => 'https://lazyeye.onrender.com/game5maze',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Maze Labyrinth Mapping</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #050814; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 56px 8px calc(10px + env(safe-area-inset-bottom, 12px)); }
    .hud { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: rgba(19, 29, 54, 0.85); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; margin-bottom: 4px; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; width: 100%; height: 100%; min-height: 0; display: flex; align-items: center; justify-content: center; }
    canvas { background: #000; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Mazes: <span class="score-box" id="score">0</span></span>
    <span>Orb: <span style="color:${leftColor}">●</span> Walls: <span style="color:${rightColor}">●</span></span>
    <span style="font-size:11px; color:#94A3B8;">Swipe to navigate</span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const playerCol = '${leftColor}';
    const wallCol = '${rightColor}';
    const N = 11;
    let size = 26;
    function resize() {
      const avail = Math.min(wrap.clientWidth || window.innerWidth, wrap.clientHeight || (window.innerHeight - 50));
      size = Math.floor(avail / N);
      canvas.width = size * N; canvas.height = size * N;
    }
    resize();
    window.addEventListener('resize', resize);
    let px = 1, py = 1, score = 0;
    const grid = [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1]
    ];
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          if (grid[r][c] === 1) { ctx.fillStyle = wallCol; ctx.fillRect(c * size, r * size, size, size); }
          else if (grid[r][c] === 2) { ctx.fillStyle = '#10B981'; ctx.fillRect(c * size, r * size, size, size); }
        }
      }
      ctx.fillStyle = playerCol;
      ctx.beginPath();
      ctx.arc(px * size + size / 2, py * size + size / 2, size / 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    render();
    function move(dx, dy) {
      if (grid[py + dy][px + dx] !== 1) {
        px += dx; py += dy;
        if (grid[py][px] === 2) {
          score++; document.getElementById('score').innerText = score;
          px = 1; py = 1;
        }
        render();
      }
    }

    // Touch Swipe Gestures for Maze
    let touchX = 0, touchY = 0;
    window.addEventListener('touchstart', (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20) move(1, 0);
        else if (dx < -20) move(-1, 0);
      } else {
        if (dy > 20) move(0, 1);
        else if (dy < -20) move(0, -1);
      }
    }, { passive: true });
  </script>
</body>
</html>`,
  },

  // 9. Ball Catcher
  {
    id: 'ballcatcher',
    title: 'Ball Catcher Visual Motor',
    category: 'Hand-Eye Sync',
    badgeClass: 'badge-rose',
    description: 'Track and catch falling chromatic targets across visual quadrants to strengthen saccades and sensory-motor integration.',
    image: GAME_IMAGES.ballcatcher,
    iconLibrary: 'Ionicons',
    iconName: 'basketball-outline',
    duration: 15,
    route: '/game3ballcatcher',
    getUrl: () => 'https://lazyeye.onrender.com/game3ballcatcher',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Ball Catcher Visual Motor</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #070D1B; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #000; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Caught: <span class="score-box" id="score">0</span></span>
    <span>Basket: <span style="color:${leftColor}">●</span> Balls: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Drag your basket horizontally to catch falling targets</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const basketCol = '${leftColor}';
    const ballCol = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    let basketW = 75, basketX = (canvas.width - basketW) / 2;
    let balls = [], score = 0, timer = 0;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (++timer % 50 === 0) {
        balls.push({ x: Math.random() * (canvas.width - 40) + 20, y: 0, vy: Math.random() * 2 + 3, r: 12 });
      }
      balls.forEach(b => {
        b.y += b.vy;
        ctx.fillStyle = ballCol;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        if (b.y > canvas.height - 40 && b.y < canvas.height - 20 && b.x > basketX && b.x < basketX + basketW) {
          b.caught = true; score++; document.getElementById('score').innerText = score;
        }
      });
      balls = balls.filter(b => b.y < canvas.height && !b.caught);
      ctx.fillStyle = basketCol;
      ctx.fillRect(basketX, canvas.height - 35, basketW, 16);
    }
    requestAnimationFrame(loop);
    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      basketX = Math.max(0, Math.min(canvas.width - basketW, e.touches[0].clientX - rect.left - basketW / 2));
    }, { passive: true });
  </script>
</body>
</html>`,
  },

  // 10. Bouncing Ball (Agility Runner)
  {
    id: 'bouncingball',
    title: 'Bouncing Ball Agility',
    category: 'Trajectory Tracking',
    badgeClass: 'badge-blue',
    description: 'Anticipate dynamic rebounds and speed variations under dichoptic viewing to enhance depth perception and tracking agility.',
    image: GAME_IMAGES.bouncingball,
    iconLibrary: 'Ionicons',
    iconName: 'disc-outline',
    duration: 15,
    route: '/game7test',
    getUrl: () => 'https://lazyeye.onrender.com/game7test',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Bouncing Ball Agility</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #080D1C; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #020617; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Jumps: <span class="score-box" id="score">0</span></span>
    <span>Ball: <span style="color:${leftColor}">●</span> Hurdles: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Tap screen to jump over oncoming chromatic hurdles</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const bColor = '${leftColor}';
    const hColor = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    let ballY = 0, vy = 0, isGrounded = true, score = 0;
    let hurdles = [], timer = 0;
    const ground = 380;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, ground, canvas.width, canvas.height - ground);
      vy += 0.45;
      ballY += vy;
      if (ballY > 0) { ballY = 0; vy = 0; isGrounded = true; }
      if (++timer % 80 === 0) {
        hurdles.push({ x: canvas.width, w: 24, h: Math.random() * 20 + 35, passed: false });
      }
      ctx.fillStyle = hColor;
      hurdles.forEach(h => {
        h.x -= 3.5;
        ctx.fillRect(h.x, ground - h.h, h.w, h.h);
        if (!h.passed && h.x < 50) {
          h.passed = true; score++; document.getElementById('score').innerText = score;
        }
      });
      hurdles = hurdles.filter(h => h.x > -40);
      ctx.fillStyle = bColor;
      ctx.beginPath();
      ctx.arc(60, ground - 16 + ballY, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(loop);
    window.addEventListener('pointerdown', () => {
      if (isGrounded) { vy = -10.5; isGrounded = false; }
    });
  </script>
</body>
</html>`,
  },

  // 11. Bricks Breaker
  {
    id: 'bricksbreaker',
    title: 'Bricks Breaker Suppression Defeat',
    category: 'Foveal Fixation',
    badgeClass: 'badge-rose',
    description: 'Smash chromatic bricks with paddle deflection. Exercises sustained binocular fixation, tracking agility, and depth anticipation.',
    image: GAME_IMAGES.bricksbreaker,
    iconLibrary: 'Ionicons',
    iconName: 'hardware-chip-outline',
    duration: 15,
    route: '/game6bricksbreaker',
    getUrl: () => 'https://lazyeye.onrender.com/game6bricksbreaker',
    getHtml: (leftColor = '#EF4444', rightColor = '#0284C7') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Bricks Breaker</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; touch-action: none; }
    html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; background: #070D1B; }
    body { color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 14px)); }
    .hud { width: 100%; max-width: 380px; display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; background: rgba(19, 29, 54, 0.85); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .score-box { color: #38BDF8; font-size: 16px; font-weight: 700; }
    .canvas-wrap { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; width: 100%; margin: 6px 0; }
    canvas { background: #000; border: 2px solid rgba(255, 255, 255, 0.16); border-radius: 12px; display: block; touch-action: none; }
    .controls { width: 100%; max-width: 380px; text-align: center; font-size: 12px; color: #94A3B8; padding-bottom: max(6px, env(safe-area-inset-bottom, 14px)); flex-shrink: 0; }
  </style>
</head>
<body>
  <div class="hud">
    <span>Bricks: <span class="score-box" id="score">0</span></span>
    <span>Paddle: <span style="color:${leftColor}">●</span> Bricks: <span style="color:${rightColor}">●</span></span>
  </div>
  <div class="canvas-wrap" id="canvasWrap"><canvas id="game"></canvas></div>
  <div class="controls">Drag horizontally to move your paddle and smash bricks</div>
  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const wrap = document.getElementById('canvasWrap');
    const paddleCol = '${leftColor}';
    const brickCol = '${rightColor}';
    function resize() {
      canvas.width = Math.min(360, wrap.clientWidth);
      canvas.height = Math.min(520, wrap.clientHeight);
    }
    resize();
    window.addEventListener('resize', resize);
    const COLS = 6, ROWS = 4, bW = 50, bH = 16, pad = 6;
    let bricks = [];
    for (let r = 0; r < ROWS; r++) {
      bricks[r] = [];
      for (let c = 0; c < COLS; c++) bricks[r][c] = { active: true };
    }
    let pW = 75, pX = (canvas.width - pW) / 2;
    let ball = { x: canvas.width / 2, y: canvas.height - 60, vx: 3, vy: -4, r: 8 };
    let score = 0;
    function loop() {
      requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = brickCol;
      const offX = (canvas.width - (COLS * (bW + pad) - pad)) / 2;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (bricks[r][c].active) {
            const bx = offX + c * (bW + pad);
            const by = 20 + r * (bH + pad);
            ctx.fillRect(bx, by, bW, bH);
            if (ball.x > bx && ball.x < bx + bW && ball.y - ball.r < by + bH && ball.y + ball.r > by) {
              bricks[r][c].active = false;
              ball.vy = -ball.vy;
              score += 10; document.getElementById('score').innerText = score;
            }
          }
        }
      }
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx = -ball.vx;
      if (ball.y - ball.r < 0) ball.vy = -ball.vy;
      if (ball.y + ball.r > canvas.height - 35 && ball.x > pX && ball.x < pX + pW) {
        ball.vy = -Math.abs(ball.vy);
      }
      if (ball.y > canvas.height) {
        ball = { x: canvas.width / 2, y: canvas.height - 60, vx: 3, vy: -4, r: 8 };
      }
      ctx.fillStyle = paddleCol;
      ctx.fillRect(pX, canvas.height - 30, pW, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(loop);
    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      pX = Math.max(0, Math.min(canvas.width - pW, e.touches[0].clientX - rect.left - pW / 2));
    }, { passive: true });
  </script>
</body>
</html>`,
  },
];
