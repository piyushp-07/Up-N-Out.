import React, { useEffect, useRef } from 'react';
import { UploadIcon, TrashIcon } from './Icons';

const DropdownMenu = ({ onSetTheme, theme, onSetBackground, onClose, onClearCurrentChat }) => {
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);
    const backgrounds = [
        { name: 'Default', value: '' },
        { name: 'Lavender Haze', value: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)' },
        { name: 'Peach Sunset', value: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)' },
        { name: 'Serene Mint', value: 'linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)' },
        { name: 'Ocean Breeze', value: 'linear-gradient(to right, #89f7fe 0%, #66a6ff 100%)' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onSetBackground(`url(${reader.result})`);
            reader.readAsDataURL(file);
            onClose();
        }
    };

    return (
        <div ref={dropdownRef} className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 w-56 border dark:border-gray-700">
            <div className="p-2">
                <div className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 px-2 pt-1">Theme</div>
                <button onClick={() => onSetTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full text-left flex justify-between items-center px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span>Dark Mode</span>
                    <div className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors ${theme === 'dark' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'}`}/>
                    </div>
                </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <div className="p-2">
                <div className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 px-2 pt-1">Chat Wallpaper</div>
                {backgrounds.map(bg => (
                    <button key={bg.name} onClick={() => { onSetBackground(bg.value); onClose(); }} className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        {bg.name}
                    </button>
                ))}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                <button onClick={() => fileInputRef.current.click()} className="w-full text-left flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    <span>Upload from Gallery</span>
                </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <div className="p-2">
                 <div className="font-semibold text-xs uppercase text-gray-500 dark:text-gray-400 px-2 pt-1">Actions</div>
                 <button onClick={() => { onClearCurrentChat(); onClose(); }} className="w-full text-left flex items-center px-2 py-1.5 text-sm rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    <span>Clear Conversation</span>
                </button>
            </div>
        </div>
    );
};

export default DropdownMenu;
