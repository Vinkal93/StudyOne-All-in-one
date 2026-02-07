import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MdCheckCircle, MdError, MdInfo, MdClose } from 'react-icons/md';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    pointerEvents: 'none',
                    width: '100%',
                    maxWidth: '300px'
                }}>
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className={`
                                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg 
                                transform transition-all duration-300 animate-slideIn
                                ${toast.type === 'success' ? 'bg-green-500 text-white' :
                                    toast.type === 'error' ? 'bg-red-500 text-white' :
                                        'bg-blue-600 text-white'}
                            `}
                            style={{ minWidth: 'min(90vw, 300px)', backdropFilter: 'blur(8px)' }}
                        >
                            <span className="text-xl">
                                {toast.type === 'success' && <MdCheckCircle />}
                                {toast.type === 'error' && <MdError />}
                                {toast.type === 'info' && <MdInfo />}
                            </span>
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <MdClose size={18} />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
