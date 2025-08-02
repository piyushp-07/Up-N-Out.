import React from 'react';
import { SettingsIcon } from './Icons';
import logo from '../assets/Logo.png'

const MentorSidebar = ({ mentors, onSelectMentor, activeMentorId, onNavigate, onToggleSidebar, isSidebarOpen }) => (
    <div className={`bg-[#1c5739] dark:bg-gray-800 flex flex-col flex-shrink-0 relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full md:w-1/3 lg:w-1/4 p-4' : 'w-0 p-0'}`}>
        <div className={`transition-opacity duration-200 flex flex-col h-full ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                 <div className="h-12 w-full flex items-center justify-center mr-4">
                     <img src={logo} alt="UpNOut Logo" className="h-full w-auto object-contain"/><h1 className="text-4xl font-bold text-green-800">Up-N-Out</h1>
                </div>
                <button
                    onClick={onToggleSidebar}
                    className="text-[#f8f6f2]/70 hover:text-[#f8f6f2] hover:bg-[#2e6342]/60 rounded-full p-1 transition-colors"
                    title="Collapse sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto -mr-4 pr-4">
                {mentors.map(mentor => (
                    <div
                        key={mentor.id}
                        onClick={() => onSelectMentor(mentor)}
                        className={`p-3 mb-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${activeMentorId === mentor.id ? 'bg-[#2e6342] text-[#f8f6f2] shadow-lg' : 'hover:bg-[#2e6342]/60'}`}
                    >
                        <div className="w-12 h-12 rounded-full mr-4 border-2 border-white/50 overflow-hidden flex-shrink-0 bg-gray-300">
                             <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/2e6342/f8f6f2?text=Error'; }} />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#f8f6f2] dark:text-white">{mentor.name}</h3>
                            <p className="text-sm text-[#f8f6f2]/70 dark:text-gray-400">{mentor.specialty}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-[#f8f6f2]/20 dark:border-gray-700 flex-shrink-0 flex justify-center">
                <button onClick={() => onNavigate('settings')} className="p-2 rounded-full text-[#f8f6f2]/70 hover:text-[#f8f6f2] hover:bg-[#2e6342]/60 transition-colors" title="Settings">
                    <SettingsIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    </div>
);

export default MentorSidebar;
