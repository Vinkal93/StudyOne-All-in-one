import React from 'react';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    color: string;
    onClick?: () => void;
    delay?: number;
}

const ToolCard: React.FC<ToolCardProps> = ({
    icon,
    title,
    subtitle,
    color,
    onClick,
    delay = 0
}) => {
    return (
        <div
            onClick={onClick}
            className="relative overflow-hidden bg-card rounded-xl shadow-sm border border-divider-light 
                       cursor-pointer transition-all group animate-fadeInUp"
            style={{
                animationDelay: `${delay}ms`,
                animationFillMode: 'both',
            }}
        >
            {/* Hover glow background */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
                    transitionDuration: 'var(--duration-normal)',
                }}
            />

            <div className="relative z-10 p-4 flex flex-col items-center justify-center text-center h-full">
                {/* Icon Container with floating effect */}
                <div
                    className="p-3 rounded-xl mb-3 transition-all group-hover:scale-110 group-hover:-translate-y-1"
                    style={{
                        backgroundColor: `${color}15`,
                        boxShadow: `0 8px 24px ${color}20`,
                        transitionDuration: 'var(--duration-normal)',
                        transitionTimingFunction: 'var(--ease-bounce)',
                    }}
                >
                    <div
                        className="text-2xl transition-transform group-hover:scale-110"
                        style={{
                            color,
                            filter: `drop-shadow(0 2px 4px ${color}40)`,
                        }}
                    >
                        {icon}
                    </div>
                </div>

                {/* Title */}
                <h3
                    className="font-semibold text-sm line-clamp-1 mb-1 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {title}
                </h3>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-xs text-text-tertiary line-clamp-1">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Bottom accent line on hover */}
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    transitionDuration: 'var(--duration-normal)',
                }}
            />
        </div>
    );
};

export default ToolCard;
