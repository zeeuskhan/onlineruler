/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Ruler, Settings, Moon, Sun, HelpCircle, FileText, CheckCircle, Smartphone, Sliders, Globe, Compass, GraduationCap, LayoutGrid, ArrowLeftRight, HelpCircle as HelpIcon } from 'lucide-react';
import { ToolMode, CalibrationData } from './types';

// Importing Custom Sub-components
import CalibrationWidget from './components/CalibrationWidget';
import RulerTool from './components/RulerTool';
import ProtractorTool from './components/ProtractorTool';
import RingSizerTool from './components/RingSizerTool';
import GridTool from './components/GridTool';
import UnitConverterTool from './components/UnitConverterTool';
import PrintableRulerTool from './components/PrintableRulerTool';
import GuidesHub from './components/GuidesHub';
import RealOnlineRuler from './components/RealOnlineRuler';
import AdBanner from './components/AdBanner';
import SEOContent from './components/SEOContent';

function getToolFromPath(pathname: string): ToolMode {
  const p = pathname.toLowerCase();
  if (p === '/protractor') return 'protractor';
  if (p === '/ring-size') return 'ring-size';
  if (p === '/grid') return 'grid';
  if (p === '/unit-converter') return 'unit-converter';
  if (p === '/printable') return 'printable';
  if (p === '/guides') return 'guides';
  return 'ruler';
}

