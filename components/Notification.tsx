
import React from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onDismiss: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onDismiss }) => {
    const baseClasses = "p-4 rounded-lg flex items-center justify-between shadow-md mb-6 animate-fade-in-down";
    const typeClasses = {
        success: "bg-green-100 border border-green-200 text-green-800",
        error: "bg-red-100 border border-red-200 text-red-800",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <p>{message}</p>
            <button onClick={onDismiss} className="ml-4 p-1 rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default Notification;
