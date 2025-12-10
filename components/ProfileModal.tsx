import React, { useState, useEffect } from 'react';
import {
    X,
    Settings,
    Grid,
    CreditCard,
    Edit2,
    Lock,
    Download,
    Zap
} from 'lucide-react';
import { useUser, User } from '@/app/hooks/useUser';
import PricingCard from './PricingCard';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'general' | 'library' | 'billing';

interface ImageItem {
    id: string;
    prompt: string;
    style: string;
    svgUrl: string;
    pngUrl?: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab === 'library') {
            fetchLibrary();
        }
    }, [isOpen, activeTab]);

    const fetchLibrary = async () => {
        setIsLoadingLibrary(true);
        try {
            const res = await fetch('/api/library');
            if (res.ok) {
                const data = await res.json();
                setImages(data.images || []);
            } else {
                throw new Error("Fetch failed");
            }
        } catch (error) {
            console.warn("Failed to fetch library, using mock data for dev demo:", error);
            // Mock Data Fallback
            if (process.env.NODE_ENV === 'development') {
                setImages([
                    { id: '1', prompt: "A sleek rocket ship taking off, flat style", style: "Flat", svgUrl: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/android.svg" },
                    { id: '2', prompt: "Geometric mountains at sunset", style: "Doodle", svgUrl: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/compass.svg" },
                    { id: '3', prompt: "Cute robot holding a flower", style: "Tech", svgUrl: "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/duck.svg" }
                ]);
            }
        } finally {
            setIsLoadingLibrary(false);
        }
    };

    const handleDownload = (svgContent: string, id: string) => {
        // Current implementation stores Data URI in svgUrl for demo
        // If it's a data URI, we can download it directly.
        // If it's a path, we fetch it.
        const a = document.createElement('a');
        a.href = svgContent;
        a.download = `vector-${id}.svg`;
        a.click();
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-4xl h-[600px] flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Left Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200" />
                        <div className="truncate">
                            <div className="font-bold text-sm text-slate-900 truncate">{user.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{user.plan} Plan</div>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-1">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            <Settings size={18} />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'library' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            <Grid size={18} />
                            My Library
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'billing' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                            <CreditCard size={18} />
                            Billing
                        </button>
                    </nav>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-xl font-bold text-slate-900 capitalize">
                            {activeTab === 'general' ? 'Account Settings' : activeTab === 'library' ? 'My Library' : 'Billing & Credits'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'general' && (
                            <div className="max-w-md space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Profile Photo</label>
                                    <div className="relative inline-block group cursor-pointer">
                                        <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white shadow-md" />
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit2 size={24} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user.name}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#0045ff] focus:ring-2 focus:ring-[#0045ff]/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={user.email}
                                                readOnly
                                                className="w-full px-4 py-2 pl-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                                            />
                                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
                                            <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale opacity-60" alt="" />
                                            Linked via Google
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'library' && (
                            <div>
                                {isLoadingLibrary ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : images.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                            <Grid size={48} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">No assets yet</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto">Generate your first vector illustration to see it appear here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {images.map((img) => (
                                            <div key={img.id} className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 relative group overflow-hidden shadow-sm hover:shadow-md transition-all">
                                                {/* Use object tag for SVG to render safely or img tag if data/url */}
                                                <img src={img.svgUrl} alt={img.prompt} className="w-full h-full object-contain p-4" />

                                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                                                    <p className="text-white text-xs text-center line-clamp-2 mb-3 px-2 font-medium">{img.prompt}</p>
                                                    <button
                                                        onClick={() => handleDownload(img.svgUrl, img.id)}
                                                        className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-50 transform hover:scale-105 transition-all"
                                                    >
                                                        <Download size={14} /> Download
                                                    </button>
                                                </div>
                                                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {img.style}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-8">
                                <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-blue-900/20">
                                    <div>
                                        <div className="text-blue-200 text-sm font-medium mb-1">Current Balance</div>
                                        <div className="text-3xl font-bold flex items-center gap-2">
                                            <Zap className="fill-yellow-400 text-yellow-400" />
                                            {user.credits} Credits
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400 mb-1">Current Plan</div>
                                        <div className="font-bold capitalize">{user.plan}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recharge Credits</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                                        <PricingCard
                                            title="Starter"
                                            price="$15"
                                            credits="100 Credits"
                                            description="Perfect for a single project."
                                        />
                                        <PricingCard
                                            title="Pro Pack"
                                            price="$35"
                                            credits="500 Credits"
                                            description="Best value for professionals."
                                            isPro={true}
                                        />
                                        <PricingCard
                                            title="Agency"
                                            price="$99"
                                            credits="2000 Credits"
                                            description="For teams."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
