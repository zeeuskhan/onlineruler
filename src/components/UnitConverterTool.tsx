/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Settings, AlignLeft, Info, HelpCircle, FileCheck } from 'lucide-react';
import { CalibrationData, UnitConversionValue } from '../types';

interface UnitConverterToolProps {
  calibration: CalibrationData;
}

export default function UnitConverterTool({ calibration }: UnitConverterToolProps) {
  // Input standard states representing the active converted lengths
  const [values, setValues] = useState<UnitConversionValue>({
    cm: '10',
    mm: '100',
    inch: '3.937',
    px: '378',
    yard: '0.109',
    foot: '0.328',
    meter: '0.10',
  });

  // Calculate standard conversion map indices based on an edited unit value
  const triggerConversion = (sourceUnit: keyof UnitConversionValue, textVal: string) => {
    const floatVal = parseFloat(textVal);
    
    // In case input is empty, clear other screens
    if (isNaN(floatVal) || textVal.trim() === '') {
      setValues({
        cm: sourceUnit === 'cm' ? textVal : '',
        mm: sourceUnit === 'mm' ? textVal : '',
        inch: sourceUnit === 'inch' ? textVal : '',
        px: sourceUnit === 'px' ? textVal : '',
        yard: sourceUnit === 'yard' ? textVal : '',
        foot: sourceUnit === 'foot' ? textVal : '',
        meter: sourceUnit === 'meter' ? textVal : '',
      });
      return;
    }

    // Solve standard factor relative to Centimeters (cm) as pivot key
    let cmValue = 0;
    const ppi = calibration.ppi;

    switch (sourceUnit) {
      case 'cm':
        cmValue = floatVal;
        break;
      case 'mm':
        cmValue = floatVal / 10;
        break;
      case 'inch':
        cmValue = floatVal * 2.54;
        break;
      case 'px':
        const inchFromPx = floatVal / ppi;
        cmValue = inchFromPx * 2.54;
        break;
      case 'yard':
        cmValue = floatVal * 91.44;
        break;
      case 'foot':
        cmValue = floatVal * 30.48;
        break;
      case 'meter':
        cmValue = floatVal * 100;
        break;
    }

    // Now convert cmValue into all other units
    const inches = cmValue / 2.54;
    
    setValues({
      cm: sourceUnit === 'cm' ? textVal : Number(cmValue.toFixed(3)).toString(),
      mm: sourceUnit === 'mm' ? textVal : Number((cmValue * 10).toFixed(2)).toString(),
      inch: sourceUnit === 'inch' ? textVal : Number(inches.toFixed(4)).toString(),
      px: sourceUnit === 'px' ? textVal : Math.round(inches * ppi).toString(),
      yard: sourceUnit === 'yard' ? textVal : Number((cmValue / 91.44).toFixed(4)).toString(),
      foot: sourceUnit === 'foot' ? textVal : Number((cmValue / 30.48).toFixed(4)).toString(),
      meter: sourceUnit === 'meter' ? textVal : Number((cmValue / 100).toFixed(4)).toString(),
    });
  };

  // Recalculate pixel sizes when PPI changes in calibration widget
  useEffect(() => {
    if (values.cm) {
      triggerConversion('cm', values.cm);
    }
  }, [calibration.ppi]);

  // Compute neat fraction for the current inches decimal
  const getInchFraction = () => {
    const inchFloat = parseFloat(values.inch);
    if (isNaN(inchFloat)) return 'N/A';
    const whole = Math.floor(inchFloat);
    const dec = inchFloat - whole;
    const sixteenths = Math.round(dec * 16);
    if (sixteenths === 0) return whole > 0 ? `${whole}"` : '0"';
    if (sixteenths === 16) return `${whole + 1}"`;

    let num = sixteenths;
    let den = 16;
    const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
    const divisor = gcd(num, den);
    num /= divisor;
    den /= divisor;

    return whole > 0 ? `${whole} ${num}/${den}"` : `${num}/${den}"`;
  };

  return (
    <div className="space-y-8">
      
      {/* Primary Calculator Form Grid */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-5 lg:p-6 select-none">
        <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Instant Unit Length Conversion Suite
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Type into any standard input field. Dimensions translate in real-time. Active conversion scale: <strong className="text-zinc-800 dark:text-zinc-350">{calibration.ppi} DPI</strong>.
            </p>
          </div>
        </div>

        {/* Inputs standard block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="conversion-inputs-grid">
          {/* Centimeters */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Centimeters (cm)</span>
            <div className="relative">
              <input
                type="text"
                value={values.cm}
                onChange={(e) => triggerConversion('cm', e.target.value)}
                id="converter-input-cm"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400">cm</span>
            </div>
          </div>

          {/* Millimeters */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Millimeters (mm)</span>
            <div className="relative">
              <input
                type="text"
                value={values.mm}
                onChange={(e) => triggerConversion('mm', e.target.value)}
                id="converter-input-mm"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400">mm</span>
            </div>
          </div>

          {/* Inches */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Inches (in)</span>
            <div className="relative">
              <input
                type="text"
                value={values.inch}
                onChange={(e) => triggerConversion('inch', e.target.value)}
                id="converter-input-inch"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400">in</span>
            </div>
            {/* Show fraction beneath in tiny text */}
            <span className="text-[10px] text-zinc-400 font-mono italic block pt-1 text-right">
              Approx. Fraction: {getInchFraction()} (1/16th tolerance)
            </span>
          </div>

          {/* Device Pixels */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Device Pixels (px)</span>
            <div className="relative">
              <input
                type="text"
                value={values.px}
                onChange={(e) => triggerConversion('px', e.target.value)}
                id="converter-input-px"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400">px</span>
            </div>
          </div>

          {/* Meters */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Meters (m)</span>
            <div className="relative">
              <input
                type="text"
                value={values.meter}
                onChange={(e) => triggerConversion('meter', e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400 font-sans">m</span>
            </div>
          </div>

          {/* Feet */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Feet (ft)</span>
            <div className="relative">
              <input
                type="text"
                value={values.foot}
                onChange={(e) => triggerConversion('foot', e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400 font-sans">ft</span>
            </div>
          </div>

          {/* Yards */}
          <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-lg border border-zinc-150/50 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Yards (yd)</span>
            <div className="relative">
              <input
                type="text"
                value={values.yard}
                onChange={(e) => triggerConversion('yard', e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 text-sm font-semibold font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-zinc-400 font-sans">yd</span>
            </div>
          </div>

          {/* Ratio conversion display summary info button */}
          <div className="space-y-1 p-3 bg-indigo-55/40 dark:bg-zinc-800/20 rounded-lg flex items-center justify-center border border-dashed border-indigo-200 dark:border-zinc-700 text-center">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-500 block">DPI Scaling Anchor</span>
              <strong className="text-sm text-zinc-700 dark:text-zinc-300 font-mono block">1" = {calibration.ppi}px</strong>
              <span className="text-[9px] text-zinc-400 bg-zinc-100 dark:bg-zinc-750 p-1 px-1.5 rounded block">
                1 cm ≈ {(calibration.ppi / 2.54).toFixed(1)} pixels
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Formula math tutorial cards */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 leading-relaxed text-xs">
        
        {/* Card 1: Metric to Imperial math */}
        <div className="bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-150 dark:border-zinc-800 rounded-xl p-5 space-y-3">
          <span className="text-zinc-400 uppercase tracking-wider font-bold text-[9px] block">Metric ↔ Imperial Formula Blueprint</span>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            How to convert Centimeters to Inches
          </h4>
          <p className="text-zinc-500">
            The international yard agreement specifies exactly <strong>1 inch as 2.54 centimeters</strong>. This simple mathematical multiplier creates the basic conversion blueprint:
          </p>
          <div className="bg-zinc-150/60 dark:bg-zinc-805 font-mono p-2.5 rounded text-zinc-700 dark:text-zinc-300">
            <div>• Inches to Cm: <strong className="text-indigo-650 dark:text-indigo-400">Inches × 2.54 = Centimeters</strong></div>
            <div className="text-[9px] text-zinc-400 pt-0.5 ml-3">E.g., 4" × 2.54 = 10.16 cm</div>
            <div className="mt-2.5">• Cm to Inches: <strong className="text-indigo-650 dark:text-indigo-400">Centimeters ÷ 2.54 = Inches</strong></div>
            <div className="text-[9px] text-zinc-400 pt-0.5 ml-3">E.g., 15 cm ÷ 2.54 = 5.905 inches</div>
          </div>
        </div>

        {/* Card 2: Pixels to Centimeters mathematical logic */}
        <div className="bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-150 dark:border-zinc-800 rounded-xl p-5 space-y-3">
          <span className="text-zinc-400 uppercase tracking-wider font-bold text-[9px] block">Digital Screen Math Blueprint</span>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-500" />
            Converting Screen Pixels (px) to Centimeters (cm)
          </h4>
          <p className="text-zinc-500">
            Because displays use dots of different densities to output symbols, we first determine the screen's real **PPI (Pixels Per Inch/DPI)**:
          </p>
          <div className="bg-zinc-155/60 dark:bg-zinc-805 font-mono p-2.5 rounded text-zinc-700 dark:text-zinc-300">
            <div>• Pixels to CM: <strong className="text-emerald-600 dark:text-emerald-400"> ( pixels ÷ PPI ) × 2.54 = cm</strong></div>
            <div className="text-[9px] text-zinc-400 pt-0.5 ml-3">Using active scale: ( {values.px}px ÷ {calibration.ppi} PPI ) × 2.54 = {values.cm}cm</div>
            <div className="mt-2.5">• CM to Pixels: <strong className="text-emerald-600 dark:text-emerald-400"> ( cm ÷ 2.54 ) × PPI = pixels</strong></div>
            <div className="text-[9px] text-zinc-400 pt-0.5 ml-3">Using active scale: ( {values.cm}cm ÷ 2.54 ) × {calibration.ppi} PPI = {values.px}px</div>
          </div>
        </div>

      </div>
    </div>
  );
}
