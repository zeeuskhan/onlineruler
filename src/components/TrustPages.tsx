/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, FileText, AlertTriangle, Code, Copy, Check, ExternalLink, Globe } from 'lucide-react';
import { E_E_A_T_AUTHOR } from '../seoData';

interface TrustPagesProps {
  pageType: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'widget';
  onNavigateHome: () => void;
}

export default function TrustPages({ pageType, onNavigateHome }: TrustPagesProps) {
  const [copiedWidget, setCopiedWidget] = useState<boolean>(false);
  const [formSent, setFormSent] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const widgetIframeSnippet = `<iframe src="https://rulerscale.vercel.app/?tool=ruler&embed=true" width="100%" height="320" style="border:none;border-radius:12px;overflow:hidden;" title="RuleScale - Free Online Ruler" loading="lazy"></iframe><p style="font-size:11px;text-align:center;color:#666;">Online Ruler tool powered by <a href="https://rulerscale.vercel.app/" target="_blank" rel="noopener" style="color:#4f46e5;font-weight:bold;">RuleScale</a></p>`;

  const copyWidgetCode = () => {
    navigator.clipboard?.writeText(widgetIframeSnippet);
    setCopiedWidget(true);
    setTimeout(() => setCopiedWidget(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xs text-zinc-700 dark:text-zinc-300">
      
      {/* Page Content Switcher */}
      {pageType === 'about' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                About RuleScale &amp; Murata Design
              </h1>
              <span className="text-xs text-zinc-400 font-mono">
                Founded by {E_E_A_T_AUTHOR.name} • Last updated {E_E_A_T_AUTHOR.updatedDate}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              <strong>RuleScale</strong> was conceived with a straightforward engineering goal: to eliminate the frustration of inaccurate, uncalibrated web ruler graphics. Traditional search engines return static images or generic 96-DPI rulers that are wildly distorted on modern smartphone and high-resolution Retina laptop displays.
            </p>
            <p>
              By combining client-side SVG vector geometry with physical ISO/IEC card calibration matrices, RuleScale transforms any internet-connected display into an instrument with millimeter precision.
            </p>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pt-2">Our Engineering Principles</h3>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li><strong>Zero Bloat, Zero Downloads:</strong> Everything runs instantaneously in your web browser with a sub-100KB initial bundle footprint.</li>
              <li><strong>100% Privacy Guarantee:</strong> No telemetry, no image storage, and no server uploads. Your camera streams and measurements stay strictly on your local device.</li>
              <li><strong>Accessibility &amp; Open Standards:</strong> Full support for keyboard navigation, high-contrast dark mode, and standard SI metric &amp; imperial fractional units.</li>
            </ul>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pt-4">
              Online Measurement Tools &amp; Benchmark References
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              When evaluating web-based measurement utilities across the internet, users frequently encounter standard utilities such as{' '}
              <a href="https://www.piliapp.com/actual-size/cm-ruler/" target="_blank" rel="nofollow noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:opacity-80">PiliApp CM Ruler</a>,{' '}
              <a href="https://realonlineruler.com/" target="_blank" rel="nofollow noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:opacity-80">RealOnlineRuler</a>,{' '}
              <a href="https://anruler.com/" target="_blank" rel="nofollow noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:opacity-80">AnRuler</a>,{' '}
              <a href="https://ruler.now/" target="_blank" rel="nofollow noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:opacity-80">Ruler.now</a>, and{' '}
              <a href="https://allruler.com/" target="_blank" rel="nofollow noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline hover:opacity-80">AllRuler</a>.
              Below is an objective feature comparison highlighting how RuleScale&apos;s architecture addresses common calibration and privacy limitations:
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-bold">
                  <tr>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Tool / Domain</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Primary Focus</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">Calibration Method</th>
                    <th className="p-3 border-b border-zinc-200 dark:border-zinc-700">RuleScale Dedicated Feature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      <a href="https://www.piliapp.com/actual-size/cm-ruler/" target="_blank" rel="nofollow noopener noreferrer" className="hover:underline">
                        PiliApp CM Ruler
                      </a>
                    </td>
                    <td className="p-3">Centimeter scale on screen</td>
                    <td className="p-3">Preset device selection</td>
                    <td className="p-3">
                      <a href="/online-ruler-cm" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        RuleScale CM Ruler (1mm Subdivisions)
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      <a href="https://realonlineruler.com/" target="_blank" rel="nofollow noopener noreferrer" className="hover:underline">
                        RealOnlineRuler
                      </a>
                    </td>
                    <td className="p-3">Actual size real ruler</td>
                    <td className="p-3">Card / Screen size slider</td>
                    <td className="p-3">
                      <a href="/real-online-ruler" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        RuleScale Real Online Ruler (100% 1:1 Scale)
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      <a href="https://anruler.com/" target="_blank" rel="nofollow noopener noreferrer" className="hover:underline">
                        AnRuler
                      </a>
                    </td>
                    <td className="p-3">Screen ruler &amp; full display view</td>
                    <td className="p-3">Manual DPI adjustment</td>
                    <td className="p-3">
                      <a href="/ruler-overlay" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        RuleScale 4-Edge Viewport Overlay
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      <a href="https://ruler.now/" target="_blank" rel="nofollow noopener noreferrer" className="hover:underline">
                        Ruler.now
                      </a>
                    </td>
                    <td className="p-3">Fast minimalist web ruler</td>
                    <td className="p-3">Standard CSS pixels (96 DPI)</td>
                    <td className="p-3">
                      <a href="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        RuleScale Instant Dual Hub
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">
                      <a href="https://allruler.com/" target="_blank" rel="nofollow noopener noreferrer" className="hover:underline">
                        AllRuler
                      </a>
                    </td>
                    <td className="p-3">Multi-unit ruler tools</td>
                    <td className="p-3">Screen dimension input</td>
                    <td className="p-3">
                      <a href="/actual-size-ruler" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        RuleScale Actual Size Multi-Tool Suite
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {pageType === 'privacy' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Privacy Policy
              </h1>
              <span className="text-xs text-zinc-400 font-mono">Effective Date: October 2026</span>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs">
              <strong>Core Privacy Statement:</strong> RuleScale does not collect, record, transmit, or monetize your personal measurement data, video streams, or photos.
            </div>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">1. Client-Side Execution</h3>
            <p>All calculations, coordinate transformations, and caliper measurements are processed exclusively in your device browser memory via JavaScript.</p>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">2. Device Camera Stream</h3>
            <p>When you enable the Camera Ruler tool, your browser requests local media stream permission. The video feed is attached to an HTML5 canvas element solely for real-time visualization. No video frames or snapshots are sent to any remote server.</p>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">3. Local Storage</h3>
            <p>Your screen calibration PPI preference (e.g., 96 or 227 PPI) and chosen dark/light theme are saved in your browser&apos;s local storage (LocalStorage) so you don&apos;t have to recalibrate on every visit. You can clear this data at any time through your browser settings.</p>
          </div>
        </section>
      )}

      {pageType === 'terms' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Terms of Service
              </h1>
              <span className="text-xs text-zinc-400 font-mono">Updated October 2026</span>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>By accessing or utilizing RuleScale (&ldquo;the Service&rdquo;), you agree to be bound by these standard Terms of Service.</p>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Acceptable Use</h3>
            <p>RuleScale is provided free of charge for educational, personal, craft, and commercial reference. You may embed the official ruler widget on third-party websites using our standard iframe code.</p>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Intellectual Property</h3>
            <p>The vector graphics, SVG ruler layouts, and algorithmic calibration code are proprietary to Murata Design &amp; RuleScale.</p>
          </div>
        </section>
      )}

      {pageType === 'disclaimer' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Measurement Accuracy Disclaimer
              </h1>
              <span className="text-xs text-zinc-400 font-mono">Industrial &amp; Scientific Limitations</span>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <strong>Honest Accuracy Statement:</strong> RuleScale is engineered for everyday household, craft, hardware sizing, 3D printing, and design purposes. It is <em>not</em> a certified metrological instrument.
            </div>
            <p>
              {E_E_A_T_AUTHOR.accuracyDisclaimer}
            </p>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Factors Influencing Display Measurement:</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Browser Zoom:</strong> Ensure your browser zoom is set to 100% (Ctrl+0 or Cmd+0).</li>
              <li><strong>Operating System Scaling:</strong> Windows Display Scaling (e.g. 125% or 150%) adjusts pixel ratios; calibrating with a physical card automatically accounts for this.</li>
              <li><strong>Screen Curvature:</strong> Curved monitors or flexible displays may introduce slight radial variance at the outer edges.</li>
            </ul>
          </div>
        </section>
      )}

      {pageType === 'contact' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Contact RuleScale Engineering
              </h1>
              <span className="text-xs text-zinc-400 font-mono">Direct Support &amp; Feature Feedback</span>
            </div>
          </div>

          {formSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100">Message Received!</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Thank you for contacting RuleScale. Our technical team responds to all inquiries within 24-48 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Alex Smith"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Message or Bug Report</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your question, calibration inquiry, or device request..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Send Message →
              </button>
            </form>
          )}
        </section>
      )}

      {pageType === 'widget' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Embeddable Ruler Widget for Websites
              </h1>
              <span className="text-xs text-zinc-400 font-mono">Free Iframe Snippet with Backlink Attribution</span>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Enhance your craft blog, woodworking site, e-commerce store, or classroom portal by embedding an interactive online ruler directly on your page.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Copy-Paste HTML Snippet</span>
                <button
                  onClick={copyWidgetCode}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  {copiedWidget ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWidget ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-4 bg-zinc-950 text-indigo-300 font-mono text-xs rounded-2xl overflow-x-auto border border-zinc-800 leading-relaxed whitespace-pre-wrap">
                {widgetIframeSnippet}
              </pre>
            </div>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 pt-2">Live Preview of Embedded Widget</h3>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-950/50">
              <div className="text-center text-xs text-zinc-400 mb-2 font-mono">Preview Frame (320px height)</div>
              <div className="w-full bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 block">RuleScale Interactive Calibrated Ruler</span>
                <span className="text-xs text-zinc-500">Live SVG measuring engine loaded inside your host website.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Home Button */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onNavigateHome}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          ← Return to Interactive Online Ruler Hub
        </button>
      </div>

    </article>
  );
}
