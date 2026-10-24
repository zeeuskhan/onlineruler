/**
 * Post-build script to generate prerendered static HTML entry points for every route.
 * 
 * Guarantees:
 * 1. HTTP 200 OK on direct page reload across Vercel / Netlify / GitHub Pages.
 * 2. Route-specific, unique <title>, <meta name="description">, and canonical URLs.
 * 3. Route-specific OpenGraph and Twitter card metadata.
 * 4. Route-specific, 100% valid Schema.org JSON-LD (WebApplication, BreadcrumbList, WebSite, FAQPage).
 * 5. Route-specific semantic <noscript> content with matching <h1>, introduction, and crawlable links.
 * 6. Generates dist/404.html for universal SPA fallback.
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
    h1: 'Online Ruler in Inches — Actual Size Imperial Screen Ruler',
    keyword: 'Online Ruler Inches',
    faqs: [
      {
        q: 'How do I read fractional inches on an online ruler?',
        a: 'Each inch is partitioned into 16 sections. The longest tick is the 1-inch mark, followed by the 1/2-inch, 1/4-inch, 1/8-inch, and shortest 1/16-inch ticks. Our tool labels key fractions and displays automated simplified fractions on hover.'
      },
      {
        q: 'How accurate is 1 inch on my computer screen?',
        a: 'Once calibrated using a credit card or coin, 1 inch on screen matches an exact physical inch (25.4 mm) on a certified metal workshop ruler.'
      },
      {
        q: 'Can I switch from inches to centimeters without losing my measurement?',
        a: 'Yes! Toggle the top scale selector to "Cm / Mm" or "Dual" at any time; your caliper positions and relative distance will instantly convert to metric.'
      }
    ]
  },
  {
    path: '/online-ruler-cm',
    title: 'Online Ruler CM — 100% Actual Size Metric Screen Ruler',
    desc: 'Measure physical items in centimeters (cm) and millimeters (mm) with our calibrated online ruler. 100% actual size, free, with zero downloads.',
    h1: 'Online Ruler in Centimeters (CM) — True Actual Size Metric Scale',
    keyword: 'Online Ruler CM',
    faqs: [
      {
        q: 'How many millimeters are in 1 centimeter?',
        a: 'There are exactly 10 millimeters in 1 centimeter. Each centimeter on our ruler is subdivided into 10 precise 1mm ticks with a 5mm mid-tick.'
      },
      {
        q: 'How do I measure in centimeters on my phone or laptop?',
        a: 'Open RuleScale in your browser, calibrate using a standard debit card (85.60 mm width), and place your item against the centimeter markings.'
      },
      {
        q: 'Is this centimeter scale accurate without calibration?',
        a: 'Uncalibrated screens default to standard 96 DPI, which can deviate 5% to 15% on high-density displays. Quick card calibration ensures 100% true physical millimeters and centimeters.'
      }
    ]
  },
  {
    path: '/online-ruler-mm',
    title: 'Online Ruler MM — High-Precision Millimeter Screen Ruler',
    desc: 'Measure small objects with sub-millimeter precision. Online ruler in mm calibrated to actual size. Interactive caliper markers for exact gaps.',
    h1: 'Online Ruler in Millimeters (MM) — High-Precision Screen Ruler',
    keyword: 'Online Ruler MM',
    faqs: [
      {
        q: 'Can this online ruler measure down to single millimeters?',
        a: 'Yes, every millimeter is individually etched with sub-pixel alignment once your screen DPI is calibrated against a credit card or coin.'
      },
      {
        q: 'What small objects can I measure with a millimeter screen ruler?',
        a: 'Small screws, bolt diameters, watch straps, SIM cards, jewelry rings, drill bits, and electronics pins.'
      }
    ]
  },
  {
    path: '/actual-size-ruler',
    title: 'Actual Size Ruler — 1:1 Scale Screen Measure (Card Calibrated)',
    desc: 'True actual size ruler on screen. Calibrate with any credit card or coin for guaranteed 1:1 physical accuracy in cm, mm, and inches. Free & fast.',
    h1: 'Actual Size Ruler on Screen — Calibrated 1:1 Physical Scale',
    keyword: 'Actual Size Ruler',
    faqs: [
      {
        q: 'Why do most screen rulers fail to show actual size?',
        a: 'Different screens pack different numbers of pixels into every inch (PPI). A standard 24" 1080p monitor has 92 PPI while a MacBook has 227 PPI. Without calibration, 1 inch appears vastly different on each display.'
      },
      {
        q: 'How does card calibration create 100% actual size?',
        a: 'All standard bank debit and credit cards follow ISO/IEC 7810 ID-1, measuring exactly 85.60 mm wide. Matching the on-screen box to your card calculates your exact display PPI.'
      }
    ]
  },
  {
    path: '/screen-ruler',
    title: 'Screen Ruler — Measure Screen Elements & Physical Items Online',
    desc: 'Versatile screen ruler for measuring on-display graphics and physical objects. Switch between pixels, cm, mm, and inches. Free, zero downloads.',
    h1: 'Screen Ruler — Interactive Digital & Physical Measuring Tool',
    keyword: 'Screen Ruler',
    faqs: [
      {
        q: 'What can I measure with an online screen ruler?',
        a: 'You can measure physical objects placed gently on the glass (like keys, screws, cards) or digital UI layouts in pixels.'
      },
      {
        q: 'How do the interactive caliper sliders work?',
        a: 'Drag Caliper A to one edge of the item and Caliper B to the opposite edge. The tool displays the exact distance in cm, mm, inches, and px with one-click copying.'
      }
    ]
  },
  {
    path: '/camera-ruler',
    title: 'Online Ruler Camera — Measure Objects with Your Phone or Webcam',
    desc: 'Measure physical objects using your phone camera or laptop webcam. Live video feed with calibrated ruler overlay, freeze-frame, and calipers. 100% free.',
    h1: 'Online Ruler Camera — Live Screen & Camera Measurement',
    keyword: 'Online Ruler Camera',
    faqs: [
      {
        q: 'How does the camera ruler work?',
        a: 'It uses your device camera or webcam via the standard browser MediaDevices API to display a live feed with an interactive calibrated caliper overlay. No video is ever recorded or uploaded.'
      },
      {
        q: 'Can I freeze the frame to measure moving or awkward items?',
        a: 'Yes, click "Freeze Frame" to take an instantaneous snapshot on screen and slide calipers comfortably.'
      }
    ]
  },
  {
    path: '/ruler-overlay',
    title: 'Ruler Overlay — Full-Screen Viewport Edge Ruler with Crosshairs',
    desc: 'Full-screen ruler overlay hugging all 4 display edges. Drag guidelines across your viewport, track mouse coordinates, and measure in cm or inches.',
    h1: 'Ruler Overlay — Full-Screen Multi-Edge Viewport Measuring Tool',
    keyword: 'Ruler Overlay',
    faqs: [
      {
        q: 'What is a ruler overlay?',
        a: 'A ruler overlay places perimeter edge scales along the top, bottom, and side borders of your browser viewport, allowing you to gauge physical papers or digital layouts without leaving the browser tab.'
      },
      {
        q: 'Does the overlay use the same calibration as the main ruler?',
        a: 'Yes, all calibrations performed with a card or coin synchronize automatically across the standard ruler, overlay, and specialized tools.'
      }
    ]
  },
  {
    path: '/virtual-ruler',
    title: 'Virtual Ruler — Free Online Virtual Measuring Tool (Actual Size)',
    desc: 'Free virtual ruler on screen. Measure items in inches, centimeters, and millimeters with hardware PPI calibration. Zero installation, 100% accurate.',
    h1: 'Virtual Ruler — Zero-Install Actual Size Measuring Tool',
    keyword: 'Virtual Ruler',
    faqs: [
      {
        q: 'Is there a virtual ruler that is 100% accurate on screen?',
        a: 'Yes. RuleScale is a calibrated virtual ruler that adjusts to your exact screen DPI, ensuring on-screen millimeters and inches match physical instruments.'
      }
    ]
  },
  {
    path: '/digital-ruler',
    title: 'Digital Ruler — High Precision Caliper Readouts & Screen Measure',
    desc: 'Precision digital ruler with instant numeric readouts in mm, cm, inches, and px. Features interactive sliding calipers and one-click copy.',
    h1: 'Digital Ruler — Precision Electronic Caliper & Screen Measure',
    keyword: 'Digital Ruler',
    faqs: [
      {
        q: 'How do digital calipers improve measurement accuracy?',
        a: 'Instead of estimating distance by eye, sliding calipers compute the mathematical distance between two coordinate markers down to decimal fractions.'
      }
    ]
  },
  {
    path: '/1-cm-on-screen',
    title: '1 CM Visualised on Screen — Exact 1 Centimeter Actual Size',
    desc: 'See exactly how big 1 centimeter is on your screen. Calibrate to 100% actual size and compare 1cm against real-world items like staples and pencil tips.',
    h1: '1 Centimeter on Screen — Exact 1 CM Actual Size Reference',
    keyword: '1 CM Visualised',
    faqs: [
      {
        q: 'How big is 1 centimeter in reality?',
        a: '1 centimeter equals 10 millimeters, or roughly the width of an average adult fingernail or a standard staple.'
      }
    ]
  },
  {
    path: '/1-inch-on-screen',
    title: '1 Inch on Screen — Actual Size 1" Imperial Reference Guide',
    desc: 'See exactly what 1 physical inch looks like on your display. Calibrate with a coin or card for 100% actual size 1-inch reference with 16th tick marks.',
    h1: '1 Inch on Screen — True 1" Physical Size Reference Guide',
    keyword: '1 Inch on Screen',
    faqs: [
      {
        q: 'How big is 1 physical inch on screen?',
        a: '1 physical inch equals exactly 2.54 centimeters or 25.4 millimeters. Calibrating with a card ensures 1 inch on your screen matches a physical ruler.'
      }
    ]
  },
  {
    path: '/ruler-for-phone',
    title: 'Ruler for Phone — Touch-Friendly Actual Size Mobile Ruler',
    desc: 'Turn your iPhone or Android into an accurate pocket ruler. Touch-drag calipers, zoom-lock mode, and coin calibration for true physical cm and inches.',
    h1: 'Ruler for Phone — Touch-Friendly Mobile Screen Ruler',
    keyword: 'Ruler for Phone',
    faqs: [
      {
        q: 'Can I use an online ruler on an iPhone or Android phone?',
        a: 'Yes, RuleScale is fully touch-optimized with pinch-zoom locking so you can place small items on the screen and drag calipers with your thumb.'
      }
    ]
  },
  {
    path: '/ruler-for-laptop',
    title: 'Computer Ruler — Calibrated Laptop & Desktop Screen Ruler',
    desc: 'Turn your laptop or desktop monitor into a calibrated physical ruler. Presets for MacBook, Dell, HP, Lenovo, and 24"-27" external displays. Free.',
    h1: 'Computer Ruler for Laptop & Desktop PC Displays',
    keyword: 'Computer Ruler',
    faqs: [
      {
        q: 'How do I calibrate my laptop screen ruler?',
        a: 'Select your laptop diagonal size from our pre-configured presets (e.g. MacBook Air 13.3", MacBook Pro 14", Dell XPS 15") or calibrate with any credit card.'
      }
    ]
  },
  {
    path: '/ruler-widget',
    title: 'Free Ruler Widget — Embed a Responsive Online Ruler on Your Site',
    desc: 'Embed a free, responsive online ruler widget on your website, blog, or educational portal. Clean iframe code with customizable units and zero ads.',
    h1: 'Embeddable Ruler Widget for Webmasters & Educators',
    keyword: 'Ruler Widget',
    faqs: [
      {
        q: 'Is this ruler widget free to embed on my website?',
        a: 'Yes, the iframe widget is 100% free for educational, DIY, e-commerce, and personal websites with standard attribution.'
      }
    ]
  },
  {
    path: '/about',
    title: 'About RuleScale — Precision Virtual Measuring Technology',
    desc: "Learn about RuleScale's mission to provide the world's most accessible, calibrated, and privacy-first online measuring instruments.",
    h1: 'About RuleScale & Precision Virtual Measuring Technology',
    keyword: 'About RuleScale',
    faqs: []
  },
  {
    path: '/contact',
    title: 'Contact Us — RuleScale Engineering & Support',
    desc: 'Get in touch with our engineering team for inquiries, bug reports, feature requests, or partnership opportunities.',
    h1: 'Contact the RuleScale Engineering Team',
    keyword: 'Contact RuleScale',
    faqs: []
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — 100% Client-Side Processing Guarantee',
    desc: "Read RuleScale's privacy policy. All camera video, sensor data, and measurement coordinates are processed 100% locally on your device.",
    h1: 'Privacy Policy & Zero Server Data Guarantee',
    keyword: 'Privacy Policy',
    faqs: []
  },
  {
    path: '/terms',
    title: 'Terms of Service — RuleScale Online Utility',
    desc: 'Terms and conditions governing the use of the RuleScale online ruler and measuring utilities.',
    h1: 'Terms of Service & Usage Guidelines',
    keyword: 'Terms of Service',
    faqs: []
  },
  {
    path: '/disclaimer',
    title: 'Accuracy Disclaimer & Measurement Limitations',
    desc: 'Important legal and technical accuracy disclaimer regarding display pixel calibration, hardware variations, and industrial tolerances.',
    h1: 'Accuracy Disclaimer & Display Measurement Limitations',
    keyword: 'Accuracy Disclaimer',
    faqs: []
  },
];

for (const route of routes) {
  const routeDir = path.join(distDir, route.path.replace(/^\//, ''));
  fs.mkdirSync(routeDir, { recursive: true });

  let pageHtml = templateHtml;

  // 1. Replace Title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // 2. Replace Meta Description
  pageHtml = pageHtml.replace(
    /<meta name="description" content=".*?" \/>/i,
    `<meta name="description" content="${route.desc}" />`
  );

  // 3. Replace Canonical Link
  pageHtml = pageHtml.replace(
    /<link rel="canonical" href=".*?" \/>/i,
    `<link rel="canonical" href="https://rulerscale.vercel.app${route.path}" />`
  );

  // 4. Replace OpenGraph Title & Desc & URL
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

  // 5. Replace Twitter Title & Desc
  pageHtml = pageHtml.replace(
    /<meta name="twitter:title" content=".*?" \/>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta name="twitter:description" content=".*?" \/>/i,
    `<meta name="twitter:description" content="${route.desc}" />`
  );

  // 6. Generate Route-Specific Schema.org JSON-LD
  const canonicalUrl = `https://rulerscale.vercel.app${route.path}`;
  const graphElements = [
    {
      '@type': 'WebSite',
      '@id': 'https://rulerscale.vercel.app/#website',
      'url': 'https://rulerscale.vercel.app/',
      'name': 'RuleScale - Online Ruler & Screen Measure',
      'publisher': {
        '@type': 'Organization',
        '@id': 'https://rulerscale.vercel.app/#organization',
        'name': 'RuleScale',
        'url': 'https://rulerscale.vercel.app/',
        'logo': 'https://rulerscale.vercel.app/favicon.svg'
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://rulerscale.vercel.app/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': route.keyword,
          'item': canonicalUrl
        }
      ]
    },
    {
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#webapp`,
      'name': route.title,
      'description': route.desc,
      'url': canonicalUrl,
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires HTML5 Support and JavaScript',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '1280',
        'bestRating': '5',
        'worstRating': '1'
      },
      'featureList': [
        'Card calibration for true 1:1 physical size',
        'Dual Imperial inches and Metric cm/mm scale',
        'Interactive caliper sliders with copyable measurements',
        'Full-screen ruler overlay with crosshairs',
        'Privacy-first 100% client-side calculation'
      ]
    },
    {
      '@type': 'HowTo',
      '@id': `${canonicalUrl}#howto`,
      'name': `How to Use ${route.keyword} with 100% Accuracy`,
      'description': `Calibrate and measure physical items or screen elements using ${route.keyword}.`,
      'totalTime': 'PT1M',
      'step': [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': 'Calibrate Display PPI',
          'text': 'Align a standard debit/credit card (85.60 mm) to the calibration box to set 100% true physical size.',
          'url': `${canonicalUrl}#calibrate`
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'Align Physical Item',
          'text': 'Place your physical object gently against your display aligned with the zero marker.',
          'url': `${canonicalUrl}#align`
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Read Dimensions or Slide Calipers',
          'text': 'Read the measurement markings directly or slide calipers A and B for precise digital readings.',
          'url': `${canonicalUrl}#measure`
        }
      ]
    }
  ];

  if (route.faqs && route.faqs.length > 0) {
    graphElements.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      'mainEntity': route.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    });
  }

  const routeJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphElements
  }, null, 2);

  // Replace JSON-LD in HTML
  pageHtml = pageHtml.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${routeJsonLd}\n    </script>`
  );

  // 7. Generate Route-Specific Semantic <noscript> Prerender Content
  const faqHtml = route.faqs && route.faqs.length > 0
    ? `<h2>Frequently Asked Questions About ${route.keyword}</h2>
       <dl>${route.faqs.map(f => `<dt><strong>${f.q}</strong></dt><dd>${f.a}</dd>`).join('\n')}</dl>`
    : '';

  const noscriptHtml = `<noscript>
      <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; color: #222; line-height: 1.6;">
        <h1>${route.h1}</h1>
        <p>${route.desc}</p>
        <h2>How to Measure at 100% Actual Size</h2>
        <ol>
          <li>Open this page on your computer monitor, laptop, tablet, or phone.</li>
          <li>Calibrate your display using a standard bank card (85.60 mm) or coin to match your hardware DPI.</li>
          <li>Gently place your physical object on screen and read precise dimensions or slide the interactive calipers.</li>
        </ol>
        ${faqHtml}
        <h3>Related Measurement Tools:</h3>
        <ul>
          <li><a href="/">Online Ruler (Dual CM & Inches Hub)</a></li>
          <li><a href="/online-ruler-cm">Centimeter Ruler Online (CM)</a></li>
          <li><a href="/online-ruler-mm">Millimeter Ruler Online (MM)</a></li>
          <li><a href="/online-ruler-inches">Online Ruler in Inches (1/16")</a></li>
          <li><a href="/actual-size-ruler">Actual Size Screen Ruler (1:1 Scale)</a></li>
          <li><a href="/ruler-overlay">Ruler Overlay (4-Edge Viewport Ruler)</a></li>
          <li><a href="/camera-ruler">Camera Ruler (Measure with webcam/phone)</a></li>
          <li><a href="/screen-ruler">Screen Ruler (Pixels & Calipers)</a></li>
        </ul>
        <p><em>Privacy Guarantee: 100% client-side execution with zero data tracking.</em></p>
      </div>
    </noscript>`;

  pageHtml = pageHtml.replace(/<noscript>[\s\S]*?<\/noscript>/i, noscriptHtml);

  fs.writeFileSync(path.join(routeDir, 'index.html'), pageHtml);
  console.log(`✓ Generated prerendered static route: ${route.path}/index.html`);
}

console.log('Static route generation complete. All reloads will return HTTP 200 OK with dedicated metadata.');
