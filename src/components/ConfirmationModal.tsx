import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="text-center pt-2 pb-6">
                <div className={`
                    mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl
                    ${type === 'danger' ? 'bg-red-100 text-red-600' :
                        type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'}
                `}>
                    {type === 'danger' ? '⚠️' : type === 'warning' ? '!' : 'ℹ️'}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">{message}</p>

                <div className="flex gap-3 justify-center px-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`
                            flex-1 py-3 px-4 rounded-xl font-semibold text-white shadow-lg shadow-opacity-20 transition-all
                            ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' :
                                type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' :
                                    'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}
                        `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
