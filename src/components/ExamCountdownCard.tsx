import React from 'react';
import GradientCard from './GradientCard';

interface ExamCountdownCardProps {
    name: string;
    daysLeft: number;
    hoursLeft: number;
    category: string;
    onClick?: () => void;
    className?: string;
}

const ExamCountdownCard: React.FC<ExamCountdownCardProps> = ({
    name,
    daysLeft,
    hoursLeft,
    category,
    onClick,
    className = ''
}) => {
    const isUrgent = daysLeft <= 7;
    const gradient = isUrgent
        ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' // Warning
        : 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)'; // Primary

    return (
        <GradientCard
            gradient={gradient}
            onClick={onClick}
            className={className}
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-bold text-lg line-clamp-2 flex-1 mr-2">{name}</h3>
                <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                    {category}
                </span>
            </div>

            <div className="flex items-center gap-4 text-white">
                <div className="text-center">
                    <span className="text-3xl font-bold block leading-none">{daysLeft}</span>
                    <span className="text-xs opacity-80 uppercase tracking-wide">Days</span>
                </div>
                <div className="text-center">
                    <span className="text-3xl font-bold block leading-none">{hoursLeft}</span>
                    <span className="text-xs opacity-80 uppercase tracking-wide">Hours</span>
                </div>
            </div>
        </GradientCard>
    );
};

export default ExamCountdownCard;
