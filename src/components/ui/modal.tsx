import * as React from 'react';

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string | React.ReactNode;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    headerRight?: React.ReactNode;
}

export function Modal({ 
    isOpen = true, 
    title, 
    children, 
    maxWidth = 'md', 
    headerRight 
}: ModalProps) {
    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl'
    }[maxWidth];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-screen h-screen">
            <div className={`bg-white rounded-xl shadow-lg w-full ${maxWidthClass} p-6 max-h-[90vh] overflow-y-auto`}>
                {(title || headerRight) && (
                    <div className={`flex items-center mb-4 ${headerRight ? 'justify-between' : ''}`}>
                        {title && (
                            <h3 className={`font-semibold text-slate-900 ${headerRight ? 'text-xl' : 'text-lg'}`}>
                                {title}
                            </h3>
                        )}
                        {headerRight && <div>{headerRight}</div>}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
