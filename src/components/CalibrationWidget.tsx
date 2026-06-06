/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, Laptop, Settings, Check, RotateCcw, AlertTriangle, Monitor, Tablet, Smartphone, HelpCircle, ArrowRight, DollarSign } from 'lucide-react';
import { CalibrationData, WebPresetScreen } from '../types';
import { CARD_WIDTH_INCH, CARD_HEIGHT_INCH, CARD_WIDTH_MM, CARD_HEIGHT_MM, DEVICE_PRESETS, COIN_PRESETS } from '../data';

interface CalibrationWidgetProps {
  calibration: CalibrationData;
  onChangeCalibration: (data: CalibrationData) => void;
  onClose?: () => void;
}

export default function CalibrationWidget({
  calibration,
  onChangeCalibration,
  onClose,
}: CalibrationWidgetProps) {
  const [activeMethod, setActiveMethod] = useState<'card' | 'coin' | 'preset' | 'manual'>('card');
  const [cardWidthPx, setCardWidthPx] = useState<number>(calibration.ppi * CARD_WIDTH_INCH);
  const [selectedCoinIndex, setSelectedCoinIndex] = useState<number>(0);
  const [coinWidthPx, setCoinWidthPx] = useState<number>(
    (COIN_PRESETS[0].diameterMm / 25.4) * calibration.ppi
  );
  
  // Custom manual calculation fields
  const [screenResolutionWidth, setScreenResolutionWidth] = useState<number>(window.screen.width * (window.devicePixelRatio || 1));
  const [screenResolutionHeight, setScreenResolutionHeight] = useState<number>(window.screen.height * (window.devicePixelRatio || 1));
  const [screenDiagonalInches, setScreenDiagonalInches] = useState<number>(15.6);
  const [manualPPI, setManualPPI] = useState<number>(calibration.ppi);
  const [presetSearch, setPresetSearch] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Sync state with calibration prop updates
  useEffect(() => {
    setCardWidthPx(calibration.ppi * CARD_WIDTH_INCH);
    setManualPPI(calibration.ppi);
    setCoinWidthPx((COIN_PRESETS[selectedCoinIndex].diameterMm / 25.4) * calibration.ppi);
  }, [calibration.ppi]);

  // Handle Card Resizing
  const handleCardSlider = (val: number) => {
    setCardWidthPx(val);
    const calculatedPpi = val / CARD_WIDTH_INCH;
    setManualPPI(Math.round(calculatedPpi * 10) / 10);
  };

  // Handle Coin Resizing
  const handleCoinSlider = (val: number) => {
    setCoinWidthPx(val);
    const selectedCoin = COIN_PRESETS[selectedCoinIndex];
    const coinDiameterInch = selectedCoin.diameterMm / 25.4;
    const calculatedPpi = val / coinDiameterInch;
    setManualPPI(Math.round(calculatedPpi * 10) / 10);
  };

  // Apply Card Calibration
  const applyCardCalibration = () => {
    const finalPpi = cardWidthPx / CARD_WIDTH_INCH;
    onChangeCalibration({
      ppi: Number(finalPpi.toFixed(2)),
      calibrated: true,
      method: 'card',
    });
    triggerToast();
  };

  // Apply Coin Calibration
  const applyCoinCalibration = () => {
    const selectedCoin = COIN_PRESETS[selectedCoinIndex];
    const coinDiameterInch = selectedCoin.diameterMm / 25.4;
    const finalPpi = coinWidthPx / coinDiameterInch;
    onChangeCalibration({
      ppi: Number(finalPpi.toFixed(2)),
      calibrated: true,
      method: 'coin',
    });
    triggerToast();
  };

  // Save Manual PPI directly
  const applyManualPPI = (ppiVal: number) => {
    onChangeCalibration({
      ppi: Number(ppiVal.toFixed(2)),
      calibrated: true,
      method: 'manual',
    });
    triggerToast();
  };

  // Reset to default
  const handleReset = () => {
    // Standard CSS scale treats 96 pixels as 1 physical inch
    onChangeCalibration({
      ppi: 96,
      calibrated: false,
      method: 'default',
    });
    setCardWidthPx(96 * CARD_WIDTH_INCH);
    setCoinWidthPx((COIN_PRESETS[selectedCoinIndex].diameterMm / 25.4) * 96);
    setManualPPI(96);
  };

  // Auto-Calculating PPI from Width/Height/Diagonal
  const handleCalculateManualPPI = () => {
    const horizontalSqr = screenResolutionWidth * screenResolutionWidth;
    const verticalSqr = screenResolutionHeight * screenResolutionHeight;
    const diagonalPixels = Math.sqrt(horizontalSqr + verticalSqr);
    const calculatedPpi = diagonalPixels / screenDiagonalInches;
    if (calculatedPpi > 30 && calculatedPpi < 1000) {
      setManualPPI(Math.round(calculatedPpi * 10) / 10);
      applyManualPPI(calculatedPpi);
    }
  };

  // Select Device Preset
  const handleSelectPreset = (preset: WebPresetScreen) => {
    onChangeCalibration({
      ppi: preset.ppi,
      calibrated: true,
      method: 'preset',
      presetName: preset.name,
    });
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Change Coin selection
  const handleCoinChange = (index: number) => {
    setSelectedCoinIndex(index);
    const selectedCoin = COIN_PRESETS[index];
    const coinDiameterInch = selectedCoin.diameterMm / 25.4;
    setCoinWidthPx(manualPPI * coinDiameterInch);
  };

  // Filter device presets
  const filteredPresets = DEVICE_PRESETS.filter(p =>
    p.name.toLowerCase().includes(presetSearch.toLowerCase())
  );

  return (
    <div id="calibration-card" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-5 max-w-4xl mx-auto mb-6 transition-all duration-300">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-toast flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-lg shadow-lg animate-bounce" id="calibration-saved-toast">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Screen Calibrated to {manualPPI} PPI!</span>
        </div>
      )}

      {/* Header Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Accuracy Calibration Settings
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Auto-detected PPI: <strong className="text-indigo-600 dark:text-indigo-400">{Math.round(96 * (window.devicePixelRatio || 1))}</strong>. 
            Currently active scale: <strong className="text-zinc-900 dark:text-zinc-50 font-mono">{calibration.ppi} Pixels/Inch</strong> 
            {calibration.calibrated ? ' (Calibrated)' : ' (Standard Default)'}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleReset}
            id="btn-calibration-reset"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          {onClose && (
            <button
              onClick={onClose}
              id="btn-calibration-close"
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-md transition-colors leading-none"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Mode Select Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-6">
        <button
          onClick={() => setActiveMethod('card')}
          id="btn-tab-card"
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
            activeMethod === 'card'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Ruler Calibration Card
        </button>

        <button
          onClick={() => setActiveMethod('coin')}
          id="btn-tab-coin"
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
            activeMethod === 'coin'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Coin Diameter widget
        </button>

        <button
          onClick={() => setActiveMethod('preset')}
          id="btn-tab-preset"
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
            activeMethod === 'preset'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          Search Device Presets
        </button>

        <button
          onClick={() => setActiveMethod('manual')}
          id="btn-tab-manual"
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
            activeMethod === 'manual'
              ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Manual Scales & Math
        </button>
      </div>

      {/* Main Body content changes according to activeMethod */}
      <div className="min-h-[200px]" id="calibration-body">
        
        {/* Method 1: Credit Card */}
        {activeMethod === 'card' && (
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="flex-1 w-full space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-200">
                <span className="font-semibold block mb-1">Standard Card Size:</span>
                All cards like credit, debit, or ID cards globally measure exactly <strong>{CARD_WIDTH_MM} mm</strong> (<strong>{CARD_WIDTH_INCH.toFixed(2)} inches</strong>) wide according to international guidelines.
              </div>
              <div className="block sm:hidden bg-indigo-50/50 dark:bg-indigo-950/25 border-l-2 border-indigo-500 p-2.5 rounded-r-md text-[11px] text-indigo-950 dark:text-zinc-300 leading-snug">
                <strong>📱 Calibrating on Mobile?</strong> For maximum slider flexibility, please rotate your phone to <strong>Landscape Mode</strong> so the card can stretch to full physical size!
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Slide or drag until virtual card matches your physical card:
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 font-mono">Smaller</span>
                  <input
                    type="range"
                    min="150"
                    max="650"
                    step="0.5"
                    value={cardWidthPx}
                    onChange={(e) => handleCardSlider(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    id="slider-card-width"
                  />
                  <span className="text-xs text-zinc-500 font-mono">Larger</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-xs text-zinc-500 block">Fine-Tune Scale</span>
                    <strong className="text-sm text-zinc-800 dark:text-zinc-200 font-mono">{manualPPI} PPI</strong>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCardSlider(Math.max(150, cardWidthPx - 1))}
                      className="px-2 py-1 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 text-xs font-bold rounded-l transition-colors"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleCardSlider(Math.max(150, cardWidthPx - 0.2))}
                      className="px-2 py-1 bg-white dark:bg-zinc-700 border-t border-b border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 text-[10px] font-bold transition-colors"
                    >
                      -0.2
                    </button>
                    <button
                      onClick={() => handleCardSlider(Math.min(650, cardWidthPx + 0.2))}
                      className="px-2 py-1 bg-white dark:bg-zinc-700 border-t border-b border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 text-[10px] font-bold transition-colors"
                    >
                      +0.2
                    </button>
                    <button
                      onClick={() => handleCardSlider(Math.min(650, cardWidthPx + 1))}
                      className="px-2 py-1 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 text-xs font-bold rounded-r transition-colors"
                    >
                      +1
                    </button>
                  </div>
                </div>

                <button
                  onClick={applyCardCalibration}
                  id="btn-apply-card-calibration"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Check className="w-4 h-4" />
                  Save Screen Calibration
                </button>
              </div>
            </div>

            {/* Simulated Card Preview Wrapper */}
            <div className="flex justify-center items-center p-3 bg-zinc-50 dark:bg-zinc-850/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40 w-full lg:w-auto overflow-hidden">
              <div
                style={{ width: `${cardWidthPx}px`, height: `${cardWidthPx * (CARD_HEIGHT_INCH / CARD_WIDTH_INCH)}px` }}
                className="max-w-full relative rounded-xl shadow-ruler overflow-hidden border border-zinc-300 dark:border-zinc-600 transition-all duration-75 flex flex-col justify-between p-4 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 text-white select-none"
                id="interactive-simulated-creditcard"
              >
                {/* Visual Glassmorphed Elements of Card */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest opacity-60">Digital Calibrator</span>
                    <h4 className="text-xs font-bold tracking-tight">SUPERIOR RULER</h4>
                  </div>
                  <div className="w-8 h-6 bg-amber-300/80 rounded-md border border-amber-400 flex items-center justify-center text-[8px] font-bold text-amber-950">
                    CHIP
                  </div>
                </div>
                <div className="text-center font-mono tracking-widest text-sm lg:text-base my-2">
                  ••••  ••••  ••••  {Math.round(manualPPI)}
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-widest opacity-50 block">Card Width</span>
                    <span className="text-[10px] font-mono leading-none">{CARD_WIDTH_MM} mm / 3.37"</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-emerald-300">CALIBRATING</span>
                </div>
                
                {/* Overlay Drag Indicators */}
                <div className="absolute right-0 top-0 bottom-0 w-1 flex items-center justify-center bg-zinc-200/20 active:bg-amber-300 pointer-events-none">
                  <div className="h-6 w-3 border border-indigo-400 bg-white/90 rounded-full flex flex-col justify-center gap-[1px] items-center text-zinc-600">
                    <span className="block w-1.5 h-[1.5px] bg-zinc-500"></span>
                    <span className="block w-1.5 h-[1.5px] bg-zinc-500"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Method 2: Coin Calibration */}
        {activeMethod === 'coin' && (
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 animate-fadeIn">
            <div className="flex-1 w-full space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg p-3 text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-semibold block mb-1">Scale with a coin:</span>
                Place a physical coin flat over the circle diagram. Adjust the slider until the inner green circle matches your coin's exact outer circumference.
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Your Coin Preset:
                </label>
                <select
                  value={selectedCoinIndex}
                  onChange={(e) => handleCoinChange(parseInt(e.target.value))}
                  id="select-coin-preset"
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-1.5 px-3 text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  {COIN_PRESETS.map((coin, index) => (
                    <option key={coin.name} value={index}>
                      {coin.name} (Diameter: {coin.diameterMm} mm)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Adjust graphic circle size:
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 font-mono">Smaller</span>
                  <input
                    type="range"
                    min="50"
                    max="350"
                    step="0.5"
                    value={coinWidthPx}
                    onChange={(e) => handleCoinSlider(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    id="slider-coin-width"
                  />
                  <span className="text-xs text-zinc-500 font-mono">Larger</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-xs text-zinc-500 block">Calculated Resolution Scale</span>
                    <strong className="text-sm text-zinc-800 dark:text-zinc-200 font-mono">{manualPPI} PPI</strong>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCoinSlider(Math.max(50, coinWidthPx - 1))}
                      className="px-2 py-1 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 text-xs font-bold rounded-l transition-colors"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleCoinSlider(Math.min(350, coinWidthPx + 1))}
                      className="px-2 py-1 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 text-xs font-bold rounded-r transition-colors"
                    >
                      +1
                    </button>
                  </div>
                </div>

                <button
                  onClick={applyCoinCalibration}
                  id="btn-apply-coin-calibration"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Check className="w-4 h-4" />
                  Save Coin Calibration
                </button>
              </div>
            </div>

            {/* Constant Coin Diameter Circle */}
            <div className="flex justify-center items-center p-6 bg-zinc-50 dark:bg-zinc-850/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40 w-full lg:w-48 self-stretch">
              <div className="relative flex flex-col items-center justify-center">
                <div
                  style={{ width: `${coinWidthPx}px`, height: `${coinWidthPx}px` }}
                  className="rounded-full shadow-md bg-gradient-to-br from-amber-400 via-yellow-100 to-amber-600 border border-amber-600 opacity-90 flex items-center justify-center text-amber-950 flex-col font-mono relative transition-all duration-75"
                >
                  <div className="absolute inset-2 border-2 border-dashed border-amber-700/60 rounded-full animate-spin-slow"></div>
                  <span className="text-[10px] font-bold tracking-tight">{COIN_PRESETS[selectedCoinIndex].diameterMm}mm</span>
                  <span className="text-[8px] opacity-70">PLACE COIN</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Method 3: Search Device Presets */}
        {activeMethod === 'preset' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Type device name e.g. MacBook, iPhone, iPad, Dell..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  id="input-preset-search"
                  className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 px-3 pl-8 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-zinc-100"
                />
                <span className="absolute left-2.5 top-2.5 text-zinc-400">🔍</span>
              </div>
              {presetSearch && (
                <button
                  onClick={() => setPresetSearch('')}
                  className="text-xs text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1" id="presets-container">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  id={`preset-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className="flex items-center justify-between text-left p-3 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-zinc-700 hover:bg-indigo-50/20 dark:hover:bg-zinc-800/80 rounded-lg transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    {preset.deviceType === 'laptop' && <Laptop className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />}
                    {preset.deviceType === 'monitor' && <Monitor className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />}
                    {preset.deviceType === 'tablet' && <Tablet className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />}
                    {preset.deviceType === 'phone' && <Smartphone className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />}
                    <div>
                      <span className="text-xs font-bold block text-zinc-800 dark:text-zinc-200 leading-tight">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        Screen Size: {preset.diagonal} 
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {preset.ppi} PPI
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                  </div>
                </button>
              ))}
              {filteredPresets.length === 0 && (
                <div className="col-span-full py-8 text-center text-zinc-400 text-xs">
                  No devices matched your search. Try adjusting spelling or calibrate manually!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Method 4: Manual scales */}
        {activeMethod === 'manual' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Quick manual adjust slider */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Direct PPI Tuning</h3>
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Uncalibrated standard base:</span>
                  <span className="text-xs font-mono">96 PPI</span>
                </div>
                <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400 font-bold">
                  <span className="text-xs">Adjust target scale manually:</span>
                  <span className="text-sm font-mono tracking-tight">{manualPPI} PPI</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  value={manualPPI}
                  onChange={(e) => setManualPPI(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex gap-1.5 pt-2">
                  <button
                    onClick={() => {
                      const prev = Math.max(50, manualPPI - 1);
                      setManualPPI(prev);
                      applyManualPPI(prev);
                    }}
                    className="flex-1 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 font-semibold text-xs rounded transition-colors"
                  >
                    -1 PPI
                  </button>
                  <button
                    onClick={() => {
                      const next = Math.min(600, manualPPI + 1);
                      setManualPPI(next);
                      applyManualPPI(next);
                    }}
                    className="flex-1 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 font-semibold text-xs rounded transition-colors"
                  >
                    +1 PPI
                  </button>
                </div>
                <button
                  onClick={() => applyManualPPI(manualPPI)}
                  id="btn-apply-manual-ppi"
                  className="w-full mt-2 bg-zinc-900 hover:bg-black dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-bold text-xs py-2 rounded-lg transition-colors"
                >
                  Apply {manualPPI} PPI
                </button>
              </div>
            </div>

            {/* Diagonal screen calculator */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">PPI Calculator (From Screen Specs)</h3>
              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3.5 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">HORIZ. PIXELS</label>
                    <input
                      type="number"
                      value={screenResolutionWidth}
                      onChange={(e) => setScreenResolutionWidth(parseInt(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md py-1 px-2 text-xs font-mono dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">VERT. PIXELS</label>
                    <input
                      type="number"
                      value={screenResolutionHeight}
                      onChange={(e) => setScreenResolutionHeight(parseInt(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md py-1 px-2 text-xs font-mono dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1">SCREEN DIAGONAL (INCHES)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={screenDiagonalInches}
                    onChange={(e) => setScreenDiagonalInches(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md py-1 px-2 text-xs font-mono dark:text-zinc-100"
                  />
                </div>
                <button
                  onClick={handleCalculateManualPPI}
                  id="btn-calculate-ppi"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors"
                >
                  Calculate & Apply PPI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Unsure? Use a credit card - it is standard worldwide!
        </span>
        <span className="font-mono">
          Calibration formula: Card rendered width px / {CARD_WIDTH_INCH.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
