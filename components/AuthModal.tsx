
import React from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (provider: 'google' | 'microsoft') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-md w-full p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center relative overflow-hidden mb-6 shadow-md">
                        <div className="absolute top-0 w-full h-1/2 bg-[#00c8e6]"></div>
                        <div className="absolute top-1/2 w-full h-1/2 bg-[#ff5a5a]"></div>
                        <div className="z-10 bg-black rounded-full w-5 h-5 flex items-center justify-center">
                            <div className="w-0.5 h-0.5 bg-white rounded-full mx-[1px]"></div>
                            <div className="w-0.5 h-0.5 bg-white rounded-full mx-[1px]"></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
                    <p className="text-gray-600 mb-8">Sign in to save your assets and manage credits.</p>

                    <div className="flex flex-col gap-3 w-full mb-8">
                        <button
                            onClick={() => onLogin('google')}
                            className="flex items-center justify-center gap-3 w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium text-gray-700 transition-all active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => onLogin('microsoft')}
                            className="flex items-center justify-center gap-3 w-full h-12 bg-[#2f2f2f] hover:bg-black text-white rounded-xl font-medium transition-all shadow-lg active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 23 23">
                                <path fill="#f3f3f3" d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
                            </svg>
                            Continue with Microsoft
                        </button>
                    </div>

                    <p className="text-xs text-gray-400">
                        By continuing, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Service</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
