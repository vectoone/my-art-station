
'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PricingCard from '@/components/PricingCard';
import {
  X,
  Layers,
  PenTool,
  Download,
  ArrowUpRight,
  Check,
  MousePointer2,
  Instagram,
  Twitter,
  HelpCircle
} from 'lucide-react';

// --- REMAINING STATIC SECTIONS ---

const HowItWorks = () => (
  <section id="how-it-works" className="px-4 py-24 bg-white relative">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          From idea to SVG in three steps
        </h2>
        <p className="text-gray-600 text-lg">MyArtStation removes the friction from illustration. No more searching stock sites.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {[
          { title: "Choose a style", desc: "Select from our curated library of professional vector styles.", icon: <Layers className="text-blue-500" /> },
          { title: "Describe & Generate", desc: "Type what you need. Our AI draws it instantly in vector format.", icon: <PenTool className="text-pink-500" /> },
          { title: "Export to Figma", desc: "Download as SVG or PNG and use it directly in your designs.", icon: <Download className="text-cyan-500" /> }
        ].map((step, idx) => (
          <div key={idx} className="flex flex-col gap-6 group">
            <div className="aspect-[4/3] bg-gray-50 rounded-3xl border border-gray-100 p-8 flex items-center justify-center overflow-hidden group-hover:border-gray-200 transition-colors relative">
              <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm text-gray-400 border border-gray-100">{idx + 1}</div>
              <div className="scale-150 transform group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Features = () => (
  <section id="features" className="px-4 py-24 bg-gray-50 border-y border-gray-200">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-20 relative">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block relative z-10">
          Professional grade vectors
        </h2>
        <div className="w-48 h-3 bg-yellow-300/50 absolute -bottom-1 left-1/2 transform -translate-x-1/2 -z-0 rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-x-24 lg:gap-y-20">
        {[
          { title: "Infinite Resolution", desc: "Scale to billboards without pixelation. True SVG paths.", icon: <ArrowUpRight /> },
          { title: "Worry-Free License", desc: "Every generated image includes a commercial license. You own it.", icon: <Check /> },
          { title: "Brand Consistency", desc: "Upload a reference to train the AI on your specific brand look.", icon: <MousePointer2 /> },
          { title: "Editable Paths", desc: "Export clean code. Edit colors and curves in Illustrator or Figma.", icon: <PenTool /> }
        ].map((feat, i) => (
          <div key={i} className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-slate-900">
              {feat.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">{feat.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="py-24 bg-white relative">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Simple Pricing. No Subscriptions.</h2>
        <div className="inline-block bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold">
          Pay once, use forever. Credits never expire.
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          title="Starter"
          price="$15"
          credits="100 Credits"
          description="Perfect for a single project or freelancers just getting started."
        />
        <PricingCard
          title="Pro Pack"
          price="$35"
          credits="500 Credits"
          description="Best value for professional designers and agencies."
          isPro={true}
        />
        <PricingCard
          title="Agency"
          price="$99"
          credits="2000 Credits"
          description="For teams that need a massive library of consistent assets."
        />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1/2 bg-[#00c8e6]"></div>
              <div className="absolute top-1/2 w-full h-1/2 bg-[#ff5a5a]"></div>
            </div>
            <span className="font-bold text-lg text-slate-900">MyArtStation</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            The AI vector engine for modern design teams.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-4">Product</h4>
          <ul className="space-y-3 text-sm text-gray-600 font-medium">
            <li><a href="#" className="hover:text-black">Features</a></li>
            <li><a href="#" className="hover:text-black">Pricing</a></li>
            <li><a href="#" className="hover:text-black">API</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-600 font-medium">
            <li className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" className="w-4 h-4" alt="figma" />
              <a href="#" className="hover:text-black">Figma Plugin</a>
            </li>
            <li><a href="#" className="hover:text-black">Community</a></li>
          </ul>
        </div>

        <div>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-black hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-black hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-8 border-t border-gray-100">
        <p>© 2025 MyArtStation Inc. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#00c8e6] selection:text-white scroll-smooth transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-white p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 hover:scale-105 transition-transform">
          <HelpCircle size={24} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
