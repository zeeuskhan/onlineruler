/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Circle, Info, HelpCircle, FileText, Check, Globe, HelpCircle as HelpIcon, Sliders } from 'lucide-react';
import { CalibrationData, RingSizeData } from '../types';
import { RING_SIZES } from '../data';

interface RingSizerToolProps {
  calibration: CalibrationData;
  onOpenCalibration: () => void;
}

export default function RingSizerTool({ calibration, onOpenCalibration }: RingSizerToolProps) {
  const [activeTab, setActiveTab] = useState<'calibrator' | 'grid'>('calibrator');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(8); // US Size 7 (index 8) is a perfect default standard
  const [customDiameterMm, setCustomDiameterMm] = useState<number>(17.3); // US 7 base

  const currentRingData = RING_SIZES[selectedSizeIndex];

  // Map arbitrary custom slider diameter to the closest standard US ring size
  const handleCustomDiameterChange = (diam: number) => {
    setCustomDiameterMm(diam);
    // Find closest ring size
    let closestIndex = 0;
    let minDiff = 999;
    
    RING_SIZES.forEach((size, idx) => {
      const diff = Math.abs(size.diameterMm - diam);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    
    setSelectedSizeIndex(closestIndex);
  };

  // Tap a circle in the Grid Array to focus it in sizer
  const handleSelectGridSize = (idx: number) => {
    setSelectedSizeIndex(idx);
    setCustomDiameterMm(RING_SIZES[idx].diameterMm);
    setActiveTab('calibrator');
  };

  // Convert millimeter dimension to CSS pixels based on calibrated screen PPI scale
  const mmToPx = (mm: number) => {
    const inch = mm / 25.4;
    return inch * calibration.ppi;
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Calibration Reminder */}
      {!calibration.calibrated && (
        <div className="max-w-4xl mx-auto p-3.5 bg-amber-50 dark:bg-amber-955/20 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-center justify-between gap-3 text-xs leading-relaxed select-none">
          <div className="flex gap-2 items-center text-amber-900 dark:text-amber-200">
            <Info className="w-4.5 h-4.5 text-amber-600 shrink-0" />
            <span>
              <strong>Scaling Notice:</strong> To ensure concentric sizing circles render at exact, physical millimeter diameters, please calibrate your screen density.
            </span>
          </div>
          <button
            onClick={onOpenCalibration}
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline shrink-0"
          >
            Calibrate Screen Now →
          </button>
        </div>
      )}

      {/* Selector Tabs Mode */}
      <div className="flex justify-center max-w-4xl mx-auto">
        <div className="inline-flex rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700">
          <button
            onClick={() => setActiveTab('calibrator')}
            id="btn-ring-tab-matcher"
            className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-bold rounded-md transition-all ${
              activeTab === 'calibrator'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            1. Focused Ring Matcher
          </button>
          
          <button
            onClick={() => setActiveTab('grid')}
            id="btn-ring-tab-matrix"
            className={`flex items-center gap-1.5 py-1.5 px-4 text-xs font-bold rounded-md transition-all ${
              activeTab === 'grid'
                ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            2. Multi-Size Circle Matrix
          </button>
        </div>
      </div>

      {/* Sub-Layout A: Ring Slider Matcher */}
      {activeTab === 'calibrator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Sizer Controls Card */}
          <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-5">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Focused Physical Ring Calibration</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Place an existing ring that fits onto your monitor. Drag the slider until the colored circle exactly fills the **interior wall perimeter** of your physical band.
                </p>
              </div>

              {/* Live Diameter Slide adjusters */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Fine-Tune Inside Diameter:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{customDiameterMm.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="13.0"
                  max="23.0"
                  step="0.1"
                  value={customDiameterMm}
                  onChange={(e) => handleCustomDiameterChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  id="slider-ring-diameter"
                />
                
                {/* Microadjust Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleCustomDiameterChange(Math.max(13, customDiameterMm - 0.1))}
                    className="flex-1 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 hover:bg-zinc-50 text-[10px] font-bold rounded"
                  >
                    -0.1 mm
                  </button>
                  <button
                    onClick={() => handleCustomDiameterChange(Math.min(23, customDiameterMm + 0.1))}
                    className="flex-1 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 hover:bg-zinc-50 text-[10px] font-bold rounded"
                    id="btn-increment-ring"
                  >
                    +0.1 mm
                  </button>
                </div>
              </div>

              {/* Preset quick buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-extrabold block">Quick Select US Size</span>
                <div className="flex flex-wrap gap-1">
                  {RING_SIZES.filter((_, idx) => idx % 2 === 0).map((r) => {
                    const isSelected = r.usa === currentRingData.usa;
                    return (
                      <button
                        key={r.usa}
                        onClick={() => {
                          const sizeIndex = RING_SIZES.findIndex(x => x.usa === r.usa);
                          setSelectedSizeIndex(sizeIndex);
                          setCustomDiameterMm(r.diameterMm);
                        }}
                        className={`py-1 px-2 text-[11px] font-mono font-bold rounded border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        US {r.usa}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sizes Outputs Multi-standard specs cards row */}
            <div className="bg-zinc-900 text-white rounded-xl p-5 border border-zinc-800 shadow-md">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Identified International Ring Sizes</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 text-center">
                <div className="bg-zinc-800/65 p-2 rounded border border-zinc-700/50">
                  <span className="text-[9px] text-zinc-400 uppercase block font-bold">USA / Canada</span>
                  <strong className="text-base font-bold text-white mt-0.5 block">{currentRingData.usa}</strong>
                </div>
                <div className="bg-zinc-800/65 p-2 rounded border border-zinc-700/50">
                  <span className="text-[9px] text-zinc-400 uppercase block font-bold">UK / Australia</span>
                  <strong className="text-base font-bold text-white mt-0.5 block">{currentRingData.uk}</strong>
                </div>
                <div className="bg-zinc-800/65 p-2 rounded border border-zinc-700/50">
                  <span className="text-[9px] text-zinc-400 uppercase block font-bold">Europe</span>
                  <strong className="text-base font-bold text-white mt-0.5 block">{currentRingData.europe}</strong>
                </div>
                <div className="bg-zinc-800/65 p-2 rounded border border-zinc-700/50">
                  <span className="text-[9px] text-zinc-400 uppercase block font-bold">Japan</span>
                  <strong className="text-base font-bold text-white mt-0.5 block">{currentRingData.japan}</strong>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono">
                <span>Inside Diameter: {currentRingData.diameterMm} mm</span>
                <span>Circumference: {(currentRingData.diameterMm * Math.PI).toFixed(1)} mm</span>
              </div>
            </div>
          </div>

          {/* Sizer Large Focus Circle Canvas Board */}
          <div className="lg:col-span-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl shadow-inner flex flex-col items-center justify-center p-6 text-center h-[340px] lg:h-auto select-none">
            <div className="relative flex items-center justify-center">
              
              {/* Inside Measurement Loop border */}
              <div
                style={{
                  width: `${mmToPx(customDiameterMm)}px`,
                  height: `${mmToPx(customDiameterMm)}px`,
                }}
                className="rounded-full bg-linear-to-tr from-rose-500/10 to-indigo-500/5 border-3 border-indigo-600 dark:border-indigo-400 flex items-center justify-center transition-all duration-75 relative shadow-lg"
              >
                {/* Horizontal Scale Line */}
                <span className="h-[1.5px] w-full bg-indigo-600/20 absolute z-0"></span>
                <span className="w-[1.5px] h-full bg-indigo-600/20 absolute z-0"></span>

                {/* Diameter Text callout inside circle */}
                <div className="text-center z-10 p-2 bg-white/90 dark:bg-zinc-900/90 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-md transform scale-90">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold leading-none">Diameter</span>
                  <strong className="text-xs font-mono font-bold text-zinc-905 dark:text-zinc-50">{customDiameterMm.toFixed(1)} mm</strong>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <Globe className="w-3.5 h-3.5 text-indigo-505" />
              <span>Concentric rendering calibrated with {calibration.ppi} DPI</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Layout B: Multi-Size Matrix Grid */}
      {activeTab === 'grid' && (
        <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto">
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl mb-4 text-xs text-zinc-500 flex gap-2 items-start leading-relaxed">
            <HelpIcon className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Complete Standard Size Array:</strong> Place your physical ring directly onto your screen glass. Locate the circle which completely fills the interior wall without extending past its metal edges. <strong>Tap any circle to select and lock it down for fine-tuning inside diameter views!</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 pt-2" id="grid-ring-container">
            {RING_SIZES.map((size, index) => {
              const diamPx = mmToPx(size.diameterMm);
              const isSelected = index === selectedSizeIndex;

              return (
                <div
                  key={size.usa}
                  onClick={() => handleSelectGridSize(index)}
                  className={`bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-between gap-4 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-md h-[165px] ${
                    isSelected ? 'ring-2 ring-indigo-500 border-transparent shadow' : ''
                  }`}
                  id={`ring-size-${size.usa}`}
                >
                  <div className="text-center">
                    <span className="text-[11px] font-sans font-bold text-zinc-800 dark:text-zinc-200">US SIZE {size.usa}</span>
                    <span className="text-[9px] block text-zinc-400 font-mono tracking-tight mt-0.5">Diam: {size.diameterMm} mm</span>
                  </div>

                  {/* Concentric Circle container */}
                  <div className="h-16 w-16 flex items-center justify-center relative">
                    <div
                      style={{
                        width: `${Math.min(60, diamPx)}px`,
                        height: `${Math.min(60, diamPx)}px`,
                      }}
                      className={`rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/15'
                          : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/10'
                      }`}
                    />
                  </div>

                  <span className="text-[9px] font-mono leading-none bg-zinc-100 dark:bg-zinc-800 py-1 px-1.5 rounded dark:text-zinc-300">
                    UK: {size.uk} | EU: {size.europe}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
