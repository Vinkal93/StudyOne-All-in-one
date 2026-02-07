import React from 'react';
import { MdChevronRight } from 'react-icons/md';
import GradientCard from './GradientCard';

interface JobTimelineCardProps {
    title: string;
    department: string;
    eligibility: string;
    vacancies: number;
    daysLeft: number;
    isNew?: boolean;
    onClick?: () => void;
}

const JobTimelineCard: React.FC<JobTimelineCardProps> = ({
    title,
    department,
    eligibility,
    vacancies,
    daysLeft,
    isNew = false,
    onClick
}) => {
    return (
        <div className="flex cursor-pointer group" onClick={onClick}>
            {/* Timeline */}
            <div className="flex flex-col items-center mr-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${isNew ? 'bg-success' : 'bg-primary'}`}></div>
                <div className="w-0.5 flex-1 bg-divider my-1 group-hover:bg-primary/30 transition-colors"></div>
            </div>

            {/* Card */}
            <GradientCard className="flex-1 mb-3 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {isNew && (
                                <span className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                            )}
                            <h3 className="font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                        </div>
                        <p className="text-text-secondary text-xs mb-2">{department}</p>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded font-medium">
                                {vacancies} Vacancies
                            </span>
                            <span className={`text-[10px] px-2 py-1 rounded font-medium ${daysLeft <= 7 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                                {daysLeft} days left
                            </span>
                            <span className="bg-background text-text-tertiary text-[10px] px-2 py-1 rounded font-medium">
                                {eligibility}
                            </span>
                        </div>
                    </div>
                    <MdChevronRight className="text-text-tertiary group-hover:text-primary transition-colors" size={24} />
                </div>
            </GradientCard>
        </div>
    );
};

export default JobTimelineCard;
