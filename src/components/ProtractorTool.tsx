/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Compass, RotateCw, Image as ImageIcon, Sparkles, Sliders, ChevronUp, Copy, HelpCircle, EyeOff, Check } from 'lucide-react';

export default function ProtractorTool() {
  const [protractorType, setProtractorType] = useState<'180' | '360'>('180');
  
  // Angle nodes: Center, Arm 1, Arm 2 - initially centered with offsets
  const [center, setCenter] = useState({ x: 250, y: 250 });
  const [armA, setArmA] = useState({ x: 380, y: 250 });
  const [armB, setArmB] = useState({ x: 340, y: 160 });
  
  const [draggingNode, setDraggingNode] = useState<'center' | 'A' | 'B' | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState<number>(0.6);
  const [imageScale, setImageScale] = useState<number>(1.0);
  const [imageRot, setImageRot] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 480 });
  const [didInitCenter, setDidInitCenter] = useState<boolean>(false);

  // Maintain container coordinates using ResizeObserver for responsive accuracy
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    resizeObserver.observe(svgEl);

    const rect = svgEl.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Set default center and arms positions on first load or dimensions change
  useEffect(() => {
    if (containerSize.width > 0 && !didInitCenter) {
      const cx = Math.round(containerSize.width / 2);
      const cy = Math.round(containerSize.height / 2 + 20); // push slightly down for top half semi-circle symmetry
      setCenter({ x: cx, y: cy });
      setArmA({ x: cx + 130, y: cy });
      setArmB({ x: cx + 90, y: cy - 90 });
      setDidInitCenter(true);
    } else if (containerSize.width > 0) {
      // Bounds guard center and arm nodes if container resizes
      setCenter((prev) => ({
        x: Math.round(Math.max(20, Math.min(prev.x, containerSize.width - 20))),
        y: Math.round(Math.max(20, Math.min(prev.y, containerSize.height - 20))),
      }));
      setArmA((prev) => ({
        x: Math.round(Math.max(10, Math.min(prev.x, containerSize.width - 10))),
        y: Math.round(Math.max(10, Math.min(prev.y, containerSize.height - 10))),
      }));
      setArmB((prev) => ({
        x: Math.round(Math.max(10, Math.min(prev.x, containerSize.width - 10))),
        y: Math.round(Math.max(10, Math.min(prev.y, containerSize.height - 10))),
      }));
    }
  }, [containerSize, didInitCenter]);

  // Dynamic radial boundary calculation based on measured stage size
  const protractorRadius = containerSize.width > 0
    ? Math.min(160, Math.max(110, Math.min(containerSize.width * 0.38, (containerSize.height - 60) * 0.45)))
    : 160;

  // Compute angles relative to horizontal line going right
  const getAngle = (point: { x: number; y: number }, origin: { x: number; y: number }) => {
    const dy = point.y - origin.y;
    const dx = point.x - origin.x;
    let theta = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180
    if (theta < 0) theta += 360;
    return theta;
  };

  const angleA = getAngle(armA, center);
  const angleB = getAngle(armB, center);

  // Calculate internal angular difference
  let diffAngle = Math.abs(angleB - angleA);
  if (diffAngle > 180 && protractorType === '180') {
    diffAngle = 360 - diffAngle;
  }

  // Handle Dragging of circles
  const handlePointerDown = (node: 'center' | 'A' | 'B', e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingNode(node);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Bounds guard within SVG
    const boundedX = Math.max(10, Math.min(x, rect.width - 10));
    const boundedY = Math.max(10, Math.min(y, rect.height - 10));

    if (draggingNode === 'center') {
      const dx = boundedX - center.x;
      const dy = boundedY - center.y;
      setCenter({ x: boundedX, y: boundedY });
      // Drag Arms along relative to center coordinates
      setArmA({ x: armA.x + dx, y: armA.y + dy });
      setArmB({ x: armB.x + dx, y: armB.y + dy });
    } else if (draggingNode === 'A') {
      setArmA({ x: boundedX, y: boundedY });
    } else if (draggingNode === 'B') {
      setArmB({ x: boundedX, y: boundedY });
    }
  };

  const handlePointerUp = () => {
    setDraggingNode(null);
  };

  // Upload background image to measure relative angles from drawings
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCopy = () => {
    navigator.clipboard.writeText(`${diffAngle.toFixed(1)}°`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Fine tune adjustments helper
  const adjustAngleByOffset = (node: 'A' | 'B', degOffset: number) => {
    const targetNode = node === 'A' ? armA : armB;
    const currentAngle = getAngle(targetNode, center);
    const rad = (currentAngle + degOffset) * (Math.PI / 180);
    const radius = Math.sqrt(Math.pow(targetNode.x - center.x, 2) + Math.pow(targetNode.y - center.y, 2));
    
    const newX = center.x + radius * Math.cos(rad);
    const newY = center.y + radius * Math.sin(rad);
    
    if (node === 'A') {
      setArmA({ x: newX, y: newY });
    } else {
      setArmB({ x: newX, y: newY });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-toast flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-lg shadow-lg" id="protractor-copied">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Copied {diffAngle.toFixed(1)}° to Clipboard!</span>
        </div>
      )}

      {/* Control row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl select-none">
        
        {/* Toggle Types */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Protractor Grid Type
          </span>
          <div className="flex rounded-lg p-0.5 bg-zinc-250 dark:bg-zinc-800 border dark:border-zinc-700">
            <button
              onClick={() => setProtractorType('180')}
              id="protractor-180"
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
                protractorType === '180'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Semi-Circle (180°)
            </button>
            <button
              onClick={() => setProtractorType('360')}
              id="protractor-360"
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
                protractorType === '360'
                  ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Full Circular (360°)
            </button>
          </div>
        </div>

        {/* Upload Image overlay controls */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Measure from Graphic/Photo
          </span>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-1.5 px-3 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm">
              <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
              Upload Image Overlay
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="input-protractor-photo-upload"
              />
            </label>
            {bgImage && (
              <button
                onClick={() => setBgImage(null)}
                className="p-1 px-2.5 bg-zinc-250 dark:bg-zinc-800 text-zinc-500 hover:text-red-500 border border-zinc-250 dark:border-zinc-700 rounded-lg text-xs font-bold"
                title="Remove image"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Alignment manual dials */}
        <div className="space-y-1 h-full flex flex-col justify-end">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Fine-Tune Selected Angle Range
          </span>
          <div className="flex gap-2">
            <div className="flex-1 flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border dark:border-zinc-700">
              <button
                onClick={() => adjustAngleByOffset('A', -0.5)}
                className="flex-1 bg-white dark:bg-zinc-700 hover:bg-zinc-50 border border-zinc-200/50 dark:border-zinc-650 text-[10px] py-1 font-bold rounded transition-colors"
              >
                -A
              </button>
              <button
                onClick={() => adjustAngleByOffset('A', 0.5)}
                className="flex-1 bg-white dark:bg-zinc-700 hover:bg-zinc-50 border border-zinc-200/50 dark:border-zinc-650 text-[10px] py-1 font-bold rounded transition-colors"
              >
                +A
              </button>
            </div>
            <div className="flex-1 flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border dark:border-zinc-700">
              <button
                onClick={() => adjustAngleByOffset('B', -0.5)}
                className="flex-1 bg-white dark:bg-zinc-700 hover:bg-zinc-50 border border-zinc-200/50 dark:border-zinc-650 text-[10px] py-1 font-bold rounded transition-colors"
              >
                -B
              </button>
              <button
                onClick={() => adjustAngleByOffset('B', 0.5)}
                className="flex-1 bg-white dark:bg-zinc-700 hover:bg-zinc-50 border border-zinc-200/50 dark:border-zinc-650 text-[10px] py-1 font-bold rounded transition-colors"
                id="btn-adjust-b"
              >
                +B
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Image Adjustment Slide Board */}
      {bgImage && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100 dark:border-indigo-900 rounded-lg text-xs leading-none">
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-indigo-950 dark:text-zinc-200">Opacity: {(imageOpacity * 100).toFixed(0)}%</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={imageOpacity}
              onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-indigo-950 dark:text-zinc-200">Scale: {imageScale.toFixed(2)}x</span>
            <input
              type="range"
              min="0.3"
              max="3.0"
              step="0.05"
              value={imageScale}
              onChange={(e) => setImageScale(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-indigo-950 dark:text-zinc-200">Rotate: {imageRot}°</span>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={imageRot}
              onChange={(e) => setImageRot(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      )}

      {/* Floating Protractor Metric Indicator HUD */}
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4 bg-zinc-900 dark:bg-zinc-950 text-white rounded-xl border border-zinc-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1 px-2.5 bg-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">
            Measured Angle
          </div>
          <div>
            <span className="text-[11px] text-zinc-400 block font-normal">Relative Arc:</span>
            <strong className="text-xl lg:text-2xl font-mono tracking-tight text-white">{diffAngle.toFixed(1)}°</strong>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono hidden md:block">
          <span>Radians: {((diffAngle * Math.PI) / 180).toFixed(4)} rad</span>
          <span className="mx-3.5">|</span>
          <span>Complement: {(180 - diffAngle).toFixed(1)}°</span>
        </div>

        <button
          onClick={triggerCopy}
          id="btn-copy-angle"
          className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 font-semibold text-xs rounded transition-colors text-zinc-200 select-none"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Angle
        </button>
      </div>

      {/* Interactive Svg Drawing Stage Canvas container */}
      <div className="relative max-w-4xl mx-auto h-[480px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl shadow-inner overflow-hidden flex items-center justify-center">
        
        {/* Raster Image underlay for calibration angle mapping */}
        {bgImage && (
          <img
            src={bgImage}
            alt="Measuring geometry"
            style={{
              opacity: imageOpacity,
              transform: `scale(${imageScale}) rotate(${imageRot}deg)`,
            }}
            className="absolute z-0 pointer-events-none transition-transform max-w-[90%] max-h-[90%] object-contain"
          />
        )}

        {/* Interactive SVG Drawing Graphics overlay */}
        <svg
          ref={svgRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 w-full h-full z-10"
        >
          {/* Grid backboard lines for engineering style */}
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(120, 120, 120, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />

          {/* Draw classical protractor visual representation */}
          <g transform={`translate(${center.x}, ${center.y})`} className="opacity-75 select-none pointer-events-none">
            {/* Semicircles */}
            {protractorType === '180' ? (
              <>
                {/* 180 degree outer filling arch */}
                <path
                  d={`M -${protractorRadius},0 A ${protractorRadius},${protractorRadius} 0 0,1 ${protractorRadius},0 Z`}
                  className="fill-indigo-50/15 dark:fill-zinc-800/10 stroke-indigo-600/35 dark:stroke-zinc-500/35"
                  strokeWidth="3.5"
                />
                <path
                  d={`M -${protractorRadius},0 A ${protractorRadius},${protractorRadius} 0 0,1 ${protractorRadius},0`}
                  className="fill-none stroke-indigo-600/40 dark:stroke-indigo-400/40"
                  strokeWidth="12"
                />
                
                {/* Visual degree ticks on protractor curve */}
                {Array.from({ length: 37 }).map((_, i) => {
                  const deg = i * 5; // every 5 degrees
                  const rad = (360 - deg) * (Math.PI / 180); // relative to top half arch
                  const cos = Math.cos(rad);
                  const sin = Math.sin(rad);
                  const is10 = deg % 10 === 0;
                  
                  const rOuter = protractorRadius;
                  const rInner = is10 ? rOuter - Math.max(10, protractorRadius * 0.1) : rOuter - Math.max(5, protractorRadius * 0.05);
                  
                  return (
                    <g key={deg}>
                      <line
                        x1={rOuter * cos}
                        y1={rOuter * sin}
                        x2={rInner * cos}
                        y2={rInner * sin}
                        className="stroke-zinc-800 dark:stroke-zinc-400"
                        strokeWidth={is10 ? '1.5' : '1'}
                      />
                      {is10 && deg > 0 && deg < 180 && (
                        <text
                          x={(rOuter - Math.max(18, protractorRadius * 0.16)) * cos}
                          y={(rOuter - Math.max(18, protractorRadius * 0.16)) * sin + 3.5}
                          textAnchor="middle"
                          className="text-[8px] font-mono font-bold fill-zinc-800 dark:fill-zinc-400"
                        >
                          {deg}
                        </text>
                      )}
                    </g>
                  );
                })}
              </>
            ) : (
              <>
                {/* 360 degree full filling circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={protractorRadius}
                  className="fill-indigo-50/10 dark:fill-zinc-800/5 stroke-indigo-600/30 dark:stroke-zinc-500/30"
                  strokeWidth="3"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={protractorRadius}
                  className="fill-none stroke-zinc-950/10 dark:stroke-zinc-400/20"
                  strokeWidth="10"
                />

                {/* 360 Degree Marks */}
                {Array.from({ length: 72 }).map((_, i) => {
                  const deg = i * 5;
                  const rad = deg * (Math.PI / 180);
                  const cos = Math.cos(rad);
                  const sin = Math.sin(rad);
                  const is10 = deg % 10 === 0;
                  const is90 = deg % 90 === 0;

                  const rOuter = protractorRadius;
                  const rInner = is90 
                    ? rOuter - Math.max(16, protractorRadius * 0.14)
                    : is10 
                      ? rOuter - Math.max(12, protractorRadius * 0.1) 
                      : rOuter - Math.max(5, protractorRadius * 0.05);

                  return (
                    <g key={deg}>
                      <line
                        x1={rOuter * cos}
                        y1={rOuter * sin}
                        x2={rInner * cos}
                        y2={rInner * sin}
                        className={is90 ? 'stroke-indigo-600 dark:stroke-indigo-400' : 'stroke-zinc-700 dark:stroke-zinc-450'}
                        strokeWidth={is10 ? '1.5' : '1'}
                      />
                      {is10 && (
                        <text
                          x={(rOuter - Math.max(18, protractorRadius * 0.16)) * cos}
                          y={(rOuter - Math.max(18, protractorRadius * 0.16)) * sin + 3.5}
                          textAnchor="middle"
                          className="text-[8px] font-mono font-extrabold fill-zinc-700 dark:fill-zinc-400"
                        >
                          {deg}
                        </text>
                      )}
                    </g>
                  );
                })}
              </>
            )}

            {/* Hub origin crosshair */}
            <circle cx="0" cy="0" r="4" className="fill-indigo-600" />
            <line x1="-24" y1="0" x2="24" y2="0" className="stroke-indigo-600/50" strokeWidth="1" />
            <line x1="0" y1="-24" x2="0" y2="24" className="stroke-indigo-600/50" strokeWidth="1" />
          </g>

          {/* Measured Sweep sector fill arc visualizer */}
          <path
            d={`M ${center.x},${center.y} 
               L ${center.x + (protractorRadius - 30) * Math.cos(angleA * (Math.PI / 180))},${center.y + (protractorRadius - 30) * Math.sin(angleA * (Math.PI / 180))}
               A ${protractorRadius - 30},${protractorRadius - 30} 0 ${Math.abs(angleB - angleA) > 180 ? 1 : 0},${angleB > angleA ? 1 : 0} 
                 ${center.x + (protractorRadius - 30) * Math.cos(angleB * (Math.PI / 180))},${center.y + (protractorRadius - 30) * Math.sin(angleB * (Math.PI / 180))} 
               Z`}
            className="fill-indigo-600/10 stroke-none pointer-events-none"
          />

          {/* Caliper Line Arm A */}
          <line
            x1={center.x}
            y1={center.y}
            x2={armA.x}
            y2={armA.y}
            className="stroke-indigo-600 dark:stroke-indigo-400"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Caliper Line Arm B */}
          <line
            x1={center.x}
            y1={center.y}
            x2={armB.x}
            y2={armB.y}
            className="stroke-emerald-600 dark:stroke-emerald-400"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* DRAGGABLE CENTER NODE */}
          <g
            onPointerDown={(e) => handlePointerDown('center', e)}
            id="node-vertex-origin"
            className="cursor-move group"
          >
            <circle
              cx={center.x}
              cy={center.y}
              r="12"
              className="fill-indigo-600 stroke-white dark:stroke-zinc-900 group-hover:scale-110 group-active:scale-125 transition-transform shadow-md"
              strokeWidth="2.5"
            />
            <circle cx={center.x} cy={center.y} r="3" className="fill-white" />
          </g>

          {/* DRAGGABLE ARM A NODE */}
          <g
            onPointerDown={(e) => handlePointerDown('A', e)}
            id="node-arm-a"
            className="cursor-crosshair group"
          >
            <circle
              cx={armA.x}
              cy={armA.y}
              r="14"
              className="fill-indigo-600 stroke-white hover:scale-110 active:scale-120 transition-transform shadow-md"
              strokeWidth="2"
            />
            <text
              x={armA.x}
              y={armA.y + 4}
              textAnchor="middle"
              className="text-[9px] font-bold font-sans fill-white select-none pointer-events-none"
            >
              A
            </text>
          </g>

          {/* DRAGGABLE ARM B NODE */}
          <g
            onPointerDown={(e) => handlePointerDown('B', e)}
            id="node-arm-b"
            className="cursor-crosshair group"
          >
            <circle
              cx={armB.x}
              cy={armB.y}
              r="14"
              className="fill-emerald-600 stroke-white hover:scale-110 active:scale-120 transition-transform shadow-md"
              strokeWidth="2"
            />
            <text
              x={armB.x}
              y={armB.y + 4}
              textAnchor="middle"
              className="text-[9px] font-bold font-sans fill-white select-none pointer-events-none"
            >
              B
            </text>
          </g>
        </svg>

        {/* Center alignment overlay tip */}
        <div className="absolute left-3.5 top-3.5 bg-zinc-900/80 backdrop-blur-xs text-white p-2.5 rounded-lg text-[10px] pointer-events-none select-none z-10 max-w-xs space-y-1">
          <span className="font-extrabold block text-indigo-300">💡 WORKSPACE CONTROLS:</span>
          <span>• Drag center <strong className="text-white">Purple Dot</strong> to align vertex coordinate.</span>
          <br />
          <span>• Drag <strong className="text-white">Knopped Pins (A & B)</strong> to draw angular boundaries.</span>
        </div>
      </div>
    </div>
  );
}
