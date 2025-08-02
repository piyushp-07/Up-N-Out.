import React, { useState, useEffect } from 'react';

// Import child components
import MentorSidebar from './components/MentorSidebar';
import ChatView from './components/ChatView';
import SettingsPage from './components/SettingsPage';
import ProfileEditPage from './components/ProfileEditPage.jsx';
import ConfirmationModal from './components/ConfirmationModal';


// Mock Data - In a real app, this might come from an API
import { mentors } from './data/mentors.jsx';

export default function App() {
    const [activeMentor, setActiveMentor] = useState(null);
    const [chatHistory, setChatHistory] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState('chat'); // 'chat', 'settings', or 'profileEdit'
    const [theme, setTheme] = useState('light');
    const [userProfile, setUserProfile] = useState({
        name: 'User',
        age: '',
        gender: '',
        dob: '',
        avatar: '' // URL or Base64 data for user's avatar
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [chatBackground, setChatBackground] = useState('');
    const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);

    // Effect to apply the theme class to the root element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    // Function to call your Flask backend
    // Now accepts userMessageText, mentorId, and the full conversation history
    const callGeminiAPI = async (userMessageText, mentorId, history) => {
        const backendApiUrl = "http://localhost:5000/chat";

        // Construct the 'contents' array in the format expected by the Gemini API
        // This includes all previous messages and the current user message
        const contents = history.map(msg => ({
            role: msg.isUser ? "user" : "model",
            parts: [{ text: msg.text }]
        }));

        // Add the current user's message to the contents array
        contents.push({ role: "user", parts: [{ text: userMessageText }] });

        const payload = {
            contents: contents, // Send the entire conversation history
            mentorId: mentorId  // Send the ID of the selected mentor
        };

        try {
            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Check if the errorData has a 'details' field or a generic message
                throw new Error(errorData.details || errorData.error || `API request failed with status ${response.status}`);
            }

            const result = await response.json();

            // The backend now returns a simple JSON object like {"reply": "AI response"}
            if (result.reply) {
                return result.reply;
            } else {
                // Handle cases where the 'reply' key is missing or unexpected structure
                throw new Error("Invalid response structure from backend API: 'reply' key missing.");
            }
        } catch (err) {
            console.error("Error calling backend API:", err);
            setError(`Sorry, there was an error connecting to the server: ${err.message}`);
            return null;
        }
    };


    const handleSelectMentor = (mentor) => {
        setActiveMentor(mentor);
        if (!chatHistory[mentor.id]) {
            setChatHistory(prev => ({
                ...prev,
                [mentor.id]: [{ id: crypto.randomUUID(), text: mentor.intro, isUser: false }]
            }));
        }
    };

    const streamResponse = async (fullText, mentorId, isActionStep = false) => {
        const chunks = fullText.split('\n').filter(c => c.trim().length > 0);

        for (const chunk of chunks) {
            const delay = chunk.length * 15 + Math.random() * 100;
            await new Promise(resolve => setTimeout(resolve, delay));

            const newAiMessage = {
                id: crypto.randomUUID(),
                text: chunk,
                isUser: false,
                isActionStep: isActionStep
            };

            setChatHistory(prev => ({
                ...prev,
                [mentorId]: [...(prev[mentorId] || []), newAiMessage]
            }));
        }
    };

    const handleSendMessage = async (messageText) => {
        if (!activeMentor) return;
        const mentorForThisMessage = activeMentor;
        const userMessage = { id: crypto.randomUUID(), text: messageText, isUser: true };
        const currentHistory = chatHistory[mentorForThisMessage.id] || [];

        setChatHistory(prev => ({
            ...prev,
            [mentorForThisMessage.id]: [...currentHistory, userMessage]
        }));

        setIsTyping(true);
        setError(null);

        let userContextString = `The user you are talking to is named ${userProfile.name}.`;
        if (userProfile.age) userContextString += ` They are ${userProfile.age} years old.`;
        if (userProfile.gender && userProfile.gender !== 'rather_not_say') userContextString += ` Their gender is ${userProfile.gender}.`;

        // Prepare the conversation context to send to the backend
        // This includes initial persona/user info and the current chat history
        const conversationContext = [
            { role: "user", parts: [{ text: `Here is some information about the user you are mentoring: ${userContextString}. Please remember their name and use it occasionally and naturally in your responses to build rapport.` }] },
            { role: "model", parts: [{ text: `Okay, I'll remember that. I'm ready to chat with ${userProfile.name}.` }] },
            { role: "user", parts: [{ text: `${mentorForThisMessage.persona} Keep your responses conversational and concise, like you're texting. Avoid very long paragraphs.` }] },
            { role: "model", parts: [{ text: "Great, let's start." }] },
            // Map existing chat history to the Gemini API format
            ...currentHistory.map(msg => ({
                role: msg.isUser ? "user" : "model",
                parts: [{ text: msg.text }]
            }))
        ];

        // Pass the current messageText, mentor ID, and the full conversation context
        const aiResponseText = await callGeminiAPI(messageText, mentorForThisMessage.id, conversationContext);

        if (aiResponseText) {
            await streamResponse(aiResponseText, mentorForThisMessage.id);
        }

        setIsTyping(false);
    };

    const handleSuggestActionSteps = async () => {
        if (!activeMentor) return;
        const mentorForThisRequest = activeMentor;
        setIsTyping(true);
        setError(null);
        const currentHistory = chatHistory[mentorForThisRequest.id] || [];
        const actionPrompt = `Based on our conversation so far, please provide 3-5 clear, actionable steps that I can take. Frame this as helpful advice. Present it as a numbered list. Keep the language direct and encouraging. Remember my name is ${userProfile.name}.`;

        // Prepare the conversation context for action steps
        const conversationContext = [
            { role: "user", parts: [{ text: mentorForThisRequest.persona }] },
            { role: "model", parts: [{ text: "Okay, I'm ready." }] },
            // Map existing chat history to the Gemini API format
            ...currentHistory.map(msg => ({
                role: msg.isUser ? "user" : "model",
                parts: [{ text: msg.text }]
            }))
        ];

        // Pass the actionPrompt as the user's message for this specific API call
        const aiResponseText = await callGeminiAPI(actionPrompt, mentorForThisRequest.id, conversationContext);

        if (aiResponseText) {
            await streamResponse(aiResponseText, mentorForThisRequest.id, true);
        }

        setIsTyping(false);
    };

    const handleClearAllHistory = () => {
        setChatHistory({});
        if(activeMentor) {
            handleSelectMentor(mentors.find(m => m.id === activeMentor.id));
        }
    };

    const handleClearCurrentChat = () => {
        if (activeMentor) {
            setIsClearChatModalOpen(true);
        }
    };

    const handleConfirmClearCurrentChat = () => {
        if (!activeMentor) return;
        const mentorId = activeMentor.id;
        const mentorIntro = mentors.find(m => m.id === mentorId)?.intro || "Hello!";
        setChatHistory(prev => ({
            ...prev,
            [mentorId]: [{ id: crypto.randomUUID(), text: mentorIntro, isUser: false }]
        }));
        setIsClearChatModalOpen(false);
    };

    const currentMessages = activeMentor ? chatHistory[activeMentor.id] || [] : [];

    const renderView = () => {
        switch (currentView) {
            case 'chat':
                return (
                    <>
                        <MentorSidebar
                            mentors={mentors}
                            onSelectMentor={handleSelectMentor}
                            activeMentorId={activeMentor?.id}
                            onNavigate={setCurrentView}
                            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                            isSidebarOpen={isSidebarOpen}
                        />
                        <div className="flex flex-col flex-grow min-h-0 relative">
                            {error && (
                                <div className="bg-red-500 text-white p-2 text-center text-sm flex-shrink-0">
                                    {error}
                                </div>
                            )}
                            <ChatView
                                mentor={activeMentor}
                                messages={currentMessages}
                                onSendMessage={handleSendMessage}
                                onSuggestSteps={handleSuggestActionSteps}
                                isTyping={isTyping}
                                userProfile={userProfile}
                                isSidebarOpen={isSidebarOpen}
                                onToggleSidebar={() => setIsSidebarOpen(true)}
                                theme={theme}
                                onSetTheme={setTheme}
                                chatBackground={chatBackground}
                                onSetBackground={setChatBackground}
                                onClearCurrentChat={handleClearCurrentChat}
                            />
                        </div>
                    </>
                );
            case 'settings':
                return (
                    <SettingsPage
                        userProfile={userProfile}
                        theme={theme}
                        onSetTheme={setTheme}
                        onClearHistory={handleClearAllHistory}
                        onNavigate={setCurrentView}
                    />
                );
            case 'profileEdit':
                return (
                    <ProfileEditPage
                        userProfile={userProfile}
                        onUpdateProfile={setUserProfile}
                        onNavigate={setCurrentView}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <>
            <div className="font-sans bg-[#f8f6f2] dark:bg-gray-900 h-screen w-screen flex text-gray-800 dark:text-gray-200">
                <div className="flex w-full max-w-7xl mx-auto h-full shadow-2xl rounded-lg overflow-hidden my-0 md:my-4">
                    {renderView()}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isClearChatModalOpen}
                onClose={() => setIsClearChatModalOpen(false)}
                onConfirm={handleConfirmClearCurrentChat}
                title="Clear Conversation?"
            >
                Are you sure you want to delete this conversation? This action cannot be undone.
            </ConfirmationModal>
        </>
    );
}
