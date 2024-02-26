class Possibility {
  color = [24, 24, 24];
  rule = true;
  id = 0;
  
  constructor(color, rule, id) {
    this.color = color;
    this.rule = rule;
    this.id = id;
  }

  verify(nbs) {
    if (this.rule === true) return true;
    if (this.rule.type == "nextTo") return this.nextTo(nbs);

    return this.rule(nbs);
  }

  nextTo(nbs) {
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i]) continue;
      let poss = nbs[i].map(v => v.id);

      for (let j = 0; j < this.rule.nextTo.length; j++) {
        if (poss.includes(this.rule.nextTo[i])) continue;
      }

      return false;
    }

    return true;
  }

  copy() {
    return new Possibility(this.color, this.rule, this.id);
    // return this;
  }
}

const POSSIBILITIES = [
  // 0
  new Possibility((nbs) => {
    let bigTrees = 0;
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) {
        bigTrees ++;
        continue;
      }
      let poss = nbs[i];

      if (poss.includes(0)) bigTrees++;
      if (!poss.includes(0) && !poss.includes(1)) return false;
    }

    return bigTrees > 2;
  }),

  // 1
  new Possibility((nbs) => {
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (!poss.includes(0) && !poss.includes(1) && !poss.includes(2)) return false;
    }

    return true;
  }),

  // 2
  new Possibility((nbs) => {
    let touchingGrass = false;
    
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (poss.includes(3)) touchingGrass = true;
      if (!poss.includes(1) && !poss.includes(2) && !poss.includes(3)) return false;
    }

    return touchingGrass;
  }),
  
  // 3
  new Possibility((nbs) => {
    
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (!poss.includes(2) && !poss.includes(3) && !poss.includes(4)) return false;
    }

    return true;
  }),
  
  // 4
  new Possibility((nbs) => {
    let touchingGrass = false;
    let touchingSand = false;
    
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (poss.includes(4)) touchingGrass = true;
      if (poss.includes(5)) touchingSand = true;
      if (!poss.includes(3) && !poss.includes(4) && !poss.includes(5)) return false;
    }

    return touchingGrass && touchingSand;
  }),

  // 5
  new Possibility((nbs) => {
    let touchingWater = false;
    let touchingGrass = false;
    
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (poss.includes(4)) touchingGrass = true;
      if (poss.includes(5)) touchingWater = true;
      if (!poss.includes(4) && !poss.includes(5) && !poss.includes(6)) return false;
    }

    return touchingWater && touchingGrass;
  }),

  // 6
  new Possibility((nbs) => {
    let touchingSand = false;
    let touchingDeep = false;
    
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (poss.includes(6)) touchingSand = true;
      if (poss.includes(7)) touchingDeep = true;
      if (!poss.includes(5) && !poss.includes(6) && !poss.includes(7)) return false;
    }

    return touchingSand && touchingDeep;
  }),
  
  // 7
  new Possibility((nbs) => {
    let isDeep = false;
    
    for (let i = 0; i < nbs.length; i++) {
      if (!nbs[i] || i == 4) continue;
      let poss = nbs[i];

      if (poss.includes(7)) isDeep = true;
      if (!poss.includes(6) && !poss.includes(7)) return false;
    }

    return isDeep;
  }),
];

function onmessage(data) {
  console.log("holy shit it worked???")
}
