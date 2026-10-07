/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ruler, CheckCircle, ChevronDown, ChevronUp, Sparkles, Sliders, ShieldCheck, HelpCircle, Layers, ArrowRight, Laptop, Smartphone, Monitor } from 'lucide-react';

interface SeoContentSectionProps {
  onOpenCalibration: () => void;
  onOpenRealRuler?: () => void;
}

export default function SeoContentSection({ onOpenCalibration, onOpenRealRuler }: SeoContentSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does an online ruler measure actual size on my screen?',
      a: 'A standard computer monitor or smartphone display consists of pixels per inch (PPI). Because screen resolutions and physical sizes vary across devices, an uncalibrated digital scale might show 1 inch smaller or larger than reality. RuleScale solves this by letting you calibrate with a standard bank card (85.60 mm) or coin. Once calibrated, our virtual ruler produces 100% true-to-scale physical millimeter, centimeter, and inch measurements on your glass display.'
    },
    {
      q: 'What is a screen measure tool and how do I use it?',
      a: 'A screen measure tool is an interactive digital measuring instrument designed to measure physical items placed directly on your display or measure digital graphics in pixels. You simply place an object (like a key, screw, credit card, or jewelry) gently against your screen and slide the interactive calipers (Marker A and Marker B) to capture the exact length, width, or thickness.'
    },
    {
      q: 'What makes this an accurate ruler compared to standard web rulers?',
      a: 'Most web rulers assume a fixed 96 DPI, which is often inaccurate on modern high-density screens like MacBook Retina displays (227-254 PPI) or 4K monitors. Our accurate ruler includes dynamic PPI calibration, pre-configured hardware profiles (MacBook, iPad, iPhone, Dell, Samsung), and millimeter subdivision zooming to guarantee 1:1 physical accuracy.'
    },
    {
      q: 'Can I use this internet ruler without downloading or installing any software?',
      a: 'Yes! RuleScale is a zero-install internet ruler and web-based measurer online. It runs instantly inside any modern web browser on Windows, macOS, Linux, iOS, and Android. It requires no app store downloads, extensions, or account sign-ups, providing instant access whenever you need a ruler online.'
    },
    {
      q: 'Can I measure in both metric (cm/mm) and imperial (inches)?',
      a: 'Absolutely. The virtual ruler offers a Dual Mode displaying metric centimeters and millimeters on the top scale alongside imperial fractions (1/16th inch resolution) on the bottom scale. You can also switch directly to dedicated Centimeter, Inch, or Pixel modes with a single click.'
    },
    {
      q: 'Is it safe to place physical items on my smartphone or laptop screen?',
      a: 'Yes, modern glass screens on smartphones, tablets, and laptops are protected by hardened scratch-resistant glass (such as Gorilla Glass). Simply place small items gently on the flat surface without pressing down hard, or hold the item parallel to the screen markings.'
    }
  ];

  return (
    <article className="max-w-4xl mx-auto space-y-10 text-zinc-700 dark:text-zinc-300 select-normal mt-6">
      
      {/* SECTION 1: Rich Header & Core Value Proposition */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold w-fit">
            <Ruler className="w-3.5 h-3.5" />
            <span>Accurate Ruler &amp; Screen Measure Guide</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Accurate Screen Ruler &amp; Measurer Online (100% Actual Size)
          </h2>

          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Welcome to <strong>RuleScale</strong>, the web&apos;s most reliable <strong>online ruler</strong> and <strong>screen measure</strong> tool. When you need to measure a physical object but don&apos;t have a tape measure handy, our <strong>virtual ruler</strong> transforms your laptop, desktop monitor, tablet, or smartphone screen into a calibrated, pinpoint-precise physical measuring scale.
          </p>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Whether you&apos;re measuring hardware screws, rings, debit cards, packages, or digital artwork, our <strong>ruler online</strong> supports <strong>metric (centimeters &amp; millimeters)</strong>, <strong>imperial (inches with 1/16th fractional increments)</strong>, and <strong>screen pixels</strong>. Experience an <strong>internet ruler</strong> built from the ground up for extreme physical accuracy.
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

      {/* SECTION 6: Frequently Asked Questions (FAQ) Accordion */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold w-fit mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SEO Questions &amp; Answers</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Frequently Asked Questions About Our Online Ruler &amp; Screen Measure
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Everything you need to know about measuring accurately on screens:
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
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

      {/* SECTION 7: Call to Action Bar */}
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
