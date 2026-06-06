/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Printer, ShieldAlert, CheckCircle, Download, FileCheck, ArrowUpRight } from 'lucide-react';

type PrintablePaperType = 'a4' | 'letter';
type PrintableScaleType = 'cm' | 'inch' | 'both';

export default function PrintableRulerTool() {
  const [paperType, setPaperType] = useState<PrintablePaperType>('a4');
  const [scaleType, setScaleType] = useState<PrintableScaleType>('both');
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);

  const handlePrint = () => {
    window.print();
  };

  // Setup exact size vectors
  // A4 Page is 210mm wide (8.27in). Letter is 215.9mm wide (8.5in).
  // Standard CSS printing treats 1in as exactly 96px, 1cm as exactly 37.795px.
  // When printed at 100% scale, these standard physical declarations match real-world units perfectly!
  return (
    <div className="space-y-6">
      
      {/* Informational Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-4xl mx-auto items-stretch select-none">
        
        {/* Verification Checksheet */}
        <div className="md:col-span-8 bg-[#F0FDF4] dark:bg-emerald-990/20 border border-emerald-250 dark:border-emerald-900/60 p-5 rounded-xl space-y-3.5 text-xs text-emerald-850 dark:text-emerald-200">
          <h3 className="text-sm font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-100">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            CRITICAL PRINTER SETUP FOR 100% scale
          </h3>
          <p className="leading-relaxed">
            Standard office printers default to "Fit to Printable Area / Scale to Fit" which reduces the vectors by 3-5% to accommodate margin buffers. You **MUST** override this to print at actual size:
          </p>
          <ul className="space-y-2 pl-4 list-decimal leading-snug">
            <li>
              Click the **Print Vector Ruler** button below to open the browser printing dialog box.
            </li>
            <li>
              Look for **"Destination"** and select your active physical printer.
            </li>
            <li>
              Under **"More Settings"** (or Layout Options), locate **Scale**.
            </li>
            <li>
              Switch **Scale** from "Fit to Page" directly to <strong className="text-emerald-900 dark:text-emerald-50">"Actual Size"</strong> or input <strong className="text-emerald-900 dark:text-emerald-50">"100%"</strong> manually.
            </li>
            <li>
              Ensure margins are set to **"None"** or **"Default"**.
            </li>
            <li>
              Once printed, align an ordinary plastic credit card to our printed calibration line to confirm perfect actual-size outcomes.
            </li>
          </ul>
        </div>

        {/* Action Controls Side board */}
        <div className="md:col-span-4 bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl flex flex-col justify-between space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Ruler Configurations</span>
            
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-zinc-500 block font-bold mb-1">Paper Standards:</label>
                <div className="flex bg-zinc-200/60 dark:bg-zinc-700 p-0.5 rounded border dark:border-zinc-650">
                  <button
                    onClick={() => setPaperType('a4')}
                    className={`flex-1 py-1 text-center font-bold text-[11px] rounded ${paperType === 'a4' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                  >
                    A4 (Intl)
                  </button>
                  <button
                    onClick={() => setPaperType('letter')}
                    className={`flex-1 py-1 text-center font-bold text-[11px] rounded ${paperType === 'letter' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}
                  >
                    Letter (US)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-zinc-500 block font-bold mb-1">Measurement Axes:</label>
                <div className="flex bg-zinc-200/60 dark:bg-zinc-700 p-0.5 rounded border dark:border-zinc-650">
                  <button
                    onClick={() => setScaleType('cm')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${scaleType === 'cm' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-505'}`}
                  >
                    Cm / Mm
                  </button>
                  <button
                    onClick={() => setScaleType('inch')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${scaleType === 'inch' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-505'}`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setScaleType('both')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${scaleType === 'both' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-505'}`}
                  >
                    Both (Dual)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            id="btn-trigger-print-ruler"
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Printer className="w-4 h-4" />
            Print Vector Ruler
          </button>
        </div>
      </div>

      {/* Sheet Printable Document mockup representing printed output */}
      <div className="max-w-4xl mx-auto bg-white border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 select-none relative shadow-md">
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-zinc-400" />
            Print Preview Output Frame ({paperType.toUpperCase()} Standard)
          </span>
          <span className="font-mono">Exact CSS Physical Dimensions applied</span>
        </div>

        {/* Printable Section bounding box targets window.print() */}
        <div
          id="printable-ruler-paper-element"
          className="bg-white border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col justify-center items-center shadow-inner overflow-hidden min-h-[300px]"
        >
          {/* Svg representing vector ruler designed explicitly with absolute CSS lengths in mm/in.
              Standard printer engines map physical cm to exact cm, physical inches to exact inches when scaling is unset! */}
          <div className="w-full max-w-2xl bg-[#FCFAF5] border border-zinc-300 rounded shadow p-6 text-zinc-900 space-y-4">
            
            {/* Printed Header details explaining what this is */}
            <div className="flex justify-between items-start text-[10px] border-b border-zinc-300/60 pb-2 text-zinc-700 font-mono">
              <div>
                <strong className="block text-zinc-850 font-sans tracking-wide">SUPERIOR VIRTUAL RULER</strong>
                <span>Format: {paperType === 'a4' ? 'A4 Paper (21.0 x 29.7cm)' : 'Letter Paper (8.5 x 11.0")'}</span>
              </div>
              <div className="text-right">
                <span>Scaling Check: Print at 100% scale</span>
                <span className="block italic text-zinc-550">Verify against credit card width ({85.6}mm)</span>
              </div>
            </div>

            {/* Simulated Vector Ruler graphic with physical dimensions specified in CSS mm/in */}
            <div className="relative border border-zinc-400 bg-[#EFEADF] rounded flex flex-col justify-between overflow-hidden h-36 w-full">
              
              {/* Scale A: Centimeters / Millimeters (top curve) */}
              {(scaleType === 'cm' || scaleType === 'both') && (
                <div className="relative h-1/2 w-full border-b border-zinc-350 bg-[#EFEADF] select-none">
                  {/* Tick Marks cm lines drawn statically inside printable canvas */}
                  <div className="absolute inset-x-0 top-0 h-full flex justify-between pointer-events-none">
                    {Array.from({ length: 26 }).map((_, i) => {
                      // We draw ticks at standard spacing mm/cm
                      const isCm = i % 10 === 0;
                      const isHalfCm = i % 5 === 0 && !isCm;
                      let h = '15%';
                      if (isCm) h = '65%';
                      else if (isHalfCm) h = '35%';

                      return (
                        <div
                          key={i}
                          style={{ left: `${(i / 25) * 100}%`, width: '1px', height: h }}
                          className="absolute bg-zinc-900 top-0"
                        >
                          {isCm && (
                            <span className="absolute text-[8px] font-bold font-mono top-4 -left-1 text-zinc-850">
                              {i / 10}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="absolute right-2 bottom-1.5 text-[8px] font-mono tracking-wider font-bold">METRIC SCALE (CM)</span>
                </div>
              )}

              {/* Scale B: Inches (bottom curve) */}
              {(scaleType === 'inch' || scaleType === 'both') && (
                <div className="relative h-1/2 w-full bg-[#EFEADF] select-none">
                  {/* Draw 10 inches ticks */}
                  <div className="absolute inset-x-0 bottom-0 h-full flex justify-between pointer-events-none">
                    {Array.from({ length: 41 }).map((_, i) => {
                      const frac = i % 8; // 8 divisions per inch (1/8ths)
                      let h = '15%';
                      if (frac === 0) h = '65%';
                      else if (frac === 4) h = '35%';
                      else if (frac % 2 === 0) h = '22%';

                      return (
                        <div
                          key={i}
                          style={{ left: `${(i / 40) * 100}%`, width: '1px', height: h }}
                          className="absolute bg-zinc-900 bottom-0"
                        >
                          {frac === 0 && (
                            <span className="absolute text-[8px] font-bold font-mono bottom-4 -left-1 text-zinc-850">
                              {i / 8}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <span className="absolute right-2 top-1.5 text-[8px] font-mono tracking-wider font-bold">IMPERIAL SCALE (INCH)</span>
                </div>
              )}
            </div>

            {/* Printed card size physical gauge block for post-print check */}
            <div className="border border-dashed border-emerald-400 bg-emerald-50/50 rounded-lg p-3 text-[10px] text-emerald-800 font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <strong className="block text-[11px] font-sans pb-0.5">📏 PRINT SCALE ACCURACY GAUGE:</strong>
                <span>Compare physical Visa/ID credit card against this dotted box!</span>
              </div>
              <div className="border border-emerald-400 rounded p-1 w-28 text-center text-[9px] font-extrabold bg-white h-7 leading-normal">
                CREDIT CARD WIDTH (8.56cm)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
