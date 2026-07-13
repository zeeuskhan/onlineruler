import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;

interface SEOPageData {
  title: string;
  description: string;
  h1: string;
  paragraphs: string[];
  faqs: { q: string; a: string }[];
}

const PAGES_SEO: Record<string, SEOPageData> = {
  ruler: {
    title: "Online Ruler — Free Virtual Screen Ruler Actual Size",
    description: "Accurate online ruler. Calibrate dynamically with a card or coin. Measure on screen in cm, mm, inch, and pixels with a highly accurate digital virtual ruler.",
    h1: "Online Ruler — Free Virtual Actual Size Screen Ruler",
    paragraphs: [
      "RuleScale's online ruler is a highly accurate, browser-based digital measuring tool that allows you to measure any small physical object on your screen. Whether you are using a desktop monitor, a laptop, a tablet, or a mobile phone, our virtual ruler ensures precise measurements in centimeters (cm), millimeters (mm), inches (in), and pixels (px).",
      "To achieve 100% actual size accuracy, the ruler calibrates dynamically to your device's screen size using standard physical reference objects. By placing a common pocket item, like a credit card, ID, or coin, against your screen and matching it with our interactive slider, our software calculates the exact pixels-per-inch (PPI) of your display.",
      "This computer ruler eliminates the need to carry physical tape measures or plastic rulers. It works instantly without downloads, offering an immersive full-screen edge ruler overlay, draggable alignment guides, and a cursor coordinate tracker for advanced web design or DIY projects."
    ],
    faqs: [
      {
        q: "How accurate is this online ruler?",
        a: "The virtual ruler is 100% accurate once calibrated. Since different displays have different pixel densities, you must use our 10-second calibration tool with a standard card or coin to match the screen scale to real-world dimensions."
      },
      {
        q: "Can I measure in both centimeters and inches?",
        a: "Yes, our ruler online supports multiple metric and imperial measurement units. You can toggle between a cm ruler online, mm ruler, inch ruler online, and screen pixels (px) with a single click."
      },
      {
        q: "Does the actual size ruler on screen work on mobile phones?",
        a: "Absolutely. RuleScale is fully optimized for mobile devices, including cell phone rulers for iPhone and Android, as well as tablet and monitor displays."
      },
      {
        q: "Do I need to download an app to use this digital ruler?",
        a: "No download or installation is required. This free ruler tool is a lightweight web app that runs directly in your browser on any screen size."
      }
    ]
  },
  protractor: {
    title: "Online Protractor — Measure Angles on Screen | RuleScale",
    description: "Free interactive 360° protractor. Measure and draw angles directly on your screen with precision — no download needed.",
    h1: "Online Protractor — Interactive Screen Angle Measurement",
    paragraphs: [
      "The RuleScale online protractor is an interactive, browser-based virtual tool designed to measure angles directly on your screen with extreme precision. Perfect for students, architects, designers, and engineers, this tool provides full 360-degree rotation and flexible controls to inspect angles on physical objects placed against your display or digital mockups behind the tool.",
      "Using our protractor online is simple and intuitive. You can drag the center point to align with the vertex of any angle, adjust the baseline to match the first ray, and rotate the secondary arm to read the exact angle in degrees. It supports full opacity controls so you can overlay it on top of web designs, images, or documents.",
      "Because it is built entirely using lightweight SVG vectors, the protractor scales flawlessly on any device—including desktop monitors, laptops, and mobile phone screens—without pixelation or loss of accuracy."
    ],
    faqs: [
      {
        q: "How do I use the online protractor to measure an angle?",
        a: "Place the center crosshair of the protractor at the vertex of the angle. Align the baseline arm (0°) with one of the angle rays, then drag the rotating arm to align with the other ray. The exact degree of the angle will be calculated automatically."
      },
      {
        q: "Is the virtual protractor free to use?",
        a: "Yes, RuleScale's online protractor is completely free and works instantly on all browser-equipped devices without registration or subscription."
      },
      {
        q: "Can I rotate the entire protractor?",
        a: "Yes, the protractor tool features a 360-degree rotation wheel allowing you to align it with any tilted drawing, image, or blueprint on your screen."
      }
    ]
  },
  "ring-size": {
    title: "Ring Sizer Chart — Find Your Ring Size Online | RuleScale",
    description: "Accurate virtual ring sizer chart. Place an existing ring on your screen to find your exact US, UK, and EU ring sizes instantly. Fast and free.",
    h1: "Online Ring Sizer Chart — Virtual Ring Size Measurement",
    paragraphs: [
      "Finding your perfect ring size has never been easier. Our virtual ring sizer chart allows you to measure an existing ring or determine your finger size directly from your browser. It provides interactive, scale-calibrated circles corresponding to standard US, UK, Japanese, and European size charts.",
      "To get accurate results, ensure that your screen is calibrated first using our Calibration widget. Once calibrated, simply place a physical ring that fits you comfortably directly onto the screen. Use the interactive slider to adjust the diameter of the virtual circle until it matches the inside edge of your physical ring perfectly.",
      "This digital ring sizer is completely free and secure. It eliminates the guesswork when shopping for engagement rings, wedding bands, or fashion jewelry online, helping you avoid costly resizing and shipping returns."
    ],
    faqs: [
      {
        q: "How do I find my ring size online?",
        a: "Calibrate your screen, then place a ring that fits you on the screen. Adjust our on-screen circle using the slider until it perfectly matches the inner diameter of your ring. The sizer will display your US, UK, and EU ring sizes instantly."
      },
      {
        q: "Is this virtual ring sizer accurate?",
        a: "Yes, it is highly accurate provided your screen has been calibrated first. Because screen dimensions vary across devices, calibration with a physical card is critical to render the circle sizes to exact physical scale."
      },
      {
        q: "What sizing standards do you support?",
        a: "Our ring sizer chart supports US/Canada, UK/Australia/Ireland (alphabetic scale), and European/Japanese millimeter circumference and diameter standards."
      }
    ]
  },
  grid: {
    title: "Grid Overlay Tool — Online Screen Designer Grid",
    description: "Free interactive web grid overlay tool. Create customizable column and pixel grids on your screen for alignment, web design, and layout testing.",
    h1: "Grid Overlay Tool — Interactive Web Alignment Grid",
    paragraphs: [
      "The RuleScale grid overlay tool is an advanced on-screen alignment utility tailored for frontend developers, UI/UX designers, and digital artists. It draws highly customizable overlays with column rules, pixel coordinates, and row baselines directly over your active workspace.",
      "With this designer screen grid, you can adjust grid spacing, column counts, gutter sizes, and border colors in real-time. Whether you are checking the alignment of a website, testing a layout for responsive breakpoints, or measuring spacing between digital elements, our tool makes layout auditing seamless.",
      "The grid tool supports opacity toggles so it can act as a subtle guide while you develop, or as a high-contrast pixel ruler to verify grid columns against responsive CSS designs."
    ],
    faqs: [
      {
        q: "What is a grid overlay tool?",
        a: "It is a digital utility that renders customizable columns, gutters, and modular grid lines over your browser viewport to help you audit and align website layouts, graphics, and text blocks."
      },
      {
        q: "Can I customize the column count and gutter width?",
        a: "Yes, our interactive grid tool allows you to dynamically configure columns, row heights, grid spacing in pixels or inches, gutters, and line colors to match any layout framework."
      },
      {
        q: "Does this screen grid support fluid responsive design?",
        a: "Yes, you can set fluid percentage-based columns or lock specific pixel layouts to test how elements align across desktop, laptop, and tablet displays."
      }
    ]
  },
  "unit-converter": {
    title: "Unit Converter Online — Easy Measurement Converter",
    description: "Free measurement converter. Convert instantly between inches, cm, mm, pixels, meters, and feet with real-time scaling and screen ruler visuals.",
    h1: "Online Unit Converter — Easy Measurement Conversions",
    paragraphs: [
      "The RuleScale unit converter online is a fast, streamlined conversion calculator designed specifically for imperial and metric length dimensions. Easily convert between inches, centimeters (cm), millimeters (mm), pixels (px), meters (m), feet (ft), and yards (yd) with real-time computational feedback.",
      "Unlike generic search engine calculators, our conversion utility visualizes the converted length directly on an interactive actual-size ruler! This helps you immediately grasp the physical scale of the values you are converting, bridging the gap between numbers and real-world proportions.",
      "This digital converter is an indispensable asset for international shopping, DIY crafting, blueprint reading, and web development, giving you precision conversions down to several decimal points."
    ],
    faqs: [
      {
        q: "How do I convert centimeters (cm) to inches?",
        a: "Enter the centimeter value into the conversion input, and the tool will instantly calculate the equivalent in inches (1 cm = 0.3937 inches) while displaying the exact length on our calibrated virtual ruler."
      },
      {
        q: "What units are supported by this measurement converter?",
        a: "You can convert between Millimeters (mm), Centimeters (cm), Meters (m), Inches (in), Feet (ft), Yards (yd), and Screen Pixels (px)."
      },
      {
        q: "Is the pixel conversion accurate?",
        a: "Yes! It dynamically converts pixels based on your screen's active calibration (DPI/PPI), giving you the actual physical size of screen elements."
      }
    ]
  },
  printable: {
    title: "Printable Ruler PDF — Actual Size Free Print Template",
    description: "Download and print 100% actual size printable ruler PDFs. Accurate metric (cm) and imperial (inch) templates for standard A4 and Letter paper.",
    h1: "Printable Ruler PDF — Free Scale-Accurate Paper Ruler",
    paragraphs: [
      "When a virtual screen ruler isn't enough, RuleScale provides free, 100% scale-accurate printable ruler PDF templates. These digital files are designed for standard paper dimensions, including US Letter and European A4 sheets, ensuring you have a reliable measuring tape in seconds.",
      "Our actual size printable rulers feature high-contrast dual-axis scales with centimeters and millimeters on one edge, and inches (with fractional markers down to 1/16\") on the other. Download the vector PDF and print it on any home or office printer with zero scaling.",
      "To ensure perfect accuracy when printing, always set your printer's scaling settings to \"100%\" or \"Actual Size\" rather than \"Fit to Page\" or \"Shrink to Fit\". A physical credit card reference block is printed on the page so you can easily verify its scale accuracy."
    ],
    faqs: [
      {
        q: "How do I print the ruler to actual size?",
        a: "Download the PDF from our page, open it, and select Print. In your printer options, ensure that \"Page Scaling\" is set to \"None\" or \"Actual Size\" (do not use \"Fit to Page\")."
      },
      {
        q: "What paper formats are supported?",
        a: "We provide pre-configured templates for US Letter (8.5 x 11 inches) and international A4 paper (210 x 297 mm) with both centimeter and inch markings."
      },
      {
        q: "Is the printable paper ruler free to download?",
        a: "Yes, our vector ruler templates are 100% free to download and print for personal, commercial, or educational classroom use."
      }
    ]
  },
  guides: {
    title: "Ruler Calibration Guide & Measure Without a Ruler",
    description: "Step-by-step guides on how to calibrate any screen ruler and how to measure physical objects without a ruler using common pocket items.",
    h1: "Screen Ruler Calibration Guide & Creative Measuring Tricks",
    paragraphs: [
      "Welcome to RuleScale's ultimate knowledge center for virtual measurements. Here we provide comprehensive guides on screen ruler calibration, explaining the science of screen DPI, pixel density, and device-specific aspect ratios that affect digital scales.",
      "Learn how to measure any object without a ruler using 10 common pocket items whose dimensions are standardized worldwide—such as credit cards (85.6mm), banknotes, quarters, standard paper sheets, and smartphone dimensions.",
      "Our step-by-step tutorials make it easy for students, woodworkers, online shoppers, and DIY hobbyists to confidently take measurements on any screen or in any environment without specialized equipment."
    ],
    faqs: [
      {
        q: "Why do screen rulers require calibration?",
        a: "Screen displays come in different physical sizes but may share the same pixel resolutions (e.g., full HD). Therefore, a pixel-to-physical ratio (PPI) varies. Calibration translates virtual pixels into physical centimeters or inches."
      },
      {
        q: "How can I measure something if I don't have a ruler?",
        a: "You can use our calibrated actual-size screen ruler, or use standard physical benchmarks. For example, a credit card is exactly 3.37 inches wide, and standard US letters or A4 pages have fixed lengths."
      },
      {
        q: "What is the physical width of a standard credit card?",
        a: "A standard CR80 credit card or driving license is exactly 3.375 inches (85.6 mm) wide and 2.125 inches (53.98 mm) high. This is the optimal reference for calibration."
      }
    ]
  }
};

