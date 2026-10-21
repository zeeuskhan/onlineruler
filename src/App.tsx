/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Ruler, Settings, Moon, Sun, HelpCircle, FileText, CheckCircle, 
  Smartphone, Sliders, Globe, Compass, GraduationCap, LayoutGrid, 
  ArrowLeftRight, HelpCircle as HelpIcon, Camera, Maximize, ExternalLink,
  Code, ShieldCheck, Languages, AlertCircle
} from 'lucide-react';
import { ToolMode, CalibrationData } from './types';
import { PAGES_SEO_REGISTRY, TRUST_PAGES_CONFIG, E_E_A_T_AUTHOR, PageSeoConfig } from './seoData';

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
import SeoContentSection from './components/SeoContentSection';
import CameraRuler from './components/CameraRuler';
import TrustPages from './components/TrustPages';

export default function App() {
  // Current URL pathname routing (supporting hub & spoke structure)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      if (PAGES_SEO_REGISTRY[path] || TRUST_PAGES_CONFIG[path as keyof typeof TRUST_PAGES_CONFIG]) {
        return path;
      }
      // Check query parameter fallback for backward compatibility
      const params = new URLSearchParams(window.location.search);
      const tool = params.get('tool');
      if (tool) {
        if (tool === 'inches') return '/online-ruler-inches';
        if (tool === 'cm') return '/online-ruler-cm';
        if (tool === 'mm') return '/online-ruler-mm';
        if (tool === 'overlay') return '/ruler-overlay';
        if (tool === 'camera') return '/camera-ruler';
      }
    } catch (_) {}
    return '/';
  });

  // Query-param tab tool mode (protractor, ring-size, grid, unit-converter, printable, guides)
  const [activeTab, setActiveTab] = useState<ToolMode>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tool = params.get('tool');
      const validTools = ['ruler', 'protractor', 'ring-size', 'grid', 'unit-converter', 'printable', 'guides'];
      if (tool && validTools.includes(tool)) {
        return tool as ToolMode;
      }
    } catch (_) {}
    return 'ruler';
  });

  const [isDark, setIsDark] = useState<boolean>(false);
  const [showCalibrationDrawer, setShowCalibrationDrawer] = useState<boolean>(false);
  const [showFullRuler, setShowFullRuler] = useState<boolean>(false);
  const [showHindiNotice, setShowHindiNotice] = useState<boolean>(false);

  // Calibration state with local storage persistence
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
    } catch (_) {}
    return {
      ppi: 96,
      calibrated: false,
      method: 'default',
    };
  });

  // Handle client-side pushState navigation with real anchor URLs
  const navigateTo = useCallback((targetUrl: string) => {
    try {
      if (targetUrl.startsWith('http')) {
        window.location.href = targetUrl;
        return;
      }

      // Check if it's a query param tool
      if (targetUrl.includes('?tool=')) {
        const params = new URLSearchParams(targetUrl.split('?')[1]);
        const tool = params.get('tool') as ToolMode;
        if (tool) {
          setActiveTab(tool);
          setCurrentPath('/');
          window.history.pushState({}, '', targetUrl);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // Normal path navigation
      const cleanPath = targetUrl.toLowerCase().replace(/\/$/, '') || '/';
      setCurrentPath(cleanPath);
      setActiveTab('ruler');
      window.history.pushState({}, '', cleanPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.location.href = targetUrl;
    }
  }, []);

  // Listen for browser Back/Forward popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      setCurrentPath(path);
      const params = new URLSearchParams(window.location.search);
      const tool = params.get('tool') as ToolMode;
      if (tool) setActiveTab(tool);
      else setActiveTab('ruler');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize document.title, meta tags, and JSON-LD structured data on route changes
  useEffect(() => {
    try {
      const pageConfig = PAGES_SEO_REGISTRY[currentPath];
      const trustConfig = TRUST_PAGES_CONFIG[currentPath as keyof typeof TRUST_PAGES_CONFIG];

      let newTitle = 'Online Ruler — 100% Accurate Actual Size Screen Ruler';
      let newDescription = 'Free online ruler with instant credit card calibration. Measure physical objects on your screen in inches, cm, and mm with 100% actual size accuracy.';

      if (pageConfig) {
        newTitle = pageConfig.titleVariants[0];
        newDescription = pageConfig.metaVariants[0];
      } else if (trustConfig) {
        newTitle = trustConfig.title;
        newDescription = trustConfig.description;
      }

      // Update Document Title
      document.title = newTitle;

      // Update Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', newDescription);

      // Update Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      const canonicalHref = `https://rulerscale.vercel.app${currentPath === '/' ? '/' : currentPath}`;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalHref);

      // Update OpenGraph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', newTitle);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', newDescription);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', canonicalHref);

      // Inject / Update Rich Structured Data JSON-LD
      let jsonLdScript = document.getElementById('dynamic-jsonld');
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'dynamic-jsonld';
        jsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdScript);
      }

      const structuredData: any = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://rulerscale.vercel.app/#website',
            'url': 'https://rulerscale.vercel.app/',
            'name': 'RuleScale - Online Ruler & Screen Measure Suite',
            'description': 'Free online ruler and accurate screen measure tool.',
            'publisher': {
              '@type': 'Organization',
              '@id': 'https://rulerscale.vercel.app/#organization',
              'name': 'RuleScale & Murata Design',
              'url': 'https://rulerscale.vercel.app/',
              'logo': 'https://rulerscale.vercel.app/favicon.svg',
            },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${canonicalHref}#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://rulerscale.vercel.app/',
              },
              ...(currentPath !== '/'
                ? [
                    {
                      '@type': 'ListItem',
                      'position': 2,
                      'name': pageConfig ? pageConfig.targetKeyword : (trustConfig ? trustConfig.h1 : 'Tool'),
                      'item': canonicalHref,
                    },
                  ]
                : []),
            ],
          },
          {
            '@type': 'WebApplication',
            '@id': `${canonicalHref}#webapp`,
            'url': canonicalHref,
            'name': newTitle,
            'applicationCategory': 'UtilitiesApplication',
            'operatingSystem': 'All',
            'browserRequirements': 'Requires HTML5 Support and JavaScript',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
            },
            'author': {
              '@type': 'Person',
              'name': E_E_A_T_AUTHOR.name,
              'jobTitle': E_E_A_T_AUTHOR.role,
            },
          },
          ...(pageConfig && pageConfig.faqs.length > 0
            ? [
                {
                  '@type': 'FAQPage',
                  '@id': `${canonicalHref}#faq`,
                  'mainEntity': pageConfig.faqs.map((f) => ({
                    '@type': 'Question',
                    'name': f.question,
                    'acceptedAnswer': {
                      '@type': 'Answer',
                      'text': f.answer,
                    },
                  })),
                },
              ]
            : []),
        ],
      };

      jsonLdScript.textContent = JSON.stringify(structuredData);
    } catch (_) {}
  }, [currentPath]);

  // System theme detection
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('on_ruler_theme_mode');
      if (savedTheme === 'dark') {
        setIsDark(true);
      } else if (!savedTheme) {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    } catch (_) {}
  }, []);

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
    } catch (_) {}
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      localStorage.setItem('on_ruler_theme_mode', nextDark ? 'dark' : 'light');
    } catch (_) {}
  };

  const pageConfig: PageSeoConfig | undefined = PAGES_SEO_REGISTRY[currentPath];
  const isTrustPage = Boolean(TRUST_PAGES_CONFIG[currentPath as keyof typeof TRUST_PAGES_CONFIG]);

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen transition-colors duration-300 font-sans`}>
      <div className="bg-[#FAF9F5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col justify-between">
        
        {/* TOP LEVEL NAVIGATION HEADER */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-xs sticky top-0 z-40 select-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Logo area */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/');
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 bg-indigo-650 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Ruler className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-none block">
                  RuleScale
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 font-semibold font-mono uppercase tracking-widest">
                  Actual Size Online Ruler
                </span>
              </div>
            </a>

            {/* Quick Scale Chip and Drawer Toggle */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setShowCalibrationDrawer(!showCalibrationDrawer)}
                id="header-calib-trigger"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  calibration.calibrated
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/50'
                    : 'bg-indigo-50 dark:bg-zinc-800/80 text-indigo-700 dark:text-zinc-350 border-indigo-200 dark:border-zinc-700 hover:bg-indigo-100/50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${calibration.calibrated ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                <span className="font-mono">{calibration.ppi} DPI Mode</span>
                {calibration.calibrated ? (
                  <span className="text-[10px] font-bold uppercase opacity-80">
                    ({calibration.method === 'preset' ? calibration.presetName : calibration.method} Calibrated)
                  </span>
                ) : (
                  <span className="text-[10px] italic opacity-60">(Standard 96 DPI)</span>
                )}
                <span className="text-[10px] text-zinc-400 pl-1 font-normal">• Calibrate</span>
              </button>
            </div>

            {/* Right side Utility buttons */}
            <div className="flex items-center gap-2">
              {/* Camera AR Shortcut (#10 ranking query) */}
              <a
                href="/camera-ruler"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/camera-ruler');
                }}
                className={`hidden md:flex items-center gap-1.5 px-3 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  currentPath === '/camera-ruler'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                title="Measure with Phone Camera or Webcam"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera Ruler</span>
                <span className="text-[8px] bg-emerald-500 text-white px-1 py-0.5 rounded font-black uppercase">
                  Live
                </span>
              </a>

              {/* Viewport Overlay Shortcut (#10.5 ranking query) */}
              <button
                onClick={() => setShowFullRuler(true)}
                id="btn-real-ruler-trigger"
                className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer leading-none"
                title="Launch Full-Screen Multi-Edge Viewport Ruler"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Overlay</span>
              </button>

              {/* Hindi Toggle Switcher */}
              <button
                onClick={() => setShowHindiNotice(!showHindiNotice)}
                className="px-2.5 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="हिन्दी / English"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">हिन्दी</span>
              </button>

              <button
                onClick={toggleTheme}
                id="btn-theme-toggle"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-805 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 transition-colors cursor-pointer"
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

        {/* Hindi Language Expansion Advisory Banner */}
        {showHindiNotice && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 py-3 px-4 text-xs select-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                <span className="font-bold">ऑनलाइन रूलर (Online Ruler in Hindi):</span>
                <span>यह टूल सेंटीमीटर, इंच और मिलीमीटर में 100% सटीक वास्तविक आकार (Actual Size) प्रदान करता है। क्रेडिट कार्ड या सिक्के से कैलिब्रेट करें।</span>
              </div>
              <button
                onClick={() => setShowHindiNotice(false)}
                className="font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
              >
                ✕ बंद करें
              </button>
            </div>
          </div>
        )}

        {/* CALIBRATION WORKSPACE DRAWER SLIDEOUT */}
        {showCalibrationDrawer && (
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 py-3 animate-fadeIn select-none">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <CalibrationWidget
                calibration={calibration}
                onChangeCalibration={handleCalibrationChange}
                onClose={() => setShowCalibrationDrawer(false)}
              />
            </div>
          </div>
        )}

        {/* MAIN BODY CONTENT */}
        <main className="max-w-7xl mx-auto w-full px-4 lg:px-6 py-6 lg:py-8 flex-1 space-y-8">
          
          {/* Header Ad Slot (Fixed Height 90px to prevent CLS) */}
          <section className="min-h-[90px] flex justify-center items-center overflow-hidden">
            <AdBanner adKey="6b6777c4248ba9b31f1a7f8087ca4b49" format="iframe" height={90} width={728} />
          </section>

          {/* HUB-AND-SPOKE TOP NAVIGATION BAR WITH REAL <A HREF> LINKS */}
          <nav aria-label="Measuring Tools Navigation" className="overflow-x-auto select-none no-scrollbar border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-1.5 min-w-[780px] pb-1">
              {[
                { path: '/', label: 'Online Ruler', icon: <Ruler className="w-4 h-4" /> },
                { path: '/online-ruler-inches', label: 'Inches (1/16")', icon: <Ruler className="w-4 h-4 text-indigo-500" /> },
                { path: '/online-ruler-cm', label: 'Centimeters (CM)', icon: <Ruler className="w-4 h-4 text-emerald-500" /> },
                { path: '/online-ruler-mm', label: 'Millimeters (MM)', icon: <Ruler className="w-4 h-4 text-teal-500" /> },
                { path: '/actual-size-ruler', label: 'Actual Size', icon: <Sliders className="w-4 h-4 text-amber-500" /> },
                { path: '/camera-ruler', label: 'Camera AR', icon: <Camera className="w-4 h-4 text-rose-500" /> },
                { path: '/ruler-overlay', label: 'Edge Overlay', icon: <Maximize className="w-4 h-4 text-blue-500" /> },
                { path: '/?tool=protractor', label: 'Protractor', icon: <Compass className="w-4 h-4" /> },
                { path: '/?tool=ring-size', label: 'Ring Sizer', icon: <HelpIcon className="w-4 h-4" /> },
                { path: '/?tool=unit-converter', label: 'Unit Converter', icon: <ArrowLeftRight className="w-4 h-4" /> },
                { path: '/?tool=printable', label: 'Printable PDF', icon: <FileText className="w-4 h-4" /> },
                { path: '/?tool=guides', label: 'Guides Hub', icon: <GraduationCap className="w-4 h-4" /> },
              ].map((item) => {
                const isActive = (item.path === currentPath) || (item.path.includes(`?tool=${activeTab}`) && activeTab !== 'ruler');
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.path);
                    }}
                    className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold transition-all relative border-b-2 leading-none whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-indigo-650 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-extrabold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-250 border-transparent hover:border-zinc-300'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ACTIVE WORKSPACE RENDER CONTAINER */}
          <section id="main-active-workspace-card" className="transition-all duration-300">
            {/* 1. Camera Ruler Spoke Page */}
            {currentPath === '/camera-ruler' && (
              <CameraRuler
                calibration={calibration}
                onOpenCalibration={() => setShowCalibrationDrawer(true)}
              />
            )}

            {/* 2. Full-Screen Ruler Overlay Spoke Page */}
            {currentPath === '/ruler-overlay' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] bg-amber-400 text-neutral-900 px-2 py-0.5 rounded-full font-black uppercase">
                      Ranking #10.5 Query
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Full-Screen Multi-Edge Ruler Overlay
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                      Launches an edge-hugging calibrated viewport overlay along all 4 screen edges with pointer crosshair tracker, multi-axis guidelines, and floating control dock.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFullRuler(true)}
                    className="px-6 py-3 bg-neutral-950 hover:bg-black text-white text-xs font-black rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
                  >
                    Launch Full-Screen Overlay 🚀
                  </button>
                </div>
                {/* Standard fallback ruler in place */}
                <RulerTool
                  calibration={calibration}
                  onOpenCalibration={() => setShowCalibrationDrawer(true)}
                  onOpenRealRuler={() => setShowFullRuler(true)}
                  initialUnit="cm"
                  initialMode="dual"
                  pageTitle="Ruler Overlay — 4-Edge Viewport Measuring Tool"
                  pageSubtitle="Measure physical items or on-screen elements with full viewport crosshairs."
                />
              </div>
            )}

            {/* 3. Trust Pages (About, Contact, Privacy, Terms, Disclaimer, Widget) */}
            {isTrustPage && (
              <TrustPages
                pageType={currentPath.replace('/', '') as any}
                onNavigateHome={() => navigateTo('/')}
              />
            )}

            {/* 4. Specialized Tools (Protractor, Ring Sizer, Grid, Unit Converter, Printable, Guides) */}
            {!isTrustPage && currentPath === '/' && activeTab === 'protractor' && (
              <ProtractorTool />
            )}

            {!isTrustPage && currentPath === '/' && activeTab === 'ring-size' && (
              <RingSizerTool
                calibration={calibration}
                onOpenCalibration={() => setShowCalibrationDrawer(true)}
              />
            )}

            {!isTrustPage && currentPath === '/' && activeTab === 'grid' && (
              <GridTool calibration={calibration} />
            )}

            {!isTrustPage && currentPath === '/' && activeTab === 'unit-converter' && (
              <UnitConverterTool calibration={calibration} />
            )}

            {!isTrustPage && currentPath === '/' && activeTab === 'printable' && (
              <PrintableRulerTool />
            )}

            {!isTrustPage && currentPath === '/' && activeTab === 'guides' && (
              <GuidesHub />
            )}

            {/* 5. Ruler Tool (Default Hub & Spoke Pages: inches, cm, mm, actual-size, screen-ruler, etc.) */}
            {!isTrustPage && currentPath !== '/camera-ruler' && currentPath !== '/ruler-overlay' && activeTab === 'ruler' && (
              <RulerTool
                calibration={calibration}
                onOpenCalibration={() => setShowCalibrationDrawer(true)}
                onOpenRealRuler={() => setShowFullRuler(true)}
                initialUnit={pageConfig ? pageConfig.defaultUnit : 'cm'}
                initialMode={pageConfig ? pageConfig.defaultMode : 'dual'}
                pageTitle={pageConfig ? pageConfig.h1 : 'Online Ruler — Accurate Actual Size Screen Measure Tool'}
                pageSubtitle={pageConfig ? pageConfig.summary : 'Calibrated 100% true-to-scale physical screen ruler in inches, centimeters, and millimeters.'}
              />
            )}
          </section>

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
                  document.getElementById('calibration-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
                id="footer-action-calibrate"
                className="bg-white hover:bg-zinc-100 text-indigo-900 border-none font-bold text-xs py-2.5 px-5 rounded-lg shadow-sm whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-white shrink-0 cursor-pointer"
              >
                Calibrate Now (10 Seconds)
              </button>
            </div>
          )}

          {/* COMPREHENSIVE DYNAMIC SEO & E-E-A-T SECTION */}
          {!isTrustPage && (
            <SeoContentSection
              config={pageConfig}
              onOpenCalibration={() => {
                setShowCalibrationDrawer(true);
                document.getElementById('calibration-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenRealRuler={() => setShowFullRuler(true)}
            />
          )}

        </main>

        {/* POLISHED LANDING PAGE FOOTER WITH HUB-AND-SPOKE CRAWLABLE ARCHITECTURE */}
        <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-zinc-500 py-12 mt-12 select-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 leading-relaxed text-xs">
            
            {/* Column A: Purpose & Stats */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950 rounded flex items-center justify-center text-indigo-650 dark:text-indigo-400">
                  <Ruler className="w-4 h-4 stroke-[2.5]" />
                </div>
                <strong className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">RuleScale Measuring Suite</strong>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed max-w-sm">
                The world&apos;s most accurate online ruler and virtual screen measure tool. Calibrated against ISO/IEC bank cards and verified coins for guaranteed 1:1 true physical scale.
              </p>
              <div className="text-[10px] text-zinc-400 font-mono space-y-0.5">
                <div>Active Scale: <strong className="text-indigo-600 dark:text-indigo-400">{calibration.ppi} DPI Resolution</strong></div>
                <div>Author: <strong>{E_E_A_T_AUTHOR.name}</strong> ({E_E_A_T_AUTHOR.organization})</div>
              </div>
            </div>

            {/* Column B: Metric & Imperial Spoke Pages */}
            <div className="md:col-span-3 space-y-2.5">
              <strong className="text-zinc-850 dark:text-zinc-250 font-bold block">Units &amp; Precision Spokes:</strong>
              <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="/online-ruler-inches" onClick={(e) => { e.preventDefault(); navigateTo('/online-ruler-inches'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Online Ruler in Inches (1/16&quot;)
                  </a>
                </li>
                <li>
                  <a href="/online-ruler-cm" onClick={(e) => { e.preventDefault(); navigateTo('/online-ruler-cm'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Centimeter Ruler Online (CM)
                  </a>
                </li>
                <li>
                  <a href="/online-ruler-mm" onClick={(e) => { e.preventDefault(); navigateTo('/online-ruler-mm'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Millimeter Caliper Ruler (MM)
                  </a>
                </li>
                <li>
                  <a href="/actual-size-ruler" onClick={(e) => { e.preventDefault(); navigateTo('/actual-size-ruler'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Actual Size Ruler (Calibrated)
                  </a>
                </li>
                <li>
                  <a href="/1-cm-on-screen" onClick={(e) => { e.preventDefault(); navigateTo('/1-cm-on-screen'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • 1 CM Visualised on Screen
                  </a>
                </li>
                <li>
                  <a href="/1-inch-on-screen" onClick={(e) => { e.preventDefault(); navigateTo('/1-inch-on-screen'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • 1 Inch on Screen Actual Size
                  </a>
                </li>
              </ul>
            </div>

            {/* Column C: Camera & Device Spokes */}
            <div className="md:col-span-3 space-y-2.5">
              <strong className="text-zinc-850 dark:text-zinc-250 font-bold block">Camera &amp; Screen Tools:</strong>
              <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="/camera-ruler" onClick={(e) => { e.preventDefault(); navigateTo('/camera-ruler'); }} className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
                    • Camera Ruler AR (Ranked #10)
                  </a>
                </li>
                <li>
                  <a href="/ruler-overlay" onClick={(e) => { e.preventDefault(); navigateTo('/ruler-overlay'); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    • Full-Screen Ruler Overlay (#10.5)
                  </a>
                </li>
                <li>
                  <a href="/screen-ruler" onClick={(e) => { e.preventDefault(); navigateTo('/screen-ruler'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Interactive Screen Ruler
                  </a>
                </li>
                <li>
                  <a href="/digital-ruler" onClick={(e) => { e.preventDefault(); navigateTo('/digital-ruler'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Digital Vernier Readout Ruler
                  </a>
                </li>
                <li>
                  <a href="/ruler-for-phone" onClick={(e) => { e.preventDefault(); navigateTo('/ruler-for-phone'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Ruler for Phone (Touch-Drag)
                  </a>
                </li>
                <li>
                  <a href="/ruler-for-laptop" onClick={(e) => { e.preventDefault(); navigateTo('/ruler-for-laptop'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Computer Ruler for Laptop (#16)
                  </a>
                </li>
              </ul>
            </div>

            {/* Column D: E-E-A-T & Trust Pages */}
            <div className="md:col-span-2 space-y-2.5">
              <strong className="text-zinc-850 dark:text-zinc-250 font-bold block">Trust &amp; Metrology:</strong>
              <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('/about'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • About RuleScale
                  </a>
                </li>
                <li>
                  <a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Contact Engineering
                  </a>
                </li>
                <li>
                  <a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('/privacy'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Privacy (Zero Uploads)
                  </a>
                </li>
                <li>
                  <a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('/terms'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigateTo('/disclaimer'); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    • Accuracy Disclaimer
                  </a>
                </li>
                <li>
                  <a href="/ruler-widget" onClick={(e) => { e.preventDefault(); navigateTo('/ruler-widget'); }} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                    • Embed Ruler Widget &lt;/&gt;
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Metrology Attribution */}
          <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-400 font-medium tracking-wider">
            <span>© 2026 RuleScale • Murata Design Inc. • ISO/IEC 7810 Scale Standards</span>
            <span>100% Client-Side In-Browser Metrology Technology</span>
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
