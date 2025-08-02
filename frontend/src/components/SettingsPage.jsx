import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { UserIcon } from './Icons';

const SettingsPage = ({ userProfile, theme, onSetTheme, onClearHistory, onNavigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleClearConfirm = () => {
        onClearHistory();
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex-grow flex flex-col bg-[#f8f6f2] dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <button onClick={() => onNavigate('chat')} className="text-sm font-semibold text-[#2e6342] hover:underline">
                            &larr; Back to Chat
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-600">
                             <h2 className="text-2xl font-semibold">My Profile</h2>
                             <button onClick={() => onNavigate('profileEdit')} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                                Edit Profile
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-6 mb-4">
                           <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {userProfile.avatar ? <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{userProfile.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{userProfile.age ? `${userProfile.age} years old` : 'Age not set'}</p>
                            </div>
                        </div>
                        
                         <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300 capitalize">
                            <p><strong>Gender:</strong> {userProfile.gender.replace('_', ' ') || 'Not set'}</p>
                            <p><strong>Date of Birth:</strong> {userProfile.dob || 'Not set'}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-3 dark:border-gray-600">Appearance</h2>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Dark Mode</span>
                            <button onClick={() => onSetTheme(theme === 'dark' ? 'light' : 'dark')} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-green-600' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-3 dark:border-gray-600">Data Management</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Clear All Chat History</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This will permanently delete all your conversations.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                                Clear History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleClearConfirm}
                title="Clear All Chat History?"
            >
                Are you sure you want to delete all chat history? This action cannot be undone.
            </ConfirmationModal>
        </>
    );
};

export default SettingsPage;