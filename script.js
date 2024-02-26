const outputEl = document.getElementById("output");
const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");


let cells;
let targetFPS = 60;
let loopCount = 1;
let targetFrameTime = 1000 / targetFPS;
let lastTime = performance.now();

async function init() {
  cells = new Cells(DISPLAY_WIDTH, DISPLAY_HEIGHT, ID, THREAD_COUNT);
  canvas.width = DISPLAY_WIDTH;
  canvas.height = DISPLAY_HEIGHT;

  document.addEventListener("click", e => {
    cells.collapseRandom(PROBABILITIES);
  });

  Object.keys(TEXTURES).forEach(async txt => {
    if (!txt) return;
    await txt.complete == true;
  });

  document.addEventListener("keydown", e => {
    if (e.key == " ") {
      // cells.reset();
      // perfBench = null;
    }
  });

  // let res = [16, 12];
  // let res = [36, 24];
  // let times = 1;

  // let tArr = [];

  // log(`benching at (${res[0]}, ${res[1]}), ${times} times`);

  // let runBench = () => {
  //   let t = perfBench(res[0], res[1]);
  //   tArr.push(t);
  //   log(`#${tArr.length}: ${Math.round(t * 10) / 10}ms`);

  //   if (tArr.length < times) {
  //     setTimeout(runBench, 100);
  //   } else {
  //     let tAvg = tArr.reduce((a, b) => a + b, 0) / tArr.length;

  //     log(`benchmarks complete`);
  //     log(`average time: ${Math.round(tAvg * 10) / 10}ms`);
  //   }
  // }

  // runBench();

  lastTime = performance.now();
  loop();
}

function log(text) {
  let el = document.createElement("p");
  el.textContent = text;
  outputEl.appendChild(el);
}

function perfBench(w, h) {
  let name = `Perf Benching for ${w}, ${h}`
  console.log("Starting perf bench...");
  console.time(name);
  let t0 = performance.now();
  
  cells = new Cells(w, h, ID, THREAD_COUNT);

  function runIter() {
    cells.collapseRandom(PROBABILITIES);
    cells.collapseAll(cellsComplete => {
      if (!cellsComplete)
        runIter();
    });
  }

  try {
    runIter();
  } catch (e) {
    runIter();
  }

  console.log("iterations complete");
  let t1 = performance.now();
  console.timeEnd(name);
  drawFinale();

  return t1 - t0;
}

function loop() {
  ctx.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

  let t = performance.now();
  let dt = t - lastTime;
  lastTime = t;

  if (dt < targetFrameTime) {
    loopCount ++;
  } 

  if (dt > targetFrameTime) {
    loopCount --;
  }

  if (loopCount <= 0) {
    loopCount = 1;
  }
  
  for (let x = 0; x < DISPLAY_WIDTH; x++) {
    for (let y = 0; y < DISPLAY_HEIGHT; y++) {
      let cell = cells.get(x, y);
      let clr = [0, 0, 0];
  
      // for (let i = 0; i < cell.possible.length; i++) {
      //   clr[0] += cell.possible[i].color[0];
      //   clr[1] += cell.possible[i].color[1];
      //   clr[2] += cell.possible[i].color[2];
      // }

      // clr[0] /= cell.possible.length;
      // clr[1] /= cell.possible.length;
      // clr[2] /= cell.possible.length;

      for (let i = 0; i < cell.possible.length; i++) {
        clr[0] += COLORS[ID[cell.possible[i]]].color[0];
        clr[1] += COLORS[ID[cell.possible[i]]].color[1];
        clr[2] += COLORS[ID[cell.possible[i]]].color[2];
      }

      clr[0] /= cell.possible.length;
      clr[1] /= cell.possible.length;
      clr[2] /= cell.possible.length;

      ctx.fillStyle = `rgb(${clr.join(",")})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  for (let i = 0; i < loopCount; i++) {
    cells.collapseRandom(PROBABILITIES);
    if (cells.collapseAll()) return drawFinale(cells);
  }

  requestAnimationFrame(loop);
}

// adds "textures"
function drawFinale() {
  // todo: make this do smthn
  console.log("rendering final texture");
  canvas.width = cells.width * TEXTURE_SIZE;
  canvas.height = cells.height * TEXTURE_SIZE;

  for (let x = 0; x < cells.width; x++) {
    for (let y = 0; y < cells.height; y++) {
      let cell = cells.get(x, y);
      let poss = ID[cell.possible[0]];
      let txt = TEXTURES[poss];

      if (txt) {
        ctx.drawImage(txt, x * TEXTURE_SIZE, y * TEXTURE_SIZE);
      } else {
        ctx.fillStyle = `rgb(${poss.color.join(",")})`;
        ctx.fillRect(x * TEXTURE_SIZE, y * TEXTURE_SIZE, TEXTURE_SIZE, TEXTURE_SIZE);
      }
    }
  }

  console.log("drawFinale complete");
  evaluateProbs();
}

function evaluateProbs() {
  let probs = {};

  Object.keys(PROBABILITIES).forEach(key => {
    probs[key] = 0;
  });
}

setTimeout(() => {
  init();
}, 1000);
