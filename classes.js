class Cell {
  possibilities = new Uint8ClampedArray(colors.length);
  ruleRef;
  dispRef;
  x;
  y;
  

  constructor () {
    for (let i = 0; i < this.possibilities.length; i++)
      this.possibilities[i] = i;
  }

  setPosition(x, y) { this.x = x; this.y = y; }
  setRuleRef (ref) { this.ruleRef = ref; }
  setDispRef (ref) { this.dispRef = ref; }

  recalculate() {
    if (this.x == undefined || this.y == undefined) return console.error("Position not set.");
    if (this.ruleRef == undefined) return console.error("No rule reference set.");
    if (this.dispRef == undefined) return console.error("No display reference set.");

    let nPoss = [];
    let changed = false;
    let pos = { x: this.x, y: this.y };

    for (let i = 0; i < this.possibilities.length; i++) {
      let poss = this.possibilities[i];
      let col = colors[poss];
      let val = false;

      for (let j = 0; j < this.ruleRef.length; j++)
        val = this.ruleRef[j].validate(poss, pos) || val;

      if (!val) changed = true;
      else nPoss.push(poss);
    }

    if (changed) this.possibilities = new Uint8ClampedArray(nPoss);
  }

  collapse() {
    let pick = this.possibilities[Math.floor(Math.random() * this.possibilities.length)];
    this.possibilities = new Uint8ClampedArray(1);
    this.possibilities[0] = pick;
  }
}

class Rule {
  dispRef;
  sample;
  
  constructor (sample) { this.sample = sample; }
  setDispRef (ref) { this.dispRef = ref; }

  // poss = int, pos = { x, y }
  validate (poss, pos) {
    if (this.sample == undefined) return console.error("Invalid sample.");
    if (this.dispRef == undefined) return console.error("No display reference set.");

    let vals = [
      (this.sample.cen == poss),
      this.dispRef[pos.x - 1]?.[pos.y]?.possibilities?.includes(this.sample.lef),
      this.dispRef[pos.x + 1]?.[pos.y]?.possibilities?.includes(this.sample.rig),
      this.dispRef[pos.x]?.[pos.y - 1]?.possibilities?.includes(this.sample.top),
      this.dispRef[pos.x]?.[pos.y + 1]?.possibilities?.includes(this.sample.dow),
      this.dispRef[pos.x + 1]?.[pos.y - 1]?.possibilities?.includes(this.sample.trg),
      this.dispRef[pos.x - 1]?.[pos.y - 1]?.possibilities?.includes(this.sample.tlf),
      this.dispRef[pos.x + 1]?.[pos.y + 1]?.possibilities?.includes(this.sample.brg),
      this.dispRef[pos.x - 1]?.[pos.y + 1]?.possibilities?.includes(this.sample.blf)
    ];

    let ret = true;

    for (let i = 0; i < vals.length; i++) {
      if (vals[i] == false) ret = false;
    }

    return ret;
  }
}

function sample(ptrn, x, y) {
  return {
    cen: ptrn[x][y],
    trg: ptrn[x + 1][y - 1],
    top: ptrn[x][y - 1],
    tlf: ptrn[x - 1][y - 1],
    lef: ptrn[x - 1][y],
    blf: ptrn[x - 1][y + 1],
    dow: ptrn[x][y + 1],
    brg: ptrn[x + 1][y + 1],
    rig: ptrn[x + 1][y],
  }
}

