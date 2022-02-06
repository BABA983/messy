function* mulberry32(seed) {
  let t = (seed += 0x6d2b79f5);

  // Generate numbers indefinitely
  while (true) {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    yield ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Use the same seed to get the same sequence
const seed = 98345;
const generator = mulberry32(seed);

console.log(generator.next().value); // 0.9057375795673579
console.log(generator.next().value); // 0.7620641703251749
console.log(generator.next().value); // 0.0211441791616380