export default function App() {
  // Load active tab from URL path for modern SEO clean routing
  const [activeTab, setActiveTab] = useState<ToolMode>(() => {
    try {
      if (typeof window !== 'undefined') {
        return getToolFromPath(window.location.pathname);
      }
    } catch (e) {
      console.warn('URL pathname reading is restricted.', e);
    }
    return 'ruler';
  });
  const [isDark, setIsDark] = useState<boolean>(false);
  const [showCalibrationDrawer, setShowCalibrationDrawer] = useState<boolean>(false);
  const [showFullRuler, setShowFullRuler] = useState<boolean>(false);
  
  // Set default Calibration state, loading from LocalStorage if preset
  const [calibration, setCalibration] = useState<CalibrationData>(() => {
    try {
      const savedPPI = localStorage.getItem('on_ruler_calibrated_ppi');
      const savedMethod = localStorage.getItem('on_ruler_calibrated_method');
      const savedPreset = localStorage.getItem('on_ruler_calibrated_preset');
      
      if (savedPPI) {
        const floatPpi = parseFloat(savedPPI);
        if (floatPpi > 30 && floatPpi < 1000) {
          return {
            ppi: floatPpi,
            calibrated: savedMethod !== 'default',
            method: (savedMethod as any) || 'manual',
            presetName: savedPreset || undefined,
          };
        }
      }
    } catch (e) {
      console.warn('LocalStorage reads prevented by browser security sandbox.', e);
    }
    return {
      ppi: 96,
      calibrated: false,
      method: 'default',
    };
  });

  // Synchronize active tab with URL path for clean search-friendly URLs
  useEffect(() => {
    try {
      const targetPath = activeTab === 'ruler' ? '/' : `/${activeTab}`;
      if (window.location.pathname !== targetPath) {
        const url = new URL(window.location.href);
        url.pathname = targetPath;
        // Strip the old 'tool' search parameter to migrate cleanly to paths
        url.searchParams.delete('tool');
        window.history.pushState({ tool: activeTab }, '', url.toString());
      }
    } catch (e) {
      console.warn('Cannot update URL path.', e);
    }
  }, [activeTab]);

  // Support back/forward browser history navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getToolFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle 301 Client-Side Redirect from old query parameter URLs (?tool=xxx)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const oldTool = params.get('tool');
      if (oldTool) {
        const validTools = ['ruler', 'protractor', 'ring-size', 'grid', 'unit-converter', 'printable', 'guides'];
        if (validTools.includes(oldTool)) {
          const targetPath = oldTool === 'ruler' ? '/' : `/${oldTool}`;
          const url = new URL(window.location.href);
          url.pathname = targetPath;
          url.searchParams.delete('tool');
          window.location.replace(url.toString());
        }
      }
    } catch (e) {
      console.warn('Legacy query redirect failed.', e);
    }
  }, []);

  // Watch for system theme modes on initial mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('on_ruler_theme_mode');
      if (savedTheme === 'dark') {
        setIsDark(true);
      } else if (!savedTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
      }
    } catch (e) {
      console.log('Skipping theme storage preference.');
    }
  }, []);

  // Update calibration values reactively
  const handleCalibrationChange = (newData: CalibrationData) => {
    setCalibration(newData);
    try {
      localStorage.setItem('on_ruler_calibrated_ppi', newData.ppi.toString());
      localStorage.setItem('on_ruler_calibrated_method', newData.method);
      if (newData.presetName) {
        localStorage.setItem('on_ruler_calibrated_preset', newData.presetName);
      } else {
        localStorage.removeItem('on_ruler_calibrated_preset');
      }
    } catch (e) {
      console.warn('Cannot write configuration to local environment storage.', e);
    }
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      localStorage.setItem('on_ruler_theme_mode', nextDark ? 'dark' : 'light');
    } catch (e) {
      console.log('Cannot write theme configuration to storage.');
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen transition-colors duration-300 font-sans`}>
      {/* Outer Theme wrapper */}
      <div className="bg-[#FAF9F5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col justify-between">
        
        {/* TOP LEVEL NAVIGATION HEADER HEADER BAR */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-xs sticky top-0 z-sticky select-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Logo area */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-650 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Ruler className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-none">
                  Virtual Ruler Pro
                </h1>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-semibold font-mono uppercase tracking-widest">
                  Extreme Pixel Accuracy Suite
                </span>
              </div>
            </div>

            {/* Middle Quick Scale Chip and Drawer Toggle */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setShowCalibrationDrawer(!showCalibrationDrawer)}
                id="header-calib-trigger"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  calibration.calibrated
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/50'
                    : 'bg-indigo-50 dark:bg-zinc-800/80 text-indigo-700 dark:text-zinc-350 border-indigo-200 dark:border-zinc-700 hover:bg-indigo-100/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${calibration.calibrated ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                <span className="font-mono">{calibration.ppi} Pixels/Inch</span>
                {calibration.calibrated ? (
                  <span className="text-[10px] font-bold uppercase opacity-80">
                    ({calibration.method === 'preset' ? calibration.presetName : calibration.method} Calibrated)
                  </span>
                ) : (
                  <span className="text-[10px] italic opacity-60">(Standard Scale)</span>
                )}
                <span className="text-[10px] text-zinc-400 pl-1 font-normal">• Adjust</span>
              </button>
            </div>

            {/* Right side Utility buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowFullRuler(true)}
                id="btn-real-ruler-trigger"
                className="flex items-center gap-2 px-3 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer leading-none"
                title="Launch Exact Replica Viewport Ruler"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Viewport Rules</span>
                <span className="text-[8px] bg-amber-450 text-neutral-900 px-1 py-0.5 rounded font-black uppercase text-center shrink-0">
                  New
                </span>
              </button>

              <button
                onClick={toggleTheme}
                id="btn-theme-toggle"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-805 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors cursor-pointer animate-fadeIn"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setShowCalibrationDrawer(!showCalibrationDrawer)}
                id="btn-settings-toggle"
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-zinc-650 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer ${
                  showCalibrationDrawer 
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 text-indigo-650' 
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-805'
                }`}
                title="Open Calibration Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

          </div>
        </header>

        {/* CALIBRATION WORKSPACE DRAWER SLIDEOUT */}
        {showCalibrationDrawer && (
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 py-2.5 animate-fadeIn select-none">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <CalibrationWidget
                calibration={calibration}
                onChangeCalibration={handleCalibrationChange}
                onClose={() => setShowCalibrationDrawer(false)}
              />
            </div>
          </div>
        )}

        {/* MAIN BODY LAYOUT INTERACTIVE DECKS */}
        <main className="max-w-7xl mx-auto w-full px-4 lg:px-6 py-6 lg:py-8 flex-1 space-y-8">
          
          {/* Header Ad Banner (728x90) */}
          <AdBanner adKey="6b6777c4248ba9b31f1a7f8087ca4b49" format="iframe" height={90} width={728} />
          
          {/* Main Tab Deck Header Bar Selection */}
          <div className="overflow-x-auto select-none no-scrollbar border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-1.5 min-w-[650px] pb-1">
              {[
                { id: 'ruler', label: 'Screen Ruler', icon: <Ruler className="w-4 h-4" /> },
                { id: 'protractor', label: 'Angle Protractor', icon: <Compass className="w-4 h-4" /> },
                { id: 'ring-size', label: 'Ring Sizer Chart', icon: <HelpIcon className="w-4 h-4" /> },
                { id: 'grid', label: 'Creative Web Grid', icon: <LayoutGrid className="w-4 h-4" /> },
                { id: 'unit-converter', label: 'Instant Converter', icon: <ArrowLeftRight className="w-4 h-4" /> },
                { id: 'printable', label: 'Scale printable', icon: <FileText className="w-4 h-4" /> },
                { id: 'guides', label: 'Guidelines & FAQs', icon: <GraduationCap className="w-4 h-4" /> },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as ToolMode);
                    }}
                    id={`tab-selector-${tab.id}`}
                    className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold transition-all relative border-b-2 leading-none whitespace-nowrap ${
                      isActive
                        ? 'text-indigo-650 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-extrabold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250 border-transparent hover:border-zinc-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Component Render Wrapper */}
          <section id="main-active-workspace-card" className="transition-all duration-300">
            {activeTab === 'ruler' && (
              <RulerTool
                calibration={calibration}
                onOpenCalibration={() => setShowCalibrationDrawer(true)}
                onOpenRealRuler={() => setShowFullRuler(true)}
              />
            )}
            
            {activeTab === 'protractor' && (
              <ProtractorTool />
            )}

            {activeTab === 'ring-size' && (
              <RingSizerTool
                calibration={calibration}
                onOpenCalibration={() => setShowCalibrationDrawer(true)}
              />
            )}

            {activeTab === 'grid' && (
              <GridTool calibration={calibration} />
            )}

            {activeTab === 'unit-converter' && (
              <UnitConverterTool calibration={calibration} />
            )}

            {activeTab === 'printable' && (
              <PrintableRulerTool />
            )}

            {activeTab === 'guides' && (
              <GuidesHub />
            )}
          </section>

          {/* Core Crawlable SEO & FAQ content below the interactive measuring utilities */}
          <SEOContent activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* DYNAMIC CALIBRATION BANNER AT THE BOTTOM FOR QUICK ENGAGEMENT */}
          {!calibration.calibrated && !showCalibrationDrawer && (
            <div className="bg-gradient-to-r from-indigo-750 via-indigo-900 to-indigo-950 text-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 select-none max-w-4xl mx-auto">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[10px] bg-emerald-500 text-emerald-950 font-bold px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                  Highly Recommended
                </span>
                <h4 className="text-base font-extrabold text-white tracking-tight leading-none pt-0.5">
                  Is your screen ruler exactly to scale?
                </h4>
                <p className="text-xs text-indigo-200 max-w-lg leading-relaxed">
                  Every monitor packs a unique number of pixels into its diagonal view. To ensure 1 inch on display matches 1 physical inch in your pocket, calibrate using an ordinary debit card.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCalibrationDrawer(true);
                  // Scroll to calibration area smoothly
                  document.getElementById('calibration-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="footer-action-calibrate"
                className="bg-white hover:bg-zinc-100 text-indigo-900 border-none font-bold text-xs py-2.5 px-5 rounded-lg shadow-sm whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-white shrink-0"
              >
                Calibrate Now (10 Seconds)
              </button>
            </div>
          )}

        </main>

        {/* POLISHED LANDING PAGE FOOTER WITH RICH SEARCH WORDS & METRICS */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500 py-10 mt-12 select-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 md:grid-cols-12 gap-8 leading-relaxed text-xs">
            
            {/* Column A: Purpose & Stats */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950 rounded flex items-center justify-center text-indigo-650 dark:text-indigo-400">
                  <Ruler className="w-4 h-4 stroke-[2.5]" />
                </div>
                <strong className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">Virtual Ruler Tool Suite</strong>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed max-w-sm">
                Built to outperform classical options: provides extreme physical accuracy backboards calibrated directly against display physical densities. Zero ads, instant access, sub-100KB initial asset footprint, 100% vector scaling print layouts.
              </p>
              <div className="text-[10px] text-zinc-400 font-mono">
                <span>Active Scale Identifier: </span>
                <strong className="text-indigo-600 dark:text-indigo-400">{calibration.ppi} DPI Resolution Mode</strong>
              </div>
            </div>            {/* Column B: Tool index */}
            <div className="md:col-span-3 space-y-2.5">
              <strong className="text-zinc-850 dark:text-zinc-250 font-bold block">Digital Instruments Index:</strong>
              <ul className="space-y-1.5 text-zinc-455 dark:text-zinc-400">
                <li>
                  <button onClick={() => { setShowFullRuler(true); }} className="hover:text-blue-600 dark:hover:text-blue-400 text-blue-500 font-black flex items-center gap-1.5 text-left leading-none cursor-pointer">
                    • Live Viewport Edge Ruler (New)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ruler')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                    • Actual Size Screen Ruler (cm/in)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('protractor')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                    • SVG Compass angle Protractor
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ring-size')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                    • Ring Diameter Chart Sizer
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('grid')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                    • Web Alignment Coordinate Grid
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('unit-converter')} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                    • Century Metric Unit Converter
                  </button>
                </li>
              </ul>
            </div>

            {/* Column C: Educational Guides */}
            <div className="md:col-span-4 space-y-2.5">
              <strong className="text-zinc-850 dark:text-zinc-250 font-bold block">Editorial Guides Index:</strong>
              <ul className="space-y-1.5 text-zinc-455 dark:text-zinc-400">
                <li>
                  <button onClick={() => { setActiveTab('guides'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium block text-left">
                    • How to Calibrate Screen Rulers for laptops & mobiles
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('guides'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium block text-left">
                    • How to measure without a ruler (10 pocket items)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('guides'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium block text-left">
                    • How to find US and UK Ring Size at home
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('guides'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium block text-left">
                    • Pixels to Centimeters mathematical conversion guide
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Footer Ad Banner (468x60) */}
          <AdBanner adKey="68e74af62003701085edf5c2422fb9f7" format="iframe" height={60} width={468} />

          <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
            <span>© 2026 Virtual Ruler suite • Murata Design Inc.</span>
            <span>calibrated measurements for extreme physical accuracy</span>
          </div>
        </footer>

      </div>

      {/* Renders immersive multi-edge viewport ruler overlay */}
      <RealOnlineRuler
        isOpen={showFullRuler}
        onClose={() => setShowFullRuler(false)}
        calibration={calibration}
        onCalibrationChange={handleCalibrationChange}
      />
    </div>
  );
}
