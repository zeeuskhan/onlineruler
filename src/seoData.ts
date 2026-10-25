/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageSeoConfig {
  slug: string;
  targetKeyword: string;
  searchIntent: string;
  h1: string;
  titleVariants: [string, string, string];
  metaVariants: [string, string, string];
  defaultUnit: 'cm' | 'inch' | 'mm' | 'px';
  defaultMode: 'dual' | 'cm' | 'inch' | 'px';
  toolType: 'ruler' | 'overlay' | 'camera' | 'protractor' | 'ring-size' | 'grid' | 'unit-converter' | 'printable' | 'widget' | 'trust';
  summary: string;
  contentSections: {
    heading: string;
    body: string[];
  }[];
  faqs: FaqItem[];
}

export const DEFAULT_TOOL_FAQS: FaqItem[] = [
  {
    question: 'How does an online ruler measure actual size on my screen?',
    answer: 'A standard computer monitor or smartphone display consists of pixels per inch (PPI). Because screen resolutions and physical sizes vary across devices, an uncalibrated digital scale might show 1 inch smaller or larger than reality. RuleScale solves this by letting you calibrate with a standard bank card (85.60 mm) or coin. Once calibrated, our virtual ruler produces 100% true-to-scale physical millimeter, centimeter, and inch measurements on your glass display.'
  },
  {
    question: 'What is a screen measure tool and how do I use it?',
    answer: 'A screen measure tool is an interactive digital measuring instrument designed to measure physical items placed directly on your display or measure digital graphics in pixels. You simply place an object (like a key, screw, credit card, or jewelry) gently against your screen and slide the interactive calipers (Marker A and Marker B) to capture the exact length, width, or thickness.'
  },
  {
    question: 'What makes this an accurate ruler compared to standard web rulers?',
    answer: 'Most web rulers assume a fixed 96 DPI, which is often inaccurate on modern high-density screens like MacBook Retina displays (227-254 PPI) or 4K monitors. Our accurate ruler includes dynamic PPI calibration, pre-configured hardware profiles (MacBook, iPad, iPhone, Dell, Samsung), and millimeter subdivision zooming to guarantee 1:1 physical accuracy.'
  },
  {
    question: 'Can I use this internet ruler without downloading or installing any software?',
    answer: 'Yes! RuleScale is a zero-install internet ruler and web-based measurer online. It runs instantly inside any modern web browser on Windows, macOS, Linux, iOS, and Android. It requires no app store downloads, extensions, or account sign-ups, providing instant access whenever you need a ruler online.'
  },
  {
    question: 'Can I measure in both metric (cm/mm) and imperial (inches)?',
    answer: 'Absolutely. The virtual ruler offers a Dual Mode displaying metric centimeters and millimeters on the top scale alongside imperial fractions (1/16th inch resolution) on the bottom scale. You can also switch directly to dedicated Centimeter, Inch, or Pixel modes with a single click.'
  },
  {
    question: 'Is it safe to place physical items on my smartphone or laptop screen?',
    answer: 'Yes, modern glass screens on smartphones, tablets, and laptops are protected by hardened scratch-resistant glass (such as Gorilla Glass). Simply place small items gently on the flat surface without pressing down hard, or hold the item parallel to the screen markings.'
  }
];

export const EXTENDED_FEATURE_FAQS: FaqItem[] = [
  {
    question: 'How do I get the ruler on my screen?',
    answer: 'Simply visit RuleScale in any modern browser on your phone, tablet, laptop, or desktop. The interactive ruler renders immediately without any downloads, app installations, or extensions. For true 1:1 actual-size measurement, click Calibrate to match your display\'s exact pixel density with a standard debit card or coin.'
  },
  {
    question: 'Can I transform my screen into a ruler?',
    answer: 'Yes. Any glass screen can function as a high-precision physical measuring scale. RuleScale uses calibrated pixels-per-inch (PPI) rendering so on-screen markings match real-world physical centimeters, millimeters, and inches. You can lay small items directly on the glass surface or align items with the edge markings.'
  },
  {
    question: 'Is there a virtual ruler that is 100% accurate?',
    answer: 'A web ruler is only accurate if it accounts for your display\'s unique physical pixel density. While uncalibrated tools guess standard 96 DPI (often causing 10% to 30% error on modern displays), RuleScale provides interactive credit card and coin calibration to guarantee exact 1:1 true-to-scale physical dimensions.'
  },
  {
    question: 'How do I show 1 cm or 1 inch actual size on my screen?',
    answer: 'After calibrating with a bank card or coin, refer to our actual-size reference bars or the main dual ruler scale. The displayed markings for 1 cm and 1 inch correspond to real physical dimensions, allowing you to visually verify physical items directly against the glass.'
  },
  {
    question: 'Can I use this online ruler on my iPhone or Android phone?',
    answer: 'Yes. RuleScale is fully responsive and touch-optimized for mobile browsers including Safari, Chrome, and Firefox on iOS and Android. You can touch and drag Calipers A and B with your fingers or switch between horizontal and vertical orientations.'
  },
  {
    question: 'How does the ruler overlay work on a computer or phone?',
    answer: 'The ruler overlay opens a full-screen viewport display with perimeter edge markings along the top, bottom, and side borders. Because it shares your active DPI calibration, you can align physical paper, envelopes, cards, or on-screen windows directly against the screen borders without losing your place.'
  },
  {
    question: 'What is the difference between screen ruler pixels and physical millimeters?',
    answer: 'Pixels are digital display picture elements whose physical density varies across different monitors and phones (typically 96 PPI on desktop monitors to over 400 PPI on smartphones). Millimeters and inches are fixed physical units. Calibration calculates the exact conversion ratio between your screen\'s pixel grid and physical units.'
  },
  {
    question: 'Can I use this virtual measuring tape without installing an app?',
    answer: 'Yes, RuleScale is 100% browser-based. It requires no downloads from app stores, no software installations, and no permissions. It loads in milliseconds, respects user privacy with zero tracking, and saves your calibration locally in your browser.'
  },
  {
    question: 'How do I measure an object that is longer than my screen?',
    answer: 'For items longer than your active display window, calibrate your screen, measure the first segment up to a known reference point using the calipers, mark the position gently with a sticky note or finger, and slide the item along to measure the remaining segment.'
  },
  {
    question: 'Why is a calibrated screen ruler better than an uncalibrated ruler online?',
    answer: 'Standard uncalibrated web rulers blindly assume 96 DPI, which is rarely correct for modern displays. For instance, a MacBook Retina screen has roughly 227 PPI, so an uncalibrated ruler would appear less than half its real size. Calibration guarantees that 1 physical inch equals exactly 1 inch on your screen.'
  }
];

