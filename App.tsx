
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Expense, Notification as NotificationType } from './types';
import { saveExpense } from './services/googleSheetsService';
import ExpenseForm from './components/ExpenseForm';
import Notification from './components/Notification';
import Header from './components/Header';
import HowToUse from './components/HowToUse';

// --- SettingsModal Component ---
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    googleSheetUrl: string;
    setGoogleSheetUrl: (url: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, googleSheetUrl, setGoogleSheetUrl }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            modalRef.current?.querySelector('input')?.focus();
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 px-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
        >
            <div 
                ref={modalRef} 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 id="settings-title" className="text-2xl font-bold text-gray-800">
                        Settings & Instructions
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Close settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-700 mb-3">1. Connect to Google Sheets</h3>
                        <p className="text-gray-600 mb-4">
                            Enter your Google Apps Script Web App URL below. This is where your expense data will be sent. Your URL is saved automatically.
                        </p>
                        <input
                            type="url"
                            value={googleSheetUrl}
                            onChange={(e) => setGoogleSheetUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            aria-label="Google Sheets Web App URL"
                        />
                    </div>
                    
                    <HowToUse />
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => localStorage.getItem('googleSheetUrl') || '');
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem('googleSheetUrl', googleSheetUrl);
    }, [googleSheetUrl]);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSaveExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
        if (!googleSheetUrl) {
            setNotification({ message: 'Please set your Google Sheets Web App URL in the Settings first.', type: 'error' });
            setIsSettingsOpen(true);
            return;
        }
        
        setIsLoading(true);
        setNotification(null);

        const newExpense: Expense = {
            ...expense,
            id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
        };

        try {
            const result = await saveExpense(newExpense, googleSheetUrl);
            setNotification({ message: result.message, type: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                setNotification({ message: error.message, type: 'error' });
            } else {
                setNotification({ message: 'An unknown error occurred.', type: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [googleSheetUrl]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <Header onSettingsClick={() => setIsSettingsOpen(true)} />
            
            <main className="container mx-auto p-4 md:p-8 max-w-2xl">
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onDismiss={() => setNotification(null)}
                    />
                )}
                
                {!googleSheetUrl && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg" role="alert">
                        <p className="font-bold">Welcome!</p>
                        <p>To get started, please set up your Google Sheets connection.
                        <button onClick={() => setIsSettingsOpen(true)} className="font-bold underline ml-2 hover:text-yellow-800 focus:outline-none">
                           Open Settings
                        </button>
                        </p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                     <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Expense</h2>
                    <ExpenseForm onSave={handleSaveExpense} isLoading={isLoading} />
                </div>
            </main>

            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                googleSheetUrl={googleSheetUrl}
                setGoogleSheetUrl={setGoogleSheetUrl}
            />
        </div>
    );
};

export default App;
