import React from 'react';

interface StreakRingProps {
    currentStreak: number;
    targetStreak?: number;
    size?: number;
    color?: string;
    className?: string;
}

const StreakRing: React.FC<StreakRingProps> = ({
    currentStreak,
    targetStreak = 7,
    size = 80,
    color = '#10B981', // Success color default
    className = ''
}) => {
    const progress = Math.min(Math.max(currentStreak / targetStreak, 0), 1);
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                className="transform -rotate-90 w-full h-full"
            >
                {/* Background Ring */}
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Ring */}
                <circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold" style={{ color: color }}>{currentStreak}</span>
                <span className="text-[10px] text-text-secondary uppercase">Days</span>
            </div>
        </div>
    );
};

export default StreakRing;
