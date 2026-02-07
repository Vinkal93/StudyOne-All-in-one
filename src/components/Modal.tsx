import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        full: 'max-w-full mx-4'
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
                    relative w-full ${sizeClasses[size]} bg-surface 
                    rounded-t-2xl sm:rounded-2xl shadow-2xl 
                    max-h-[90vh] overflow-hidden
                    animate-slideUp sm:animate-scaleIn
                `}
                style={{
                    animation: 'slideUp var(--duration-normal) var(--ease-out)',
                }}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-4 border-b border-divider">
                        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
                        <button
                            onClick={onClose}
                            className="icon-btn"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
