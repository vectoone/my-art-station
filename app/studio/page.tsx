
'use client';

import React, { useState } from 'react';
import { useUser } from '@/app/hooks/useUser';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import {
    LayoutGrid,
    Shuffle,
    Download,
    Lock,
    Zap,
    Image as ImageIcon,
    MoreVertical
} from 'lucide-react';

// Style Presets
const STYLES = [
    { id: 'flat', name: 'Flat Vector', image: 'https://img.freepik.com/free-vector/flat-design-modern-city-landscape_23-2149156555.jpg?size=626&ext=jpg' },
    { id: 'doodle', name: 'Hand Drawn', image: 'https://img.freepik.com/free-vector/hand-drawn-business-element-collection_23-2149852236.jpg?size=626&ext=jpg' },
    { id: 'watercolor', name: 'Watercolor', image: 'https://img.freepik.com/free-vector/watercolor-landscape-background_52683-62547.jpg?size=626&ext=jpg' },
    { id: 'tech', name: 'Tech Isometric', image: 'https://img.freepik.com/free-vector/isometric-modern-technology-concept_23-2148458763.jpg?size=626&ext=jpg' },
];

export default function StudioPage() {
    const { user, isLoggedIn, login, deductCredits } = useUser();
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('flat');
    const [batchSize, setBatchSize] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Mock generated images for now, or fetch from API
    // In real implementation, these would come from state/API
    const [generatedImages, setGeneratedImages] = useState<any[]>([]);

    const handleGenerate = async () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        if (user && user.credits < batchSize) {
            setShowProfileModal(true); // Open recharging
            return;
        }

        setIsGenerating(true);

        // Mock API Call Delay
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Mock Success
            const newImage = {
                id: Date.now().toString(),
                url: `https://picsum.photos/seed/${Date.now()}/800/600`,
                prompt: prompt,
                style: selectedStyle,
                type: 'mock' // indicator
            };
            setGeneratedImages([newImage, ...generatedImages]);
            deductCredits(batchSize);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShuffle = () => {
        const prompts = [
            "A futuristic city with floating gardens",
            "A cute robot holding a flower",
            "Abstract geometric shapes in blue and orange",
            "Mountain landscape at sunset, minimal style"
        ];
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }

    return (
        <div className="flex flex-col h-screen bg-white">
            <Navbar /> {/* Reusing existing Navbar */}

            <div className="flex flex-1 overflow-hidden">
                {/* LEFT SIDEBAR - CONTROLS */}
                <aside className="w-[400px] border-r border-gray-100 bg-gray-50/50 flex flex-col p-6 overflow-y-auto">

                    {/* Style Grid */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Select Style</label>
                        <div className="grid grid-cols-2 gap-3">
                            {STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`relative aspect-[4/3] rounded-xl overflow-hidden text-left group transition-all ${selectedStyle === style.id ? 'ring-2 ring-offset-2 ring-[#0045ff]' : 'hover:opacity-80'}`}
                                >
                                    <img src={style.image} alt={style.name} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                        <span className="text-white text-xs font-bold">{style.name}</span>
                                    </div>
                                    {selectedStyle === style.id && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#0045ff] rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prompt Input */}
                    <div className="mb-8 relative flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Describe your idea</label>
                            <button onClick={handleShuffle} className="text-xs text-[#0045ff] font-bold flex items-center gap-1 hover:underline">
                                <Shuffle size={12} /> Shuffle
                            </button>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="A flat vector illustration of..."
                            className="w-full h-40 md:h-full resize-none p-4 rounded-xl bg-white border border-gray-200 focus:border-[#0045ff] focus:ring-2 focus:ring-[#0045ff]/20 outline-none text-gray-900 placeholder:text-gray-400 font-medium leading-relaxed shadow-sm transition-all"
                        />
                    </div>

                    {/* Batch & Generate */}
                    <div className="mt-auto">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Batch Size</label>
                        <div className="flex bg-white p-1 rounded-xl border border-gray-200 mb-6 shadow-sm">
                            {[1, 2, 3, 4].map(num => {
                                const isLocked = user?.plan === 'free' && num > 2;
                                return (
                                    <button
                                        key={num}
                                        onClick={() => !isLocked && setBatchSize(num)}
                                        disabled={isLocked}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1 ${batchSize === num ? 'bg-slate-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'} ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        title={isLocked ? "Upgrade to Pro for Batch Gen" : ""}
                                    >
                                        {num} {isLocked && <Lock size={10} />}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full py-4 bg-[#0045ff] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Zap className="fill-white" size={18} />
                                    Generate <span className="opacity-60 text-sm font-medium ml-1">(-{batchSize} Credits)</span>
                                </>
                            )}
                        </button>
                    </div>

                </aside>

                {/* RIGHT CANVAS - GALLERY */}
                <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
                    {generatedImages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-64 h-64 mb-8 opacity-50 bg-[url('https://cdn.dribbble.com/users/1040854/screenshots/16010156/media/5847eacec6b6d510255b389ee9c635df.jpg?compress=1&resize=800x600')] bg-contain bg-no-repeat bg-center mix-blend-multiply"></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to create</h3>
                            <p className="max-w-xs text-center text-gray-500">Your generated vector illustrations will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                            {generatedImages.map(img => (
                                <div key={img.id} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-[4/3] p-4 flex items-center justify-center bg-gray-[10px]">
                                        <img src={img.url} alt={img.prompt} className="max-h-full max-w-full object-contain" />
                                    </div>

                                    <div className="p-4">
                                        <p className="text-sm text-gray-900 font-medium line-clamp-1 mb-1">{img.prompt}</p>
                                        <p className="text-xs text-gray-500 capitalize">{img.style}</p>
                                    </div>

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                                        <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors">
                                            <Download size={16} /> Download PNG
                                        </button>
                                        <button
                                            className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${user?.plan === 'pro' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                                            onClick={() => user?.plan !== 'pro' && setShowProfileModal(true)}
                                        >
                                            {user?.plan === 'pro' ? <Download size={16} /> : <Lock size={16} />}
                                            Download SVG
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modals */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={(p) => { login(p); setShowAuthModal(false); }} />
            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
        </div>
    );
}
