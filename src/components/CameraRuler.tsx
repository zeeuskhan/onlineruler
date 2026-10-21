/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, Pause, Play, ShieldAlert, Sparkles, Sliders, Copy, Check, Info } from 'lucide-react';
import { CalibrationData } from '../types';

interface CameraRulerProps {
  calibration: CalibrationData;
  onOpenCalibration: () => void;
}

export default function CameraRuler({ calibration, onOpenCalibration }: CameraRulerProps) {
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Calipers over the camera feed
  const [caliperA, setCaliperA] = useState<number>(100);
  const [caliperB, setCaliperB] = useState<number>(260);
  const [draggingCaliper, setDraggingCaliper] = useState<'A' | 'B' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your current browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreamActive(true);
      setIsFrozen(false);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access in your browser settings to use the live camera ruler.'
          : err.message || 'Unable to access your device camera.'
      );
      setStreamActive(false);
    }
  }, [facingMode, stopStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  // Freeze frame capture
  const toggleFreeze = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!isFrozen) {
      // Capture current frame to canvas
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      setIsFrozen(true);
    } else {
      setIsFrozen(false);
    }
  };

  // Flip camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Compute distance
  const deltaPx = Math.abs(caliperB - caliperA);
  const inches = deltaPx / calibration.ppi;
  const cm = inches * 2.54;
  const mm = cm * 10;

  const handleCopy = () => {
    const text = `${cm.toFixed(2)} cm (${mm.toFixed(1)} mm / ${inches.toFixed(2)} in)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner Notice */}
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              Live Camera Ruler &amp; AR Measurement Overlay
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
              Point your phone camera or webcam at any object. Use interactive calipers over the live feed. All video runs <strong>100% on-device</strong> with zero uploads.
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {!streamActive ? (
            <button
              onClick={startStream}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 p-4 rounded-2xl text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Camera Stage Viewport */}
      <div
        ref={containerRef}
        className="relative bg-zinc-950 rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none"
      >
        {/* Live Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover max-h-[520px] ${streamActive && !isFrozen ? 'block' : 'hidden'}`}
        />

        {/* Frozen Canvas Frame */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover max-h-[520px] ${isFrozen ? 'block' : 'hidden'}`}
        />

        {/* Inactive Standby Screen */}
        {!streamActive && (
          <div className="text-center p-8 space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-zinc-850 mx-auto flex items-center justify-center text-zinc-400">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Camera is Inactive</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Click &ldquo;Start Camera&rdquo; above to enable real-time video measurement, or use our on-screen ruler for physical glass contact measurements.
              </p>
            </div>
            <button
              onClick={startStream}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer"
            >
              Enable Device Camera
            </button>
          </div>
        )}

        {/* Live Overlay Ticks & Calipers (Active when stream is running or frame is frozen) */}
        {streamActive && (
          <>
            {/* Top Metric & Imperial Ruler Overlay Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/85 via-black/50 to-transparent pointer-events-none p-3 flex justify-between items-center text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px] font-bold">
                  {isFrozen ? 'FRAME FROZEN' : 'LIVE AR STREAM'}
                </span>
              </div>
              <div className="font-mono text-xs bg-black/60 px-3 py-1 rounded-full border border-white/20">
                Scale: {calibration.ppi} PPI ({calibration.calibrated ? 'Calibrated' : 'Standard 96 DPI'})
              </div>
            </div>

            {/* Caliper Line A */}
            <div
              style={{ left: `${caliperA}px` }}
              className="absolute top-0 bottom-0 w-8 -translate-x-4 cursor-ew-resize flex items-center justify-center z-20 group"
              onPointerDown={(e) => {
                setDraggingCaliper('A');
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (draggingCaliper === 'A' && containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const newX = Math.max(10, Math.min(e.clientX - rect.left, rect.width - 20));
                  setCaliperA(newX);
                }
              }}
              onPointerUp={(e) => {
                if (draggingCaliper === 'A') {
                  setDraggingCaliper(null);
                  try {
                    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                  } catch (_) {}
                }
              }}
            >
              <div className="w-0.5 h-full bg-indigo-400 group-hover:bg-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.8)] relative">
                <div className="absolute top-1/3 -translate-x-1/2 left-1/2 bg-indigo-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                  ◄ Caliper A
                </div>
              </div>
            </div>

            {/* Caliper Line B */}
            <div
              style={{ left: `${caliperB}px` }}
              className="absolute top-0 bottom-0 w-8 -translate-x-4 cursor-ew-resize flex items-center justify-center z-20 group"
              onPointerDown={(e) => {
                setDraggingCaliper('B');
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (draggingCaliper === 'B' && containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const newX = Math.max(10, Math.min(e.clientX - rect.left, rect.width - 20));
                  setCaliperB(newX);
                }
              }}
              onPointerUp={(e) => {
                if (draggingCaliper === 'B') {
                  setDraggingCaliper(null);
                  try {
                    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                  } catch (_) {}
                }
              }}
            >
              <div className="w-0.5 h-full bg-emerald-400 group-hover:bg-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.8)] relative">
                <div className="absolute top-2/3 -translate-x-1/2 left-1/2 bg-emerald-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                  Caliper B ►
                </div>
              </div>
            </div>

            {/* Shaded Caliper Bridge Span */}
            <div
              style={{
                left: `${Math.min(caliperA, caliperB)}px`,
                width: `${Math.abs(caliperA - caliperB)}px`,
              }}
              className="absolute bottom-16 h-8 bg-indigo-500/30 border-t border-b border-indigo-400/50 flex items-center justify-center pointer-events-none"
            >
              <span className="text-[10px] font-mono font-bold text-white bg-black/70 px-2 py-0.5 rounded">
                {cm.toFixed(2)} cm • {inches.toFixed(2)}&quot;
              </span>
            </div>

            {/* Floating Camera Control HUD at Bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl shadow-2xl z-30">
              <button
                onClick={toggleFreeze}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  isFrozen ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isFrozen ? 'Resume live video' : 'Freeze video to inspect measurement'}
              >
                {isFrozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isFrozen ? 'Resume' : 'Freeze'}</span>
              </button>

              <button
                onClick={toggleFacingMode}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Flip Camera (Front/Rear)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Measurement Readout Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-center select-none">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Centimeters</span>
          <strong className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50 font-mono">
            {cm.toFixed(2)} cm
          </strong>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Millimeters</span>
          <strong className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50 font-mono">
            {mm.toFixed(1)} mm
          </strong>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Inches</span>
          <strong className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50 font-mono">
            {inches.toFixed(2)}&quot;
          </strong>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Pixels (Span)</span>
          <strong className="text-base sm:text-lg text-zinc-900 dark:text-zinc-50 font-mono">
            {deltaPx} px
          </strong>
        </div>
      </div>

      {/* Accuracy Advisory Box */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-2xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
        <strong className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-600" />
          Camera Parallax &amp; Optical Distance Guide:
        </strong>
        <p className="leading-relaxed text-amber-800 dark:text-amber-300">
          Due to optical lens perspective, objects held closer to the camera appear larger on screen. For highest accuracy, place a known reference item (such as a standard credit card: 85.6 mm) side-by-side with your item at the exact same distance from the lens, or use screen-contact mode on our calibrated ruler.
        </p>
      </div>

    </div>
  );
}
