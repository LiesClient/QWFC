class Cell {
  possible = [];
  original = [];
  resets = 0;
  pos = {
    x: 0,
    y: 0
  };
  thread;
  currentCB;

  constructor(x, y, poss, thread) {
    this.id = x + " " + y;
    this.pos.x = x;
    this.pos.y = y;
    this.possible = new Array(poss).fill().map((v, i) => i);
    this.thread = thread;

    if (thread) {
      thread.addEventListener("message", ({ data }) => {
        if (data.id != this.id) return;
        this.possibilities = data.possibilities;
        if (this.currentCB) this.currentCB(this.possible.length);
      });
    }
  }

  collapse(cells, cb) {
    // if (this.thread) {
      let neighbors = takeSample(cells, this.pos).map(nb => nb?.map(v => v.id));
      this.currentCB = cb;
      this.thread.postMessage({ id: this.id }, [neighbors, this.possible]);
    // } else {
    //   this.manual(cells, cb);
    // }
  }

  // manual(cells, cb) {
  //   let neighbors = takeSample(cells, this.pos).map(nb => nb?.map(v => v.id));
  //   let newPoss = [];

  //   for (let i = 0; i < this.possible.length; i++) {
  //     if (this.possible[i].verify(neighbors)) {
  //       newPoss.push(this.possible[i]);
  //     }
  //   }

  //   if (newPoss.length == 0) {
  //     this.possible = this.original.map(v => v);
  //     cells.recordBacktrack(this.pos);
  //     this.resets++;

  //     if (this.resets >= 3) {
  //       cells.backtrack(this.pos);
  //     }
  //   } else {
  //     this.possible = newPoss;
  //     this.resets = 0;
  //   }

  //   cb(this.possible.length);
  // }

  backtrack() {
    this.possible = new Array(poss).fill().map((v, i) => i);
    return true;
  }
}

class Cells {
  cells = [];
  notCollapsed = [];
  threadPool = [];
  collapseComplete = false;
  width = 0;
  height = 0;
  threadCount = 0;
  
  constructor(width, height, id, threadCount) {
    for (let i = 0; i < threadCount; i++) {
      let worker = new Worker("/possibilities.js");
      this.threadPool.push(worker);
    }
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.notCollapsed.push(this.cells.length);
        
        if (!threadCount){
          this.cells.push(new Cell(x, y, id.length));
          continue;
        }
        
        this.cells.push(new Cell(x, y, id.length, this.threadPool[(x * height + y) % threadCount]));
      }
    }

    this.width = width;
    this.height = height;
    this.threadCount = threadCount;
    this.notCollapsed.sort((a, b) => Math.random() - .5);
  }

  reset() {
    this.notCollapsed = [];
    for (let i = 0; i < this.cells.length; i++) {
      this.notCollapsed.push(this.cells.length);
      this.cells[i].backtrack();
    }
    this.notCollapsed.sort((a, b) => Math.random() - .5);
  }

  get (x, y) {
    if (x < 0 || y < 0) return null;
    if (y >= this.height || x >= this.width) return null;
    return this.cells[x * this.height + y];
  }

  backtrack(pos) {
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        if (this.get(x + pos.x, y + pos.y)?.backtrack())
          this.notCollapsed.push((x + pos.x) * this.height + y + pos.y);
  }

  recordBacktrack(pos) {
    this.notCollapsed.push(pos.x * this.height + pos.y);
  }

  collapseAll(cb) {
    let isDone = true;
    let count = 0;
    this.notCollapsed = [];
    
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].collapse(this, (len) => {
        count ++;
        if (len > 1) {
          isDone = false;
          this.notCollapsed.push(i);
        }

        if (count >= this.cells.length - 1) {
          this.notCollapsed.sort((a, b) => Math.random() - .5);
          if (isDone) this.collapseComplete = true;
          cb(isDone);
        }
      });
    }
  }

  collapse(x, y) {
    let pos = x * this.width + y;
    let arr = this.cells[pos].possible;
    let ind = Math.floor(Math.random() * arr.length);

    this.cells[pos].possible = [arr[ind]];
  }

  collapseRandom(probs) {
    if (!this.notCollapsed.length) return 1;
    let pos = this.notCollapsed.pop();
    let arr = this.cells[pos].possible;
    let prob = arr.map(v => probs[id[v]]);
    let sum = prob.reduce((a, b) => a + b,  0);
    let rand = Math.random() * sum;
    let index = 0;

    while (true) {
      let n = prob[index];
      if (isNaN(n)) n = 0;
      rand -= n;

      if (rand <= 0) break;
      index++;
    }

    this.cells[pos].possible = [arr[index]];
  }
}

function takeSample(cells, pos) {
  let arr = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      arr.push(cells.get(pos.x + x, pos.y + y)?.possible);
    }
  }

  return arr;
}
