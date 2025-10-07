// Tetris Binario — lógica principal

(function () {
  const boardEl = document.getElementById('board');
  const weightsEl = document.getElementById('weights');
  const targetsEl = document.getElementById('targets');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  const highLabelEl = document.getElementById('high-label');
  const nextCanvas = document.getElementById('next');
  const bitsSelect = document.getElementById('select-bits');
  const btnStart = document.getElementById('btn-start');
  const btnPause = document.getElementById('btn-pause');
  const btnRestart = document.getElementById('btn-restart');
  const btnTheme = document.getElementById('btn-theme');
  const btnRecords = document.getElementById('btn-records');
  const modal = document.getElementById('records-modal');
  const modalClose = document.getElementById('records-close');
  const modalBackdrop = document.getElementById('records-backdrop');
  const recordsList = document.getElementById('records-list');

  const nextCtx = nextCanvas.getContext('2d');

  const ROWS = 20;
  let COLS = parseInt(bitsSelect.value, 10); // ancho en bits
  let grid = createGrid(ROWS, COLS);
  let running = false;
  let paused = false;
  let dropInterval = 800; // ms
  let lastDrop = 0;
  let score = 0;
  const HIGH_PREFIX = 'tetris_binario_highscore_';
  function highKeyFor(cols) { return HIGH_PREFIX + String(cols); }
  let highScore = 0;
  function loadHighScore() {
    highScore = parseInt(localStorage.getItem(highKeyFor(COLS)) || '0', 10) || 0;
    if (highScoreEl) highScoreEl.textContent = String(highScore);
  }
  function updateHighLabel() {
    if (highLabelEl) highLabelEl.textContent = `Mejor (${COLS}b):`;
  }
  let targets = [];

  // Piezas (tetrominós) en rotaciones (matrices 4x4)
  const TETROMINOS = {
    I: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
    O: [
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
    ],
    T: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    L: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
    ],
    J: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    S: [
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
    Z: [
      [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ],
    ],
  };

  const TYPE_COLOR = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    L: '#f0a000',
    J: '#0000f0',
    S: '#00f000',
    Z: '#f00000',
  };

  function createGrid(r, c) {
    return Array.from({ length: r }, () => Array(c).fill(0));
  }

  function weightsFor(cols) {
    const arr = [];
    for (let i = cols - 1; i >= 0; i--) arr.push(1 << i);
    return arr; // MSB a la izquierda
  }

  function renderWeights() {
    const w = weightsFor(COLS);
    weightsEl.style.gridTemplateColumns = `repeat(${COLS}, 28px) 40px`;
    weightsEl.innerHTML = w.map(v => `<div class="wcell">${v}</div>`).join('') + `<div class="wcell spacer"></div>`;
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateRows = `repeat(${ROWS}, 28px)`;
    boardEl.style.gap = '3px';
    const frag = document.createDocumentFragment();

    for (let r = 0; r < ROWS; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'row';
      rowEl.style.gridTemplateColumns = `repeat(${COLS}, 28px) 40px`;
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div');
        const filled = !!grid[r][c];
        cell.className = 'cell' + (filled ? ' filled' : '');
        if (filled) {
          cell.style.background = grid[r][c];
        }
        rowEl.appendChild(cell);
      }
      const val = rowToDecimal(grid[r]);
      const valEl = document.createElement('div');
      valEl.className = 'row-value';
      valEl.textContent = val;
      rowEl.appendChild(valEl);
      frag.appendChild(rowEl);
    }
    boardEl.appendChild(frag);
    drawCurrentPiece();
  }

  function rowToDecimal(bits) {
    // MSB en la columna 0
    return bits.reduce((acc, b) => (acc << 1) | (b ? 1 : 0), 0);
  }

  // Objetivos (nube de 4 números únicos, entre 1 y 2^COLS-1)
  function refillTargets() {
    const max = (1 << COLS) - 1;
    const set = new Set();
    while (set.size < 4) {
      const n = 1 + Math.floor(Math.random() * max); // excluye 0
      set.add(n);
    }
    targets = Array.from(set);
    renderTargets();
  }

  function replaceTarget(oldVal) {
    const max = (1 << COLS) - 1;
    const occupied = new Set(targets);
    let candidate = null;
    let tries = 0;
    do {
      candidate = 1 + Math.floor(Math.random() * max);
      tries++;
    } while (occupied.has(candidate) && tries < 50);
    const idx = targets.indexOf(oldVal);
    if (idx !== -1) targets[idx] = candidate;
    renderTargets();
  }

  function renderTargets() {
    targetsEl.innerHTML = targets
      .map((n) => `<div class="target">${n}</div>`)
      .join('');
  }

  // Pieza actual y cola
  const bagOrder = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];
  const LEVELS = [4, 5, 6, 8];
  let queue = [];
  let current = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function refillQueue() {
    queue.push(...shuffle(bagOrder));
  }

  function spawn() {
    if (queue.length < 3) refillQueue();
    const type = queue.shift();
    current = {
      type,
      rot: 0,
      x: Math.max(0, Math.floor((COLS - 4) / 2)), // ajustado a 4x4 máscara
      y: -1,
      color: TYPE_COLOR[type],
    };
    if (collides(current, 0, 0, current.rot)) {
      gameOver();
    }
    renderNext();
  }

  function shapeMatrix(piece, rot = piece.rot) {
    const mats = TETROMINOS[piece.type];
    return mats[rot % mats.length];
  }

  function collides(piece, dx, dy, rot) {
    const m = shapeMatrix(piece, rot);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!m[r][c]) continue;
        const x = piece.x + c + dx;
        const y = piece.y + r + dy;
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y >= 0 && grid[y][x]) return true;
      }
    }
    return false;
  }

  function mergePiece() {
    const m = shapeMatrix(current);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!m[r][c]) continue;
        const x = current.x + c;
        const y = current.y + r;
        if (y >= 0) grid[y][x] = current.color;
      }
    }
  }

  function drawCurrentPiece() {
    // Refresca estados de celdas de la pieza actual (superposición visual simple)
    const rows = boardEl.querySelectorAll('.row');
    if (!current) return;
    const m = shapeMatrix(current);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!m[r][c]) continue;
        const x = current.x + c;
        const y = current.y + r;
        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          const cell = rows[y].children[x];
          if (cell) {
            cell.classList.add('filled');
            cell.style.background = current.color;
          }
        }
      }
    }
  }

  function renderNext() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (!queue.length) return;
    const type = queue[0];
    const mat = TETROMINOS[type][0];
    const size = 20;
    const offX = 30, offY = 30;
    nextCtx.fillStyle = '#1b2644';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = TYPE_COLOR[type] || '#6bb7e6';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (mat[r][c]) {
          nextCtx.fillStyle = TYPE_COLOR[type] || '#6bb7e6';
          nextCtx.fillRect(offX + c * size, offY + r * size, size - 2, size - 2);
        }
      }
    }
  }

  function hardDrop() {
    let steps = 0;
    while (!collides(current, 0, 1, current.rot)) {
      current.y++;
      steps++;
    }
    if (steps > 0) tick(true);
  }

  function rotate(dir) {
    const nextRot = (current.rot + dir + 4) % 4;
    if (!collides(current, 0, 0, nextRot)) {
      current.rot = nextRot;
    } else if (!collides(current, -1, 0, nextRot)) {
      current.x -= 1;
      current.rot = nextRot;
    } else if (!collides(current, 1, 0, nextRot)) {
      current.x += 1;
      current.rot = nextRot;
    }
    renderBoard();
  }

  function clearMatchingRows() {
    const toClear = [];
    const targetSet = new Set(targets);
    for (let r = 0; r < ROWS; r++) {
      const val = rowToDecimal(grid[r]);
      if (val !== 0 && targetSet.has(val)) toClear.push({ r, val });
    }
    if (!toClear.length) return 0;

    // Clear rows and drop (desde abajo hacia arriba para no desplazar índices)
    toClear.sort((a, b) => b.r - a.r);
    for (const { r, val } of toClear) {
      grid.splice(r, 1);
      grid.unshift(Array(COLS).fill(0));
      replaceTarget(val);
    }
    return toClear.length;
  }

  function tick(forceLock = false) {
    if (!running || paused) return;
    if (!current) spawn();

    if (!forceLock && !collides(current, 0, 1, current.rot)) {
      current.y++;
    } else {
      mergePiece();
      const cleared = clearMatchingRows();
      if (cleared > 0) {
        score += cleared * 100;
        scoreEl.textContent = score;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem(highKeyFor(COLS), String(highScore));
          if (highScoreEl) highScoreEl.textContent = String(highScore);
        }
      }
      spawn();
    }
    renderBoard();
  }

  function loop(ts) {
    if (!running) return;
    if (!paused) {
      if (ts - lastDrop > dropInterval) {
        tick();
        lastDrop = ts;
      }
    }
    requestAnimationFrame(loop);
  }

  function gameOver() {
    running = false;
    btnStart.disabled = false;
    btnPause.disabled = true;
    btnRestart.disabled = false;
    // Asegura guardar récord si se alcanzó justo al final
    if (score > highScore) {
      highScore = score;
      localStorage.setItem(highKeyFor(COLS), String(highScore));
      if (highScoreEl) highScoreEl.textContent = String(highScore);
    }
    alert('¡Game Over! Puntuación: ' + score);
  }

  function resetGame() {
    grid = createGrid(ROWS, COLS);
    queue = [];
    current = null;
    score = 0;
    scoreEl.textContent = '0';
    loadHighScore();
    updateHighLabel();
    refillTargets();
    renderWeights();
    renderBoard();
    renderNext();
  }

  // Eventos UI
  btnStart.addEventListener('click', () => {
    resetGame();
    running = true;
    paused = false;
    btnStart.disabled = true;
    btnPause.disabled = false;
    btnRestart.disabled = false;
    spawn();
    lastDrop = 0;
    requestAnimationFrame(loop);
  });

  btnPause.addEventListener('click', () => {
    if (!running) return;
    paused = !paused;
    btnPause.textContent = paused ? 'Reanudar' : 'Pausa';
  });

  btnRestart.addEventListener('click', () => {
    resetGame();
    running = true;
    paused = false;
    btnPause.textContent = 'Pausa';
    lastDrop = 0;
  });

  bitsSelect.addEventListener('change', () => {
    COLS = parseInt(bitsSelect.value, 10);
    resetGame();
  });

  // -------- Modal de Récords --------
  function getHigh(bits) {
    return parseInt(localStorage.getItem(highKeyFor(bits)) || '0', 10) || 0;
  }

  function renderRecords() {
    if (!recordsList) return;
    recordsList.innerHTML = '';
    LEVELS.forEach((lvl) => {
      const li = document.createElement('li');
      li.className = 'record-item';
      const bits = document.createElement('span');
      bits.className = 'bits';
      bits.textContent = `${lvl} bits`;
      const val = document.createElement('span');
      val.className = 'value';
      val.textContent = String(getHigh(lvl));
      li.appendChild(bits);
      li.appendChild(val);
      recordsList.appendChild(li);
    });
  }

  function openModal() {
    if (!modal) return;
    renderRecords();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
  if (btnRecords) btnRecords.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (!running || paused) {
      if (e.key.toLowerCase() === 'p') btnPause.click();
      if (e.key.toLowerCase() === 'r') btnRestart.click();
      return;
    }
    switch (e.key) {
      case 'ArrowLeft':
        if (!collides(current, -1, 0, current.rot)) current.x--;
        renderBoard();
        break;
      case 'ArrowRight':
        if (!collides(current, 1, 0, current.rot)) current.x++;
        renderBoard();
        break;
      case 'ArrowDown':
        tick();
        break;
      case 'ArrowUp':
        rotate(1);
        break;
      case ' ': // Space
        e.preventDefault();
        hardDrop();
        break;
      case 'p':
      case 'P':
        btnPause.click();
        break;
      case 'r':
      case 'R':
        btnRestart.click();
        break;
    }
  });

  // Inicialización
  refillTargets();
  renderWeights();
  renderBoard();
  renderNext();
  loadHighScore();
  updateHighLabel();

  // Tema (light/dark)
  function applyTheme(theme) {
    const light = theme === 'light';
    document.body.classList.toggle('theme-light', light);
    if (btnTheme) btnTheme.textContent = `Tema: ${light ? 'Light' : 'Dark'}`;
  }
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
})();
