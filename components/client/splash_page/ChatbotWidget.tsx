import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareIcon, SendIcon } from '../../icons/IconComponents';
import { SplashPageSettings } from '../../../types';

interface Message {
    id: number;
    text: React.ReactNode;
    sender: 'bot' | 'user';
    options?: { text: string, action: () => void }[];
}

type ChatState = 
  | 'greeting'
  | 'gatheringEmail'
  | 'gatheringPhone'
  | 'gatheringMessage'
  | 'inquiryComplete'
  | 'supportBuilding'
  | 'supportArea'
  | 'supportMenu'
  | 'processing'
  | 'escalated';

export const ChatbotWidget: React.FC<{ settings: SplashPageSettings }> = ({ settings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatState, setChatState] = useState<ChatState>('greeting');
    const [userInfo, setUserInfo] = useState({ 
        email: '', phone: '', message: '', building: '', area: ''
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            startConversation();
        }
    }, [isOpen]);

    const addMessage = (text: React.ReactNode, sender: 'bot' | 'user', options?: { text: string, action: () => void }[]) => {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender, options }]);
    };
    
    const startConversation = () => {
        setMessages([]);
        setChatState('greeting');
        setUserInfo({ email: '', phone: '', message: '', building: '', area: '' });
        addMessage(
            "Welcome to Support! How can I help you today?",
            'bot',
            [
                { text: "Service Inquiry", action: () => handleInquiryStart() },
                { text: "Technical Support", action: () => handleSupportStart() },
            ]
        );
    };

    const handleInquiryStart = () => {
        addMessage("Service Inquiry", 'user');
        setChatState('gatheringEmail');
        addMessage("Great! I can help with that. First, could I get your email address?", 'bot');
    };
    
    const handleSupportStart = () => {
        addMessage("Technical Support", 'user');
        setChatState('supportBuilding');
        addMessage("I can help with technical issues. To start, please tell me your building name or number.", 'bot');
    };

    const handleUserResponse = (text: string) => {
        addMessage(text, 'user');
        
        switch (chatState) {
            case 'gatheringEmail':
                setUserInfo(prev => ({ ...prev, email: text }));
                setChatState('gatheringPhone');
                addMessage("Thanks! And what is your phone number?", 'bot');
                break;
            case 'gatheringPhone':
                setUserInfo(prev => ({ ...prev, phone: text }));
                setChatState('gatheringMessage');
                addMessage("Perfect. Please describe your inquiry, and I'll have a representative contact you shortly.", 'bot');
                break;
            case 'gatheringMessage':
                const finalUserInfo = { ...userInfo, message: text, phone: userInfo.phone };
                setUserInfo(finalUserInfo);
                setChatState('inquiryComplete');
                addMessage("Thank you! We've received your information and will be in touch via email or WhatsApp soon.", 'bot');
                // Simulate forwarding the email
                console.log('Forwarding inquiry to sales@superlink.host:', finalUserInfo);
                break;

            case 'supportBuilding':
                setUserInfo(prev => ({ ...prev, building: text }));
                setChatState('supportArea');
                addMessage("Thank you. And what is your area or room number?", 'bot');
                break;
            case 'supportArea':
                 setUserInfo(prev => ({ ...prev, area: text }));
                 setChatState('supportMenu');
                 setTimeout(() => {
                    addMessage("Great! How can I help you today?", 'bot', [
                        { text: "Subscription Problem", action: () => handleMenuSelection("subscription") },
                        { text: "No Internet", action: () => handleMenuSelection("connectivity") },
                        { text: "Change Device", action: () => handleMenuSelection("deviceChange") },
                        { text: "Add a TV", action: () => handleMenuSelection("addTV") },
                    ]);
                 }, 500);
                 break;
            default:
                // Do nothing if input is not expected
        }
    };
    
    const handleMenuSelection = (selection: string) => {
        setChatState('processing');
        let response = "";
        let escalation = false;
        
        switch(selection) {
            case 'subscription':
                response = "I'm checking your subscription status now... It seems your plan is active. Could you please describe the issue in more detail?";
                break;
            case 'connectivity':
                response = "I see your device is connected to our network. Let's try to fix this. Please restart your device. If that doesn't work, I can notify a technician.";
                break;
            case 'deviceChange':
                response = "To switch devices, I need to update your voucher. This will disconnect your current device. Are you sure you want to proceed?";
                break;
            case 'addTV':
                response = "Adding a TV requires an additional fee and a separate voucher. I've sent a payment link to your registered mobile number. Once paid, the voucher will be sent via SMS.";
                break;
            default:
                response = "I'm not sure how to handle that. Let me get a technician for you.";
                escalation = true;
        }

        setTimeout(() => {
            addMessage(response, 'bot');
            if (escalation) {
                escalateToTechnician();
            } else {
                 setTimeout(() => showSupportMenu(), 4000);
            }
        }, 1000);
    }

    const showSupportMenu = () => {
        setChatState('supportMenu');
        addMessage("Is there anything else I can help you with?", 'bot', [
            { text: "Subscription Problem", action: () => handleMenuSelection("subscription") },
            { text: "No Internet", action: () => handleMenuSelection("connectivity") },
            { text: "Change Device", action: () => handleMenuSelection("deviceChange") },
            { text: "Add a TV", action: () => handleMenuSelection("addTV") },
        ]);
    };

    const escalateToTechnician = () => {
        setChatState('escalated');
        const alertMessage = `A technician has been alerted with your details (Building: ${userInfo.building}, Area: ${userInfo.area}). They will contact you shortly via WhatsApp or email.`;
        addMessage(alertMessage, 'bot');
    };
    
    const isInputDisabled = (): boolean => {
        const enabledStates: ChatState[] = ['gatheringEmail', 'gatheringPhone', 'gatheringMessage', 'supportBuilding', 'supportArea'];
        return !enabledStates.includes(chatState);
    };

    return (
        <>
            <div className={`fixed bottom-16 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-3 flex items-center justify-between border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                    <div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Support Chat</h3>
                        <p className="text-xs text-green-500">Online</p>
                    </div>
                    <button onClick={startConversation} className="text-xs text-blue-600 hover:underline">Restart</button>
                </div>
                {/* Messages */}
                <div className="flex-1 p-4 h-80 overflow-y-auto space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                {msg.text}
                                {msg.options && (
                                    <div className="mt-2 border-t border-gray-300 dark:border-gray-600 pt-2 space-y-1">
                                        {msg.options.map(opt => (
                                            <button key={opt.text} onClick={opt.action} className="w-full text-left text-blue-600 dark:text-blue-400 font-medium bg-white dark:bg-gray-800 rounded-md p-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-900">
                                                {opt.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                <div className="p-2 border-t dark:border-gray-700">
                     <form onSubmit={e => {
                         e.preventDefault();
                         const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                         if(input.value.trim()) {
                             handleUserResponse(input.value.trim());
                             input.value = '';
                         }
                     }}>
                        <div className="flex items-center">
                            <input name="message" type="text" placeholder="Type your message..." disabled={isInputDisabled()} className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-0 rounded-lg text-sm px-3 py-2 disabled:opacity-50" />
                            <button type="submit" className="ml-2 p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50" disabled={isInputDisabled()}>
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                style={{ backgroundColor: settings.primaryColor }}
            >
                <MessageSquareIcon className="w-7 h-7" />
            </button>
        </>
    );
};

export default ChatbotWidget;