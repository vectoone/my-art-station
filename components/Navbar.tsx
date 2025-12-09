
import React, { useState } from 'react';
import { Search, Menu, X, Settings, LogOut, LayoutGrid, Zap, ChevronDown, User as UserIcon } from 'lucide-react';
import { useUser } from '@/app/hooks/useUser';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';

const Button = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";

    const variants: Record<string, string> = {
        primary: "bg-[#0045ff] text-white hover:bg-blue-700 border border-transparent shadow-sm hover:shadow-md",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        dark: "bg-gray-900 text-white hover:bg-black border border-transparent shadow-lg hover:shadow-xl",
        outline: "bg-transparent border border-gray-300 text-gray-700 hover:border-gray-800 hover:text-gray-900",
        ghost: "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    };

    const sizes: Record<string, string> = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Navbar = () => {
    const { user, isLoggedIn, login, logout } = useUser();
    const [showBanner, setShowBanner] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [activeProfileTab, setActiveProfileTab] = useState<'general' | 'library' | 'billing'>('general');

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <>
            <header className="flex flex-col w-full border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
                {/* Top Banner */}
                {showBanner && (
                    <div className="bg-slate-900 text-white text-xs md:text-sm py-2 px-4 flex justify-center items-center relative transition-all">
                        <span className="text-center">
                            New Feature: <span className="font-bold">Vector SVG Export</span> is now live on MyArtStation!
                        </span>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label="Close banner"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Main Nav */}
                <nav className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
                    <div className="flex items-center gap-8">
                        {/* Brand Logo */}
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                                <div className="absolute top-0 w-full h-1/2 bg-[#00c8e6]"></div>
                                <div className="absolute top-1/2 w-full h-1/2 bg-[#ff5a5a]"></div>
                                <div className="z-10 bg-black rounded-full w-4 h-4 flex items-center justify-center">
                                    <div className="w-0.5 h-0.5 bg-white rounded-full mx-[1px]"></div>
                                    <div className="w-0.5 h-0.5 bg-white rounded-full mx-[1px]"></div>
                                </div>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">MyArtStation</span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a href="#features" className="hover:text-black transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
                            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex relative w-64 mr-4">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0045ff]/20 focus:border-[#0045ff] transition-all"
                                placeholder="Search illustrations..."
                            />
                        </div>

                        <div className="hidden sm:flex gap-3 items-center">
                            {isLoggedIn && user ? (
                                <div className="relative">
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                                    >
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200" />
                                        <ChevronDown size={14} className="text-gray-500" />
                                    </button>

                                    {/* User Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <div className="font-bold text-slate-900">{user.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${user.plan === 'pro' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {user.plan} Member
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Credits</span>
                                                    <span className="font-bold text-[#0045ff] flex items-center gap-1">
                                                        <Zap size={14} className="fill-[#0045ff]" />
                                                        {user.credits}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="py-2">
                                                <button
                                                    onClick={() => { setShowProfileModal(true); setIsProfileOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <LayoutGrid size={16} className="text-gray-400" />
                                                    My Library
                                                </button>
                                                <button
                                                    onClick={() => { setShowProfileModal(true); setIsProfileOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <Settings size={16} className="text-gray-400" />
                                                    Settings
                                                </button>
                                            </div>

                                            <div className="border-t border-gray-50 mt-2 pt-2">
                                                <button
                                                    onClick={() => { logout(); setIsProfileOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Button variant="secondary" size="sm" className="font-semibold text-gray-700" onClick={() => setShowAuthModal(true)}>
                                        Log In
                                    </Button>
                                    <Button variant="primary" size="sm" className="font-semibold shadow-blue-500/20" onClick={() => setShowAuthModal(true)}>
                                        Try Pro Free
                                    </Button>
                                </>
                            )}
                        </div>

                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4 shadow-lg absolute w-full left-0 top-full">
                        <a href="#features" className="block text-sm font-medium text-gray-700">Features</a>
                        <a href="#pricing" className="block text-sm font-medium text-gray-700">Pricing</a>
                        <div className="pt-2 flex flex-col gap-2">
                            <Button variant="secondary" size="sm" className="w-full justify-center" onClick={() => setShowAuthModal(true)}>Log In</Button>
                            <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => setShowAuthModal(true)}>Get Started</Button>
                        </div>
                    </div>
                )}
            </header>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLogin={(provider) => {
                    login(provider);
                    setShowAuthModal(false);
                }}
            />

            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
            />
        </>
    );
};

export default Navbar;
