import React, { useState } from 'react';
import { ToolMode } from '../types';
import { Ruler, Compass, HelpCircle as HelpIcon, LayoutGrid, ArrowLeftRight, FileText, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface SEOContentProps {
  activeTab: ToolMode;
  setActiveTab: (tab: ToolMode) => void;
}

interface FAQItem {
  q: string;
  a: string;
}

interface ToolSEOData {
  h1: string;
  paragraphs: string[];
  faqs: FAQItem[];
  primaryKeyword: string;
}

const SEO_DATA: Record<ToolMode, ToolSEOData> = {
  ruler: {
    primaryKeyword: 'online ruler',
    h1: 'Online Ruler — Free Virtual Actual Size Screen Ruler',
    paragraphs: [
      'RuleScale\'s online ruler is a highly accurate, browser-based digital measuring tool that allows you to measure any small physical object on your screen. Whether you are using a desktop monitor, a laptop, a tablet, or a mobile phone, our virtual ruler ensures precise measurements in centimeters (cm), millimeters (mm), inches (in), and pixels (px).',
      'To achieve 100% actual size accuracy, the ruler calibrates dynamically to your device\'s screen size using standard physical reference objects. By placing a common pocket item, like a credit card, ID, or coin, against your screen and matching it with our interactive slider, our software calculates the exact pixels-per-inch (PPI) of your display.',
      'This computer ruler eliminates the need to carry physical tape measures or plastic rulers. It works instantly without downloads, offering an immersive full-screen edge ruler overlay, draggable alignment guides, and a cursor coordinate tracker for advanced web design or DIY projects.'
    ],
    faqs: [
      {
        q: 'How accurate is this online ruler?',
        a: 'The virtual ruler is 100% accurate once calibrated. Since different displays have different pixel densities, you must use our 10-second calibration tool with a standard card or coin to match the screen scale to real-world dimensions.'
      },
      {
        q: 'Can I measure in both centimeters and inches?',
        a: 'Yes, our ruler online supports multiple metric and imperial measurement units. You can toggle between a cm ruler online, mm ruler, inch ruler online, and screen pixels (px) with a single click.'
      },
      {
        q: 'Does the actual size ruler on screen work on mobile phones?',
        a: 'Absolutely. RuleScale is fully optimized for mobile devices, including cell phone rulers for iPhone and Android, as well as tablet and monitor displays.'
      },
      {
        q: 'Do I need to download an app to use this digital ruler?',
        a: 'No download or installation is required. This free ruler tool is a lightweight web app that runs directly in your browser on any screen size.'
      }
    ]
  },
  protractor: {
    primaryKeyword: 'protractor online',
    h1: 'Online Protractor — Interactive Screen Angle Measurement',
    paragraphs: [
      'The RuleScale online protractor is an interactive, browser-based virtual tool designed to measure angles directly on your screen with extreme precision. Perfect for students, architects, designers, and engineers, this tool provides full 360-degree rotation and flexible controls to inspect angles on physical objects placed against your display or digital mockups behind the tool.',
      'Using our protractor online is simple and intuitive. You can drag the center point to align with the vertex of any angle, adjust the baseline to match the first ray, and rotate the secondary arm to read the exact angle in degrees. It supports full opacity controls so you can overlay it on top of web designs, images, or documents.',
      'Because it is built entirely using lightweight SVG vectors, the protractor scales flawlessly on any device—including desktop monitors, laptops, and mobile phone screens—without pixelation or loss of accuracy.'
    ],
    faqs: [
      {
        q: 'How do I use the online protractor to measure an angle?',
        a: 'Place the center crosshair of the protractor at the vertex of the angle. Align the baseline arm (0°) with one of the angle rays, then drag the rotating arm to align with the other ray. The exact degree of the angle will be calculated automatically.'
      },
      {
        q: 'Is the virtual protractor free to use?',
        a: 'Yes, RuleScale\'s online protractor is completely free and works instantly on all browser-equipped devices without registration or subscription.'
      },
      {
        q: 'Can I rotate the entire protractor?',
        a: 'Yes, the protractor tool features a 360-degree rotation wheel allowing you to align it with any tilted drawing, image, or blueprint on your screen.'
      }
    ]
  },
  'ring-size': {
    primaryKeyword: 'ring sizer chart',
    h1: 'Online Ring Sizer Chart — Virtual Ring Size Measurement',
    paragraphs: [
      'Finding your perfect ring size has never been easier. Our virtual ring sizer chart allows you to measure an existing ring or determine your finger size directly from your browser. It provides interactive, scale-calibrated circles corresponding to standard US, UK, Japanese, and European size charts.',
      'To get accurate results, ensure that your screen is calibrated first using our Calibration widget. Once calibrated, simply place a physical ring that fits you comfortably directly onto the screen. Use the interactive slider to adjust the diameter of the virtual circle until it matches the inside edge of your physical ring perfectly.',
      'This digital ring sizer is completely free and secure. It eliminates the guesswork when shopping for engagement rings, wedding bands, or fashion jewelry online, helping you avoid costly resizing and shipping returns.'
    ],
    faqs: [
      {
        q: 'How do I find my ring size online?',
        a: 'Calibrate your screen, then place a ring that fits you on the screen. Adjust our on-screen circle using the slider until it perfectly matches the inner diameter of your ring. The sizer will display your US, UK, and EU ring sizes instantly.'
      },
      {
        q: 'Is this virtual ring sizer accurate?',
        a: 'Yes, it is highly accurate provided your screen has been calibrated first. Because screen dimensions vary across devices, calibration with a physical card is critical to render the circle sizes to exact physical scale.'
      },
      {
        q: 'What sizing standards do you support?',
        a: 'Our ring sizer chart supports US/Canada, UK/Australia/Ireland (alphabetic scale), and European/Japanese millimeter circumference and diameter standards.'
      }
    ]
  },
  grid: {
    primaryKeyword: 'grid overlay tool',
    h1: 'Grid Overlay Tool — Interactive Web Alignment Grid',
    paragraphs: [
      'The RuleScale grid overlay tool is an advanced on-screen alignment utility tailored for frontend developers, UI/UX designers, and digital artists. It draws highly customizable overlays with column rules, pixel coordinates, and row baselines directly over your active workspace.',
      'With this designer screen grid, you can adjust grid spacing, column counts, gutter sizes, and border colors in real-time. Whether you are checking the alignment of a website, testing a layout for responsive breakpoints, or measuring spacing between digital elements, our tool makes layout auditing seamless.',
      'The grid tool supports opacity toggles so it can act as a subtle guide while you develop, or as a high-contrast pixel ruler to verify grid columns against responsive CSS designs.'
    ],
    faqs: [
      {
        q: 'What is a grid overlay tool?',
        a: 'It is a digital utility that renders customizable columns, gutters, and modular grid lines over your browser viewport to help you audit and align website layouts, graphics, and text blocks.'
      },
      {
        q: 'Can I customize the column count and gutter width?',
        a: 'Yes, our interactive grid tool allows you to dynamically configure columns, row heights, grid spacing in pixels or inches, gutters, and line colors to match any layout framework.'
      },
      {
        q: 'Does this screen grid support fluid responsive design?',
        a: 'Yes, you can set fluid percentage-based columns or lock specific pixel layouts to test how elements align across desktop, laptop, and tablet displays.'
      }
    ]
  },
  'unit-converter': {
    primaryKeyword: 'unit converter online',
    h1: 'Online Unit Converter — Easy Measurement Conversions',
    paragraphs: [
      'The RuleScale unit converter online is a fast, streamlined conversion calculator designed specifically for imperial and metric length dimensions. Easily convert between inches, centimeters (cm), millimeters (mm), pixels (px), meters (m), feet (ft), and yards (yd) with real-time computational feedback.',
      'Unlike generic search engine calculators, our conversion utility visualizes the converted length directly on an interactive actual-size ruler! This helps you immediately grasp the physical scale of the values you are converting, bridging the gap between numbers and real-world proportions.',
      'This digital converter is an indispensable asset for international shopping, DIY crafting, blueprint reading, and web development, giving you precision conversions down to several decimal points.'
    ],
    faqs: [
      {
        q: 'How do I convert centimeters (cm) to inches?',
        a: 'Enter the centimeter value into the conversion input, and the tool will instantly calculate the equivalent in inches (1 cm = 0.3937 inches) while displaying the exact length on our calibrated virtual ruler.'
      },
      {
        q: 'What units are supported by this measurement converter?',
        a: 'You can convert between Millimeters (mm), Centimeters (cm), Meters (m), Inches (in), Feet (ft), Yards (yd), and Screen Pixels (px).'
      },
      {
        q: 'Is the pixel conversion accurate?',
        a: 'Yes! It dynamically converts pixels based on your screen\'s active calibration (DPI/PPI), giving you the actual physical size of screen elements.'
      }
    ]
  },
  printable: {
    primaryKeyword: 'printable ruler pdf',
    h1: 'Printable Ruler PDF — Free Scale-Accurate Paper Ruler',
    paragraphs: [
      'When a virtual screen ruler isn\'t enough, RuleScale provides free, 100% scale-accurate printable ruler PDF templates. These digital files are designed for standard paper dimensions, including US Letter and European A4 sheets, ensuring you have a reliable measuring tape in seconds.',
      'Our actual size printable rulers feature high-contrast dual-axis scales with centimeters and millimeters on one edge, and inches (with fractional markers down to 1/16") on the other. Download the vector PDF and print it on any home or office printer with zero scaling.',
      'To ensure perfect accuracy when printing, always set your printer\'s scaling settings to "100%" or "Actual Size" rather than "Fit to Page" or "Shrink to Fit". A physical credit card reference block is printed on the page so you can easily verify its scale accuracy.'
    ],
    faqs: [
      {
        q: 'How do I print the ruler to actual size?',
        a: 'Download the PDF from our page, open it, and select Print. In your printer options, ensure that "Page Scaling" is set to "None" or "Actual Size" (do not use "Fit to Page").'
      },
      {
        q: 'What paper formats are supported?',
        a: 'We provide pre-configured templates for US Letter (8.5 x 11 inches) and international A4 paper (210 x 297 mm) with both centimeter and inch markings.'
      },
      {
        q: 'Is the printable paper ruler free to download?',
        a: 'Yes, our vector ruler templates are 100% free to download and print for personal, commercial, or educational classroom use.'
      }
    ]
  },
  guides: {
    primaryKeyword: 'measure without ruler',
    h1: 'Screen Ruler Calibration Guide & Creative Measuring Tricks',
    paragraphs: [
      'Welcome to RuleScale\'s ultimate knowledge center for virtual measurements. Here we provide comprehensive guides on screen ruler calibration, explaining the science of screen DPI, pixel density, and device-specific aspect ratios that affect digital scales.',
      'Learn how to measure any object without a ruler using 10 common pocket items whose dimensions are standardized worldwide—such as credit cards (85.6mm), banknotes, quarters, standard paper sheets, and smartphone dimensions.',
      'Our step-by-step tutorials make it easy for students, woodworkers, online shoppers, and DIY hobbyists to confidently take measurements on any screen or in any environment without specialized equipment.'
    ],
    faqs: [
      {
        q: 'Why do screen rulers require calibration?',
        a: 'Screen displays come in different physical sizes but may share the same pixel resolutions (e.g., full HD). Therefore, a pixel-to-physical ratio (PPI) varies. Calibration translates virtual pixels into physical centimeters or inches.'
      },
      {
        q: 'How can I measure something if I don\'t have a ruler?',
        a: 'You can use our calibrated actual-size screen ruler, or use standard physical benchmarks. For example, a credit card is exactly 3.37 inches wide, and standard US letters or A4 pages have fixed lengths.'
      },
      {
        q: 'What is the physical width of a standard credit card?',
        a: 'A standard CR80 credit card or driving license is exactly 3.375 inches (85.6 mm) wide and 2.125 inches (53.98 mm) high. This is the optimal reference for calibration.'
      }
    ]
  }
};

export default function SEOContent({ activeTab, setActiveTab }: SEOContentProps) {
  const data = SEO_DATA[activeTab] || SEO_DATA.ruler;
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const handleTabClick = (tabId: ToolMode, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-12 pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-12 text-zinc-800 dark:text-zinc-200 max-w-4xl mx-auto">
      
      {/* 1. ON-PAGE SEO CONTENT HEADERS & TEXT */}
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          {data.h1}
        </h1>
        
        <div className="space-y-4 text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
          {data.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC INTERACTION FAQ ACCORDION */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <HelpIcon className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
          Frequently Asked Questions (FAQ)
        </h3>
        
        <div className="space-y-3.5" id="faq-accordion-group">
          {data.faqs.map((faq, idx) => {
            const isOpen = openFAQIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-4 md:p-5 flex justify-between items-center font-bold text-sm md:text-base text-zinc-905 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 md:p-5 pt-0 border-t border-zinc-100 dark:border-zinc-850 text-xs md:text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/30 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. INTERNAL LINKING HUB GRID BETWEEN ALL 7 TOOLS */}
      <div className="space-y-5 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-850">
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Explore Our Suite of Professional Virtual Measuring Instruments:
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {[
            { id: 'ruler', label: 'Screen Ruler', path: '/', icon: <Ruler className="w-4 h-4" /> },
            { id: 'protractor', label: 'Angle Protractor', path: '/protractor', icon: <Compass className="w-4 h-4" /> },
            { id: 'ring-size', label: 'Ring Sizer Chart', path: '/ring-size', icon: <HelpIcon className="w-4 h-4" /> },
            { id: 'grid', label: 'Creative Web Grid', path: '/grid', icon: <LayoutGrid className="w-4 h-4" /> },
            { id: 'unit-converter', label: 'Instant Converter', path: '/unit-converter', icon: <ArrowLeftRight className="w-4 h-4" /> },
            { id: 'printable', label: 'Scale printable', path: '/printable', icon: <FileText className="w-4 h-4" /> },
            { id: 'guides', label: 'Guidelines & FAQs', path: '/guides', icon: <GraduationCap className="w-4 h-4" /> },
          ].map((item) => {
            const isSelf = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleTabClick(item.id as ToolMode, e)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold leading-none transition-all ${
                  isSelf
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border-indigo-200 dark:border-indigo-850 pointer-events-none'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}