function getToolKeyFromPath(pathname: string): string {
  const p = pathname.toLowerCase();
  if (p === '/protractor') return 'protractor';
  if (p === '/ring-size') return 'ring-size';
  if (p === '/grid') return 'grid';
  if (p === '/unit-converter') return 'unit-converter';
  if (p === '/printable') return 'printable';
  if (p === '/guides') return 'guides';
  return 'ruler';
}

function getSeoInjectedHtml(originalHtml: string, reqPath: string): string {
  const toolKey = getToolKeyFromPath(reqPath);
  const pageData = PAGES_SEO[toolKey] || PAGES_SEO.ruler;
  const canonicalUrl = `https://rulerscale.vercel.app${reqPath === '/' ? '' : reqPath}`;

  // Build the structured JSON-LD data
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `RuleScale ${toolKey === 'ruler' ? 'Screen Ruler' : pageData.title.split('|')[0].trim()}`,
    "url": canonicalUrl,
    "description": pageData.description,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5, CSS3, JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "RuleScale Home",
        "item": "https://rulerscale.vercel.app/"
      },
      ...(reqPath !== '/' && reqPath !== '/ruler' ? [{
        "@type": "ListItem",
        "position": 2,
        "name": pageData.title.split('|')[0].trim(),
        "item": canonicalUrl
      }] : [])
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageData.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Build the visible crawler HTML blocks
  const visibleSeoBodyHtml = `
    <div style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: system-ui, sans-serif; line-height: 1.6;">
      <h1 style="font-size: 2rem; font-weight: 800; color: #1e1b4b; margin-bottom: 20px;">${pageData.h1}</h1>
      
      <div style="margin-bottom: 30px;">
        ${pageData.paragraphs.map(p => `<p style="margin-bottom: 16px; color: #374151;">${p}</p>`).join('')}
      </div>

      <h2 style="font-size: 1.5rem; font-weight: 700; color: #1e1b4b; margin-top: 40px; margin-bottom: 20px;">Frequently Asked Questions (FAQ)</h2>
      <div style="margin-bottom: 40px;">
        ${pageData.faqs.map(faq => `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; padding: 16px; background-color: #f9fafb;">
            <strong style="display: block; font-size: 1.1rem; color: #111827; margin-bottom: 8px;">${faq.q}</strong>
            <p style="margin: 0; color: #4b5563;">${faq.a}</p>
          </div>
        `).join('')}
      </div>

      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 40px 0;" />
      <h3 style="font-size: 1.1rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 16px;">Explore Our Ruler & Metric Suites</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
        <a href="/" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Screen Ruler</a>
        <a href="/protractor" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Angle Protractor</a>
        <a href="/ring-size" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Ring Sizer Chart</a>
        <a href="/grid" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Creative Web Grid</a>
        <a href="/unit-converter" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Instant Converter</a>
        <a href="/printable" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Scale Printable</a>
        <a href="/guides" style="display: block; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; color: #4f46e5; font-weight: 600;">Guidelines & FAQs</a>
      </div>
    </div>
  `;

  let html = originalHtml;

  // Replace default Title tag
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${pageData.title}</title>`
  );

  // Replace default Meta Description tag
  html = html.replace(
    /<meta name="description" content=".*?" \/>/,
    `<meta name="description" content="${pageData.description}" />`
  );

  // Replace default Canonical link tag
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph Tags
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/,
    `<meta property="og:title" content="${pageData.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/,
    `<meta property="og:description" content="${pageData.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // Replace Twitter Tags
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${pageData.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    `<meta name="twitter:description" content="${pageData.description}" />`
  );

  // Inject Schemas & visible pre-rendered body
  const structuredDataScripts = `
    <script type="application/ld+json">${JSON.stringify(webAppSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  `;

  html = html.replace('</head>', `${structuredDataScripts}</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${visibleSeoBodyHtml}</div>`);

  return html;
}

async function startServer() {
  const app = express();

  // 1. 301 Permanent Redirects for legacy query-param URLs (?tool=xxx)
  app.use((req, res, next) => {
    const tool = req.query.tool;
    if (tool && typeof tool === 'string') {
      const validTools = ['ruler', 'protractor', 'ring-size', 'grid', 'unit-converter', 'printable', 'guides'];
      if (validTools.includes(tool)) {
        const targetPath = tool === 'ruler' ? '/' : `/${tool}`;
        return res.redirect(301, targetPath);
      }
    }
    next();
  });

  // Health route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom' // We handle serving of index.html manually
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built assets (excluding index.html so our custom route handler gets triggered for paths)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  // Explicitly serve robots.txt with correct Content-Type (text/plain)
  app.get('/robots.txt', (req, res) => {
    try {
      const robotsPath = process.env.NODE_ENV !== 'production'
        ? path.resolve(process.cwd(), 'public/robots.txt')
        : path.resolve(process.cwd(), 'dist/robots.txt');
      res.status(200).set({ 'Content-Type': 'text/plain' }).sendFile(robotsPath);
    } catch (err) {
      res.status(404).send('Not Found');
    }
  });

  // Explicitly serve sitemap.xml with correct Content-Type (application/xml)
  app.get('/sitemap.xml', (req, res) => {
    try {
      const sitemapPath = process.env.NODE_ENV !== 'production'
        ? path.resolve(process.cwd(), 'public/sitemap.xml')
        : path.resolve(process.cwd(), 'dist/sitemap.xml');
      res.status(200).set({ 'Content-Type': 'application/xml' }).sendFile(sitemapPath);
    } catch (err) {
      res.status(404).send('Not Found');
    }
  });

  // Handle all core tool routes for SSR meta & on-page pre-rendering
  const cleanPaths = ['/', '/ruler', '/protractor', '/ring-size', '/grid', '/unit-converter', '/printable', '/guides'];
  
  cleanPaths.forEach(cleanPath => {
    app.get(cleanPath, async (req, res, next) => {
      try {
        let rawHtml = '';
        if (process.env.NODE_ENV !== 'production') {
          rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          // Inject HMR support in development mode
          rawHtml = await vite.transformIndexHtml(req.originalUrl, rawHtml);
        } else {
          rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');
        }

        const enrichedHtml = getSeoInjectedHtml(rawHtml, cleanPath);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(enrichedHtml);
      } catch (err) {
        next(err);
      }
    });
  });

  // Fallback for any other requests
  app.get('*', async (req, res, next) => {
    try {
      let rawHtml = '';
      if (process.env.NODE_ENV !== 'production') {
        rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        rawHtml = await vite.transformIndexHtml(req.originalUrl, rawHtml);
      } else {
        rawHtml = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');
      }
      res.status(200).set({ 'Content-Type': 'text/html' }).end(rawHtml);
    } catch (err) {
      next(err);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
