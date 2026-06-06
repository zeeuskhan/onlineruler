/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Hash, Sliders, Palette, MousePointer, Info, Maximize2 } from 'lucide-react';
import { CalibrationData } from '../types';

interface GridToolProps {
  calibration: CalibrationData;
}

type GridUnit = 'cm' | 'inch' | 'px';

export default function GridTool({ calibration }: GridToolProps) {
  const [gridUnit, setGridUnit] = useState<GridUnit>('cm');
  const [lineWidth, setLineWidth] = useState<number>(1);
  const [opacity, setOpacity] = useState<number>(0.35);
  const [gridColor, setGridColor] = useState<string>('#94A3B8'); // Slate 400 default
  const [showCenterLines, setShowCenterLines] = useState<boolean>(true);
  const [showMouseTracker, setShowMouseTracker] = useState<boolean>(true);
  
  // Spacing unit values
  const [spacingValue, setSpacingValue] = useState<number>(1); // e.g. 1cm or 1 inch or 50px
  
  // Track system coordinates for display
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Use ResizeObserver for high performance responsiveness of grids
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

  // Auto-set default step ranges based on unit selection
  useEffect(() => {
    switch (gridUnit) {
      case 'cm':
        setSpacingValue(1.0); // 1 cm spacing
        break;
      case 'inch':
        setSpacingValue(0.5); // 0.5 inch spacing
        break;
      case 'px':
        setSpacingValue(100); // 100 pixels spacing
        break;
    }
  }, [gridUnit]);

  // Convert logical units to pixels
  const getSpacingPx = () => {
    switch (gridUnit) {
      case 'cm':
        const inchRatioCm = spacingValue / 2.54;
        return inchRatioCm * calibration.ppi;
      case 'inch':
        return spacingValue * calibration.ppi;
      case 'px':
      default:
        return spacingValue;
    }
  };

  const spacingPx = getSpacingPx();

  // Mouse capture move coordinate tracker
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      setMousePos({
        x: Math.round(relativeX),
        y: Math.round(relativeY),
      });
    }
  };

  const pxToUnits = (px: number) => {
    const inches = px / calibration.ppi;
    switch (gridUnit) {
      case 'cm':
        return `${(inches * 2.54).toFixed(2)} cm`;
      case 'inch':
        return `${inches.toFixed(2)}"`;
      case 'px':
      default:
        return `${px} px`;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Parameters Selector Dock */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl select-none text-xs">
        
        {/* Step spacing unit toggle */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Grid Scale Unit
          </label>
          <div className="flex rounded-lg p-0.5 bg-zinc-200/60 dark:bg-zinc-800 border dark:border-zinc-700">
            {(['cm', 'inch', 'px'] as GridUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setGridUnit(u)}
                id={`btn-grid-unit-${u}`}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
                  gridUnit === u
                    ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-50 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Spacing Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-bold text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Grid Subdivisions</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">
              {spacingValue} {gridUnit}
            </span>
          </div>
          
          <input
            type="range"
            min={gridUnit === 'px' ? '20' : '0.1'}
            max={gridUnit === 'px' ? '300' : '3.0'}
            step={gridUnit === 'px' ? '10' : '0.1'}
            value={spacingValue}
            onChange={(e) => setSpacingValue(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            id="slider-grid-spacing"
          />
        </div>

        {/* Opacity Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-zinc-500 font-bold">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Line Opacity</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono">{(opacity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.9"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Coloring matrix selector */}
        <div className="space-y-1 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block pb-1">
            Grid Line Accent Color
          </span>
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 p-1 border border-zinc-150 dark:border-zinc-700 rounded-lg">
            <button
              onClick={() => setGridColor('#94A3B8')} // slate-400
              className={`w-6 h-6 rounded-md bg-slate-400 border-2 ${gridColor === '#94A3B8' ? 'border-indigo-600 scale-105 shadow' : 'border-transparent'}`}
              title="Slate Slate"
            />
            <button
              onClick={() => setGridColor('#3B82F6')} // blue-500
              className={`w-6 h-6 rounded-md bg-blue-500 border-2 ${gridColor === '#3B82F6' ? 'border-indigo-600 scale-105 shadow' : 'border-transparent'}`}
              id="grid-color-blue"
              title="Sky Blue"
            />
            <button
              onClick={() => setGridColor('#EF4444')} // red-500
              className={`w-6 h-6 rounded-md bg-red-500 border-2 ${gridColor === '#EF4444' ? 'border-indigo-600 scale-105 shadow' : 'border-transparent'}`}
              title="Warning Red"
            />
            <button
              onClick={() => setGridColor('#10B981')} // green-500
              className={`w-6 h-6 rounded-md bg-emerald-500 border-2 ${gridColor === '#10B981' ? 'border-indigo-600 scale-105 shadow' : 'border-transparent'}`}
              title="Calibrate Green"
            />
            <button
              onClick={() => setGridColor('#1E1E1E')} // raw charcoal
              className={`w-6 h-6 rounded-md bg-zinc-900 border-2 ${gridColor === '#1E1E1E' ? 'border-indigo-600 scale-105 shadow' : 'border-transparent'}`}
              title="Deep Black"
            />
          </div>
        </div>
      </div>

      {/* Auxiliary Overlays Selection Rows */}
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto p-3 bg-zinc-900 dark:bg-zinc-950 text-white rounded-xl border border-zinc-800 shadow-md">
        <div className="flex gap-4 text-xs select-none">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCenterLines}
              onChange={(e) => setShowCenterLines(e.target.checked)}
              className="accent-indigo-500 rounded border-zinc-700 text-indigo-600"
            />
            <span>Highlight Center Crosshairs</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMouseTracker}
              onChange={(e) => setShowMouseTracker(e.target.checked)}
              className="accent-indigo-500 rounded border-zinc-700 text-indigo-600"
            />
            <span>Show Cursor Coordinate Readouts</span>
          </label>
        </div>

        {/* Live track readout in HUD */}
        {showMouseTracker && (
          <div className="text-xs font-mono text-indigo-300 transition-all flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5" />
            X: <span>{pxToUnits(mousePos.x)}</span>, Y: <span>{pxToUnits(mousePos.y)}</span>
          </div>
        )}
      </div>

      {/* Main Grid Graphic Container stage canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative max-w-4xl mx-auto h-[440px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl select-none overflow-hidden cursor-crosshair group shadow-inner"
        id="interactive-spacing-grid"
      >
        {/* Dynamic Canvas Svg overlay to draw alignment grid boxes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            {/* Dynamic spacing pattern declaration */}
            <pattern
              id="adjustableGrid"
              width={spacingPx}
              height={spacingPx}
              patternUnits="userSpaceOnUse"
            >
              <rect width={spacingPx} height={spacingPx} fill="none" />
              <path
                d={`M ${spacingPx} 0 L 0 0 0 ${spacingPx}`}
                fill="none"
                stroke={gridColor}
                strokeWidth={lineWidth}
                strokeOpacity={opacity}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adjustableGrid)" />

          {/* Draw Center axis crosshairs if requested */}
          {showCenterLines && containerSize.width > 0 && (
            <g className="opacity-80">
              {/* x-axis */}
              <line
                x1="0"
                y1={containerSize.height / 2}
                x2={containerSize.width}
                y2={containerSize.height / 2}
                stroke={gridColor}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              {/* y-axis */}
              <line
                x1={containerSize.width / 2}
                y1="0"
                x2={containerSize.width / 2}
                y2={containerSize.height}
                stroke={gridColor}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
            </g>
          )}

          {/* Interactive Mouse pointer tracker tracking indicators lines */}
          {showMouseTracker && mousePos.x > 0 && mousePos.y > 0 && (
            <g className="opacity-55">
              {/* horizontal tracker */}
              <line
                x1="0"
                y1={mousePos.y}
                x2="100%"
                y2={mousePos.y}
                stroke="#6366F1"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* vertical tracker */}
              <line
                x1={mousePos.x}
                y1="0"
                x2={mousePos.x}
                y2="100%"
                stroke="#6366F1"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* target node dot */}
              <circle cx={mousePos.x} cy={mousePos.y} r="3" fill="#6366F1" />
            </g>
          )}
        </svg>

        {/* Floating crosshair details */}
        {showMouseTracker && (
          <div
            style={{
              left: `${mousePos.x + 12}px`,
              top: `${mousePos.y + 12}px`,
              display: mousePos.x === 0 ? 'none' : 'block',
            }}
            className="absolute bg-zinc-900/90 text-white rounded p-1.5 text-[9px] font-mono leading-none pointer-events-none select-none z-10 shadow-md border border-zinc-800 transition-all duration-75"
          >
            <span>X: {pxToUnits(mousePos.x)}</span>
            <br />
            <span className="block mt-1">Y: {pxToUnits(mousePos.y)}</span>
          </div>
        )}

        {/* Informational tip */}
        <div className="absolute right-3 top-3 bg-zinc-900/70 p-2 rounded text-[10px] text-white/90 z-10 pointer-events-none select-none">
          Grid: {spacingValue} {gridUnit} = {Math.round(spacingPx)}px on your display
        </div>
      </div>
    </div>
  );
}
