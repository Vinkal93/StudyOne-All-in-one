import React from 'react';

interface SectionHeaderProps {
    title: string;
    actionText?: string;
    onActionClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onActionClick }) => {
    return (
        <div className="flex items-center justify-between py-2 mb-2">
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            {actionText && (
                <button
                    onClick={onActionClick}
                    className="text-primary font-medium text-sm hover:opacity-80 transition-opacity"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

export default SectionHeader;
