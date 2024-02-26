const canvas = document.getElementById("display");
const pcanvas = document.getElementById("pattern");
const ctx = canvas.getContext("2d");
const pctx = pcanvas.getContext("2d");

canvas.width = dsize;
canvas.height = dsize;
pcanvas.width = psize;
pcanvas.height = psize;

let pattern = new mat(() => 0, psize, psize), display;

pcanvas.addEventListener("click", e => {
  let rect = pcanvas.getBoundingClientRect();
  let x = e.x - rect.left;
  let y = e.y - rect.top;
  let gx = Math.floor(x / rect.width * psize);
  let gy = Math.floor(y / rect.height * psize);
  pattern[gx][gy] = (1 + pattern[gx][gy]) % colors.length;
  init();
});

// main structure functions
function init() {
  display = new mat(() => new Cell(), dsize, dsize);

  let rules = [];

  for (let x = 1; x < psize - 1; x++)
    for (let y = 1; y < psize - 1; y++) {
      let rule = new Rule(sample(pattern, x, y));
      rule.setDispRef(display);
      rules.push(rule);
    }

  for (let x = 0; x < dsize; x++)
    for (let y = 0; y < dsize; y++) {
      let cell = display[x][y];
      cell.setPosition(x, y);
      cell.setDispRef(display);
      cell.setRuleRef(rules);
    }

  solve();
}

function draw() {
  ctx.clearRect(0, 0, dsize, dsize);
  ctx.clearRect(0, 0, psize, psize);

  for (let x = 0; x < psize; x++)
    for (let y = 0; y < psize; y++) {
      let index = pattern[x][y];

      pctx.fillStyle = colors[index];
      pctx.fillRect(x, y, 1, 1);
    }

  for (let x = 0; x < dsize; x++)
    for (let y = 0; y < dsize; y++) {
      let cell = display[x][y];
      ctx.globalAlpha = 1 / cell.possibilities.length;

      for (let i = 0; i < cell.possibilities.length; i++) {
        ctx.fillStyle = colors[cell.possibilities[i]];
        ctx.fillRect(x, y, 1, 1);
      }
    }

  ctx.globalAlpha = 1;
}

function solve() {
  recalculate();

  while (totalEntropy() != 0) {
    iterate();
    recalculate();
  }

  recalculate();

  draw();
}

function iterate() {
  let x = Math.floor(Math.random() * dsize);
  let y = Math.floor(Math.random() * dsize);

  if (display[x][y].possibilities.length == 1) return iterate();
  display[x][y].collapse();
}

function recalculate() {
  let offsetx = Math.floor(Math.random() * dsize);
  let offsety = Math.floor(Math.random() * dsize);
  
  for (let x = 0; x < dsize; x++)
    for (let y = 0; y < dsize; y++) {
      let cell = display[(x + offsetx) % dsize][(y + offsety) % dsize];
      cell.recalculate();
    }
}

function totalEntropy() {
  let e = 0;

  for (let x = 0; x < dsize; x++)
    for (let y = 0; y < dsize; y++){
      e += display[x][y].possibilities.length != 1;
    }

  return e;
}

// helpers
function mat(fn, width, height) {
  let arr = new Array(width).fill(0);

  for (let i = 0; i < width; i++) {
    arr[i] = new Array(height).fill(0);

    for (let j = 0; j < height; j++)
      arr[i][j] = fn();
  }

  return arr;
}


init();
