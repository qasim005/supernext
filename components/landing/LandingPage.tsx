import React, { useState, useEffect, useRef } from 'react';
import { WifiIcon, CheckCircleIcon, MessageSquareIcon, SendIcon, SuperNextLogo, BarChartIcon, VideoIcon, MailIcon, CreditCardIcon, UsersIcon, GlobeIcon, PhoneIcon, MapPinIcon, QuoteIcon } from '../icons/IconComponents';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

// --- Chatbot Component for Landing Page ---
interface LandingChatbotMessage {
  id: number;
  text: React.ReactNode;
  sender: 'bot' | 'user';
  options?: { text: string, action: () => void }[];
}

type LandingChatState =
  | 'greeting'
  | 'gatheringName'
  | 'gatheringEmail'
  | 'gatheringMessage'
  | 'complete';

const LandingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<LandingChatbotMessage[]>([]);
  const [chatState, setChatState] = useState<LandingChatState>('greeting');
  const [userInfo, setUserInfo] = useState({ name: '', email: '', message: '' });
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
    setUserInfo({ name: '', email: '', message: '' });
    addMessage(
      "Hello! Thanks for visiting SuperNext. How can I assist you today?",
      'bot',
      [{ text: "I have a question", action: () => handleInquiryStart() }]
    );
  };

  const handleInquiryStart = () => {
    addMessage("I have a question", 'user');
    setChatState('gatheringName');
    addMessage("Happy to help! To connect you with the right person, what's your name?", 'bot');
  };

  const handleUserResponse = (text: string) => {
    addMessage(text, 'user');
    switch (chatState) {
      case 'gatheringName':
        setUserInfo(prev => ({ ...prev, name: text }));
        setChatState('gatheringEmail');
        addMessage(`Nice to meet you, ${text}! What's your email address?`, 'bot');
        break;
      case 'gatheringEmail':
        setUserInfo(prev => ({ ...prev, email: text }));
        setChatState('gatheringMessage');
        addMessage("Great. And what is your question or message for our team?", 'bot');
        break;
      case 'gatheringMessage':
        setUserInfo(prev => ({ ...prev, message: text }));
        setChatState('complete');
        addMessage("Thank you! We've received your message. Our team will review it and get back to you at your email address shortly.", 'bot');
        console.log('New lead captured:', { ...userInfo, message: text });
        break;
    }
  };

  const isInputDisabled = (): boolean => {
    const enabledStates: LandingChatState[] = ['gatheringName', 'gatheringEmail', 'gatheringMessage'];
    return !enabledStates.includes(chatState);
  };

  return (
    <>
      <div className={`fixed bottom-24 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="p-3 flex items-center justify-between border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">SuperNext Support</h3>
            <p className="text-xs text-green-500">Online</p>
          </div>
          <button onClick={startConversation} className="text-xs text-blue-600 hover:underline">Restart</button>
        </div>
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
        <div className="p-2 border-t dark:border-gray-700">
          <form onSubmit={e => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
            if (input.value.trim()) {
              handleUserResponse(input.value.trim());
              input.value = '';
            }
          }}>
            <div className="flex items-center">
              <input name="message" type="text" placeholder="Type your message..." disabled={isInputDisabled()} className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-0 rounded-lg text-sm px-3 py-2 disabled:opacity-50" />
              <button type="submit" className="ml-2 p-2 text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50" disabled={isInputDisabled()}>
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full flex items-center justify-center text-white bg-blue-600 shadow-lg transition-transform hover:scale-110"
      >
        <MessageSquareIcon className="w-8 h-8" />
      </button>
    </>
  );
};
// --- End Chatbot Component ---

// FIX: Destructure the onNavigateToLogin prop to make it accessible within the component.
const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-30 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SuperNextLogo className="h-10 w-10" />
            <span className="text-3xl font-bold text-white">SuperNext Cloudssss</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#contact" className="px-5 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 animate-pulse-slow">
              Contact Us for Quotation
            </a>
            <button onClick={() => navigate('/signin')} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">
              Client Login
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative isolate">
          <div className="absolute inset-0 -z-10 w-full h-screen overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2574&auto=format&fit=crop"
              alt="City skyline at night with data visualization"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          <div className="py-24 sm:py-32 h-screen flex items-center">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Intelligent Multi-functional Cloud WiFi Solution</h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
                Transform your venue into a Smart WiFi Hotspot. A complete solution with centralized user management, automated billing, advanced analytics, and marketing tools.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button onClick={onNavigateToLogin} className="rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                  Get Started &rarr;
                </button>
                <a href="#features" className="text-sm font-semibold leading-6 text-white">Learn more <span aria-hidden="true">&rarr;</span></a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white dark:bg-gray-900/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">What Our Clients Say</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                We've helped hundreds of businesses across the UAE improve their guest WiFi experience.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-800 p-8 shadow-sm">
                <QuoteIcon className="h-8 w-8 text-gray-400" />
                <blockquote className="mt-6 flex-grow text-gray-700 dark:text-gray-300">
                  <p><i>"The SuperNext cloud platform revolutionized our guest WiFi. It's reliable, easy to manage, and the analytics have provided invaluable insights into our customer demographics. Our guest satisfaction scores have increased by 30%!"</i></p>
                </blockquote>
                <footer className="mt-6">
                  <p className="font-semibold text-gray-900 dark:text-white">Ahmed Al-Mansoori</p>
                  <p className="text-gray-600 dark:text-gray-400">IT Manager, Five Hotels & Resorts</p>
                </footer>
              </div>
              <div className="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-800 p-8 shadow-sm">
                <QuoteIcon className="h-8 w-8 text-gray-400" />
                <blockquote className="mt-6 flex-grow text-gray-700 dark:text-gray-300">
                  <p><i>"Setup was a breeze. The system integrated perfectly with our existing MikroTik hardware. The voucher generation and billing system is incredibly flexible and has created a new, hassle-free revenue stream for our properties."</i></p>
                </blockquote>
                <footer className="mt-6">
                  <p className="font-semibold text-gray-900 dark:text-white">Fatima Al-Kaabi</p>
                  <p className="text-gray-600 dark:text-gray-400">Operations Head, Damac Properties</p>
                </footer>
              </div>
              <div className="flex flex-col rounded-lg bg-gray-50 dark:bg-gray-800 p-8 shadow-sm">
                <QuoteIcon className="h-8 w-8 text-gray-400" />
                <blockquote className="mt-6 flex-grow text-gray-700 dark:text-gray-300">
                  <p><i>"As a multi-site restaurant chain, centralized management was key. With SuperNext, we can oversee all our locations from a single dashboard. The marketing tools have also been fantastic for promoting our specials."</i></p>
                </blockquote>
                <footer className="mt-6">
                  <p className="font-semibold text-gray-900 dark:text-white">John Pereira</p>
                  <p className="text-gray-600 dark:text-gray-400">Marketing Director, Wagamama UAE</p>
                </footer>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything You Need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Top ISP WiFi Features</p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                From user management to monetization, our cloud system provides all the tools you need to run a successful WiFi hotspot service.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <WifiIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    WiFi Management
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">Centralized management of user accounts, access limits, and internet plans. All APs connect to our cloud for authentication and accounting.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <UsersIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    User Level Limits
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">Assign different limits to user accounts: download/upload speed, bandwidth quota, and expiration date with high customization.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <CreditCardIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    WiFi Billing
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">Automate billing with pre-printed vouchers, PayPal, and 70+ payment gateways. Keep 100% of the profits.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <BarChartIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    Advanced Analytics
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">Gain complete insight into network functions and guest behavior with basic to advanced analytics and reports.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <VideoIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    Video Ads Before Login
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">Deliver video commercials to guests before they connect. Target by age and gender, with PDF reports on click-through rates.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <MailIcon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    Email Marketing
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">Automatically send promotional email campaigns when a guest connects or leaves. Set up reminders to encourage return visits.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Hardware Integration Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Seamless Hardware Integration</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Our cloud platform is hardware-agnostic. Built on the industry-standard RADIUS protocol, it seamlessly integrates with your existing network equipment. There's no need to purchase proprietary hardware, giving you the freedom and flexibility to build the best network for your venue.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {['MikroTik', 'Cisco', 'Aruba', 'Ruckus', 'Ubiquiti', 'TP-Link', 'and more...'].map((brand) => (
                  <div key={brand} className="flex items-center gap-x-3">
                    <CheckCircleIcon className="h-6 w-6 flex-none text-green-500" />
                    <span className="text-gray-900 dark:text-white font-medium">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section className="bg-white dark:bg-gray-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Simple & Powerful</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">How SuperNext WiFi Works</p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-block bg-blue-100 dark:bg-gray-700 p-5 rounded-full text-blue-600 dark:text-blue-400">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">1. Connect & Redirect</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Guests are automatically redirected to your custom-branded welcome page upon connecting to your WiFi network.</p>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-blue-100 dark:bg-gray-700 p-5 rounded-full text-blue-600 dark:text-blue-400">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">2. Login or Purchase</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Guests select their preferred connection method: free trial, voucher code, social login, or credit card payment.</p>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-blue-100 dark:bg-gray-700 p-5 rounded-full text-blue-600 dark:text-blue-400">
                    <CheckCircleIcon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">3. Control & Monetize</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">You control session duration, speed, and bandwidth, while collecting guest data for marketing and analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300" aria-labelledby="footer-heading" id="contact">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <SuperNextLogo className="h-10 w-10" />
                <span className="text-2xl font-bold text-white">SuperNext Technologies</span>
              </div>
              <p className="text-sm leading-6 text-gray-400">A Dubai-based technology provider specializing in enterprise-level WiFi solutions, hotspot billing, and cloud integrations. With 15+ years of experience in the UAE, we deliver tailored solutions for local and global partners.</p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li><a href="#features" className="text-sm leading-6 text-gray-400 hover:text-white">WiFi Management</a></li>
                    <li><a href="#features" className="text-sm leading-6 text-gray-400 hover:text-white">Billing & Vouchers</a></li>
                    <li><a href="#features" className="text-sm leading-6 text-gray-400 hover:text-white">Analytics</a></li>
                    <li><a href="#features" className="text-sm leading-6 text-gray-400 hover:text-white">Marketing</a></li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">About Us</a></li>
                    <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">Client Login</a></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-1 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">Contact Us</h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                      <p className="text-sm leading-6 text-gray-400">Office D01, 3rd Floor, Control Tower, Motor City, Dubai, UAE</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm leading-6 text-gray-400">+971-48864215</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MailIcon className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm leading-6 text-gray-400">Amjid@supernxt.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-xs leading-5 text-gray-400">&copy; {new Date().getFullYear()} SuperNext Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <LandingChatbot />
    </div>
  );
};

export default LandingPage;