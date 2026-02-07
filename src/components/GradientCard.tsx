import React from 'react';

interface GradientCardProps {
    children: React.ReactNode;
    gradient?: string;
    backgroundColor?: string;
    onClick?: () => void;
    className?: string;
    animated?: boolean;
}

const GradientCard: React.FC<GradientCardProps> = ({
    children,
    gradient,
    backgroundColor,
    onClick,
    className = '',
    animated = true,
}) => {
    const style: React.CSSProperties = {};

    if (gradient) {
        style.background = gradient;
        style.color = 'white';
    } else if (backgroundColor) {
        style.backgroundColor = backgroundColor;
    }

    return (
        <div
            className={`
                relative overflow-hidden rounded-xl shadow-md
                ${animated ? 'hover-lift cursor-pointer' : ''}
                ${!gradient && !backgroundColor ? 'bg-card border border-divider-light' : ''}
                ${className}
            `}
            style={style}
            onClick={onClick}
        >
            {/* Shine overlay for gradient cards */}
            {gradient && (
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
                        transitionDuration: 'var(--duration-normal)',
                    }}
                />
            )}

            <div className="relative z-10 p-4 h-full">
                {children}
            </div>
        </div>
    );
};

export default GradientCard;
