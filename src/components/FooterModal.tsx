import React from 'react';
import { X, Copy, ExternalLink, Check, Mail, Send, Terminal, Shield, FileText, Sparkles, BookOpen } from 'lucide-react';

export type FooterModalType = 'docs' | 'about' | 'changelog' | 'license' | 'privacy' | 'contact' | null;

interface FooterModalProps {
  type: FooterModalType;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const FooterModal: React.FC<FooterModalProps> = ({ type, onClose, onShowToast }) => {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  if (!type) return null;

  const handleCopyExample = () => {
    const examplePrompt = `Create a high-contrast monochromatic kinetic text animation for the word "VERTEX". Split into individual character spans. Track pointer movement: when pointer enters within 100px radius, characters push outward with inverse-square repulsion physics (amplitude 24px) and return with damped spring oscillation. Add a subtle 1px white glow highlight along glyph contours on hover.`;
    navigator.clipboard.writeText(examplePrompt);
    setCopied(true);
    onShowToast('Example prompt copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSent(true);
    onShowToast('Thank you! Your feedback has been received.');
    setTimeout(() => {
      onClose();
      setSent(false);
      setFeedback('');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#262626] rounded-xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
          <div className="flex items-center gap-2.5">
            {type === 'docs' && <BookOpen className="w-5 h-5 text-white" />}
            {type === 'about' && <Sparkles className="w-5 h-5 text-white" />}
            {type === 'changelog' && <Terminal className="w-5 h-5 text-white" />}
            {type === 'license' && <FileText className="w-5 h-5 text-white" />}
            {type === 'privacy' && <Shield className="w-5 h-5 text-white" />}
            {type === 'contact' && <Mail className="w-5 h-5 text-white" />}
            <h3 className="text-lg font-bold text-white tracking-tight capitalize">
              {type === 'docs'
                ? 'Documentation & Prompt Guide'
                : type === 'about'
                ? 'About atexteffects'
                : type === 'changelog'
                ? 'Release Changelog'
                : type === 'license'
                ? 'MIT License'
                : type === 'privacy'
                ? 'Privacy & Data Policy'
                : 'Contact & Feedback'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-4 space-y-4 text-sm text-[#CCCCCC] leading-relaxed flex-1 pr-1 font-sans">
          {type === 'docs' && (
            <div className="space-y-4">
              <p>
                <strong className="text-white">atexteffects</strong> is an implementation-agnostic
                repository of 110 animated typography techniques. Every specimen includes a formal
                prompt engineered to generate code in any stack: React, Tailwind CSS, Framer Motion,
                GSAP, WebGL, Canvas 2D, or pure CSS.
              </p>

              <div className="p-3.5 bg-[#141414] border border-[#242424] rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#888888]">Prompt Architecture Schema</span>
                  <button
                    onClick={handleCopyExample}
                    className="flex items-center gap-1 text-xs text-white hover:text-[#AAAAAA] transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Sample'}</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-[#A3A3A3] space-y-1 bg-[#0A0A0A] p-2.5 rounded border border-[#1A1A1A]">
                  <p><span className="text-white">1. Target:</span> Glyph segmentation & bounding layout</p>
                  <p><span className="text-white">2. Physics / Motion:</span> Easing, frequency, wave functions & amplitude</p>
                  <p><span className="text-white">3. Vector / Shader:</span> Specular bloom, masks, SVG filters, clipping paths</p>
                  <p><span className="text-white">4. Easing & Loop:</span> Exact timing curves and boundary states</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">How to Use with AI Tools</h4>
                <p className="text-xs text-[#AAAAAA]">
                  Paste any prompt directly into <strong>Claude</strong>, <strong>ChatGPT</strong>, <strong>v0.dev</strong>, <strong>Cursor</strong>, or <strong>Gemini</strong>. Specify your target framework (e.g. <em>&quot;Implement this using Tailwind CSS and Framer Motion in Next.js&quot;</em>) for turnkey production components.
                </p>
              </div>
            </div>
          )}

          {type === 'about' && (
            <div className="space-y-3">
              <p>
                <strong className="text-white">atexteffects</strong> was founded to bridge the gap between creative typography direction and practical code generation.
              </p>
              <p>
                Instead of locking animations behind heavyweight npm packages or closed frameworks, each effect is formulated as a precise, mathematical prompt. This makes every animation timeless, portable, and adaptable to future renderers.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#141414] border border-[#222222] rounded-lg">
                  <div className="text-xl font-bold text-white">110</div>
                  <div className="text-xs text-[#888888]">Curated Effects</div>
                </div>
                <div className="p-3 bg-[#141414] border border-[#222222] rounded-lg">
                  <div className="text-xl font-bold text-white">10</div>
                  <div className="text-xs text-[#888888]">Animation Categories</div>
                </div>
                <div className="p-3 bg-[#141414] border border-[#222222] rounded-lg">
                  <div className="text-xl font-bold text-white">0kb</div>
                  <div className="text-xs text-[#888888]">Runtime Dependencies</div>
                </div>
                <div className="p-3 bg-[#141414] border border-[#222222] rounded-lg">
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-xs text-[#888888]">Open Source & Free</div>
                </div>
              </div>
            </div>
          )}

          {type === 'changelog' && (
            <div className="space-y-4">
              <div className="border-l-2 border-white pl-3.5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">v1.0.0</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F1F1F] text-[#999999]">Latest</span>
                </div>
                <p className="text-xs text-[#AAAAAA]">Major Catalog Expansion & Circuit Architecture</p>
                <ul className="text-xs text-[#888888] list-disc list-inside space-y-1 pt-1">
                  <li>Added 40 new master typography animations across all 10 categories (total 110).</li>
                  <li>Engineered interactive SVG circuit bus footer with noise-flicker glitch title.</li>
                  <li>Real-time prompt details modal with tag filtering and permalinks.</li>
                  <li>Local storage favorites persistence with bulk export tool.</li>
                  <li>Full keyboard navigation shortcuts engine (⌘K, J, K, F, C, S, M, ?).</li>
                </ul>
              </div>
            </div>
          )}

          {type === 'license' && (
            <div className="space-y-2 font-mono text-xs text-[#999999] bg-[#0A0A0A] p-4 rounded-lg border border-[#1E1E1E]">
              <p className="text-white font-bold">MIT License</p>
              <p>Copyright (c) 2026 atexteffects contributors</p>
              <p className="pt-2 leading-relaxed">
                Permission is hereby granted, free of charge, to any person obtaining a copy of this
                software and associated documentation files, to deal in the Software without restriction,
                including without limitation the rights to use, copy, modify, merge, publish, distribute,
                sublicense, and/or sell copies of the Software.
              </p>
              <p className="pt-2">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#141414] border border-[#222222] rounded-lg">
                <h4 className="text-xs font-semibold uppercase text-white mb-1">Zero Tracking & Local Storage Only</h4>
                <p className="text-xs text-[#AAAAAA]">
                  atexteffects does not use analytics trackers, fingerprinting scripts, third-party cookies,
                  or external telemetry.
                </p>
              </div>
              <ul className="text-xs text-[#888888] space-y-2 list-disc list-inside">
                <li><strong className="text-white">Favorites:</strong> Saved strictly inside your browser&apos;s <code className="text-white">localStorage</code>.</li>
                <li><strong className="text-white">Preferences:</strong> Reduced motion toggle stored in local state.</li>
                <li><strong className="text-white">Privacy:</strong> 100% private, offline-capable, and client-side executed.</li>
              </ul>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-3">
              <p className="text-xs text-[#AAAAAA]">
                Have an idea for a new animation effect, found a glitch, or want to contribute? Send a note directly.
              </p>
              {sent ? (
                <div className="p-4 bg-green-950/40 border border-green-800/60 rounded-lg text-center text-green-300 text-xs font-medium">
                  ✓ Message transmitted! Thank you for helping improve the catalog.
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#AAAAAA] mb-1">Your Email (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="designer@studio.com"
                      className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#AAAAAA] mb-1">Feedback / Effect Idea</label>
                    <textarea
                      required
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Describe your typography animation idea or report..."
                      className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 text-xs text-[#888888] hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-white text-black hover:bg-[#E5E5E5] transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="pt-3 border-t border-[#1E1E1E] flex items-center justify-between text-xs text-[#666666]">
          <span>atexteffects v1.0.0</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>GitHub repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