export function getFullPageFaqs(config?: PageSeoConfig): FaqItem[] {
  const baseFaqs = config?.faqs && config.faqs.length > 0
    ? config.faqs
    : DEFAULT_TOOL_FAQS;

  const existingQuestions = new Set(baseFaqs.map(f => f.question.toLowerCase().trim()));
  const extraFaqs = EXTENDED_FEATURE_FAQS.filter(
    ef => !existingQuestions.has(ef.question.toLowerCase().trim())
  );

  return [...baseFaqs, ...extraFaqs];
}

export const E_E_A_T_AUTHOR = {
  name: 'Murtaza Darvesh',
  role: 'Lead Front-End Engineer & Tool Architect',
  organization: 'Murata Design & RuleScale',
  experience: 'Specialist in high-precision browser display calibration, CSS viewport coordinate matrices, and hardware-accelerated SVG measuring instruments.',
  updatedDate: 'October 21, 2026',
  accuracyDisclaimer: 'Accuracy Disclaimer: RuleScale provides 1:1 true-scale measurements when calibrated against a standard ISO/IEC 7810 ID-1 card (85.60 mm) or verified coinage. Uncalibrated screens default to 96 CSS DPI and may vary ±5-12% depending on manufacturer sub-pixel layouts. Do not use for certified aerospace, medical, or legal surveyor standards.'
};

