/**
 * Post-build script to generate static HTML entry points for every route.
 * This guarantees that refreshing/reloading any URL on Vercel, Netlify,
 * or GitHub Pages returns HTTP 200 OK instead of a 404 error.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

// Also create 404.html for universal SPA fallback
fs.writeFileSync(path.join(distDir, '404.html'), templateHtml);
console.log('✓ Created dist/404.html fallback');

const routes = [
  {
    path: '/online-ruler-inches',
    title: 'Online Ruler Inches — Actual Size Imperial 1/16" Screen Ruler',
    desc: 'Actual size online ruler in inches with fractional 1/16th, 1/8th, and 1/4th subdivisions. Calibrate with a card for true physical accuracy. 100% free.',
  },
  {
    path: '/online-ruler-cm',
    title: 'Online Ruler CM — 100% Actual Size Metric Screen Ruler',
    desc: 'Measure physical items in centimeters (cm) and millimeters (mm) with our calibrated online ruler. 100% actual size, free, with zero downloads.',
  },
  {
    path: '/online-ruler-mm',
    title: 'Online Ruler MM — High-Precision Millimeter Screen Ruler',
    desc: 'Measure small objects with sub-millimeter precision. Online ruler in mm calibrated to actual size. Interactive caliper markers for exact gaps.',
  },
  {
    path: '/actual-size-ruler',
    title: 'Actual Size Ruler — 1:1 Scale Screen Measure (Card Calibrated)',
    desc: 'True actual size ruler on screen. Calibrate with any credit card or coin for guaranteed 1:1 physical accuracy in cm, mm, and inches. Free & fast.',
  },
  {
    path: '/screen-ruler',
    title: 'Screen Ruler — Measure Screen Elements & Physical Items Online',
    desc: 'Versatile screen ruler for measuring on-display graphics and physical objects. Switch between pixels, cm, mm, and inches. Free, zero downloads.',
  },
  {
    path: '/camera-ruler',
    title: 'Online Ruler Camera — Measure Objects with Your Phone or Webcam',
    desc: 'Measure physical objects using your phone camera or laptop webcam. Live video feed with calibrated ruler overlay, freeze-frame, and calipers. 100% free.',
  },
  {
    path: '/ruler-overlay',
    title: 'Ruler Overlay — Full-Screen Viewport Edge Ruler with Crosshairs',
    desc: 'Full-screen ruler overlay hugging all 4 display edges. Drag guidelines across your viewport, track mouse coordinates, and measure in cm or inches.',
  },
  {
    path: '/virtual-ruler',
    title: 'Virtual Ruler — Free Online Virtual Measuring Tool (Actual Size)',
    desc: 'Free virtual ruler on screen. Measure items in inches, centimeters, and millimeters with hardware PPI calibration. Zero installation, 100% accurate.',
  },
  {
    path: '/digital-ruler',
    title: 'Digital Ruler — High Precision Caliper Readouts & Screen Measure',
    desc: 'Precision digital ruler with instant numeric readouts in mm, cm, inches, and px. Features interactive sliding calipers and one-click copy.',
  },
  {
    path: '/1-cm-on-screen',
    title: '1 CM Visualised on Screen — Exact 1 Centimeter Actual Size',
    desc: 'See exactly how big 1 centimeter is on your screen. Calibrate to 100% actual size and compare 1cm against real-world items like staples and pencil tips.',
  },
  {
    path: '/1-inch-on-screen',
    title: '1 Inch on Screen — Actual Size 1" Imperial Reference Guide',
    desc: 'See exactly what 1 physical inch looks like on your display. Calibrate with a coin or card for 100% actual size 1-inch reference with 16th tick marks.',
  },
  {
    path: '/ruler-for-phone',
    title: 'Ruler for Phone — Touch-Friendly Actual Size Mobile Ruler',
    desc: 'Turn your iPhone or Android into an accurate pocket ruler. Touch-drag calipers, zoom-lock mode, and coin calibration for true physical cm and inches.',
  },
  {
    path: '/ruler-for-laptop',
    title: 'Computer Ruler — Calibrated Laptop & Desktop Screen Ruler',
    desc: 'Turn your laptop or desktop monitor into a calibrated physical ruler. Presets for MacBook, Dell, HP, Lenovo, and 24"-27" external displays. Free.',
  },
  {
    path: '/ruler-widget',
    title: 'Free Ruler Widget — Embed a Responsive Online Ruler on Your Site',
    desc: 'Embed a free, responsive online ruler widget on your website, blog, or educational portal. Clean iframe code with customizable units and zero ads.',
  },
  {
    path: '/about',
    title: 'About RuleScale — Precision Virtual Measuring Technology',
    desc: "Learn about RuleScale's mission to provide the world's most accessible, calibrated, and privacy-first online measuring instruments.",
  },
  {
    path: '/contact',
    title: 'Contact Us — RuleScale Engineering & Support',
    desc: 'Get in touch with our engineering team for inquiries, bug reports, feature requests, or partnership opportunities.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — 100% Client-Side Processing Guarantee',
    desc: "Read RuleScale's privacy policy. All camera video, sensor data, and measurement coordinates are processed 100% locally on your device.",
  },
  {
    path: '/terms',
    title: 'Terms of Service — RuleScale Online Utility',
    desc: 'Terms and conditions governing the use of the RuleScale online ruler and measuring utilities.',
  },
  {
    path: '/disclaimer',
    title: 'Accuracy Disclaimer & Measurement Limitations',
    desc: 'Important legal and technical accuracy disclaimer regarding display pixel calibration, hardware variations, and industrial tolerances.',
  },
];

for (const route of routes) {
  const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });

  let pageHtml = templateHtml;
  // Replace Title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);
  // Replace Meta Description
  pageHtml = pageHtml.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${route.desc}" />`
  );
  // Replace Canonical Link
  pageHtml = pageHtml.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="https://rulerscale.vercel.app${route.path}" />`
  );
  // Replace OpenGraph Title & Desc
  pageHtml = pageHtml.replace(
    /<meta property="og:title" content=".*?" \/>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:description" content=".*?" \/>/i,
    `<meta property="og:description" content="${route.desc}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:url" content=".*?" \/>/i,
    `<meta property="og:url" content="https://rulerscale.vercel.app${route.path}" />`
  );

  fs.writeFileSync(path.join(routeDir, 'index.html'), pageHtml);
  console.log(`✓ Generated static route: ${route.path}/index.html`);
}

console.log('Static route generation complete. All reloads will return HTTP 200 OK.');
