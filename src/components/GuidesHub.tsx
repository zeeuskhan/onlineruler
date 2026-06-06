/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, BookOpen, Clock, Tag, ChevronDown, CheckCircle, GraduationCap, ArrowRight, HelpCircle, HelpCircle as HelpIcon } from 'lucide-react';
import { EDITORIAL_GUIDES, INCH_TICKS_16THS } from '../data';

export default function GuidesHub() {
  const [activeGuideId, setActiveGuideId] = useState<string>(EDITORIAL_GUIDES[0].id);
  const [interactiveUnit, setInteractiveUnit] = useState<'inch' | 'cm'>('inch');
  const [hoveredTickIndex, setHoveredTickIndex] = useState<number>(8); // defaults to 1/2 inch

  // Generate ticks close up for Centimeter interactive ruler
  // We'll show 10 subdivisions (millimeters) in a 0 to 1 cm zoom
  const cmTicks = Array.from({ length: 11 }).map((_, i) => {
    let height = '35%';
    let label = '';
    if (i === 0) { height = '85%'; label = '0 cm'; }
    else if (i === 5) { height = '55%'; label = '0.5'; }
    else if (i === 10) { height = '85%'; label = '1 cm'; }
    return { index: i, height, label };
  });

  return (
    <div className="space-y-10">
      
      {/* SECTION 1: Interactive Read-A-Ruler Micro-Simulator */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-2xl shadow-xl p-5 lg:p-7 select-none">
        
        {/* Header banner */}
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-2.5 pb-4 border-b border-indigo-800 mb-6">
          <div className="space-y-1">
            <span className="text-[9px] bg-indigo-650/80 text-indigo-200 uppercase font-bold tracking-widest px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Interactive Lesson Simulator
            </span>
            <h3 className="text-base lg:text-lg font-bold text-white tracking-tight">
              Interactive Read-A-Ruler Explorer
            </h3>
            <p className="text-xs text-indigo-300 leading-tight">
              Hover over or slide along the giant ticks below to decode how imperial fractions and metric subdivisions are computed.
            </p>
          </div>

          <div className="flex rounded-md p-0.5 bg-indigo-950 border border-indigo-800">
            <button
              onClick={() => { setInteractiveUnit('inch'); setHoveredTickIndex(8); }}
              className={`py-1 px-3 text-xs font-bold rounded ${interactiveUnit === 'inch' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-white'}`}
            >
              Imperial Fractions (Inches)
            </button>
            <button
              onClick={() => { setInteractiveUnit('cm'); setHoveredTickIndex(5); }}
              className={`py-1 px-3 text-xs font-bold rounded ${interactiveUnit === 'cm' ? 'bg-indigo-600 text-white' : 'text-indigo-400 hover:text-white'}`}
            >
              Metric Millimeters (cm)
            </button>
          </div>
        </div>

        {/* The Closeup Graphic Stage */}
        <div className="bg-[#FAF8F2] text-zinc-90 w-full h-44 rounded-xl relative border-2 border-indigo-950 flex flex-col justify-end p-4 shadow-inner overflow-hidden">
          
          <span className="absolute left-3.5 top-2 text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">
            {interactiveUnit === 'inch' ? 'Inch Close-up zoom (1/16th resolution)' : 'Centimeter Close-up zoom (1mm resolution)'}
          </span>

          {/* Svg closeup ticks container */}
          <div className="h-24 w-full flex relative select-none">
            
            {interactiveUnit === 'inch' ? (
              <>
                {INCH_TICKS_16THS.map((tick, i) => {
                  const leftPercent = (tick.position * 100);
                  const isHovered = hoveredTickIndex === i;

                  return (
                    <div
                      key={i}
                      onPointerEnter={() => setHoveredTickIndex(i)}
                      style={{ left: `calc(${leftPercent}% - 6px)` }}
                      className="absolute top-0 bottom-0 w-3 cursor-pointer group flex justify-center"
                    >
                      {/* Visual Line */}
                      <div
                        style={{ height: tick.height }}
                        className={`w-0.5 transition-all ${
                          isHovered 
                            ? 'bg-rose-500 scale-x-150 shadow shadow-rose-200' 
                            : 'bg-zinc-800/80 group-hover:bg-indigo-600'
                        }`}
                      />
                      {/* Fractional text labels */}
                      {tick.label && (
                        <span className="absolute bottom-1 text-[10px] font-bold text-zinc-800 font-mono">
                          {tick.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {cmTicks.map((tick, i) => {
                  const leftPercent = (tick.index * 10);
                  const isHovered = hoveredTickIndex === i;

                  return (
                    <div
                      key={i}
                      onPointerEnter={() => setHoveredTickIndex(i)}
                      style={{ left: `calc(${leftPercent}% - 6px)` }}
                      className="absolute top-0 bottom-0 w-3 cursor-pointer group flex justify-center"
                    >
                      <div
                        style={{ height: tick.height }}
                        className={`w-0.5 transition-all ${
                          isHovered 
                            ? 'bg-rose-500 scale-x-150 shadow shadow-rose-200' 
                            : 'bg-zinc-850/90 group-hover:bg-indigo-600'
                        }`}
                      />
                      {tick.label && (
                        <span className="absolute bottom-1 text-[10px] font-bold text-zinc-850 font-mono">
                          {tick.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* Target interactive hover node guideline center */}
            {interactiveUnit === 'inch' && (
              <div
                style={{ left: `${(hoveredTickIndex / 16) * 100}%` }}
                className="absolute top-0 h-[65%] w-0.5 bg-rose-500/30 border-l border-dashed border-rose-500 pointer-events-none transition-all duration-75"
              />
            )}
            
            {interactiveUnit === 'cm' && (
              <div
                style={{ left: `${hoveredTickIndex * 10}%` }}
                className="absolute top-0 h-[65%] w-0.5 bg-rose-500/30 border-l border-dashed border-rose-500 pointer-events-none transition-all duration-75"
              />
            )}
          </div>
        </div>

        {/* The Closeup explanation math metadata block */}
        <div className="mt-5 p-4 bg-indigo-950/80 rounded-xl border border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
          {interactiveUnit === 'inch' ? (
            <>
              <div className="space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Fraction Checked</span>
                <h4 className="text-base lg:text-lg font-bold font-mono text-white tracking-tight">
                  {INCH_TICKS_16THS[hoveredTickIndex].label || `${hoveredTickIndex}/16"`} of an Inch
                </h4>
                <p className="text-xs text-indigo-200 leading-snug">
                  {hoveredTickIndex === 8 && 'The Half-inch tick: Exactly half-way through the whole block. Second tallest line.'}
                  {hoveredTickIndex === 4 && 'The Quarter-inch tick: Splits the first section in half. Third tallest line.'}
                  {hoveredTickIndex === 12 && 'The Three-quarter inch tick: Denotes 75% length completion.'}
                  {hoveredTickIndex % 2 !== 0 && 'The Sixteenths tick: The smallest, finest subdivision on traditional pocket rules.'}
                  {hoveredTickIndex % 2 === 0 && hoveredTickIndex !== 4 && hoveredTickIndex !== 8 && hoveredTickIndex !== 12 && hoveredTickIndex !== 0 && hoveredTickIndex !== 16 && 'The Eighths tick: Splits inches into eight even sections.'}
                </p>
              </div>

              {/* Fractional math display details */}
              <div className="bg-indigo-900/60 p-3 rounded-lg border border-indigo-800 text-right shrink-0">
                <span className="text-[9px] text-indigo-300 font-bold block uppercase pb-0.5 font-sans">Mathematics translation</span>
                <strong className="text-sm font-mono block text-emerald-400">
                  Decimal: {(hoveredTickIndex / 16).toFixed(4)}"
                </strong>
                <span className="text-[10px] text-zinc-300 block font-mono mt-1">
                  Metric: {((hoveredTickIndex / 16) * 2.54).toFixed(3)} cm
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Subdivision Checked</span>
                <h4 className="text-base lg:text-lg font-mono font-bold text-white tracking-tight">
                  {hoveredTickIndex} Millimeters (mm)
                </h4>
                <p className="text-xs text-indigo-200 leading-snug">
                  {hoveredTickIndex === 0 && 'Origin Scale point zero. Baseline start block.'}
                  {hoveredTickIndex === 5 && 'The Half-centimeter mark: Middle-sized indicator tick separating sections.'}
                  {hoveredTickIndex === 10 && 'Exactly one centimeter: Renders numbers and tall primary grids.'}
                  {hoveredTickIndex !== 0 && hoveredTickIndex !== 5 && hoveredTickIndex !== 10 && 'Traditional individual millimeter ticks.'}
                </p>
              </div>

              <div className="bg-indigo-900/60 p-3 rounded-lg border border-indigo-800 text-right shrink-0">
                <span className="text-[9px] text-indigo-300 font-bold block uppercase pb-0.5 font-sans">Centimeter equivalent</span>
                <strong className="text-sm font-mono block text-emerald-400">
                  Decimal: {(hoveredTickIndex / 10).toFixed(1)} cm
                </strong>
                <span className="text-[10px] text-zinc-300 block font-mono mt-1">
                  Imperial: {((hoveredTickIndex / 10) / 2.54).toFixed(4)}"
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SECTION 2: Topic Editorial Guides Tabs Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Select Article Menu */}
        <div className="md:col-span-4 bg-zinc-50 dark:bg-zinc-800/40 p-3.5 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-2 select-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block px-2.5 pb-1">
            Knowledge Hub Guides
          </span>
          
          <div className="space-y-1" id="article-selectors-grid">
            {EDITORIAL_GUIDES.map((guide) => {
              const isActive = guide.id === activeGuideId;
              return (
                <button
                  key={guide.id}
                  onClick={() => setActiveGuideId(guide.id)}
                  id={`article-select-${guide.id}`}
                  className={`w-full text-left p-3 rounded-lg text-xs leading-normal font-semibold transition-all flex flex-col gap-1 border border-transparent ${
                    isActive
                      ? 'bg-white dark:bg-zinc-850 text-indigo-650 dark:text-zinc-50 shadow-sm border-zinc-200/50 dark:border-zinc-700'
                      : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <span className="block pr-1 leading-tight group-hover:text-indigo-650 font-bold">{guide.title}</span>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400 font-normal">
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {guide.readTime}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Article markdown formatter */}
        <div className="md:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 lg:p-6 shadow-sm">
          {(() => {
            const currentGuide = EDITORIAL_GUIDES.find(g => g.id === activeGuideId);
            if (!currentGuide) return null;

            return (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Meta details */}
                <div className="space-y-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-[9px] tracking-wider uppercase font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 p-1 px-2 rounded">
                    Editorial Guide
                  </span>
                  <h2 className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
                    {currentGuide.title}
                  </h2>
                  <p className="text-xs text-zinc-400 font-normal">
                    {currentGuide.subtitle}
                  </p>
                </div>

                {/* Article Content rendering from our rich guides database data file */}
                <div className="prose dark:prose-invert max-w-none text-xs text-zinc-600 dark:text-zinc-300 space-y-4 leading-relaxed">
                  {currentGuide.contentMarkdown.split('\n\n').map((block, bIdx) => {
                    // Check if headers
                    if (block.startsWith('### ')) {
                      return <h4 key={bIdx} className="text-sm font-bold text-zinc-800 dark:text-zinc-100 pt-3 flex items-center gap-1.5">{block.replace('###', '')}</h4>;
                    }
                    if (block.startsWith('#### ')) {
                      return <h5 key={bIdx} className="text-xs font-bold text-zinc-850 dark:text-zinc-200">{block.replace('####', '')}</h5>;
                    }
                    // Check if bullet lists
                    if (block.startsWith('* ') || block.startsWith('- ')) {
                      return (
                        <ul key={bIdx} className="list-disc pl-5 space-y-1 mt-2">
                          {block.split('\n').map((line, lIdx) => (
                            <li key={lIdx} className="pl-0.5">{line.replace(/^[*\-]\s+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    // Check if blockquotes table markdown
                    if (block.startsWith('|')) {
                      const rows = block.trim().split('\n');
                      return (
                        <div key={bIdx} className="overflow-x-auto my-3 border border-zinc-150 dark:border-zinc-800 rounded-lg">
                          <table className="w-full text-left text-xs border-collapse">
                            <tbody>
                              {rows.map((row, rIdx) => {
                                const cells = row.split('|').filter((_, cIdx) => cIdx > 0 && cIdx < row.split('|').length - 1);
                                const isHeader = rIdx === 0;
                                return (
                                  <tr key={rIdx} className={isHeader ? 'bg-zinc-50 dark:bg-zinc-800/80 font-bold text-zinc-800 dark:text-zinc-200' : 'border-t border-zinc-150 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:bg-zinc-50/50'}>
                                    {cells.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-2 py-1.5 font-medium">{cell.trim().replace(/\*\*/g, '')}</td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    return <p key={bIdx} className="mt-2.5 leading-relaxed">{block}</p>;
                  })}
                </div>

                {/* Footnotes tag keywords */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-1.5 items-center">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[10px] font-bold text-zinc-400 mr-2 uppercase">Core Keywords:</span>
                  {currentGuide.targetKeywords.map((k) => (
                    <span key={k} className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 p-1 px-1.5 rounded">
                      #{k}
                    </span>
                  ))}
                </div>

              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}
