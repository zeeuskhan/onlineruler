/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Ruler, X, Maximize2, Minimize2, Eye, EyeOff, Sparkles, 
  Settings, CreditCard, Laptop, Shield, LayoutGrid, ChevronDown, 
  ChevronUp, Move, Trash2, Moon, Sun, Info, Keyboard
} from 'lucide-react';
import { CalibrationData, WebPresetScreen } from '../types';
import { CARD_WIDTH_INCH, CARD_HEIGHT_INCH, DEVICE_PRESETS } from '../data';

interface RealOnlineRulerProps {
  isOpen: boolean;
  onClose: () => void;
  calibration: CalibrationData;
  onCalibrationChange: (data: CalibrationData) => void;
}

interface RulerEdge {
  id: 'top' | 'bottom' | 'left' | 'right';
  label: string;
  icon: string;
}

interface Guide {
  id: string;
  type: 'h' | 'v'; // horizontal or vertical
  positionPx: number;
}

export default function RealOnlineRuler({ 
  isOpen, 
  onClose, 
  calibration, 
  onCalibrationChange 
}: RealOnlineRulerProps) {
  if (!isOpen) return null;

  // Viewport dimensions
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Ruler Active Edges (competitor supports all simultaneously)
  const [activeEdges, setActiveEdges] = useState<Record<'top' | 'bottom' | 'left' | 'right', boolean>>({
    top: true,
    bottom: false,
    left: true,
    right: false,
  });

  // Active units: cm | in | px
  const [activeUnit, setActiveUnit] = useState<'cm' | 'inch' | 'px'>('cm');

  // Control panel visibility & position (minimizable or draggable)
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [panelPos, setPanelPos] = useState({ x: window.innerWidth / 2 - 190, y: 120 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Calibration modes: 'card' | 'diagonal' | 'preset'
  const [activeCalibTab, setActiveCalibTab] = useState<'card' | 'diagonal' | 'preset'>('card');
  const [cardWidthPx, setCardWidthPx] = useState<number>(calibration.ppi * CARD_WIDTH_INCH);

  // Diagonal calculation inputs
  const [diagInches, setDiagInches] = useState<number>(15.6);
  const [resWidth, setResWidth] = useState<number>(window.screen.width * (window.devicePixelRatio || 1));
  const [resHeight, setResHeight] = useState<number>(window.screen.height * (window.devicePixelRatio || 1));

  // Device search
  const [deviceSearch, setDeviceSearch] = useState('');

  // Floating guides state
  const [guides, setGuides] = useState<Guide[]>([]);
  const [draggedGuideId, setDraggedGuideId] = useState<string | null>(null);
  const [newGuideType, setNewGuideType] = useState<'h' | 'v'>('v');
  const [showGuides, setShowGuides] = useState<boolean>(true);

  // Crosshair state
  const [showCrosshair, setShowCrosshair] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Fullscreen support
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dark/Light Theme for overall ruler overlay
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    try {
      return localStorage.getItem('on_ruler_theme_mode') === 'dark';
    } catch {
      return true;
    }
  });

  // Track viewport changes
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Sync simulated card width with PPI
  useEffect(() => {
    setCardWidthPx(calibration.ppi * CARD_WIDTH_INCH);
  }, [calibration.ppi]);

  // Handle unit conversions
  const pxToValue = (px: number, unit: 'cm' | 'inch' | 'px') => {
    const inches = px / calibration.ppi;
    if (unit === 'cm') return inches * 2.54;
    if (unit === 'inch') return inches;
    return px;
  };

  const formatWithFraction = (inches: number) => {
    const whole = Math.floor(inches);
    const frac = inches - whole;
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
  };

  const getValueLabel = (px: number) => {
    const val = pxToValue(px, activeUnit);
    if (activeUnit === 'cm') return `${val.toFixed(1)} cm`;
    if (activeUnit === 'inch') return formatWithFraction(val);
    return `${Math.round(val)} px`;
  };

  // Keyboard Shortcuts hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;

      switch (e.key.toLowerCase()) {
        case '1':
          setActiveUnit('cm');
          e.preventDefault();
          break;
        case '2':
          setActiveUnit('inch');
          e.preventDefault();
          break;
        case '3':
          setActiveUnit('px');
          e.preventDefault();
          break;
        case 't':
          setActiveEdges(prev => ({ ...prev, top: !prev.top }));
          break;
        case 'b':
          setActiveEdges(prev => ({ ...prev, bottom: !prev.bottom }));
          break;
        case 'l':
          setActiveEdges(prev => ({ ...prev, left: !prev.left }));
          break;
        case 'r':
          setActiveEdges(prev => ({ ...prev, right: !prev.right }));
          break;
        case 'g':
          setShowGuides(prev => !prev);
          break;
        case 'k':
          setShowCrosshair(prev => !prev);
          break;
        case 'escape':
          setGuides([]);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'h':
          setIsMinimized(prev => !prev);
          break;
        case 'c':
          setActiveCalibTab('card');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fullscreen implementation
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error(`Fullscreen request error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Monitor real fullscreen states
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Panel Draggability triggers
  const handlePanelGrab = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.panel-no-drag')) return;
    setIsDraggingPanel(true);
    dragStartRef.current = {
      x: e.clientX - panelPos.x,
      y: e.clientY - panelPos.y,
    };
    e.preventDefault();
  };

  const handleGlobalPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // 1. Crosshair coordinate update
    setCursorPos({ x: e.clientX, y: e.clientY });

    // 2. Dragging controls panel
    if (isDraggingPanel) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      setPanelPos({
        x: Math.max(10, Math.min(newX, viewport.width - 250)),
        y: Math.max(10, Math.min(newY, viewport.height - 100)),
      });
    }

    // 3. Dragging guides line coordinates
    if (draggedGuideId) {
      setGuides(prev => prev.map(g => {
        if (g.id !== draggedGuideId) return g;
        return {
          ...g,
          positionPx: g.type === 'h' ? e.clientY : e.clientX,
        };
      }));
    }
  };

  const handleGlobalPointerUp = () => {
    setIsDraggingPanel(false);
    setDraggedGuideId(null);
  };

  // Add click guideline on empty space background
  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.panel-click-intercept') || target.closest('.ruler-bar') || draggedGuideId) {
      return;
    }
    
    if (!showGuides) return;

    // Drop guide
    const id = `edge-guide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const positionPx = newGuideType === 'h' ? e.clientY : e.clientX;
    setGuides(prev => [...prev, { id, type: newGuideType, positionPx }]);
  };

  // Drag Calibration Card adjustment
  const handleCardSliderWidth = (pxVal: number) => {
    setCardWidthPx(pxVal);
    const calculatedPpi = pxVal / CARD_WIDTH_INCH;
    onCalibrationChange({
      ppi: Number(calculatedPpi.toFixed(2)),
      calibrated: true,
      method: 'card',
    });
  };

  // Enter screen diagonal calculations
  const applyDiagonalCalculation = () => {
    const diagSq = resWidth * resWidth + resHeight * resHeight;
    const diagPx = Math.sqrt(diagSq);
    const calculatedPpi = diagPx / diagInches;
    if (calculatedPpi > 30 && calculatedPpi < 1000) {
      onCalibrationChange({
        ppi: Number(calculatedPpi.toFixed(2)),
        calibrated: true,
        method: 'manual',
      });
    }
  };

  // Change predefined presets
  const handleSelectPredefined = (preset: WebPresetScreen) => {
    onCalibrationChange({
      ppi: preset.ppi,
      calibrated: true,
      method: 'preset',
      presetName: preset.name,
    });
  };

  // Reset preset
  const handleResetToStandard = () => {
    onCalibrationChange({
      ppi: 96,
      calibrated: false,
      method: 'default',
    });
    setCardWidthPx(96 * CARD_WIDTH_INCH);
  };

  // Theme support
  const toggleThemeMode = () => {
    const newMode = !isDarkTheme;
    setIsDarkTheme(newMode);
    try {
      localStorage.setItem('on_ruler_theme_mode', newMode ? 'dark' : 'light');
    } catch {}
  };

  // Render SVG Vector Ticks along the ruler border lengths
  const drawRulerSvgContent = (orientation: 'horizontal' | 'vertical', flow: 'start' | 'end', maxLen: number) => {
    const ticks: React.JSX.Element[] = [];
    const labels: React.JSX.Element[] = [];

    const ppi = calibration.ppi;
    const thickness = 56; // thickness of absolute ruler visual block

    // SVGs ticks styles
    const strokeColor = isDarkTheme ? 'rgba(255, 255, 255, 0.45)' : 'rgba(9, 9, 11, 0.5)';
    const strokeBoldColor = isDarkTheme ? 'rgba(255, 255, 255, 0.75)' : 'rgba(9, 9, 11, 0.85)';
    const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';

    if (activeUnit === 'cm') {
      const mmPx = ppi / 25.4;
      const mmItems = Math.ceil(maxLen / mmPx);

      for (let i = 0; i <= mmItems; i++) {
        const dPx = i * mmPx;
        if (dPx > maxLen) break;

        const isCm = i % 10 === 0;
        const isHalfCm = i % 5 === 0 && !isCm;
        const tickLength = isCm ? 20 : isHalfCm ? 14 : 8;

        // Position on target
        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        if (orientation === 'horizontal') {
          x1 = dPx;
          x2 = dPx;
          if (flow === 'start') {
            y1 = 0;
            y2 = tickLength;
          } else {
            y1 = thickness;
            y2 = thickness - tickLength;
          }
        } else {
          y1 = dPx;
          y2 = dPx;
          if (flow === 'start') {
            x1 = 0;
            x2 = tickLength;
          } else {
            x1 = thickness;
            x2 = thickness - tickLength;
          }
        }

        ticks.push(
          <line
            key={`t-cm-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isCm ? strokeBoldColor : strokeColor}
            strokeWidth={isCm ? '1.5' : '1'}
          />
        );

        if (isCm) {
          const valCm = i / 10;
          let lx = 0, ly = 0;
          let textAnchor = 'middle';
          let alignBaseline = 'middle';
          let rotation = 0;

          if (orientation === 'horizontal') {
            lx = dPx;
            ly = flow === 'start' ? tickLength + 10 : thickness - tickLength - 10;
          } else {
            ly = dPx;
            lx = flow === 'start' ? tickLength + 11 : thickness - tickLength - 11;
            textAnchor = 'middle';
            rotation = flow === 'start' ? 90 : -90;
          }

          labels.push(
            <text
              key={`lbl-cm-${i}`}
              x={lx}
              y={ly}
              fill={textColor}
              fontSize="9px"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor={textAnchor}
              alignmentBaseline={alignBaseline as any}
              transform={rotation ? `rotate(${rotation}, ${lx}, ${ly})` : undefined}
            >
              {valCm}
            </text>
          );
        }
      }
    } else if (activeUnit === 'inch') {
      const step16th = ppi / 16;
      const stepItems = Math.ceil(maxLen / step16th);

      for (let i = 0; i <= stepItems; i++) {
        const dPx = i * step16th;
        if (dPx > maxLen) break;

        const fraction = i % 16;
        let tickLength = 6;
        if (fraction === 0) tickLength = 22;
        else if (fraction === 8) tickLength = 16;
        else if (fraction % 4 === 0) tickLength = 12;
        else if (fraction % 2 === 0) tickLength = 9;

        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        if (orientation === 'horizontal') {
          x1 = dPx;
          x2 = dPx;
          if (flow === 'start') {
            y1 = 0;
            y2 = tickLength;
          } else {
            y1 = thickness;
            y2 = thickness - tickLength;
          }
        } else {
          y1 = dPx;
          y2 = dPx;
          if (flow === 'start') {
            x1 = 0;
            x2 = tickLength;
          } else {
            x1 = thickness;
            x2 = thickness - tickLength;
          }
        }

        ticks.push(
          <line
            key={`t-in-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={fraction === 0 ? strokeBoldColor : strokeColor}
            strokeWidth={fraction === 0 ? '1.5' : fraction === 8 ? '1.2' : '0.8'}
          />
        );

        if (fraction === 0) {
          const valInch = i / 16;
          let lx = 0, ly = 0;
          let textAnchor = 'middle';
          let rotation = 0;

          if (orientation === 'horizontal') {
            lx = dPx;
            ly = flow === 'start' ? tickLength + 9 : thickness - tickLength - 9;
          } else {
            ly = dPx;
            lx = flow === 'start' ? tickLength + 10 : thickness - tickLength - 10;
            rotation = flow === 'start' ? 90 : -90;
          }

          labels.push(
            <text
              key={`lbl-in-${i}`}
              x={lx}
              y={ly}
              fill={textColor}
              fontSize="9px"
              fontWeight="bold"
              fontFamily="monospace"
              textAnchor={textAnchor}
              alignmentBaseline="middle"
              transform={rotation ? `rotate(${rotation}, ${lx}, ${ly})` : undefined}
            >
              {valInch}
            </text>
          );
        }
      }
    } else {
      // Pixels layout
      const step = 10;
      const count = Math.ceil(maxLen / step);

      for (let i = 0; i <= count; i++) {
        const dPx = i * step;
        if (dPx > maxLen) break;

        const is100 = dPx % 100 === 0;
        const is50 = dPx % 50 === 0 && !is100;
        const tickLength = is100 ? 18 : is50 ? 12 : 6;

        let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        if (orientation === 'horizontal') {
          x1 = dPx;
          x2 = dPx;
          if (flow === 'start') {
            y1 = 0;
            y2 = tickLength;
          } else {
            y1 = thickness;
            y2 = thickness - tickLength;
          }
        } else {
          y1 = dPx;
          y2 = dPx;
          if (flow === 'start') {
            x1 = 0;
            x2 = tickLength;
          } else {
            x1 = thickness;
            x2 = thickness - tickLength;
          }
        }

        ticks.push(
          <line
            key={`t-px-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={is100 ? strokeBoldColor : strokeColor}
            strokeWidth={is100 ? '1.2' : '0.8'}
          />
        );

        if (is100) {
          let lx = 0, ly = 0;
          let textAnchor = 'middle';
          let rotation = 0;

          if (orientation === 'horizontal') {
            lx = dPx;
            ly = flow === 'start' ? tickLength + 8 : thickness - tickLength - 8;
          } else {
            ly = dPx;
            lx = flow === 'start' ? tickLength + 9 : thickness - tickLength - 9;
            rotation = flow === 'start' ? 90 : -90;
          }

          labels.push(
            <text
              key={`lbl-px-${i}`}
              x={lx}
              y={ly}
              fill={textColor}
              fontSize="8px"
              fontFamily="monospace"
              textAnchor={textAnchor}
              alignmentBaseline="middle"
              transform={rotation ? `rotate(${rotation}, ${lx}, ${ly})` : undefined}
            >
              {dPx}
            </text>
          );
        }
      }
    }

    return (
      <>
        {ticks}
        {labels}
      </>
    );
  };

  // Filter device presets list
  const filteredPresets = useMemo(() => {
    return DEVICE_PRESETS.filter(d => 
      d.name.toLowerCase().includes(deviceSearch.toLowerCase())
    );
  }, [deviceSearch]);

  return (
    <div 
      className={`fixed inset-0 z-extreme select-none outline-none font-sans overflow-hidden ${
        isDarkTheme ? 'bg-[#0f0f12]/92 text-zinc-100' : 'bg-[#f4f4f5]/92 text-zinc-900'
      }`}
      onMouseMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      onPointerLeave={handleGlobalPointerUp}
      onClick={handleBackgroundClick}
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0 z-0 bg-[#000000]/10 pointer-events-none" />

      {/* TOP RULER edge */}
      {activeEdges.top && (
        <div 
          className={`ruler-bar fixed top-0 left-0 right-0 h-[56px] border-b shadow-md z-30 transition-colors ${
            isDarkTheme 
              ? 'bg-[#18181c]/95 border-zinc-800' 
              : 'bg-zinc-50/95 border-zinc-200'
          }`}
          style={{ width: '100%' }}
        >
          <svg className="w-full h-full pointer-events-none">
            {drawRulerSvgContent('horizontal', 'start', viewport.width)}
          </svg>
          <div className="absolute right-3 bottom-1.5 font-mono text-[9px] uppercase tracking-wide opacity-55 font-bold">
            TOP ({activeUnit})
          </div>
        </div>
      )}

      {/* BOTTOM RULER edge */}
      {activeEdges.bottom && (
        <div 
          className={`ruler-bar fixed bottom-0 left-0 right-0 h-[56px] border-t shadow-lg z-30 transition-colors ${
            isDarkTheme 
              ? 'bg-[#18181c]/95 border-zinc-805' 
              : 'bg-zinc-50/95 border-zinc-200'
          }`}
          style={{ width: '100%' }}
        >
          <svg className="w-full h-full pointer-events-none">
            {drawRulerSvgContent('horizontal', 'end', viewport.width)}
          </svg>
          <div className="absolute right-3 top-1.5 font-mono text-[9px] uppercase tracking-wide opacity-55 font-bold">
            BOTTOM ({activeUnit})
          </div>
        </div>
      )}

      {/* LEFT RULER edge */}
      {activeEdges.left && (
        <div 
          className={`ruler-bar fixed top-0 left-0 bottom-0 w-[56px] border-r shadow-md z-30 transition-colors ${
            isDarkTheme 
              ? 'bg-[#18181c]/95 border-zinc-800' 
              : 'bg-zinc-50/95 border-zinc-200'
          }`}
          style={{ height: '100%' }}
        >
          <svg className="w-full h-full pointer-events-none">
            {drawRulerSvgContent('vertical', 'start', viewport.height)}
          </svg>
          <div className="absolute left-1.5 bottom-3 font-mono text-[9px] uppercase tracking-wide opacity-55 font-bold [writing-mode:vertical-lr]">
            LEFT ({activeUnit})
          </div>
        </div>
      )}

      {/* RIGHT RULER edge */}
      {activeEdges.right && (
        <div 
          className={`ruler-bar fixed top-0 right-0 bottom-0 w-[56px] border-l shadow-md z-30 transition-colors ${
            isDarkTheme 
              ? 'bg-[#18181c]/95 border-zinc-800' 
              : 'bg-zinc-50/95 border-zinc-200'
          }`}
          style={{ height: '100%' }}
        >
          <svg className="w-full h-full pointer-events-none">
            {drawRulerSvgContent('vertical', 'end', viewport.height)}
          </svg>
          <div className="absolute right-1.5 bottom-3 font-mono text-[9px] uppercase tracking-wide opacity-55 font-bold [writing-mode:vertical-lr]">
            RIGHT ({activeUnit})
          </div>
        </div>
      )}

      {/* CROSSHAIR LAYER */}
      {showCrosshair && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {/* Vertical line through cursor */}
          <div 
            style={{ left: `${cursorPos.x}px` }} 
            className="absolute top-0 bottom-0 w-[1px] border-l border-dashed border-[#3b82f6]/70"
          />
          {/* Horizontal line through cursor */}
          <div 
            style={{ top: `${cursorPos.y}px` }} 
            className="absolute left-0 right-0 h-[1px] border-t border-dashed border-[#3b82f6]/70"
          />
          {/* Coordinate indicator badge near cursor */}
          <div 
            style={{ 
              left: `${cursorPos.x + 15}px`, 
              top: `${cursorPos.y + 15}px` 
            }} 
            className="absolute bg-neutral-900/90 text-white border border-neutral-700 text-[10px] font-mono p-1.5 rounded shadow-lg pointer-events-none flex flex-col gap-0.5 whitespace-nowrap z-50 animate-fadeIn"
          >
            <div>X: <span className="text-[#3b82f6] font-semibold">{getValueLabel(cursorPos.x)}</span></div>
            <div>Y: <span className="text-[#10b981] font-semibold">{getValueLabel(cursorPos.y)}</span></div>
            <div className="text-[8px] text-zinc-400">({cursorPos.x}, {cursorPos.y} px)</div>
          </div>
        </div>
      )}

      {/* DRAGGABLE GUIDELINES OVERLAY */}
      {showGuides && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {guides.map((g) => {
            const isHorizontal = g.type === 'h';
            const valLabel = getValueLabel(g.positionPx);

            return (
              <div
                key={g.id}
                style={isHorizontal ? { top: `${g.positionPx}px` } : { left: `${g.positionPx}px` }}
                className={`absolute pointer-events-auto group/guide hover:z-50 ${
                  isHorizontal 
                    ? 'left-0 right-0 h-4 -translate-y-2 cursor-row-resize' 
                    : 'top-0 bottom-0 w-4 -translate-x-2 cursor-col-resize'
                }`}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  setDraggedGuideId(g.id);
                }}
              >
                {/* Visual guideline line */}
                <div className={`pointer-events-none absolute ${
                  isHorizontal 
                    ? 'top-2 left-0 right-0 h-[1.5px] bg-[#3b82f6] duration-75 group-hover/guide:bg-rose-500' 
                    : 'left-2 top-0 bottom-0 w-[1.5px] bg-[#3b82f6] duration-75 group-hover/guide:bg-rose-500'
                }`} />

                {/* Floating coordinate marker tag */}
                <div 
                  className={`panel-click-intercept absolute bg-[#3b82f6] group-hover/guide:bg-rose-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md pointer-events-auto flex items-center gap-1 whitespace-nowrap select-none transition-colors ${
                    isHorizontal 
                      ? 'left-[100px] top-4' 
                      : 'top-[100px] left-4'
                  }`}
                  onPointerDown={(e) => e.stopPropagation()} // Avoid dragging line via button click
                >
                  <Move className="w-2.5 h-2.5 shrink-0 opacity-70" />
                  <span>{valLabel}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setGuides(prev => prev.filter(item => item.id !== g.id));
                    }}
                    className="ml-1 leading-none w-3.5 h-3.5 hover:bg-black/30 rounded flex items-center justify-center font-bold text-[10px]"
                    title="Remove Guide"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CENTRAL RULERS DASHBOARD OVERLAY PANEL */}
      <div 
        style={{ left: `${panelPos.x}px`, top: `${panelPos.y}px` }}
        className={`panel-click-intercept absolute z-40 w-[385px] rounded-2xl shadow-2xl transition-all duration-300 border backdrop-blur-md ${
          isDarkTheme 
            ? 'bg-neutral-900/90 border-neutral-700/60 shadow-black/80' 
            : 'bg-white/95 border-zinc-200 shadow-zinc-400/40'
        } ${isMinimized ? 'w-auto' : ''}`}
        onMouseDown={handlePanelGrab}
      >
        {/* PANEL HEADER (Grabbable bar) */}
        <div className="flex items-center justify-between p-3.5 border-b border-zinc-500/10 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-650 rounded flex items-center justify-center text-white">
              <Ruler className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            {!isMinimized && (
              <div>
                <strong className={`text-xs font-black tracking-tight ${isDarkTheme ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  Competitor Ruler Replica
                </strong>
                <span className="text-[9px] font-semibold text-blue-500 block uppercase tracking-wider">
                  Accurate Screen Blueprint
                </span>
              </div>
            )}
          </div>

          <div className="panel-no-drag flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-1 rounded-md hover:bg-zinc-500/10 transition-colors ${
                isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title={isMinimized ? 'Expand Dashboard' : 'Minimize Dashboard'}
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-rose-500 hover:bg-rose-500/15 transition-colors"
              title="Close Ruler Overlay (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DRAG BANNER ACCORDION */}
        {isMinimized ? (
          <div className="p-2 select-none text-center">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest px-1 block animate-pulse">
              Min. Dashboard ({activeUnit})
            </span>
          </div>
        ) : (
          <div className="panel-no-drag p-4 space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">

            {/* UNIT SWITCHER */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                1. Measurement Unit (Press 1, 2, 3)
              </label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-500/5 p-1 rounded-lg border border-zinc-500/10">
                {(['cm', 'inch', 'px'] as const).map((u) => {
                  const isActive = activeUnit === u;
                  return (
                    <button
                      key={u}
                      onClick={() => setActiveUnit(u)}
                      className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow'
                          : isDarkTheme 
                            ? 'text-zinc-400 hover:text-white' 
                            : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}
                    >
                      {u === 'cm' ? 'cm / mm' : u === 'inch' ? 'inches' : 'pixels (px)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EDGE SELECTORS */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                2. Visible Ruler Margins (T, B, L, R)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'top', label: 'Top', sc: 'T' },
                  { key: 'bottom', label: 'Bottom', sc: 'B' },
                  { key: 'left', label: 'Left', sc: 'L' },
                  { key: 'right', label: 'Right', sc: 'R' },
                ].map((edge) => {
                  const isActive = activeEdges[edge.key as 'top' | 'bottom' | 'left' | 'right'];
                  return (
                    <button
                      key={edge.key}
                      onClick={() => {
                        setActiveEdges(prev => ({
                          ...prev,
                          [edge.key]: !prev[edge.key]
                        }));
                      }}
                      className={`py-1.5 relative rounded-lg text-xs font-bold border transition-all ${
                        isActive
                          ? 'bg-blue-50/10 text-blue-500 border-blue-500/40'
                          : isDarkTheme
                            ? 'bg-[#1e1e24] border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-zinc-950 hover:bg-zinc-150'
                      }`}
                    >
                      <span>{edge.label}</span>
                      <span className="absolute -top-1 -right-1 text-[7px] px-1 bg-black/60 rounded text-zinc-400">
                        {edge.sc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CALIBRATION UTILITY */}
            <div className="space-y-2 border-t border-zinc-500/10 pt-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  3. Precision Calibration (PPI: {calibration.ppi})
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={handleResetToStandard}
                    className="text-[9px] font-bold text-rose-500 hover:underline hover:text-rose-600"
                  >
                    Reset PPI
                  </button>
                </div>
              </div>

              {/* Mini Tabs navigation */}
              <div className="flex gap-1.5 bg-zinc-500/5 p-1 rounded-md text-[10px] border border-zinc-500/10 font-bold mb-2">
                {[
                  { id: 'card', label: '💳 Credit Card' },
                  { id: 'diagonal', label: '📐 Screen Diag.' },
                  { id: 'preset', label: '📱 Presets' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCalibTab(tab.id as any)}
                    className={`flex-1 py-1 rounded text-center transition-colors ${
                      activeCalibTab === tab.id
                        ? isDarkTheme ? 'bg-neutral-800 text-white shadow-sm' : 'bg-white text-zinc-950 shadow-xs border'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Calibration Tab Bodies */}
              <div className="p-2.5 rounded-xl border border-zinc-500/10 bg-zinc-500/5 min-h-[110px]" id="modal-calib-box">
                {activeCalibTab === 'card' && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] leading-tight block text-zinc-400 font-medium">
                      Place physical credit/debit card on monitor and drag slider to match exactly:
                    </span>
                    <input
                      type="range"
                      min="150"
                      max="650"
                      step="0.5"
                      value={cardWidthPx}
                      onChange={(e) => handleCardSliderWidth(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-750 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-zinc-500">Scale card:</span>
                      <strong className="text-blue-500 font-extrabold">{calibration.ppi} Pixels/Inch</strong>
                    </div>
                  </div>
                )}

                {activeCalibTab === 'diagonal' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-3 gap-1.5">
                      <div>
                        <label className="block text-[8px] text-zinc-400 font-extrabold mb-1">DIAG (INCH)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={diagInches}
                          onChange={(e) => setDiagInches(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#18181c] border border-zinc-700 rounded text-center p-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-400 font-extrabold mb-1">X-RES</label>
                        <input
                          type="number"
                          value={resWidth}
                          onChange={(e) => setResWidth(parseInt(e.target.value) || 0)}
                          className="w-full bg-[#18181c] border border-zinc-700 rounded text-center p-1 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-400 font-extrabold mb-1">Y-RES</label>
                        <input
                          type="number"
                          value={resHeight}
                          onChange={(e) => setResHeight(parseInt(e.target.value) || 0)}
                          className="w-full bg-[#18181c] border border-zinc-700 rounded text-center p-1 text-xs text-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={applyDiagonalCalculation}
                      className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-1.5 rounded text-[10px] text-white transition-colors uppercase tracking-wider"
                    >
                      Calculate & Apply specs
                    </button>
                  </div>
                )}

                {activeCalibTab === 'preset' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search preset e.g. iPhone, MacBook..."
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                      className="w-full bg-[#18181c] border border-zinc-700 rounded p-1 px-2 text-xs text-white mb-1 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-1 max-h-[85px] overflow-y-auto no-scrollbar font-sans">
                      {filteredPresets.slice(0, 8).map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleSelectPredefined(preset)}
                          className="text-left text-[9px] p-1 px-1.5 rounded bg-zinc-500/10 border border-zinc-800 hover:border-blue-500 text-zinc-300 hover:text-white"
                        >
                          <span className="font-bold block truncate leading-none">{preset.name}</span>
                          <span className="text-[8px] text-zinc-500 font-mono font-semibold">{preset.ppi} ppi / {preset.diagonal}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CALIBRATION INDEX DETAILS */}
              <div className="flex justify-between items-center bg-zinc-500/5 border border-zinc-500/10 p-2.5 rounded-lg text-[10px] text-zinc-400">
                <span>Status:</span>
                <strong className={`font-bold ${calibration.calibrated ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {calibration.calibrated ? '✓ Calibrated Accuracy' : '⚠ Estimated Scale (Standard)'}
                </strong>
              </div>
            </div>

            {/* INTERACTIVE OVERLAYS: CROSSHAIR + GUIDELINES DROPS */}
            <div className="space-y-2 border-t border-zinc-500/10 pt-3.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                4. Overlay & Measurement Helpers
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowCrosshair(prev => !prev)}
                  className={`flex items-center gap-2 justify-center py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    showCrosshair 
                      ? 'bg-blue-600 text-white' 
                      : isDarkTheme 
                        ? 'bg-[#1e1e24] border-zinc-800 text-zinc-400 hover:text-white' 
                        : 'bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-zinc-950'
                  }`}
                >
                  {showCrosshair ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>Crosshair [K]</span>
                </button>
                <button
                  onClick={() => setShowGuides(prev => !prev)}
                  className={`flex items-center gap-2 justify-center py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    showGuides 
                      ? 'bg-blue-600 text-white' 
                      : isDarkTheme 
                        ? 'bg-[#1e1e24] border-zinc-800 text-zinc-400 hover:text-white' 
                        : 'bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-zinc-950'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Guidelines [G]</span>
                </button>
              </div>

              {/* Add Guide direction */}
              {showGuides && (
                <div className="bg-zinc-500/5 p-2 rounded-lg border border-zinc-500/10 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Standard guideline drop mode:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setNewGuideType('v')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        newGuideType === 'v' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-zinc-500/10 hover:text-white text-zinc-400'
                      }`}
                    >
                      Vertical
                    </button>
                    <button
                      onClick={() => setNewGuideType('h')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        newGuideType === 'h' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-zinc-500/10 hover:text-white text-zinc-400'
                      }`}
                    >
                      Horizontal
                    </button>
                  </div>
                </div>
              )}

              {/* Guidelines Counter Indicator details */}
              {guides.length > 0 && (
                <div className="flex items-center justify-between text-[10px] pt-1 text-zinc-450 dark:text-zinc-400 leading-none">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    <strong>{guides.length} edge guidelines placed</strong>
                  </span>
                  <button
                    onClick={() => setGuides([])}
                    className="flex items-center gap-1 text-rose-500 font-semibold hover:underline"
                  >
                    <Trash2 className="w-3 h-3" /> Clear (Esc)
                  </button>
                </div>
              )}
            </div>

            {/* FULLSCREEN & THEME toggles */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-500/10">
              <button
                onClick={toggleThemeMode}
                className={`flex justify-center items-center gap-2 py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                  isDarkTheme 
                    ? 'bg-zinc-805 hover:bg-zinc-800 border-zinc-800 text-zinc-300' 
                    : 'bg-zinc-100 hover:bg-zinc-150 border-zinc-200 text-zinc-700'
                }`}
              >
                {isDarkTheme ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
                <span>Theme Mode</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className={`flex justify-center items-center gap-2 py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                  isDarkTheme 
                    ? 'bg-zinc-805 hover:bg-zinc-800 border-zinc-800 text-zinc-300' 
                    : 'bg-zinc-100 hover:bg-zinc-150 border-zinc-200 text-zinc-700'
                }`}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>Fullscreen [F]</span>
              </button>
            </div>

            {/* KEYBOARD SHORTCUTS REFERENCE ACCORDION */}
            <details className="text-[10px] rounded-lg border border-zinc-500/10 bg-zinc-500/5 p-2 text-zinc-450 dark:text-zinc-450 select-none">
              <summary className="font-extrabold uppercase text-zinc-400 cursor-pointer flex items-center justify-between">
                <span className="flex items-center gap-1.5 leading-none">
                  <Keyboard className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  Keyboard Shortcuts List
                </span>
                <span className="text-[8px] text-zinc-500 shrink-0 select-none">(Click to view)</span>
              </summary>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 font-mono" id="shortcuts-info">
                <div><strong className="text-zinc-300">1:</strong> Cm/Mm mode</div>
                <div><strong className="text-zinc-300">2:</strong> Inches mode</div>
                <div><strong className="text-zinc-300">3:</strong> Pixels mode</div>
                <div><strong className="text-zinc-300">T:</strong> Top Ruler</div>
                <div><strong className="text-zinc-300">B:</strong> Bottom Ruler</div>
                <div><strong className="text-zinc-300">L:</strong> Left Ruler</div>
                <div><strong className="text-zinc-300">R:</strong> Right Ruler</div>
                <div><strong className="text-zinc-300">G:</strong> Toggle Guides</div>
                <div><strong className="text-zinc-300">K:</strong> Crosshair Toggler</div>
                <div><strong className="text-zinc-300">F:</strong> Fullscreen Toggle</div>
                <div><strong className="text-zinc-300">H:</strong> Hide/Minimize panel</div>
                <div><strong className="text-zinc-300">Esc:</strong> Clear Placed Lines</div>
              </div>
            </details>

            {/* FOOTER TIPS BAR */}
            <div className="flex gap-1.5 items-start text-[9px] text-zinc-500 bg-[#3b82f6]/5 text-zinc-450 p-2.5 rounded-lg border border-blue-500/10">
              <Info className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong>How to Drop Guidelines:</strong> With guidelines [ON], click anywhere on the blurred background to place a draggable coordinate tracker line. Drag the blue line tags to move them, and press Esc to clear.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
