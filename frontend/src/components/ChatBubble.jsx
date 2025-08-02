import React from 'react';
import { UserIcon, SparkleIcon } from './Icons';

const ChatBubble = ({ message, isUser, userAvatar, mentor }) => {
    const bubbleClasses = isUser
        ? "bg-[#2e6342] text-white self-end"
        : message.isActionStep 
            ? "bg-green-100 dark:bg-green-900/50 border border-green-300 dark:border-green-700 text-gray-800 dark:text-gray-200 self-start"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start";
    
    const Avatar = ({ src, mentor, isUser }) => {
        const avatarSize = "w-8 h-8";
        if (isUser) {
            return src ? <img src={src} alt="User" className={`${avatarSize} rounded-full object-cover`} onError={(e) => e.target.style.display='none'} /> : <div className={`${avatarSize} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}><UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" /></div>;
        }
        return (
            <div className={`${avatarSize} rounded-full overflow-hidden bg-gray-300`}>
                <img src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/2e6342/f8f6f2?text=Error'; }} />
            </div>
        );
    };

    return (
        <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && <Avatar mentor={mentor} />}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 my-1 shadow ${bubbleClasses}`}>
                {message.isActionStep && <h4 className="font-bold text-green-700 dark:text-green-300 mb-2 flex items-center"><SparkleIcon className="mr-2" /> Action Steps</h4>}
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
            {isUser && <Avatar src={userAvatar} isUser />}
        </div>
    );
};

export default ChatBubble;

