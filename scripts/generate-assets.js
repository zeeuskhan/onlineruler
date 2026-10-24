import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.alloc(4 + len);
  typeAndData.write(type, 0, 4, 'ascii');
  data.copy(typeAndData, 4);
  const crcVal = crc32(typeAndData);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function createPng(width, height, getPixelRgba) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Generate 1200x630 OpenGraph Preview Image
console.log('Generating 1200x630 OpenGraph preview image...');
const ogImageBuffer = createPng(1200, 630, (x, y, w, h) => {
  // Rich background gradient (deep space navy / indigo)
  const normX = x / w;
  const normY = y / h;
  let r = Math.round(15 + normX * 10 + normY * 15);
  let g = Math.round(23 + normX * 12 + normY * 18);
  let b = Math.round(42 + normX * 45 + normY * 35);

  // Subtle radial glow in the center top
  const dx = (x - 600) / 400;
  const dy = (y - 250) / 250;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 1.0) {
    const factor = (1.0 - dist) * 0.25;
    r = Math.min(255, Math.round(r + 99 * factor));
    g = Math.min(255, Math.round(g + 102 * factor));
    b = Math.min(255, Math.round(b + 241 * factor));
  }

  // Draw ruler body across y: 320 to 460
  if (y >= 320 && y <= 460 && x >= 80 && x <= 1120) {
    // Dark metallic ruler base
    r = 24;
    g = 27;
    b = 36;

    // Top border of ruler
    if (y === 320 || y === 321) {
      r = 99; g = 102; b = 241; // Indigo accent border
    }
    // Bottom border of ruler
    if (y === 459 || y === 460) {
      r = 55; g = 65; b = 81;
    }

    // Centimeter & Millimeter Ticks along top (y: 322 to 390)
    const rulerX = x - 100;
    if (rulerX >= 0 && rulerX <= 1000) {
      const mmInterval = 10;
      const isTick = rulerX % mmInterval === 0;
      const tickNum = Math.floor(rulerX / mmInterval);
      const isMajorCm = tickNum % 10 === 0;
      const isMidHalfCm = tickNum % 5 === 0 && !isMajorCm;

      if (isTick) {
        if (isMajorCm && y <= 375) {
          // Major CM mark (Orange)
          r = 249; g = 115; b = 22;
        } else if (isMidHalfCm && y <= 355) {
          // 5mm mark (Cyan)
          r = 56; g = 189; b = 248;
        } else if (y <= 342) {
          // 1mm mark (White)
          r = 226; g = 232; b = 240;
        }
      }
    }

    // Imperial Inch Ticks along bottom (y: 400 to 458)
    if (rulerX >= 0 && rulerX <= 1000) {
      const inchPx = 100; // 100px per inch representation
      const isInch = rulerX % inchPx === 0;
      const isHalfInch = rulerX % 50 === 0 && !isInch;
      const isQuarterInch = rulerX % 25 === 0 && !isInch && !isHalfInch;

      if (isInch && y >= 405) {
        // Full Inch Mark (Orange)
        r = 249; g = 115; b = 22;
      } else if (isHalfInch && y >= 420) {
        // Half Inch Mark (Cyan)
        r = 56; g = 189; b = 248;
      } else if (isQuarterInch && y >= 435) {
        // Quarter Inch Mark (White)
        r = 203; g = 213; b = 225;
      }
    }
  }

  // Draw Caliper A Guide (x: 280, y: 280 to 500)
  if (Math.abs(x - 280) <= 2 && y >= 280 && y <= 500) {
    r = 249; g = 115; b = 22; // Orange caliper line
  }
  // Draw Caliper B Guide (x: 880, y: 280 to 500)
  if (Math.abs(x - 880) <= 2 && y >= 280 && y <= 500) {
    r = 56; g = 189; b = 248; // Cyan caliper line
  }

  // Caliper A Badge at top (x: 260 to 300, y: 260 to 285)
  if (x >= 265 && x <= 295 && y >= 260 && y <= 285) {
    r = 249; g = 115; b = 22;
  }
  // Caliper B Badge at top (x: 865 to 895, y: 260 to 285)
  if (x >= 865 && x <= 895 && y >= 260 && y <= 285) {
    r = 56; g = 189; b = 248;
  }

  return [r, g, b, 255];
});

fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogImageBuffer);
console.log('✓ Created public/og-image.png (1200x630)');

// 2. Generate 192x192 PWA Icon
console.log('Generating 192x192 PWA app icon...');
const icon192Buffer = createPng(192, 192, (x, y, w, h) => {
  // Squircle rounded icon background
  const cx = 96, cy = 96;
  const cornerR = 36;
  const isInside = x >= 10 && x <= 182 && y >= 10 && y <= 182;
  
  if (!isInside) return [0, 0, 0, 0];

  // Indigo gradient
  const grad = y / h;
  let r = Math.round(79 - grad * 20);
  let g = Math.round(70 - grad * 25);
  let b = Math.round(229 - grad * 30);

  // Ruler inner plate
  if (x >= 24 && x <= 168 && y >= 64 && y <= 128) {
    r = 24; g = 27; b = 36;
    // Ruler ticks
    const rx = x - 28;
    if (rx % 14 === 0 && y <= 92) {
      r = 249; g = 115; b = 22;
    } else if (rx % 7 === 0 && y <= 82) {
      r = 56; g = 189; b = 248;
    }
  }

  return [r, g, b, 255];
});
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192Buffer);
console.log('✓ Created public/icon-192.png');

// 3. Generate 512x512 PWA Icon
console.log('Generating 512x512 PWA app icon...');
const icon512Buffer = createPng(512, 512, (x, y, w, h) => {
  const isInside = x >= 24 && x <= 488 && y >= 24 && y <= 488;
  if (!isInside) return [0, 0, 0, 0];

  const grad = y / h;
  let r = Math.round(79 - grad * 20);
  let g = Math.round(70 - grad * 25);
  let b = Math.round(229 - grad * 30);

  // Ruler inner plate
  if (x >= 64 && x <= 448 && y >= 170 && y <= 342) {
    r = 24; g = 27; b = 36;
    const rx = x - 74;
    if (rx % 36 === 0 && y <= 240) {
      r = 249; g = 115; b = 22;
    } else if (rx % 18 === 0 && y <= 215) {
      r = 56; g = 189; b = 248;
    } else if (rx % 6 === 0 && y <= 195) {
      r = 226; g = 232; b = 240;
    }
  }

  return [r, g, b, 255];
});
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512Buffer);
console.log('✓ Created public/icon-512.png');
