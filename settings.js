const psize = 12; // PATTERN_SIZE
const dsize = 8; // DISPLAY_SIZE
const colors = [
  "rgb(16, 16, 16)",
  "rgb(128, 16, 16)",
  "rgb(16, 128, 16)",
  "rgb(16, 16, 128)",
];

// for now, you are limited to a maximum of 2^8 - 1 (255) colors
// as in colors.length HAS TO BE < 256

if (colors.length > 255 || colors.length < 1)
  console.error("Too many (or too few) colors.");
