
import React from 'react';
import { Check } from 'lucide-react';

const Button = ({
    variant = 'primary',
    className = '',
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed px-5 py-2.5 text-base";

    const variants: Record<string, string> = {
        primary: "bg-[#0045ff] text-white hover:bg-blue-700 border border-transparent shadow-sm hover:shadow-md",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        dark: "bg-gray-900 text-white hover:bg-black border border-transparent shadow-lg hover:shadow-xl",
    };

    return (
        <button className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const PricingCard = ({ title, price, credits, description, isPro = false }: any) => (
    <div className={`relative p-8 rounded-3xl border flex flex-col h-full min-w-[280px] snap-center transition-transform hover:-translate-y-1 duration-300 ${isPro ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white border-gray-200 text-slate-900'}`}>
        {isPro && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                Most Popular
            </div>
        )}

        <div className="mb-6">
            <h3 className={`text-lg font-bold mb-2 ${isPro ? 'text-gray-200' : 'text-gray-500'}`}>{title}</h3>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{price}</span>
                {price !== "Free" && <span className={`text-sm font-medium ${isPro ? 'text-gray-400' : 'text-gray-500'}`}>/ pack</span>}
            </div>
            <p className={`text-sm mt-3 font-medium ${isPro ? 'text-blue-200' : 'text-blue-600'}`}>{credits}</p>
        </div>

        <div className="flex-1">
            <p className={`text-sm leading-relaxed mb-8 ${isPro ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
            <ul className="space-y-4 mb-8">
                {[
                    "Commercial License",
                    "SVG & PNG Export",
                    "Credits Never Expire",
                    price === "$35" ? "Priority Generation" : "Standard Speed"
                ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                        <Check size={16} className={isPro ? 'text-blue-400' : 'text-blue-600'} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>

        <Button variant={isPro ? 'secondary' : 'dark'} className="w-full rounded-xl">
            {price === "Free" ? "Start Generating" : "Buy Credits"}
        </Button>
    </div>
);

export default PricingCard;
