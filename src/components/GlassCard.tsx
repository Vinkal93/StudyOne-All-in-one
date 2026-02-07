import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'gradient' | 'gradient-success' | 'gradient-warning';
    animated?: boolean;
    glow?: boolean;
    style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    onClick,
    variant = 'default',
    animated = true,
    glow = false,
    style,
}) => {
    const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
            case 'gradient':
                return {
                    background: 'var(--gradient-primary)',
                    color: 'white',
                };
            case 'gradient-success':
                return {
                    background: 'var(--gradient-success)',
                    color: 'white',
                };
            case 'gradient-warning':
                return {
                    background: 'var(--gradient-warning)',
                    color: 'white',
                };
            default:
                return {};
        }
    };

    const baseClasses = variant === 'default'
        ? 'bg-card border border-divider-light'
        : '';

    return (
        <div
            className={`
                relative overflow-hidden rounded-xl shadow-sm
                ${baseClasses}
                ${animated ? 'hover-lift cursor-pointer' : ''}
                ${glow ? 'hover-glow' : ''}
                ${className}
            `}
            style={{
                ...getVariantStyles(),
                transition: 'all var(--duration-normal) var(--ease-out)',
                ...style,
            }}
            onClick={onClick}
        >
            {/* Shimmer overlay on hover */}
            {variant !== 'default' && (
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                    }}
                />
            )}

            <div className="relative z-10 p-4">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
