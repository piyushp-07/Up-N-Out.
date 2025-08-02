import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import DropdownMenu from './DropdownMenu';
import { SendIcon, SparkleIcon, MicIcon, MoreVerticalIcon } from './Icons';

const ChatView = ({ mentor, messages, onSendMessage, onSuggestSteps, isTyping, userProfile, isSidebarOpen, onToggleSidebar, theme, onSetTheme, chatBackground, onSetBackground, onClearCurrentChat }) => {
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const baseTextRef = useRef('');

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("Speech recognition not supported in this browser.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                 transcript += event.results[i][0].transcript;
            }
            setInputValue(baseTextRef.current + transcript);
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            baseTextRef.current = inputValue;
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);
    useEffect(() => {
        if (!isTyping && mentor) inputRef.current?.focus();
    }, [isTyping, mentor]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isTyping) {
            onSendMessage(inputValue);
            setInputValue("");
            baseTextRef.current = "";
        }
    };
    
    const handleSuggestClick = () => {
        if (!isTyping) onSuggestSteps();
    }

    if (!mentor) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center bg-[#f8f6f2] dark:bg-gray-900 text-center p-8">
                {!isSidebarOpen && (
                    <button onClick={onToggleSidebar} className="absolute top-4 left-4 z-10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors" title="Expand sidebar">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600 mb-4"><path d="M17 9.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/><path d="M7 9.5C7 6.46 9.46 4 12.5 4s5.5 2.46 5.5 5.5"/><path d="M12 14.5v7"/><path d="M9 21.5h6"/></svg>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Welcome to UpNOut</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Select a mentor from the list to start a conversation.</p>
            </div>
        );
    }
    
    const showSuggestButton = messages.length > 3;
    const defaultBg = theme === 'dark' ? '#111827' : '#f8f6f2';
    const backgroundStyle = {
        backgroundImage: chatBackground ? chatBackground : 'none',
        backgroundColor: chatBackground ? 'transparent' : defaultBg,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'all 0.5s ease',
    };

    return (
        <div className="flex-grow flex flex-col bg-white dark:bg-gray-900 min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-900 shadow-sm flex-shrink-0">
                {!isSidebarOpen && (
                     <button onClick={onToggleSidebar} className="text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors mr-2" title="Expand sidebar">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                )}
                <div className="w-10 h-10 rounded-full mr-3 overflow-hidden flex-shrink-0 bg-gray-300">
                    <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/2e6342/f8f6f2?text=Error'; }} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{mentor.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.specialty}</p>
                </div>
                <div className="ml-auto relative">
                    <button onClick={() => setIsDropdownOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <MoreVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    {isDropdownOpen && <DropdownMenu theme={theme} onSetTheme={onSetTheme} onSetBackground={onSetBackground} onClose={() => setIsDropdownOpen(false)} onClearCurrentChat={onClearCurrentChat} />}
                </div>
            </div>

            <div className="flex-grow p-4 overflow-y-auto" style={backgroundStyle}>
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} isUser={msg.isUser} userAvatar={userProfile.avatar} mentor={mentor} />
                    ))}
                    {isTyping && (
                         <div className="flex justify-start">
                             <div className="bg-white dark:bg-gray-700 text-gray-500 self-start rounded-2xl px-4 py-3 my-1 shadow flex items-center">
                                 <span className="typing-dot"></span>
                                 <span className="typing-dot"></span>
                                 <span className="typing-dot"></span>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            <div className="px-4 pt-2 pb-1 text-center flex-shrink-0 bg-white dark:bg-gray-900">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    AI-powered mentor. Conversations are not with a real human. Please be mindful and responsible.
                </p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <div className="flex-grow relative">
                        <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={isTyping ? "Mentor is typing..." : `Message ${mentor.name}...`} disabled={isTyping} className="w-full p-3 pl-4 pr-12 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2e6342] transition disabled:bg-gray-100 dark:disabled:bg-gray-700"/>
                        <button type="button" onClick={toggleListening} disabled={isTyping} className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`} title={isListening ? "Stop listening" : "Start listening"}>
                            <MicIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {showSuggestButton && (
                        <button type="button" onClick={handleSuggestClick} disabled={isTyping} className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-green-700 dark:text-green-300 p-3 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e6342] disabled:opacity-50 disabled:scale-100" title="Suggest Action Steps">
                            <SparkleIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button type="submit" disabled={isTyping || !inputValue.trim()} className="flex-shrink-0 bg-[#2e6342] hover:bg-[#1c5739] text-white p-3 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e6342] disabled:bg-[#2e6342]/50 disabled:scale-100">
                        <SendIcon className="text-white" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;
