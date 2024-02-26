const DISPLAY_HEIGHT = 8;
const DISPLAY_WIDTH = Math.floor(DISPLAY_HEIGHT * (innerWidth / innerHeight));
const THREAD_COUNT = 4;

let big_treeTexture = new Image();
big_treeTexture.src = "textures/big_tree16x16.png";

let medium_treeTexture = new Image();
medium_treeTexture.src = "textures/medium_tree16x16.png";

let small_treeTexture = new Image();
small_treeTexture.src = "textures/small_tree16x16.png";

let thick_grassTexture = new Image();
thick_grassTexture.src = "textures/thick_grass16x16.png";

let grassTexture = new Image();
grassTexture.src = "textures/grass16x16.png";

let sandTexture = new Image();
sandTexture.src = "textures/sand16x16.png";

let waterTexture = new Image();
waterTexture.src = "textures/water16x16.png";

let deep_waterTexture = new Image();
deep_waterTexture.src = "textures/deep_water16x16.png";

const TEXTURES = {
  // big_tree: big_treeTexture,
  // medium_tree: medium_treeTexture,
  // small_tree: small_treeTexture,
  // thick_grass: thick_grassTexture,
  // grass: grassTexture,
  // sand: sandTexture,
  // water: waterTexture,
  // deep_water: deep_waterTexture,
};

const PROBABILITIES = {
  big_tree: 1,
  medium_tree: 1,
  small_tree: 1,
  thick_grass: 1,
  grass: 1,
  sand: 1,
  water: 2,
  deep_water: 4,
};

const COLORS = {
  big_tree: [2, 40, 0],
  medium_tree: [12, 67, 4],
  small_tree: [42, 88, 22],
  thick_grass: [82, 140, 112],
  grass: [110, 175, 129],
  sand: [195, 178, 128],
  water: [150, 220, 249],
  deep_water: [0, 33, 243],
}

const ID = [
  "big_tree",
  "medium_tree",
  "small_tree",
  "thick_grass",
  "grass",
  "sand",
  "water",
  "deep_water",
];

const TEXTURE_SIZE = 16;
