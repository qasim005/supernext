// Fix: Corrected the React import to properly include useState, useRef, and useEffect.
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, SendIcon } from '../icons/IconComponents';
import { Page, UserRole } from '../../App';
import { CopilotMessage } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";

interface AICopilotProps {
    setCurrentPage: (page: Page) => void;
    currentPage: Page;
    role: UserRole;
}

// Fix: Updated responseSchema to use the imported `Type` enum for consistency.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        action: {
            type: Type.STRING,
            enum: ['navigate', 'text_response'],
            description: 'The type of action to perform.'
        },
        page: {
            type: Type.STRING,
            description: "Required if action is 'navigate'. The page to navigate to. Must be one of the available page names."
        },
        response_text: {
            type: Type.STRING,
            description: "Required if action is 'text_response'. The text to display to the user."
        }
    },
    required: ['action']
};


const AICopilot: React.FC<AICopilotProps> = ({ setCurrentPage, role, currentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<CopilotMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: Date.now(), text: 'Hello! I am your AI Copilot. How can I help you today? Try asking me to "show reports" or "go to vouchers".', sender: 'bot' }
            ]);
        }
    }, [isOpen, messages.length]);
    
    useEffect(scrollToBottom, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: CopilotMessage = {
            id: Date.now(),
            text: userInput,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const clientPages = ['clientDashboard', 'voucherManagement', 'realTimeStats', 'reports', 'splashPage', 'mikrotik', 'userAccess', 'accessLogs', 'archive', 'settings', 'integrations', 'helpAndSupport'];
            const adminPages = ['dashboard', 'vouchers', 'users', 'services', 'adminManagement'];

            const availablePages = role === 'client' ? clientPages : adminPages;

            const systemInstruction = `You are an AI assistant for a WiFi hotspot management dashboard called SuperNext Cloud.
            Your primary goal is to help users navigate the app or answer simple questions about its functionality.
            The user is a '${role}'.
            They are currently on the '${currentPage}' page.
            Based on their role, the pages they can access are: ${availablePages.join(', ')}.
            
            Analyze the user's request and choose one of two actions:
            1. 'navigate': If the user wants to go to a specific page. The 'page' property must be one of the available page names.
            2. 'text_response': If the user is asking a question or making a statement that doesn't involve navigation. Provide a helpful, concise answer.
            
            If the user asks to go to a page they cannot access, inform them about the permission restriction.
            Always respond in the specified JSON format.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    role: 'user',
                    parts: [{ text: userInput }]
                },
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });
            
            const jsonStr = response.text.trim();
            const aiResponse = JSON.parse(jsonStr);
            
            let botMessageText = "I'm not sure how to handle that.";

            if (aiResponse.action === 'navigate' && aiResponse.page) {
                const targetPage = aiResponse.page as Page;
                if (availablePages.includes(targetPage)) {
                    setCurrentPage(targetPage);
                    botMessageText = `Navigating you to the ${aiResponse.page.replace(/([A-Z])/g, ' $1').trim()} page.`;
                } else {
                    botMessageText = `I'm sorry, as a '${role}', you don't have access to the ${aiResponse.page} page.`;
                }
            } else if (aiResponse.action === 'text_response' && aiResponse.response_text) {
                botMessageText = aiResponse.response_text;
            }

            const botMessage: CopilotMessage = {
                id: Date.now() + 1,
                text: botMessageText,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("AI Copilot Error:", error);
            const errorMessage: CopilotMessage = {
                id: Date.now() + 1,
                text: "Sorry, I encountered an error. Please try again.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open AI Copilot"
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
                <SparklesIcon className="w-8 h-8" />
            </button>

            {/* Chat Modal */}
            <div 
                className={`fixed bottom-24 right-6 z-50 w-[400px] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 flex flex-col transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="copilot-title"
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-purple-500" />
                        <h3 id="copilot-title" className="font-semibold text-gray-900 dark:text-white">AI Copilot</h3>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        aria-label="Close chat"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>}
                            <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
                            <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                               <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                               </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t dark:border-gray-700">
                     <form onSubmit={handleSendMessage}>
                        <div className="flex items-center relative">
                            <input 
                                type="text" 
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask me anything..." 
                                className="w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-blue-500 rounded-lg text-sm pl-4 pr-12 py-2.5" 
                            />
                            <button 
                                type="submit" 
                                aria-label="Send message"
                                className="absolute right-2 p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50" 
                                disabled={!userInput.trim() || isLoading}
                            >
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AICopilot;