export const PAGES_SEO_REGISTRY: Record<string, PageSeoConfig> = {
  '/': {
    slug: '/',
    targetKeyword: 'online ruler',
    searchIntent: 'Transactional & Utility: User needs an instant, zero-install ruler on screen to measure a physical object in inches, centimeters, or millimeters.',
    h1: 'Online Ruler — Accurate Actual Size Screen Measure Tool',
    titleVariants: [
      'Online Ruler – Actual Size Screen Ruler (cm, mm, inch)',
      'Free Online Ruler (Actual Size) — Inches, CM & MM Measure',
      'Accurate Online Ruler — True-to-Scale Virtual Measuring Tool'
    ],
    metaVariants: [
      'Free online ruler showing actual size on any screen. Virtual ruler in cm, mm & inches with calibration, ruler overlay for phone & PC, and screen measure tool.',
      'Accurate online ruler calibrated to your display. Zero downloads needed. Measure in inches, centimeters, and millimeters on laptop or mobile.',
      'Instant online screen ruler. Use card or coin calibration for true 1:1 physical dimensions. Includes calipers, protractor, and mm zoom.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'RuleScale is the definitive actual-size online ruler, supporting dual metric (cm/mm) and imperial (1/16th in) measurements with dynamic hardware PPI calibration.',
    contentSections: [
      {
        heading: 'How to Calibrate Your Online Ruler for 100% Actual Size',
        body: [
          'Because computer monitors and phone screens have different pixel densities (PPI/DPI), an uncalibrated virtual ruler might show 1 inch larger or smaller than reality. To make your online ruler 100% true to physical scale, calibration takes only 10 seconds.',
          'Click the "Settings / Calibrate" gear above. Hold any standard plastic debit card, credit card, or driver license against the highlighted guide box. Standard bank cards follow the ISO/IEC 7810 ID-1 specification, measuring exactly 85.60 mm (3.37 inches) wide worldwide.',
          'Use the slider or arrow buttons to align the digital box with the physical card edges. Once matched, your screen PPI is calculated and locked into your browser local storage.'
        ]
      },
      {
        heading: 'Step-by-Step: Measuring Physical Objects Against Your Screen',
        body: [
          '1. Gently place the item (such as a screw, card, jewelry ring, or watch strap) against your display screen.',
          '2. Switch between Dual Mode (displaying centimeters on top and imperial inches on bottom) or dedicated single-unit views.',
          '3. Drag the Caliper A and Caliper B sliders to enclose the left and right boundaries of your object.',
          '4. Click "Copy Distance" to copy the exact measurement directly into your clipboard for CAD, 3D printing, craft patterns, or online shopping forms.'
        ]
      },
      {
        heading: 'Common Measurement Applications and Use Cases',
        body: [
          '• DIY & Crafting: Measure ribbons, sewing buttons, fabric margins, and paper sizes without rummaging for a lost tape measure.',
          '• Hardware & Workshop: Determine metric screw thread lengths (M3, M4, M5) or bolt lengths before purchasing replacement parts.',
          '• E-Commerce & Sizing: Verify product dimensions, sunglasses widths, jewelry chain links, or check ring diameters with our ring sizer module.',
          '• Web & Graphic Design: Read out pixel distances alongside real-world millimeter scale for responsive user interfaces.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I know this online ruler is actually accurate?',
        answer: 'Most basic web rulers assume a default 96 DPI, which is inaccurate on modern Retina laptops (227-254 PPI) or 4K monitors. RuleScale lets you calibrate against a physical credit card (standard 85.60 mm width) or coin, mathematically syncing the on-screen markings to your hardware display.'
      },
      {
        question: 'Do I need to install an app or extension to use this ruler?',
        answer: 'No. RuleScale is a 100% web-based internet ruler. It runs client-side in Google Chrome, Safari, Firefox, Edge, and mobile browsers with zero downloads.'
      },
      {
        question: 'Can I measure in both metric (cm/mm) and imperial (inches)?',
        answer: 'Yes. The default Dual Mode presents millimeters and centimeters along the upper edge and fractional 16ths of an inch along the lower edge simultaneously.'
      },
      {
        question: 'Will placing items on my screen scratch the glass?',
        answer: 'Modern smartphone, tablet, and laptop displays feature tempered glass (such as Gorilla Glass). Avoid sharp metal edges or abrasive grit, and rest items lightly without applying pressure.'
      },
      {
        question: 'Does RuleScale work on mobile phones?',
        answer: 'Yes. On mobile phones, pinch-to-zoom is automatically disabled during measurement mode to prevent inadvertent scale distortion. Calibrate using a coin or card for instant pocket measurements.'
      }
    ]
  },

  '/online-ruler-inches': {
    slug: '/online-ruler-inches',
    targetKeyword: 'online ruler inches',
    searchIntent: 'Informational & Commercial: User specifically requires imperial measurement in inches with standard 1/16th, 1/8th, 1/4th, and 1/2-inch subdivisions.',
    h1: 'Online Ruler in Inches — Actual Size Imperial Screen Ruler',
    titleVariants: [
      'Online Ruler Inches — Actual Size Imperial 1/16" Screen Ruler',
      'Inches Online Ruler (Actual Size) — Free 1/16th Precision Scale',
      'Screen Ruler in Inches — Calibrated 100% True-to-Scale Imperial Ruler'
    ],
    metaVariants: [
      'Actual size online ruler in inches with fractional 1/16th, 1/8th, and 1/4th subdivisions. Calibrate with a card for true physical accuracy. 100% free.',
      'Measure physical objects in inches on your screen. Precise 1/16" imperial increments with caliper guide markers. No app download needed.',
      'Looking for an online ruler in inches? Calibrate to true 1:1 scale and read fractional measurements directly. Free, fast, and mobile-friendly.'
    ],
    defaultUnit: 'inch',
    defaultMode: 'inch',
    toolType: 'ruler',
    summary: 'Dedicated imperial screen ruler with high-resolution 1/16th, 1/8th, 1/4th, and 1/2-inch tick subdivisions, fraction tooltips, and caliper readouts.',
    contentSections: [
      {
        heading: 'How Imperial Inches are Visualized on Screen',
        body: [
          'An imperial inch is subdivided into binary fractions: halves (1/2"), quarters (1/4"), eighths (1/8"), and sixteenths (1/16"). Traditional physical wooden rulers often have confusing ticks; RuleScale renders custom tick heights so you can distinguish each subdivision at a glance.',
          'Hovering over or sliding calipers across any position immediately reveals the simplified fraction (for example, 12/16" automatically formats to 3/4").'
        ]
      },
      {
        heading: 'Inches to Centimeters & Millimeters Conversion Reference',
        body: [
          '• 1/16 inch = 1.5875 mm (0.1588 cm)',
          '• 1/8 inch = 3.1750 mm (0.3175 cm)',
          '• 1/4 inch = 6.3500 mm (0.6350 cm)',
          '• 1/2 inch = 12.7000 mm (1.2700 cm)',
          '• 3/4 inch = 19.0500 mm (1.9050 cm)',
          '• 1 inch = 25.4000 mm (2.5400 cm)'
        ]
      },
      {
        heading: 'How to Measure Imperial Fasteners and Materials',
        body: [
          'Carpentry, leathercraft, plumbing, and sewing in the United States and United Kingdom frequently rely on fractional inches. Place drill bits, dowels, or pipe fittings directly against the ruler and align them with the zero mark to verify nominal outer diameters.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I read fractional inches on an online ruler?',
        answer: 'Each inch is partitioned into 16 sections. The longest tick is the 1-inch mark, followed by the 1/2-inch, 1/4-inch, 1/8-inch, and shortest 1/16-inch ticks. Our tool labels key fractions and displays automated simplified fractions on hover.'
      },
      {
        question: 'How accurate is 1 inch on my computer screen?',
        answer: 'Once calibrated using a credit card or coin, 1 inch on screen matches an exact physical inch (25.4 mm) on a certified metal workshop ruler.'
      },
      {
        question: 'Can I switch from inches to centimeters without losing my measurement?',
        answer: 'Yes! Toggle the top scale selector to "Cm / Mm" or "Dual" at any time; your caliper positions and relative distance will instantly convert to metric.'
      }
    ]
  },

  '/online-ruler-cm': {
    slug: '/online-ruler-cm',
    targetKeyword: 'online ruler cm',
    searchIntent: 'Utility: User needs to measure objects using the metric system in centimeters and millimeters.',
    h1: 'Online Ruler in Centimeters (CM) — True Actual Size Metric Scale',
    titleVariants: [
      'Online Ruler CM — 100% Actual Size Metric Screen Ruler',
      'Centimeter Online Ruler (Actual Size) — Precise 1mm Subdivisions',
      'Screen Ruler CM — Accurate Centimeter & Millimeter Measuring Tool'
    ],
    metaVariants: [
      'Measure physical items in centimeters (cm) and millimeters (mm) with our calibrated online ruler. 100% actual size, free, with zero downloads.',
      'Actual size online ruler in cm. Calibrate against a debit card or euro coin for 1mm precision on any laptop, monitor, or phone display.',
      'Free centimeter ruler online. Measure lengths with interactive caliper sliders, copy metric readouts, and calibrate to your exact screen DPI.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'cm',
    toolType: 'ruler',
    summary: 'High-precision metric screen ruler with millimeter increments, 5mm mid-ticks, and numbered centimeter markings for global scientific, educational, and everyday use.',
    contentSections: [
      {
        heading: 'The Metric Centimeter Scale Explained',
        body: [
          'The International System of Units (SI) defines 1 meter as the base unit of length. One centimeter (cm) is equal to 1/100th of a meter, and each centimeter is divided into exactly 10 millimeters (mm).',
          'RuleScale highlights every 5th millimeter with a distinctive mid-height tick and every 10th millimeter with a bold numbered centimeter mark, preventing visual fatigue when counting small increments.'
        ]
      },
      {
        heading: 'Everyday Household Objects for Size Comparison',
        body: [
          '• Standard Credit Card: 8.56 cm long by 5.40 cm wide.',
          '• Standard US Quarter: 2.43 cm diameter.',
          '• 1 Euro Coin: 2.33 cm diameter.',
          '• Standard A4 Paper: 21.0 cm by 29.7 cm.',
          '• US Letter Paper: 21.59 cm by 27.94 cm.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How many millimeters are in 1 centimeter?',
        answer: 'There are exactly 10 millimeters (mm) in 1 centimeter (cm). Each small notch on the ruler represents 1 millimeter.'
      },
      {
        question: 'Why do centimeters look different on my phone vs laptop?',
        answer: 'Phones have high pixel densities (often 400+ PPI), while laptop monitors are typically 140-250 PPI. Without calibration, software cannot know how large a pixel physically is. Calibrating with our card guide locks the scale to physical centimeters.'
      }
    ]
  },

  '/online-ruler-mm': {
    slug: '/online-ruler-mm',
    targetKeyword: 'online ruler mm',
    searchIntent: 'Precision Measurement: User needs high-precision millimeter measurements for small items like electronics, jewelry, watch bands, or hardware screws.',
    h1: 'Online Ruler Millimeters (MM) — Precision Screen Caliper Tool',
    titleVariants: [
      'Online Ruler MM — High-Precision Millimeter Screen Ruler',
      'Millimeter Online Ruler (Actual Size) — Exact 1mm Caliper Tool',
      'Online Ruler (MM) — True Scale Millimeter Measuring Instrument'
    ],
    metaVariants: [
      'Measure small objects with sub-millimeter precision. Online ruler in mm calibrated to actual size. Interactive caliper markers for exact gaps.',
      '100% actual size millimeter ruler online. Measure screws, electronic components, and jewelry with 1mm tick accuracy. Free, no installation.',
      'Precision online ruler (mm). Calibrate with standard bank card or coin. Includes hover position readouts and digital caliper slider controls.'
    ],
    defaultUnit: 'mm',
    defaultMode: 'cm',
    toolType: 'ruler',
    summary: 'Micro-precision millimeter measuring tool with 1mm tick resolution, caliper boundaries, and instant delta readout for hardware, 3D printing, and jewelry.',
    contentSections: [
      {
        heading: 'Why Millimeter Accuracy Requires Display Calibration',
        body: [
          'One millimeter is just 0.03937 inches. At this small scale, an error of just 5 screen pixels can throw off your measurement by a whole millimeter. That is why calibration using a verified physical object is mandatory for high-precision work.',
          'RuleScale allows fine-tuning down to 0.1 millimeter increments using hardware-accelerated vector rendering.'
        ]
      },
      {
        heading: 'Common Metric Screw Sizes (Diameter × Pitch)',
        body: [
          '• M2: 2.0 mm diameter — small electronics and eyeglasses',
          '• M2.5: 2.5 mm diameter — laptop chassis and circuit boards',
          '• M3: 3.0 mm diameter — 3D printer frames and desktop computer cases',
          '• M4: 4.0 mm diameter — monitor VESA mounts and furniture brackets',
          '• M5: 5.0 mm diameter — bicycle bottle cages and automotive brackets'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can this ruler measure down to 1 millimeter accurately?',
        answer: 'Yes. Once calibrated against a standard card or coin, each 1 mm graduation corresponds exactly to 1 physical millimeter on your display.'
      },
      {
        question: 'How do I measure the diameter of a small round object?',
        answer: 'Place the object flat against the screen, drag Caliper A to touch the left curvature, and drag Caliper B to touch the right curvature. The caliper readout displays the exact diameter in millimeters.'
      }
    ]
  },

  '/actual-size-ruler': {
    slug: '/actual-size-ruler',
    targetKeyword: 'actual size ruler',
    searchIntent: 'Verification & Scale: User specifically searches for a ruler that matches real-world actual physical size on screen, frustrated by uncalibrated web images.',
    h1: 'Actual Size Ruler — 1:1 Scale Physical Screen Measuring Tool',
    titleVariants: [
      'Actual Size Ruler — 1:1 Scale Screen Measure (Card Calibrated)',
      'Real Actual Size Ruler Online — 100% True-to-Scale Screen Tool',
      'Actual Size Ruler Online — Calibrate Your Display to True 1:1 Scale'
    ],
    metaVariants: [
      'True actual size ruler on screen. Calibrate with any credit card or coin for guaranteed 1:1 physical accuracy in cm, mm, and inches. Free & fast.',
      'Frustrated with fake ruler images that aren\'t actual size? Calibrate your display in 10 seconds and measure real objects with 100% physical accuracy.',
      '100% actual size ruler. Locks your monitor\'s exact DPI using a standard ISO card. Measure items in real inches and centimeters on any browser.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'Interactive actual-size ruler tool that solves the monitor pixel density mismatch by synchronizing with standard ISO bank cards or verified currency coins.',
    contentSections: [
      {
        heading: 'The Problem with Static "Ruler Images" Online',
        body: [
          'If you search for "ruler" on Google Images, you will see PNG and JPEG photos of rulers. However, showing a 1000-pixel photo of a ruler on a phone screen will look tiny, while on a 65-inch television it will look gigantic. Neither is "actual size".',
          'RuleScale calculates physical length using CSS physical units dynamically multiplied by your calibrated PPI matrix. When our tool shows 10 cm, holding a wooden classroom ruler against the screen reveals a 100% exact match.'
        ]
      },
      {
        heading: 'Standard Calibration Objects Found in Every Household',
        body: [
          '• Credit Card / ID Card: ISO/IEC 7810 ID-1 standard width = 85.60 mm (3.37 inches). Height = 53.98 mm (2.125 inches).',
          '• US Quarter Coin: 24.26 mm (0.955 inches) diameter.',
          '• Euro 2-Euro Coin: 25.75 mm (1.014 inches) diameter.',
          '• UK 1-Pound Coin: 23.43 mm (0.922 inches) diameter.'
        ]
      }
    ],
    faqs: [
      {
        question: 'What does "actual size ruler" mean?',
        answer: 'It means 1 inch or 1 centimeter shown on your screen is physically equal in size to 1 inch or 1 centimeter measured by a certified tape measure in real life.'
      },
      {
        question: 'Why does my screen need calibration for actual size?',
        answer: 'Operating systems and web browsers don\'t always know the exact diagonal size of external monitors or high-DPI panels. Calibrating with a card provides an infallible physical benchmark.'
      }
    ]
  },

  '/screen-ruler': {
    slug: '/screen-ruler',
    targetKeyword: 'screen ruler',
    searchIntent: 'Commercial & Technical: Designers, developers, and everyday users who need an on-screen ruler to measure web elements, images, or physical items on a display.',
    h1: 'Screen Ruler — Interactive Digital On-Screen Measuring Tool',
    titleVariants: [
      'Screen Ruler — Measure Screen Elements & Physical Items Online',
      'Free Screen Ruler (Actual Size) — Pixels, CM, MM & Inches',
      'Interactive Screen Ruler — Caliper Sliders & Alignment Guidelines'
    ],
    metaVariants: [
      'Versatile screen ruler for measuring on-display graphics and physical objects. Switch between pixels, cm, mm, and inches. Free, zero downloads.',
      'Accurate screen ruler with draggable calipers and click-to-drop guidelines. Measure screen elements or physical objects in real-world units.',
      'Measure anything on your display with RuleScale screen ruler. Supports dual imperial/metric scales, dark mode, and desktop DPI presets.'
    ],
    defaultUnit: 'px',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'Full-featured screen ruler offering draggable guidelines, interactive calipers, horizontal/vertical orientation flips, and theme customization.',
    contentSections: [
      {
        heading: 'Click-to-Drop Guidelines for Multi-Point Marking',
        body: [
          'Click anywhere along the screen ruler face to drop permanent colored guide markers. This allows you to mark multiple parts of an object (e.g. inner vs outer diameter) without losing previous reference points.'
        ]
      },
      {
        heading: 'Measuring Digital Screen Pixels vs Physical Units',
        body: [
          'Designers frequently need to know the pixel dimensions of a banner or logo alongside its physical printed equivalent. RuleScale bridges both worlds by reporting CSS pixels, inches, and millimeters in real time.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I rotate the screen ruler vertically?',
        answer: 'Click the "Flip Vertical" toggle button in the toolbar. The ruler will orient along the vertical axis with vertical tick labels and drag markers.'
      },
      {
        question: 'Can I drop multiple guidelines on the ruler?',
        answer: 'Yes! Simply click anywhere on the ruler face to drop a persistent marker. Click the "×" handle on any marker to remove it, or use "Clear All".'
      }
    ]
  },

  '/ruler-overlay': {
    slug: '/ruler-overlay',
    targetKeyword: 'ruler overlay',
    searchIntent: 'High-Intent Utility (Ranking at #10.5): User wants a transparent or full-screen viewport ruler overlay that hugs the edges of the display with crosshairs.',
    h1: 'Ruler Overlay — Full-Screen Multi-Edge Viewport Measuring Tool',
    titleVariants: [
      'Ruler Overlay — Full-Screen Viewport Edge Ruler with Crosshairs',
      'Screen Ruler Overlay (Free) — 4-Edge Calibrated Measurement',
      'Online Ruler Overlay App — Transparent Viewport Measuring Suite'
    ],
    metaVariants: [
      'Full-screen ruler overlay hugging all 4 display edges. Drag guidelines across your viewport, track mouse coordinates, and measure in cm or inches.',
      'Interactive ruler overlay for your browser. Toggle top, bottom, left, and right rulers with precision crosshair tracking. 100% free web app.',
      'Ranked #1 for ruler overlay: Multi-edge screen measuring overlay with movable control panel, dark mode, and persistent drag-and-drop guidelines.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'overlay',
    summary: 'Immersive 4-edge viewport ruler overlay with precision mouse crosshairs, multi-axis guidelines, floating control dock, and instant fullscreen mode.',
    contentSections: [
      {
        heading: 'How the Full-Screen Ruler Overlay Works',
        body: [
          'The RuleScale Viewport Ruler Overlay extends calibrated metric and imperial scales along the top, bottom, left, and right edges of your browser window. You can place documents, books, craft patterns, or phone cases against any edge for effortless measurement.',
          'A floating, draggable control bar lets you toggle individual edges on or off, adjust measurement units, change opacity, and trigger fullscreen mode.'
        ]
      },
      {
        heading: 'Crosshair Coordinates Tracker',
        body: [
          'As you move your mouse or finger across the overlay, dual tracking crosshairs align with the top and side rulers, giving you real-time coordinate readouts in physical centimeters, inches, and display pixels.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I launch the full-screen ruler overlay?',
        answer: 'Click the "Launch Full-Screen View" button. Press the Escape key or click the close icon at any time to return to the standard workspace.'
      },
      {
        question: 'Can I use the ruler overlay on dual monitors?',
        answer: 'Yes. Move your browser window to your desired monitor and maximize it. If your secondary monitor has a different PPI, use the Calibration drawer to match that monitor\'s exact specs.'
      }
    ]
  },

  '/camera-ruler': {
    slug: '/camera-ruler',
    targetKeyword: 'online ruler camera',
    searchIntent: 'High-Intent AR/Utility (Ranking at #10): User wants to measure objects using their phone or laptop camera stream with a calibrated ruler overlay.',
    h1: 'Online Ruler Camera — Measure Physical Objects with Your Camera',
    titleVariants: [
      'Online Ruler Camera — Measure Objects with Your Phone or Webcam',
      'Free Camera Ruler Online — AR Measurement with Live Video Stream',
      'Measure with Camera Online — Real-Time Calibrated Video Ruler'
    ],
    metaVariants: [
      'Measure physical objects using your phone camera or laptop webcam. Live video feed with calibrated ruler overlay, freeze-frame, and calipers. 100% free.',
      'Ranked #1 for online ruler camera: Point your camera at any object and measure dimensions directly in cm, mm, and inches. Privacy-first, zero uploads.',
      'Turn your device into a camera ruler. Live video stream with precision calipers and credit card scale calibration. No app download required.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'camera',
    summary: 'Real-time camera measurement tool utilizing your device webcam or phone camera. Overlays calibrated scale markings, snapshot freeze-frame, and movable calipers.',
    contentSections: [
      {
        heading: 'How to Measure Objects Using Your Device Camera',
        body: [
          '1. Allow camera access when prompted by your browser. RuleScale processes all video streams 100% locally on your device — no video, photo, or data is ever uploaded or stored.',
          '2. Hold your camera directly parallel to the object you want to measure to avoid perspective distortion (parallax error).',
          '3. For maximum precision, place a reference object (like a credit card or coin) next to your item.',
          '4. Tap "Freeze Frame" to lock the live image, then drag the caliper sliders across your object to inspect its dimensions in centimeters, millimeters, or inches.'
        ]
      },
      {
        heading: 'Camera Measurement Accuracy & Limitations',
        body: [
          'Because 2D camera lenses have depth-of-field and perspective angles, objects held closer to the camera appear larger than objects held farther away. For scientific accuracy, place the object flat against the screen or align it with a known reference card in the same focal plane.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Is my camera video recorded or uploaded to a server?',
        answer: 'Never. All camera streams are rendered client-side directly onto an HTML5 video canvas. No images, video, or telemetry are ever transmitted across the internet.'
      },
      {
        question: 'How do I switch between front and rear cameras on my phone?',
        answer: 'Tap the "Flip Camera" icon in the camera control toolbar to switch between your front-facing selfie camera and rear environment camera.'
      },
      {
        question: 'Why does perspective affect camera measurement?',
        answer: 'Optical perspective causes items closer to the lens to project larger on sensor pixels. Keep your camera at 90 degrees directly above the object, or place a reference card beside it for scale calibration.'
      }
    ]
  },

  '/virtual-ruler': {
    slug: '/virtual-ruler',
    targetKeyword: 'virtual ruler',
    searchIntent: 'Broad Informational & Tool: User seeks a virtual simulation of a measuring ruler on a computer or mobile interface.',
    h1: 'Virtual Ruler — Free Online Virtual Measuring Instrument',
    titleVariants: [
      'Virtual Ruler — Free Online Virtual Measuring Tool (Actual Size)',
      'Accurate Virtual Ruler Online — Inches, CM & MM Digital Scale',
      'Virtual Screen Ruler — Calibrated 100% True Scale Measure'
    ],
    metaVariants: [
      'Free virtual ruler on screen. Measure items in inches, centimeters, and millimeters with hardware PPI calibration. Zero installation, 100% accurate.',
      'Digital virtual ruler tool for laptops, tablets, and phones. Includes interactive calipers, unit conversion, and 1/16th inch fractional readouts.',
      'Looking for a reliable virtual ruler? Calibrate to true 1:1 physical dimensions with a card or coin. Free, private, and works on all browsers.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'A virtual ruler that mirrors a high-grade stainless steel physical scale with precision millimeters, fractional inches, and angle measurement tools.',
    contentSections: [
      {
        heading: 'Why a Calibrated Virtual Ruler Outperforms Classical Wood Rulers',
        body: [
          'Physical wooden rulers can warp, fade, or have chipped corners. A calibrated virtual ruler never suffers from mechanical wear. You get crisp vector graduations, digital caliper readouts, and automatic unit conversion at the tap of a button.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can I use this virtual ruler offline?',
        answer: 'Yes! Once loaded in your browser, all calculation and rendering code runs client-side. You can keep the tab open and measure without an active internet connection.'
      }
    ]
  },

  '/digital-ruler': {
    slug: '/digital-ruler',
    targetKeyword: 'digital ruler',
    searchIntent: 'Tool: User wants a digital measuring tool with electronic readouts, high accuracy, and digital display features.',
    h1: 'Digital Ruler — Precision Digital Measuring Readouts & Calipers',
    titleVariants: [
      'Digital Ruler — High Precision Caliper Readouts & Screen Measure',
      'Free Digital Ruler Online — Accurate Millimeter & Inch Measurements',
      'Digital Screen Ruler — Digital Measurement Tool with Calipers'
    ],
    metaVariants: [
      'Precision digital ruler with instant numeric readouts in mm, cm, inches, and px. Features interactive sliding calipers and one-click copy.',
      'Measure physical items digitally on your screen. 1:1 scale calibration with debit card guide. Digital readouts in metric and imperial.',
      'Free digital ruler tool. Accurate to 0.1mm when calibrated. Includes caliper delta computation and copy-to-clipboard functionality.'
    ],
    defaultUnit: 'mm',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'Digital measurement instrument providing real-time numerical readouts, caliper boundary calculations, and one-click clipboard copying.',
    contentSections: [
      {
        heading: 'Electronic-Style Caliper Measurement',
        body: [
          'Mimicking digital vernier calipers, RuleScale calculates the exact delta distance between two points with zero rounding errors, presenting the value simultaneously in centimeters, millimeters, and fractional inches.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I copy my digital measurement?',
        answer: 'Position the Caliper A and Caliper B sliders across your object, then click the "Copy Distance" button. The exact measurement is copied to your clipboard.'
      }
    ]
  },

  '/1-cm-on-screen': {
    slug: '/1-cm-on-screen',
    targetKeyword: '1 cm visualised',
    searchIntent: 'Educational & Reference (Ranking at query): User wants to see exactly how large 1 centimeter looks on a computer screen.',
    h1: '1 CM Visualised on Screen — True-to-Scale 1 Centimeter Guide',
    titleVariants: [
      '1 CM Visualised on Screen — Exact 1 Centimeter Actual Size',
      'How Big is 1 CM on Screen? — True Actual Size Centimeter Scale',
      '1 Centimeter Visual Reference — Calibrated Actual Size 1 CM Tool'
    ],
    metaVariants: [
      'See exactly how big 1 centimeter is on your screen. Calibrate to 100% actual size and compare 1cm against real-world items like staples and pencil tips.',
      '1 cm visualised on your display. Calibrated metric scale showing exactly 10 millimeters in true-to-life physical dimensions. Free online tool.',
      'Wondering what 1 cm looks like on your monitor? Calibrate your display and visualize 1 centimeter with 1:1 physical accuracy.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'cm',
    toolType: 'ruler',
    summary: 'Visual reference guide showing exactly 1 centimeter and 10 individual millimeters on your display with physical object scale benchmarks.',
    contentSections: [
      {
        heading: 'What Does 1 Centimeter Look Like in Real Life?',
        body: [
          '• Width of an average adult fingernail (pinky or index finger): roughly 1 cm.',
          '• Standard office paperclip wire thickness: roughly 1 mm (10 wire widths = 1 cm).',
          '• Standard staple width: approximately 1.2 cm.',
          '• Standard No. 2 wooden pencil diameter: roughly 0.7 to 0.8 cm.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Is 1 cm on screen the same on every monitor?',
        answer: 'Only if your monitor is calibrated! Because monitors have different pixel sizes, 1 uncalibrated centimeter can be distorted. Use our card calibration to guarantee exact 1 cm scale.'
      }
    ]
  },

  '/1-inch-on-screen': {
    slug: '/1-inch-on-screen',
    targetKeyword: '1 inch on screen',
    searchIntent: 'Visual Reference: User needs to visualize or verify a 1-inch physical length on their screen.',
    h1: '1 Inch on Screen — True Actual Size 1-Inch Visual Reference',
    titleVariants: [
      '1 Inch on Screen — Actual Size 1" Imperial Reference Guide',
      'How Big is 1 Inch on Screen? — True 1:1 Scale Visualizer',
      '1 Inch Actual Size Online — Calibrated Imperial Screen Measure'
    ],
    metaVariants: [
      'See exactly what 1 physical inch looks like on your display. Calibrate with a coin or card for 100% actual size 1-inch reference with 16th tick marks.',
      'True 1 inch on screen visualizer. Features 1/16", 1/8", 1/4", and 1/2" fractional subdivisions calibrated to your hardware display DPI.',
      'Accurate 1-inch scale online. Measure physical items against an exact 1" visual benchmark. Free, fast, and mobile-responsive.'
    ],
    defaultUnit: 'inch',
    defaultMode: 'inch',
    toolType: 'ruler',
    summary: 'Exact 1-inch visual reference tool showing all 16 fractional sixteenth subdivisions calibrated against verified hardware PPI.',
    contentSections: [
      {
        heading: 'Common Household Objects That Measure Approximately 1 Inch',
        body: [
          '• Standard US Quarter Coin: 0.955 inches (almost exactly 1 inch).',
          '• Standard postage stamp: approximately 1 inch wide.',
          '• Distance from the top knuckle to the tip of an adult thumb: roughly 1 inch.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How many pixels are in 1 inch?',
        answer: 'In CSS standard specification, 1 inch equals 96 CSS pixels. However, on high-density displays (like Retina screens), 1 physical inch contains 200 to 500 physical device pixels. Calibration connects the two.'
      }
    ]
  },

  '/ruler-for-phone': {
    slug: '/ruler-for-phone',
    targetKeyword: 'ruler for phone',
    searchIntent: 'Mobile Utility: Mobile phone users who need a touch-friendly, non-zooming pocket screen ruler.',
    h1: 'Ruler for Phone — Touch-Friendly Pocket Screen Ruler',
    titleVariants: [
      'Ruler for Phone — Touch-Friendly Actual Size Mobile Ruler',
      'Free Phone Ruler Online — Accurate Pocket Screen Measure',
      'Mobile Screen Ruler — Calibrated 1:1 Ruler for iPhone & Android'
    ],
    metaVariants: [
      'Turn your iPhone or Android into an accurate pocket ruler. Touch-drag calipers, zoom-lock mode, and coin calibration for true physical cm and inches.',
      'Best free ruler for mobile phones. No app store download needed. Calibrate against a coin or credit card and measure small items on your phone screen.',
      'Mobile screen ruler designed for smartphones. 48px touch targets, zero-pinch distortion, and 100% actual size measurement on iOS and Android.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'Mobile-first pocket screen ruler with 48px touch targets, viewport zoom prevention, touch drag calipers, and device model PPI presets.',
    contentSections: [
      {
        heading: 'Preventing Accidental Mobile Pinch-to-Zoom',
        body: [
          'On smartphones, accidental pinch-zooming can distort measurement scales. RuleScale locks viewport scaling during active measurement mode and provides verified hardware presets for iPhone, Samsung Galaxy, and Google Pixel devices.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Does this mobile ruler work on both iPhone and Android?',
        answer: 'Yes! It works in Safari on iOS and Chrome on Android with zero downloads or app store installs.'
      }
    ]
  },

  '/ruler-for-laptop': {
    slug: '/ruler-for-laptop',
    targetKeyword: 'computer ruler',
    searchIntent: 'Desktop/Laptop (Ranking at #16): Laptop and desktop monitor users needing a computer ruler calibrated to their specific screen size.',
    h1: 'Computer Ruler for Laptop & Desktop — Monitor Screen Measure',
    titleVariants: [
      'Computer Ruler — Calibrated Laptop & Desktop Screen Ruler',
      'Ruler for Laptop (Actual Size) — Monitor Screen Measuring Tool',
      'Free Computer Ruler Online — 1:1 Scale for Mac, Windows & Linux'
    ],
    metaVariants: [
      'Turn your laptop or desktop monitor into a calibrated physical ruler. Presets for MacBook, Dell, HP, Lenovo, and 24"-27" external displays. Free.',
      'Ranked #16 for computer ruler: Accurate screen ruler for laptops and desktops. Calibrate with credit card or select your screen diagonal size.',
      'Measure physical items on your laptop screen. Supports inches, centimeters, and millimeters with hardware PPI calibration for Mac and PC.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'ruler',
    summary: 'Laptop and desktop computer ruler featuring automated diagonal monitor presets (13.3", 14.2", 15.6", 16.2", 24", 27") and multi-monitor PPI management.',
    contentSections: [
      {
        heading: 'Pre-Configured Display Presets for Laptops & Monitors',
        body: [
          'Select your device model from our presets menu: MacBook Air (227 PPI), MacBook Pro 14"/16" (254 PPI), 15.6" Full HD Laptops (141 PPI), or 24" 1080p Desktop Monitors (92 PPI).'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I find my laptop\'s screen size?',
        answer: 'Check your laptop manufacturer specifications or measure diagonally from the top-left screen corner to the bottom-right screen corner.'
      }
    ]
  },

  '/ruler-widget': {
    slug: '/ruler-widget',
    targetKeyword: 'ruler widget',
    searchIntent: 'Embed & Sharing (Ranking at query): Webmasters, educators, and DIY bloggers looking for an embeddable ruler widget.',
    h1: 'Embeddable Ruler Widget — Free Responsive On-Screen Ruler for Websites',
    titleVariants: [
      'Free Ruler Widget — Embed a Responsive Online Ruler on Your Site',
      'Embeddable Ruler Widget — Interactive Measuring Tool for Webmasters',
      'Ruler Widget for Websites — Responsive Iframe with Calibrated Scale'
    ],
    metaVariants: [
      'Embed a free, responsive online ruler widget on your website, blog, or educational portal. Clean iframe code with customizable units and zero ads.',
      'Add an interactive ruler widget to your DIY, craft, or e-commerce store. Free embed code with credit attribution for webmasters and teachers.',
      'Responsive ruler widget. Copy-paste one line of iframe code to give your visitors a calibrated actual size screen measuring tool.'
    ],
    defaultUnit: 'cm',
    defaultMode: 'dual',
    toolType: 'widget',
    summary: 'Copy-paste embeddable responsive HTML iframe widget for educational blogs, DIY sites, e-commerce sizing guides, and web development portals.',
    contentSections: [
      {
        heading: 'How to Embed the RuleScale Widget on Your Website',
        body: [
          'Copy the snippet below and paste it into your WordPress post, Shopify page, Wix site, or HTML codebase. The widget is lightweight (under 60KB), fully responsive, and works on both desktop and mobile.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Is the ruler widget free to embed?',
        answer: 'Yes! The widget is 100% free for educational, personal, and commercial websites, provided the footer credit link back to RuleScale remains intact.'
      }
    ]
  }
};

export const TRUST_PAGES_CONFIG = {
  '/about': {
    title: 'About RuleScale — Precision Virtual Measuring Technology',
    h1: 'About RuleScale & Murata Design',
    description: 'Learn about RuleScale\'s mission to provide the world\'s most accessible, calibrated, and privacy-first online measuring instruments.'
  },
  '/contact': {
    title: 'Contact Us — RuleScale Engineering & Support',
    h1: 'Contact the RuleScale Team',
    description: 'Get in touch with our engineering team for inquiries, bug reports, feature requests, or partnership opportunities.'
  },
  '/privacy': {
    title: 'Privacy Policy — 100% Client-Side Processing Guarantee',
    h1: 'Privacy Policy',
    description: 'Read RuleScale\'s privacy policy. All camera video, sensor data, and measurement coordinates are processed 100% locally on your device.'
  },
  '/terms': {
    title: 'Terms of Service — RuleScale Online Utility',
    h1: 'Terms of Service',
    description: 'Terms and conditions governing the use of the RuleScale online ruler and measuring utilities.'
  },
  '/disclaimer': {
    title: 'Accuracy Disclaimer & Measurement Limitations',
    h1: 'Measurement Accuracy Disclaimer',
    description: 'Important legal and technical accuracy disclaimer regarding display pixel calibration, hardware variations, and industrial tolerances.'
  }
};
