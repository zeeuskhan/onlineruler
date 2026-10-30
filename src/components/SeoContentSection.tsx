/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Ruler, CheckCircle, ChevronDown, ChevronUp, Sparkles, Sliders, 
  ShieldCheck, HelpCircle, Layers, ArrowRight, Laptop, Smartphone, 
  Monitor, Calendar, UserCheck, AlertCircle 
} from 'lucide-react';
import { PageSeoConfig, E_E_A_T_AUTHOR, getFullPageFaqs } from '../seoData';
import { CalibrationData } from '../types';
import AdBanner from './AdBanner';

interface SeoContentSectionProps {
  onOpenCalibration: () => void;
  onOpenRealRuler?: () => void;
  config?: PageSeoConfig;
  calibration?: CalibrationData;
}

export default function SeoContentSection({ onOpenCalibration, onOpenRealRuler, config, calibration }: SeoContentSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  const sizeBarsRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState<number>(650);

  useEffect(() => {
    const handleResize = () => {
      if (sizeBarsRef.current) {
        setAvailableWidth(sizeBarsRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPpi = calibration?.ppi || 96;
  const pxPerMm = currentPpi / 25.4;

  const mmList = [1, 4, 5, 7, 10];
  const cmList = [1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 14, 15, 20, 25, 30];
  const inchList = [1, 1.5, 2, 5, 9, 12];

  const renderSizeBar = (label: string, widthPx: number) => {
    const isOverflowing = widthPx > availableWidth - 24;
    return (
      <div key={label} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-150 dark:border-zinc-700/60 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">{label}</span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {Math.round(widthPx)} px {calibration?.calibrated ? '(calibrated)' : '(estimated)'}
          </span>
        </div>
        {isOverflowing ? (
          <p className="text-xs text-amber-650 dark:text-amber-400 italic py-1">
            Too wide for this screen. Try landscape mode or a larger display.
          </p>
        ) : (
          <div
            style={{ width: `${Math.max(2, Math.round(widthPx))}px` }}
            className="h-4 bg-indigo-600 dark:bg-indigo-500 rounded-xs relative shrink-0 transition-all duration-200"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-950 dark:bg-white" />
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-indigo-950 dark:bg-white" />
          </div>
        )}
      </div>
    );
  };

  const fullFaqs = getFullPageFaqs(config);
  const activeFaqs = fullFaqs.map(f => ({ q: f.question, a: f.answer }));

  return (
    <article className="max-w-4xl mx-auto space-y-10 text-zinc-700 dark:text-zinc-300 select-normal mt-6">
      
      {/* SECTION 1: Rich Header & Core Value Proposition */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold w-fit">
            <Ruler className="w-3.5 h-3.5" />
            <span>Target Intent: {config ? config.targetKeyword.toUpperCase() : 'ONLINE RULER & SCREEN MEASURE'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            {config ? config.h1 : 'Accurate Screen Ruler & Measurer Online (100% Actual Size)'}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {config?.summary || (
              <>
                Welcome to <strong>RuleScale</strong>, the web&apos;s most reliable <strong>online ruler</strong> and <strong>real online ruler</strong> measuring tool. When you need to measure a physical object but don&apos;t have a tape measure handy, our <strong>virtual ruler</strong> transforms your laptop, desktop monitor, tablet, or smartphone screen into a calibrated, pinpoint-precise physical measuring scale.
              </>
            )}
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use it as a real online ruler, on-screen ruler, or digital ruler on your computer, monitor, laptop, phone, or tablet in centimeters, millimeters, and inches at 100% actual real size once calibrated.
          </p>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-150 dark:border-zinc-700/60">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs block mb-1">
                ✓ 100% Accurate Ruler
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                Card &amp; coin calibration ensures true 1:1 physical millimeter scale.
              </p>
            </div>
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-150 dark:border-zinc-700/60">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs block mb-1">
                ✓ Precision Screen Measure
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                Drag caliper sliders A &amp; B to compute distances instantly.
              </p>
            </div>
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-150 dark:border-zinc-700/60">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs block mb-1">
                ✓ Dual Virtual Ruler
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                Simultaneous cm, mm, and 1/16-inch imperial scales in real time.
              </p>
            </div>
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-150 dark:border-zinc-700/60">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs block mb-1">
                ✓ Zero Install Internet Ruler
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                Instant browser access on mobile, tablet, and desktop screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections from Page Config (600-1000 words E-E-A-T depth) */}
      {config?.contentSections && config.contentSections.length > 0 && (
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {config.contentSections.map((sec, idx) => (
            <div key={idx} className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-5 last:border-b-0 last:pb-0">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {sec.heading}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {sec.body.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* SECTION 2: How to Use the Measurer Online (Step-by-Step) */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            How to Use this Online Ruler &amp; Screen Measure Tool
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Follow these 4 quick steps to measure any object with full confidence and true-to-life scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Calibrate to Actual Size
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Click <strong>Calibrate</strong> in the top bar. Align your standard debit card (85.6 mm width) or coin against the reference box, or select your device preset. This locks the exact DPI of your display.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Select Your Desired Units
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Choose between <strong>Dual (cm + in)</strong>, dedicated <strong>Centimeters / Millimeters</strong>, <strong>Inches</strong>, or <strong>Pixels</strong>. You can also toggle horizontal or vertical orientation.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Place Item &amp; Position Calipers
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Rest your item gently on the glass. Drag the interactive <strong>Caliper A</strong> and <strong>Caliper B</strong> sliders to encircle the starting and ending edges of the item.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Read or Copy Your Measurement
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                The caliper bridge shows the exact distance in both metric and fractional inches. Tap <strong>Copy Distance</strong> to paste the measurement into your notes or documents.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={onOpenCalibration}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Start Screen Calibration Now →
          </button>
          {onOpenRealRuler && (
            <button
              onClick={onOpenRealRuler}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Launch Viewport Ruler Overlay
            </button>
          )}
        </div>
      </section>

      {/* SEO-SAFE IN-CONTENT AD SLOT (Fixed Height 90px to prevent CLS) */}
      <section className="bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl p-2 border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
        <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-mono mb-1">Sponsored Advertisement</span>
        <AdBanner adKey="6b6777c4248ba9b31f1a7f8087ca4b49" format="iframe" height={90} width={728} />
      </section>

      {/* STEP 2: Ruler Overlay Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold w-fit mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Screen Edge Overlay</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Ruler Overlay: Keep a Screen Ruler in View
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          When you want to compare real objects or on-screen dimensions against the edges of your display, launch our full-screen ruler overlay. Clicking the overlay button activates full-bleed edge rulers along the perimeter of your viewport. This functions as a floating screen ruler overlay and lightweight ruler widget, allowing you to gauge physical cards, envelopes, packaging, or digital layouts on your monitor, laptop, or phone without leaving the browser tab.
        </p>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The overlay uses the exact same calibrated scale as the main ruler. Any calibration you perform with a bank card or coin is instantly preserved, ensuring that perimeter edge tick marks remain completely true to physical scale in millimeters, centimeters, and fractional inches.
        </p>

        {onOpenRealRuler && (
          <div className="pt-1">
            <button
              onClick={onOpenRealRuler}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Launch Viewport Ruler Overlay</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 3: Why Choose an Internet Ruler & Screen Ruler */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Why Use RuleScale Virtual Ruler Over a Physical Ruler?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            A physical wooden or plastic ruler can get lost, broken, or warped. An <strong>internet ruler</strong> is always with you in your pocket or workstation.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Feature</th>
                <th className="py-3 px-3 text-indigo-600 dark:text-indigo-400">RuleScale Virtual Ruler</th>
                <th className="py-3 px-3 text-zinc-500">Traditional Physical Ruler</th>
                <th className="py-3 px-3 text-zinc-500">Uncalibrated Web Rulers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-300">
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Actual Size Accuracy</td>
                <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">100% Calibrated (DPI sync)</td>
                <td className="py-3 px-3">High (if not warped)</td>
                <td className="py-3 px-3 text-rose-500">Unreliable (assumes 96 DPI)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Dual Metric &amp; Imperial</td>
                <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">Simultaneous cm + in 16ths</td>
                <td className="py-3 px-3">Separate markings</td>
                <td className="py-3 px-3">Often single unit only</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Interactive Calipers</td>
                <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">Sliders A &amp; B with delta copy</td>
                <td className="py-3 px-3">Manual eye estimation</td>
                <td className="py-3 px-3">None (static image)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Always Available</td>
                <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">Any browser, zero install</td>
                <td className="py-3 px-3 text-amber-500">Must carry physically</td>
                <td className="py-3 px-3">Browser only</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">Extra Measuring Tools</td>
                <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">Protractor, Ring Sizer, Grid</td>
                <td className="py-3 px-3">Ruler only</td>
                <td className="py-3 px-3">Rarely included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: Everyday Screen Measure Use Cases */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Popular Uses for RuleScale Measurer Online
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Thousands of students, craftsmen, web designers, and homeowners use our <strong>screen ruler</strong> daily:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 block text-sm">
              🔩 Hardware &amp; Screw Sizing
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Match thread length and bolt diameter in millimeters or fractional inches before heading to the hardware store.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 block text-sm">
              💍 Jewelry &amp; Ring Sizing
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Place a ring on your display or measure finger circumference using our dedicated Ring Sizer tool to find US, UK, and EU ring sizes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 block text-sm">
              💳 Card &amp; ID Verification
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Check whether badges, loyalty cards, or photo prints conform to ISO/IEC 7810 standard wallet dimensions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 block text-sm">
              🎨 Web &amp; UI Design Alignment
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Measure interface margins, button padding, and typography elements in real-time pixels with our creative web grid overlay.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 block text-sm">
              📦 Parcel &amp; Mail Dimensions
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Measure envelopes, postcards, stamp dimensions, and small packaging items for shipping rate calculations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100 block text-sm">
              📐 Homework &amp; Geometry
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Measure angles with the 360-degree protractor, study fractional inch fractions, and convert metric units instantly.
            </p>
          </div>
        </div>
      </section>

      {/* STEP 3: Actual Size Reference Bars Section */}
      <section ref={sizeBarsRef} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            How Big Is 1 cm, 5 cm or 10 cm on My Screen?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            Different phones, tablets, and monitors have unique pixel densities, meaning an uncalibrated screen cannot show true life size. Once you calibrate RuleScale to your display&apos;s actual PPI, the visual bars below represent exact 1:1 physical measurements on your glass. Hold a coin, key, or credit card directly against the bars to verify physical size.
          </p>
        </div>

        {/* Group 1: Millimeters */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Millimeters on Screen (Actual Size)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mmList.map(mm => renderSizeBar(`${mm} mm on screen`, mm * pxPerMm))}
          </div>
        </div>

        {/* Group 2: Centimeters */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Centimeters on Screen (Actual Size)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cmList.map(cm => renderSizeBar(`${cm} cm on screen`, (cm * 10) * pxPerMm))}
          </div>
        </div>

        {/* Group 3: Inches */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Inches on Screen (Actual Size)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inchList.map(inch => renderSizeBar(`${inch} ${inch === 1 ? 'inch' : 'inches'} on screen`, inch * currentPpi))}
          </div>
        </div>
      </section>

      {/* STEP 4: Devices Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Online Ruler for Phone, Tablet, Laptop and Desktop
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            RuleScale adapts dynamically to any hardware profile. Whether you are using a mobile browser on the go or working at a multi-monitor desktop station, here is how each device configuration excels:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Smartphone className="w-4 h-4" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Phone &amp; Mobile Ruler (iPhone &amp; Android)
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Your smartphone is always with you. Open RuleScale on your mobile browser (Safari, Chrome, or Firefox) to turn your phone screen into a pocket measuring scale. Rest small items gently against the glass and drag caliper handles with your thumb. Rotate your phone to landscape mode when measuring objects up to 15 cm in length.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Laptop className="w-4 h-4" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Tablet &amp; iPad Ruler
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              An iPad or Android tablet offers an expansive, flat glass surface perfect for larger physical objects. Use it as a digital measuring surface for craft projects, leatherwork, jewelry sizing, and homework geometry without needing a traditional wooden ruler.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Laptop className="w-4 h-4" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Laptop &amp; MacBook Ruler
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              MacBook Retina displays and modern Windows laptops feature high pixel densities (often 128 to 227+ PPI). Calibrating your laptop screen with an ID card compensates for operating system scaling, ensuring exact 1:1 true-to-life centimeter and inch markings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Monitor className="w-4 h-4" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Desktop Monitor &amp; PC Ruler (1920x1080 and 4K Displays)
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Standard 24-inch or 27-inch 1080p and 4K monitors provide ample horizontal space to span a full 12-inch or 30-cm scale. Use the precision calipers or toggle to Pixel mode when inspecting web UI elements, icons, and graphic layouts.
            </p>
          </div>
        </div>
      </section>

      {/* STEP 5: Virtual Measuring Tape Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Virtual Measuring Tape and Screen Measurement Tool
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          RuleScale functions as a browser-based virtual measuring tape and interactive screen measurement tool. Instead of guessing lengths against a static image, you have access to two interactive caliper sliders: Caliper A and Caliper B. Slide Marker A to the initial edge of your object and Marker B to the opposite edge. The tool calculates the delta distance between markers with sub-millimeter precision.
        </p>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Both metric (millimeters and centimeters) and imperial (inches and fractional 16ths) readouts are updated continuously in real time. When you are finished, tap the copy button to transfer the exact measurement straight to your clipboard, streamlining workflows for online shopping, 3D printing prep, envelope sizing, and crafting.
        </p>
      </section>

      {/* STEP 6: Units Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Online Ruler in cm, mm and Inches
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            Switch effortlessly between international metric units and US customary imperial units to suit any project requirements:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Centimeter Ruler Online (cm)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every major centimeter mark is clearly labeled with 0.5 cm mid-ticks for rapid visual reading. Ideal for school assignments, stationery sizing, and everyday metric checks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Millimeter Ruler Online (mm)
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Features continuous 1 mm subdivisions for engineering-grade precision. Perfect for measuring small screws, drill bits, watch bands, and coin diameters directly against your screen.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Online Ruler in Inches
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Provides traditional 1/16-inch fractional tick marks alongside decimal equivalents. Quickly identify 1/8&quot;, 1/4&quot;, 3/8&quot;, 1/2&quot;, 5/8&quot;, 3/4&quot;, and 7/8&quot; without doing mental arithmetic.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Vertical and Horizontal Screen Ruler Orientations
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Toggle orientation with a single click. Use horizontal mode for long items across your desk, or switch to vertical mode to align tall objects comfortably along the side of your monitor or tablet.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Measurement Conversion Reference Table */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Measurement Quick Reference &amp; Conversion Cheat Sheet
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Standard imperial and metric conversion equivalents used by our accurate ruler:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-150 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">1 Inch</span>
            <strong className="text-sm text-zinc-900 dark:text-zinc-100 block mt-0.5">2.54 cm</strong>
            <span className="text-[10px] text-zinc-500 font-mono">25.4 mm</span>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-150 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">1 Centimeter</span>
            <strong className="text-sm text-zinc-900 dark:text-zinc-100 block mt-0.5">10 mm</strong>
            <span className="text-[10px] text-zinc-500 font-mono">≈ 0.3937 inches</span>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-150 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">1 Millimeter</span>
            <strong className="text-sm text-zinc-900 dark:text-zinc-100 block mt-0.5">0.1 cm</strong>
            <span className="text-[10px] text-zinc-500 font-mono">≈ 0.0394 inches</span>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-150 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">1 Foot (12 in)</span>
            <strong className="text-sm text-zinc-900 dark:text-zinc-100 block mt-0.5">30.48 cm</strong>
            <span className="text-[10px] text-zinc-500 font-mono">304.8 mm</span>
          </div>
        </div>

        {/* Fractional inch cheat row */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-xs">
          <strong className="text-indigo-900 dark:text-indigo-300 block mb-2 font-bold">
            Fractional Inch (16ths) to Millimeters Guide:
          </strong>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-650 dark:text-zinc-350">
            <div>1/16&quot; = 1.5875 mm</div>
            <div>1/8&quot; (2/16) = 3.175 mm</div>
            <div>1/4&quot; (4/16) = 6.35 mm</div>
            <div>3/8&quot; (6/16) = 9.525 mm</div>
            <div>1/2&quot; (8/16) = 12.7 mm</div>
            <div>5/8&quot; (10/16) = 15.875 mm</div>
            <div>3/4&quot; (12/16) = 19.05 mm</div>
            <div>7/8&quot; (14/16) = 22.225 mm</div>
          </div>
        </div>
      </section>

      {/* SECTION 6: E-E-A-T Author & Publisher Trust Box */}
      <section className="bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-200 dark:border-zinc-750 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              MD
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Researched &amp; Verified by {E_E_A_T_AUTHOR.name}
              </h4>
              <span className="text-xs text-zinc-400">
                {E_E_A_T_AUTHOR.role} • {E_E_A_T_AUTHOR.organization}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {E_E_A_T_AUTHOR.updatedDate}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {E_E_A_T_AUTHOR.experience}
        </p>

        <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>{E_E_A_T_AUTHOR.accuracyDisclaimer}</span>
        </div>
      </section>

      {/* SECTION 7: Frequently Asked Questions (FAQ) Accordion */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold w-fit mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>People Also Ask &amp; SEO FAQs</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Frequently Asked Questions About {config ? config.targetKeyword : 'Online Ruler'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Verified answers for users measuring on laptops, monitors, tablets, and phones:
          </p>
        </div>

        <div className="space-y-3">
          {activeFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* STEP 8: Multilingual Discovery Line */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center leading-relaxed select-none">
        Available worldwide: online ruler / <span lang="fr">règle en ligne, règle graduée en ligne, règle sur écran</span> / <span lang="ru">линейка онлайн (см)</span> / <span lang="sv">linjal online, linjal på skärmen</span> / <span lang="nl">meetlat op scherm</span> / <span lang="tr">sanal cetvel</span>
      </p>

      {/* SECTION 8: Call to Action Bar */}
      <section className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg">
        <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
          Ready to Measure with Actual Size Precision?
        </h3>
        <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
          Calibrate your screen in under 10 seconds and unlock the most accurate <strong>virtual ruler</strong>, <strong>screen measure</strong>, and <strong>online ruler</strong> on the web today.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              onOpenCalibration();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-white text-indigo-900 hover:bg-zinc-100 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Calibrate Screen Now ⚡
          </button>
        </div>
      </section>

    </article>
  );
}
