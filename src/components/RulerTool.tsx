/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Ruler, Smartphone, Hash, ArrowLeftRight, ArrowUpDown, Copy, Trash, Sparkles } from 'lucide-react';
import { CalibrationData } from '../types';

interface RulerToolProps {
  calibration: CalibrationData;
  onOpenCalibration: () => void;
  onOpenRealRuler?: () => void;
}

type RulerTheme = 'wood' | 'steel' | 'glass' | 'yellow';
type RulerUnit = 'cm' | 'mm' | 'inch' | 'px';
type RulerMode = 'dual' | 'cm' | 'inch' | 'px';

interface CustomGuideline {
  id: string;
  posPx: number;
}

export default function RulerTool({ calibration, onOpenCalibration, onOpenRealRuler }: RulerToolProps) {
  // Config state
  const [unit, setUnit] = useState<RulerUnit>('cm');
  const [activeTheme, setActiveTheme] = useState<RulerTheme>('steel');
  const [rulerMode, setRulerMode] = useState<RulerMode>('dual');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showGuides, setShowGuides] = useState<boolean>(true);
  
  // Interactive caliper sliders (for relative bounds measurement)
  const [guideA, setGuideA] = useState<number>(120);
  const [guideB, setGuideB] = useState<number>(380);
  const [draggingGuide, setDraggingGuide] = useState<'A' | 'B' | null>(null);

  // Custom persistent dropped guidelines
  const [customGuidelines, setCustomGuidelines] = useState<CustomGuideline[]>([]);

  // Hover coordinate tracking
  const [hoverPosPx, setHoverPosPx] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showHoverGuide, setShowHoverGuide] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [didInitGuides, setDidInitGuides] = useState<boolean>(false);

  // Measure container using ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    resizeObserver.observe(container);

    const rect = container.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Initialize and bounds-guard relative caliper guides
  useEffect(() => {
    const length = layout === 'vertical' ? containerSize.height : containerSize.width;
    if (length > 0) {
      if (!didInitGuides) {
        setGuideA(Math.round(length * 0.25));
        setGuideB(Math.round(length * 0.75));
        setDidInitGuides(true);
      } else {
        setGuideA((prev) => Math.max(0, Math.min(prev, length)));
        setGuideB((prev) => Math.max(0, Math.min(prev, length)));
      }
    }
  }, [containerSize, layout, didInitGuides]);

  // Adjust guidance lock on layout flip
  useEffect(() => {
    setDidInitGuides(false);
  }, [layout]);

  // Convert pixels to display values
  const pxToValue = (px: number, targetUnit: RulerUnit) => {
    const inches = px / calibration.ppi;
    switch (targetUnit) {
      case 'cm':
        return inches * 2.54;
      case 'mm':
        return inches * 25.4;
      case 'inch':
        return inches;
      case 'px':
      default:
        return px;
    }
  };

  // Human fractional display formatter for inches
  const formatValue = (val: number, targetUnit: RulerUnit) => {
    if (targetUnit === 'inch') {
      const whole = Math.floor(val);
      const frac = val - whole;
      const nearest16th = Math.round(frac * 16);
      
      if (nearest16th === 0) return whole > 0 ? `${whole}"` : '0"';
      if (nearest16th === 16) return `${whole + 1}"`;
      
      let num = nearest16th;
      let den = 16;
      const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
      const divisor = gcd(num, den);
      num /= divisor;
      den /= divisor;
      
      return whole > 0 ? `${whole} ${num}/${den}"` : `${num}/${den}"`;
    }
    return `${val.toFixed(2)} ${targetUnit}`;
  };

  // Relative distance of active calipers
  const distancePx = Math.abs(guideB - guideA);
  const distanceVal = pxToValue(distancePx, unit);
  const distanceFormatted = formatValue(distanceVal, unit);

  // Clipboard utility
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(distanceFormatted);
  };

  // Caliper drags
  const handleCaliperPointerDown = (guide: 'A' | 'B', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingGuide(guide);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingGuide || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newPos = 0;
    
    if (layout === 'vertical') {
      newPos = e.clientY - rect.top;
      newPos = Math.max(0, Math.min(newPos, rect.height));
    } else {
      newPos = e.clientX - rect.left;
      newPos = Math.max(0, Math.min(newPos, rect.width));
    }
    
    if (draggingGuide === 'A') {
      setGuideA(Math.round(newPos));
    } else {
      setGuideB(Math.round(newPos));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingGuide) {
      setDraggingGuide(null);
    }
  };

  // Main interactive page coordinates tracker
  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    let posPx = 0;
    if (layout === 'vertical') {
      posPx = e.clientY - rect.top;
    } else {
      posPx = e.clientX - rect.left;
    }
    
    const length = layout === 'vertical' ? rect.height : rect.width;
    if (posPx >= 0 && posPx <= length) {
      setHoverPosPx(Math.round(posPx));
      setIsHovering(true);
    } else {
      setIsHovering(false);
      setHoverPosPx(null);
    }
    
    if (draggingGuide) {
      handlePointerMove(e);
    }
  };

  const handleContainerPointerLeave = () => {
    setIsHovering(false);
    setHoverPosPx(null);
    if (draggingGuide) {
      setDraggingGuide(null);
    }
  };

  // Persistent guideline dropper click trigger
  const handleRulerBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent marking drop if clicked on child handles
    const target = e.target as HTMLElement;
    if (target.closest('.interactive-noclick') || draggingGuide) {
      return;
    }
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let posPx = 0;
    if (layout === 'vertical') {
      posPx = e.clientY - rect.top;
    } else {
      posPx = e.clientX - rect.left;
    }
    
    const length = layout === 'vertical' ? rect.height : rect.width;
    if (posPx < 0 || posPx > length) return;
    
    const roundedPos = Math.round(posPx);
    if (customGuidelines.some(g => g.posPx === roundedPos)) return;
    
    const id = `guide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setCustomGuidelines(prev => [...prev, { id, posPx: roundedPos }].sort((a, b) => a.posPx - b.posPx));
  };

  // Retrieve theme values for active ruler configuration
  const getThemeClass = () => {
    switch (activeTheme) {
      case 'wood':
        return {
          rulerBg: 'bg-[#F2DFC1] text-amber-950 border-[#D4C3A3] shadow-md dark:shadow-none',
          woodGrain: 'after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] after:from-amber-600/5 after:via-transparent after:to-amber-950/20 after:pointer-events-none',
          edgeTop: 'border-t-4 border-[#CFAF7B]',
          tickColor: 'bg-zinc-800/80',
          textColor: 'text-zinc-800 font-mono font-medium',
          textColorBright: 'text-amber-950',
          svgTick: 'rgba(120, 53, 4, 0.7)',
          svgText: 'fill-amber-950 font-semibold',
          svgTextFont: 'font-mono'
        };
      case 'steel':
        return {
          rulerBg: 'bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-800 text-zinc-900 dark:text-zinc-50 border-zinc-350 dark:border-zinc-700 shadow-md',
          woodGrain: 'after:absolute after:inset-0 after:bg-linear-to-b after:from-white/10 after:to-black/5 after:pointer-events-none shadow-inner',
          edgeTop: 'border-t-4 border-zinc-400 dark:border-zinc-500',
          tickColor: 'bg-zinc-950 dark:bg-zinc-300',
          textColor: 'text-zinc-900 dark:text-zinc-200 font-sans font-semibold',
          textColorBright: 'text-indigo-600 dark:text-indigo-400',
          svgTick: 'rgba(39, 39, 42, 0.8)',
          svgText: 'fill-zinc-800 dark:fill-zinc-200 font-medium',
          svgTextFont: 'font-sans'
        };
      case 'glass':
        return {
          rulerBg: 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-805 shadow-xl',
          woodGrain: 'shadow-md shadow-zinc-200/30',
          edgeTop: 'border-t-4 border-indigo-500/50',
          tickColor: 'bg-indigo-600 dark:bg-indigo-400',
          textColor: 'text-indigo-900 dark:text-zinc-100 font-sans',
          textColorBright: 'text-indigo-600 dark:text-indigo-400',
          svgTick: 'rgba(79, 70, 229, 0.7)',
          svgText: 'fill-indigo-950 dark:fill-indigo-300 font-medium',
          svgTextFont: 'font-sans'
        };
      case 'yellow':
      default:
        return {
          rulerBg: 'bg-[#FFE066] text-amber-950 border-[#E4C54B] shadow-md dark:shadow-none',
          woodGrain: 'after:absolute after:inset-0 after:bg-linear-to-r after:from-white/5 after:to-black/5 after:pointer-events-none shadow-inner',
          edgeTop: 'border-t-4 border-[#D9B51E]',
          tickColor: 'bg-zinc-950',
          textColor: 'text-zinc-950 font-sans font-bold',
          textColorBright: 'text-red-700',
          svgTick: 'rgba(0, 0, 0, 0.85)',
          svgText: 'fill-zinc-950 font-bold',
          svgTextFont: 'font-sans'
        };
    }
  };

  const themeDesign = getThemeClass();

  // Vector SVG ticks generator loop
  const renderTicksSvg = () => {
    if (containerSize.width === 0 || containerSize.height === 0) return null;
    
    const ppi = calibration.ppi;
    const length = layout === 'vertical' ? containerSize.height : containerSize.width;
    const thickness = layout === 'vertical' ? containerSize.width : containerSize.height;
    
    const elements: React.JSX.Element[] = [];

    // Helper functions for centimeter scale drawing
    const drawCmScale = (isFirstEdge: boolean) => {
      const mmPx = ppi / 25.4;
      const maxMm = Math.floor(length / mmPx);
      const scaleLines: React.JSX.Element[] = [];
      
      for (let i = 0; i <= maxMm; i++) {
        const posPx = i * mmPx;
        const isCm = i % 10 === 0;
        const isHalfCm = i % 5 === 0 && !isCm;
        
        const tickLen = isCm ? 25 : isHalfCm ? 16 : 8;
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        
        if (layout === 'horizontal') {
          x1 = posPx;
          x2 = posPx;
          if (isFirstEdge) {
            y1 = 0;
            y2 = tickLen;
          } else {
            y1 = thickness;
            y2 = thickness - tickLen;
          }
        } else {
          y1 = posPx;
          y2 = posPx;
          if (isFirstEdge) {
            x1 = 0;
            x2 = tickLen;
          } else {
            x1 = thickness;
            x2 = thickness - tickLen;
          }
        }
        
        scaleLines.push(
          <line
            key={`cm-tick-${isFirstEdge ? 'f' : 's'}-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={themeDesign.svgTick}
            strokeWidth={isCm ? 1.5 : 1}
          />
        );
        
        if (isCm) {
          const cmVal = i / 10;
          let tx = 0, ty = 0;
          let anchor = "middle";
          let baseline = "middle";
          
          if (layout === 'horizontal') {
            tx = posPx;
            if (isFirstEdge) {
              ty = tickLen + 10;
              baseline = "hanging";
            } else {
              ty = thickness - tickLen - 12;
              baseline = "alphabetic";
            }
          } else {
            ty = posPx;
            if (isFirstEdge) {
              tx = tickLen + 7;
              anchor = "start";
            } else {
              tx = thickness - tickLen - 7;
              anchor = "end";
            }
          }
          
          scaleLines.push(
            <text
              key={`cm-lbl-${isFirstEdge ? 'f' : 's'}-${cmVal}`}
              x={tx}
              y={ty}
              className={`text-[9px] sm:text-[10px] select-none ${themeDesign.svgText} ${themeDesign.svgTextFont}`}
              textAnchor={anchor}
              alignmentBaseline={baseline as any}
              style={{ userSelect: 'none' }}
            >
              {cmVal}
            </text>
          );
        }
      }
      return scaleLines;
    };
    
    // Helper functions for Inch scale drawing
    const drawInchScale = (isFirstEdge: boolean) => {
      const inch16thPx = ppi / 16;
      const max16ths = Math.floor(length / inch16thPx);
      const scaleLines: React.JSX.Element[] = [];
      
      for (let i = 0; i <= max16ths; i++) {
        const posPx = i * inch16thPx;
        const fraction = i % 16;
        
        let tickLen = 5;
        if (fraction === 0) tickLen = 25;
        else if (fraction === 8) tickLen = 18;
        else if (fraction % 4 === 0) tickLen = 13;
        else if (fraction % 2 === 0) tickLen = 9;
        
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        
        if (layout === 'horizontal') {
          x1 = posPx;
          x2 = posPx;
          if (isFirstEdge) {
            y1 = 0;
            y2 = tickLen;
          } else {
            y1 = thickness;
            y2 = thickness - tickLen;
          }
        } else {
          y1 = posPx;
          y2 = posPx;
          if (isFirstEdge) {
            x1 = 0;
            x2 = tickLen;
          } else {
            x1 = thickness;
            x2 = thickness - tickLen;
          }
        }
        
        scaleLines.push(
          <line
            key={`in-tick-${isFirstEdge ? 'f' : 's'}-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={themeDesign.svgTick}
            strokeWidth={fraction === 0 ? 1.5 : fraction % 8 === 0 ? 1.2 : 0.8}
          />
        );
        
        if (fraction === 0) {
          const inchVal = i / 16;
          let tx = 0, ty = 0;
          let anchor = "middle";
          let baseline = "middle";
          
          if (layout === 'horizontal') {
            tx = posPx;
            if (isFirstEdge) {
              ty = tickLen + 10;
              baseline = "hanging";
            } else {
              ty = thickness - tickLen - 12;
              baseline = "alphabetic";
            }
          } else {
            ty = posPx;
            if (isFirstEdge) {
              tx = tickLen + 7;
              anchor = "start";
            } else {
              tx = thickness - tickLen - 7;
              anchor = "end";
            }
          }
          
          scaleLines.push(
            <text
              key={`in-lbl-${isFirstEdge ? 'f' : 's'}-${inchVal}`}
              x={tx}
              y={ty}
              className={`text-[9px] sm:text-[10px] select-none ${themeDesign.svgText} ${themeDesign.svgTextFont}`}
              textAnchor={anchor}
              alignmentBaseline={baseline as any}
              style={{ userSelect: 'none' }}
            >
              {inchVal}
            </text>
          );
        }
      }
      return scaleLines;
    };
    
    // Helper functions for Pixel scale drawing
    const drawPxScale = (isFirstEdge: boolean) => {
      const step = 10;
      const maxTicks = Math.floor(length / step);
      const scaleLines: React.JSX.Element[] = [];
      
      for (let i = 0; i <= maxTicks; i++) {
        const posPx = i * step;
        const is100 = i % 10 === 0;
        const is50 = i % 5 === 0 && !is100;
        
        const tickLen = is100 ? 22 : is50 ? 13 : 6;
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        
        if (layout === 'horizontal') {
          x1 = posPx;
          x2 = posPx;
          if (isFirstEdge) {
            y1 = 0;
            y2 = tickLen;
          } else {
            y1 = thickness;
            y2 = thickness - tickLen;
          }
        } else {
          y1 = posPx;
          y2 = posPx;
          if (isFirstEdge) {
            x1 = 0;
            x2 = tickLen;
          } else {
            x1 = thickness;
            x2 = thickness - tickLen;
          }
        }
        
        scaleLines.push(
          <line
            key={`px-tick-${isFirstEdge ? 'f' : 's'}-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={themeDesign.svgTick}
            strokeWidth={is100 ? 1.5 : 1}
          />
        );
        
        if (is100) {
          const pxVal = i * step;
          let tx = 0, ty = 0;
          let anchor = "middle";
          let baseline = "middle";
          
          if (layout === 'horizontal') {
            tx = posPx;
            if (isFirstEdge) {
              ty = tickLen + 10;
              baseline = "hanging";
            } else {
              ty = thickness - tickLen - 12;
              baseline = "alphabetic";
            }
          } else {
            ty = posPx;
            if (isFirstEdge) {
              tx = tickLen + 7;
              anchor = "start";
            } else {
              tx = thickness - tickLen - 7;
              anchor = "end";
            }
          }
          
          scaleLines.push(
            <text
              key={`px-lbl-${isFirstEdge ? 'f' : 's'}-${pxVal}`}
              x={tx}
              y={ty}
              className={`text-[8px] font-mono select-none ${themeDesign.svgText}`}
              textAnchor={anchor}
              alignmentBaseline={baseline as any}
              style={{ userSelect: 'none' }}
            >
              {pxVal}
            </text>
          );
        }
      }
      return scaleLines;
    };

    if (rulerMode === 'dual') {
      elements.push(...drawCmScale(true));
      elements.push(...drawInchScale(false));
    } else if (rulerMode === 'cm') {
      elements.push(...drawCmScale(true));
      elements.push(...drawCmScale(false));
    } else if (rulerMode === 'inch') {
      elements.push(...drawInchScale(true));
      elements.push(...drawInchScale(false));
    } else if (rulerMode === 'px') {
      elements.push(...drawPxScale(true));
      elements.push(...drawPxScale(false));
    }
    
    return <>{elements}</>;
  };

  // Generate hovering tooltip metrics card
  const renderHoverTooltip = () => {
    if (hoverPosPx === null || !isHovering || draggingGuide || !showHoverGuide) return null;
    
    const valCm = pxToValue(hoverPosPx, 'cm');
    const valInch = pxToValue(hoverPosPx, 'inch');
    const valFormattedCm = formatValue(valCm, 'cm');
    const valFormattedInch = formatValue(valInch, 'inch');
    
    const isVerticalLayout = layout === 'vertical';
    const totalLength = isVerticalLayout ? containerSize.height : containerSize.width;
    const thickness = isVerticalLayout ? containerSize.width : containerSize.height;
    
    const safeLeft = isVerticalLayout 
      ? Math.max(120, Math.min(thickness / 2, thickness - 120)) 
      : Math.max(100, Math.min(hoverPosPx, totalLength - 100));

    const safeTop = isVerticalLayout 
      ? Math.max(100, Math.min(hoverPosPx, totalLength - 100)) 
      : Math.max(70, Math.min(thickness / 2, thickness - 70));
      
    return (
      <div 
        style={{
          left: `${safeLeft}px`,
          top: `${safeTop}px`,
        }}
        className="absolute z-40 bg-zinc-900/95 dark:bg-zinc-950/95 border border-zinc-800 text-zinc-100 rounded-lg p-2 shadow-xl pointer-events-none select-none -translate-x-1/2 -translate-y-1/2 text-center min-w-[150px] leading-tight flex flex-col gap-0.5"
      >
        <span className="text-[9px] uppercase font-bold text-teal-400 tracking-wider">Hover Position</span>
        <div className="font-mono text-xs font-semibold">{valFormattedCm}</div>
        <div className="font-mono text-xs text-amber-300 font-semibold">{valFormattedInch}</div>
        <span className="text-[8px] text-zinc-400 font-mono">({hoverPosPx} px)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Promotion banner for Full-Screen Edge Ruler */}
      {onOpenRealRuler && (
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn border border-blue-500/10">
          <div className="flex gap-4 items-start text-center md:text-left">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <Ruler className="w-6 h-6 stroke-[2.2] text-amber-300" />
            </div>
            <div>
              <span className="inline-block text-[10px] bg-amber-400 text-neutral-900 px-2 py-0.5 rounded-full font-black uppercase tracking-wider mb-1">
                Advanced Replica Tool
              </span>
              <strong className="block text-base md:text-lg font-black tracking-tight">
                Try the Immersive Full-Screen Edge Ruler Overlay
              </strong>
              <p className="text-xs text-blue-100 opacity-90 mt-1 leading-relaxed max-w-xl">
                Exact replica of <span className="underline font-bold decoration-amber-350 decoration-2">realonlineruler.com</span>. Toggles rulers along all four screen edges, featuring click-to-drop draggable guides, pointer-crosshair coordinates tracker, and convenient keyboard shortcuts.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenRealRuler}
            id="banner-btn-real-ruler"
            className="panel-click-intercept shrink-0 w-full md:w-auto px-5 py-2.5 bg-neutral-950 hover:bg-black text-white font-bold text-xs rounded-xl shadow-lg transition-all border border-neutral-800 tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 duration-150"
          >
            Launch Full-Screen View 🚀
          </button>
        </div>
      )}
      
      {/* Mobile safety layout info badge */}
      <div className="block md:hidden bg-amber-50 dark:bg-amber-900/15 border-l-4 border-amber-500 p-3.5 rounded-r-xl max-w-4xl mx-auto shadow-xs">
        <div className="flex gap-2.5 items-start">
          <Smartphone className="w-5 h-5 text-amber-605 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-xs text-amber-900 dark:text-amber-200">Mobile Aspect & Proportions Notice</span>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5 leading-snug">
              To measure physical units (centimeters or inches) exactly matching display sizes, avoid page zooming. Tap the Calibration Settings button to fit presets for your specific device model!
            </p>
          </div>
        </div>
      </div>

      {/* Primary Ruler Action Dashboard */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-4 select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Display Mode Switcher */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Ruler Layout Scales
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800/80 border dark:border-zinc-700">
              <button
                onClick={() => { setRulerMode('dual'); setUnit('cm'); }}
                className={`py-1 px-2.5 text-[11px] font-bold rounded-md transition-all ${
                  rulerMode === 'dual'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250'
                }`}
              >
                Dual (cm + in)
              </button>
              <button
                onClick={() => { setRulerMode('cm'); setUnit('cm'); }}
                className={`py-1 px-2.5 text-[11px] font-bold rounded-md transition-all ${
                  rulerMode === 'cm'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250'
                }`}
              >
                Cm / Mm
              </button>
              <button
                onClick={() => { setRulerMode('inch'); setUnit('inch'); }}
                className={`py-1 px-2.5 text-[11px] font-bold rounded-md transition-all ${
                  rulerMode === 'inch'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => { setRulerMode('px'); setUnit('px'); }}
                className={`py-1 px-2.5 text-[11px] font-bold rounded-md transition-all ${
                  rulerMode === 'px'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-250'
                }`}
              >
                Pixels
              </button>
            </div>
          </div>

          {/* Aesthetic Theme Controller */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Ruler Material Vibe
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800/80 border dark:border-zinc-700">
              <button
                onClick={() => setActiveTheme('yellow')}
                className={`py-1 px-2 text-[11px] font-bold rounded-md transition-all ${
                  activeTheme === 'yellow'
                    ? 'bg-white dark:bg-zinc-700 text-amber-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200'
                }`}
              >
                Classic Yellow
              </button>
              <button
                onClick={() => setActiveTheme('steel')}
                className={`py-1 px-1.5 text-[11px] font-bold rounded-md transition-all ${
                  activeTheme === 'steel'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200'
                }`}
              >
                Modern Steel
              </button>
              <button
                onClick={() => setActiveTheme('wood')}
                className={`py-1 px-1.5 text-[11px] font-bold rounded-md transition-all ${
                  activeTheme === 'wood'
                    ? 'bg-white dark:bg-zinc-700 text-amber-800 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200'
                }`}
              >
                Warm Wood
              </button>
              <button
                onClick={() => setActiveTheme('glass')}
                className={`py-1 px-1.5 text-[11px] font-bold rounded-md transition-all ${
                  activeTheme === 'glass'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200'
                }`}
              >
                Glass Glow
              </button>
            </div>
          </div>

          {/* Orientation selectors */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Orientation Angle
            </span>
            <div className="grid grid-cols-2 gap-1.5 rounded-lg p-1 bg-zinc-100 dark:bg-zinc-800/80 border dark:border-zinc-700 h-[58px]">
              <button
                onClick={() => setLayout('horizontal')}
                className={`flex justify-center items-center gap-1.5 py-1 px-2.5 text-[11px] font-bold rounded-md transition-all ${
                  layout === 'horizontal'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-805 dark:hover:text-zinc-200'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
                Horizontal
              </button>
              <button
                onClick={() => setLayout('vertical')}
                className={`flex justify-center items-center gap-1.5 py-1 px-2.5 text-[11px] font-bold rounded-md transition-all ${
                  layout === 'vertical'
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-805 dark:hover:text-zinc-200'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
                Vertical
              </button>
            </div>
          </div>

          {/* Guidelines toggler toggling overlays */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Interactivity Overlays
            </span>
            <div className="grid grid-cols-2 gap-1.5 h-[58px]">
              <button
                onClick={() => setShowGuides(prev => !prev)}
                className={`flex flex-col items-center justify-center p-1 border rounded-lg text-[10px] font-bold transition-all leading-tight ${
                  showGuides
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-805'
                    : 'bg-white dark:bg-zinc-900 border-zinc-205 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                <Hash className="w-4 h-4 mb-0.5" />
                <span>{showGuides ? 'Caliper [ON]' : 'Caliper [OFF]'}</span>
              </button>
              <button
                onClick={() => setShowHoverGuide(prev => !prev)}
                className={`flex flex-col items-center justify-center p-1 border rounded-lg text-[10px] font-bold transition-all leading-tight ${
                  showHoverGuide
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-805'
                    : 'bg-white dark:bg-zinc-900 border-zinc-205 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50'
                }`}
              >
                <Sparkles className="w-4 h-4 mb-0.5" />
                <span>{showHoverGuide ? 'Hover Line [ON]' : 'Hover Line [OFF]'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* HUD control line for persistent guidelines marker drops */}
        {customGuidelines.length > 0 && (
          <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/60 transition-all">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse shrink-0"></span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Active dropped guidelines: <strong>{customGuidelines.length} point markers</strong>
              </span>
            </div>
            <button
              onClick={() => setCustomGuidelines([])}
              className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline font-bold"
            >
              <Trash className="w-3.5 h-3.5" />
              Clear All Drop Markers
            </button>
          </div>
        )}
      </div>

      {/* Floating Measurement HUD (relative calipers values) */}
      {showGuides && (
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 items-center justify-between p-4 bg-zinc-900 text-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-1 px-2.5 bg-indigo-600 text-white rounded-md text-[10px] font-bold tracking-wider uppercase">
              Caliper Bounds (A to B)
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 block font-normal leading-none mb-1">Caliper Relative Distance:</span>
              <strong className="text-base lg:text-lg text-white font-mono tracking-tight font-extrabold">{distanceFormatted}</strong>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-xs text-zinc-400 font-mono">
            {unit !== 'cm' && <span>Cm: {pxToValue(distancePx, 'cm').toFixed(1)} cm</span>}
            {unit !== 'mm' && <span>Mm: {Math.round(pxToValue(distancePx, 'mm'))} mm</span>}
            {unit !== 'inch' && <span>Inch: {pxToValue(distancePx, 'inch').toFixed(3)}"</span>}
            {unit !== 'px' && <span>Pixels: {distancePx} px</span>}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyToClipboard}
              id="copy-caliper-value"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-lg text-xs font-bold transition-colors select-none"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Distance
            </button>
            <button
              onClick={() => {
                const center = (layout === 'vertical' ? (containerSize.height || 600) : (containerSize.width || 1024)) / 2;
                setGuideA(Math.round(center - 60));
                setGuideB(Math.round(center + 60));
              }}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-305 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
            >
              Reset Calipers
            </button>
          </div>
        </div>
      )}

      {/* Main Ruler Stage canvas wrapper */}
      <div 
        ref={containerRef}
         onPointerMove={handleContainerPointerMove}
         onPointerUp={handlePointerUp}
         onPointerLeave={handleContainerPointerLeave}
        onClick={handleRulerBodyClick}
        className={`relative w-full border rounded-2xl overflow-hidden shadow-md select-none transition-all duration-300 ${
          layout === 'vertical' 
            ? 'h-[620px] max-w-[280px] sm:max-w-xs mx-auto' 
            : 'h-[175px] max-w-5xl mx-auto'
        } ${themeDesign.rulerBg} ${themeDesign.edgeTop}`}
        id="ruler-display-stage"
      >
        {/* Grain visual shading simulation mask */}
        <div className={`absolute inset-0 z-0 ${themeDesign.woodGrain}`}></div>

        {/* Center Guide Labeling Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-1 opacity-20">
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] font-sans text-center px-4">
            {rulerMode === 'dual' ? 'DUAL SCALE MEASURE: CM (TOP) • INCHES (BOTTOM)' : `METRIC SCALE: ${rulerMode.toUpperCase()}`}
          </span>
          <span className="text-[8px] tracking-wide block mt-1 uppercase font-mono">
            Click directly anywhere on ruler surface to drop persistent marker bounds
          </span>
        </div>

        {/* Clickable Background surface canvas intercept */}
        <div className="absolute inset-0 z-5 cursor-crosshair" />

        {/* Scalar Ticks SVG Vector layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-10">
          {renderTicksSvg()}
        </svg>

        {/* Live coordinate helper hovering line */}
        {isHovering && hoverPosPx !== null && !draggingGuide && showHoverGuide && (
          <div
            style={layout === 'vertical' ? { top: `${hoverPosPx}px` } : { left: `${hoverPosPx}px` }}
            className={`absolute z-20 pointer-events-none bg-rose-500/80 ${
              layout === 'vertical' ? 'left-0 right-0 h-[1.5px]' : 'top-0 bottom-0 w-[1.5px]'
            }`}
          />
        )}

        {/* Floating Tooltip info widget for tracking */}
        {renderHoverTooltip()}

        {/* Custom Persistent Dropped Guideline Vectors */}
        {customGuidelines.map((g) => {
          const valCm = pxToValue(g.posPx, 'cm');
          const valInch = pxToValue(g.posPx, 'inch');
          
          if (layout === 'horizontal') {
            return (
              <div
                key={`line-${g.id}`}
                style={{ left: `${g.posPx}px` }}
                className="absolute inset-y-0 w-px border-l-2 border-dashed border-teal-500/60 z-15 pointer-events-none"
              >
                {/* Floating Badge close interaction pill */}
                <div 
                  className="interactive-noclick absolute bottom-8 left-1/2 -translate-x-1/2 bg-teal-600/95 dark:bg-teal-750/95 text-[9px] text-white font-mono font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-auto flex items-center gap-1 whitespace-nowrap z-20"
                >
                  <span>{valCm.toFixed(1)} cm / {formatValue(valInch, 'inch')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setCustomGuidelines(prev => prev.filter(item => item.id !== g.id));
                    }}
                    className="w-3.5 h-3.5 rounded-full bg-teal-800 hover:bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white transition-colors animate-fadeIn"
                    title="Remove guideline"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={`line-${g.id}`}
                style={{ top: `${g.posPx}px` }}
                className="absolute inset-x-0 h-px border-t-2 border-dashed border-teal-500/60 z-15 pointer-events-none"
              >
                {/* Badge layout for vertical bounds */}
                <div 
                  className="interactive-noclick absolute right-8 top-1/2 -translate-y-1/2 bg-teal-600/95 dark:bg-teal-750/95 text-[9px] text-white font-mono font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-auto flex items-center gap-1 whitespace-nowrap z-20"
                >
                  <span>{valCm.toFixed(1)} cm / {formatValue(valInch, 'inch')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setCustomGuidelines(prev => prev.filter(item => item.id !== g.id));
                    }}
                    className="w-3.5 h-3.5 rounded-full bg-teal-800 hover:bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          }
        })}

        {/* Relative Caliper Sliders dragging layer */}
        {showGuides && (
          <>
            {/* Caliper A Line */}
            <div
              style={layout === 'vertical' ? { top: `${guideA}px` } : { left: `${guideA}px` }}
              className={`interactive-noclick absolute z-30 cursor-grab active:cursor-grabbing flex items-center justify-center ${
                layout === 'vertical' ? 'left-0 right-0 h-5 -translate-y-2.5' : 'top-0 bottom-0 w-5 -translate-x-2.5'
              }`}
              onPointerDown={(e) => handleCaliperPointerDown('A', e)}
              id="caliper-guide-a"
            >
              <div className={`relative ${
                layout === 'vertical' ? 'h-0.5 w-[92%] bg-indigo-600/70 dark:bg-indigo-400' : 'w-0.5 h-[92%] bg-indigo-600/70 dark:bg-indigo-400'
              }`}>
                {/* Hover indicator handle grip */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-lg select-none whitespace-nowrap">
                  ↔ Caliper A
                </div>
              </div>
            </div>

            {/* Caliper B Line */}
            <div
              style={layout === 'vertical' ? { top: `${guideB}px` } : { left: `${guideB}px` }}
              className={`interactive-noclick absolute z-30 cursor-grab active:cursor-grabbing flex items-center justify-center ${
                layout === 'vertical' ? 'left-0 right-0 h-5 -translate-y-2.5' : 'top-0 bottom-0 w-5 -translate-x-2.5'
              }`}
              onPointerDown={(e) => handleCaliperPointerDown('B', e)}
              id="caliper-guide-b"
            >
              <div className={`relative ${
                layout === 'vertical' ? 'h-0.5 w-[92%] bg-emerald-600/70 dark:bg-emerald-400' : 'w-0.5 h-[92%] bg-emerald-600/70 dark:bg-emerald-400'
              }`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-lg select-none whitespace-nowrap font-semibold">
                  ↔ Caliper B
                </div>
              </div>
            </div>

            {/* Colored shaded area connecting calipers A & B */}
            <div
              style={
                layout === 'vertical'
                  ? {
                      top: `${Math.min(guideA, guideB)}px`,
                      height: `${Math.abs(guideA - guideB)}px`,
                      left: 'unset',
                      right: 0,
                      width: '6px',
                    }
                  : {
                      left: `${Math.min(guideA, guideB)}px`,
                      width: `${Math.abs(guideA - guideB)}px`,
                      top: 'unset',
                      bottom: 0,
                      height: '6px',
                    }
              }
              className="absolute bg-indigo-500/20 z-0 pointer-events-none border-t border-b border-indigo-400/30"
              id="caliper-fill-bridge"
            />
          </>
        )}
      </div>

      {/* Persistent user Calibration hook footer */}
      {!calibration.calibrated && (
        <div className="max-w-4xl mx-auto py-3.5 px-4 bg-indigo-50 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-900 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
          <span className="text-zinc-700 dark:text-zinc-300 font-medium">
            📏 Accuracy Double Check: Let's calibrate centimeter marks to match physical desk standards!
          </span>
          <button
            onClick={onOpenCalibration}
            id="btn-ruler-suggest-calib"
            className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline shrink-0"
          >
            Start Dynamic 10-Second Calibration Now →
          </button>
        </div>
      )}

      {/* Guide/Instructions section for drop guidelines feature */}
      <div className="max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
        <h5 className="font-extrabold text-zinc-800 dark:text-zinc-200">💡 Interactive Measuring Guide & Hacks:</h5>
        <ul className="list-disc pl-5 space-y-1.5 font-medium">
          <li>
            <strong>Dual-Scale Comparison:</strong> Use the <span className="text-indigo-600 dark:text-indigo-400">&quot;Dual (cm + in)&quot;</span> layout mode. The top scale tracks millimeters/centimeters and the bottom scale translates standard inch 16ths in real-time.
          </li>
          <li>
            <strong>Persistent Marking points:</strong> Hover anywhere on the ruler face and <span className="text-teal-600 dark:text-teal-400">click/tap any spot</span> to place dynamic guidelines. These act as permanent visual marks so you can put objects on the screen and mark their physical width smoothly!
          </li>
          <li>
            <strong>Precise Calipers:</strong> Drag the Caliper sliders (A &amp; B) to compute relative offsets or capture size gaps without doing manual calculations. This can be copied directly to clipboard instantly with <span className="font-bold text-zinc-805 dark:text-zinc-200">Copy Distance</span>.
          </li>
          <li>
            <strong>Accurate Scaling:</strong> Screen pixel sizes vary. For perfect results, click the <span className="font-bold">Settings</span> gear in the header to calibrate using any physical card from your wallet or specify screen diagonal metrics.
          </li>
        </ul>
      </div>

    </div>
  );
}
