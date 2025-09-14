import React, { useState } from 'react';
import { useNotificationsContext } from '../../../context/NotificationsContext';
import { NotificationType } from '../../../types';
import FaqItem from './FaqItem';

const faqData = [
    {
        question: "How do I generate new vouchers?",
        answer: "Navigate to the 'Voucher Management' page from the sidebar. Click the 'Generate Vouchers' button, fill in the details like quantity, validity, and speed limit in the modal, and then click 'Generate'. The new vouchers will appear in your list with a 'Pending' status."
    },
    {
        question: "Can I print multiple vouchers at once?",
        answer: "Yes. On the 'Voucher Management' page, select the vouchers you want to print using the checkboxes. Then, from the actions bar, click the 'Print' button. This will open a print-friendly view of the selected vouchers."
    },
    {
        question: "How do I customize my WiFi login page?",
        answer: "Go to the 'Splash Page' section. Here you can change the logo, background image or color, welcome text, and choose different login methods like social media or SMS."
    },
    {
        question: "What does 'expiring soon' mean on the dashboard?",
        answer: "This number represents vouchers that are scheduled to expire within the next 7 days. It's a helpful reminder to generate new vouchers if your stock is running low."
    },
    {
        question: "How can I see my sales reports?",
        answer: "The 'Reports' page provides daily statistics and allows you to generate custom reports for specific date ranges. You can download these reports as CSV or PDF files, or have them emailed to you."
    }
];

const HelpAndSupportPage: React.FC = () => {
    const { addNotification } = useNotificationsContext();
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    
    const [ticket, setTicket] = useState({
        category: 'Technical',
        subject: '',
        description: ''
    });

    const handleFaqClick = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTicket(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the ticket to a backend service
        console.log("Submitting ticket:", ticket);

        addNotification({
            type: NotificationType.Support,
            title: 'Support Ticket Submitted',
            message: `Your ticket regarding "${ticket.subject}" has been received.`
        });
        
        // Reset form
        setTicket({ category: 'Technical', subject: '', description: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Frequently Asked Questions</h2>
                    <div>
                        {faqData.map((item, index) => (
                            <FaqItem 
                                key={index}
                                question={item.question}
                                answer={item.answer}
                                isOpen={openFaqIndex === index}
                                onClick={() => handleFaqClick(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Submit a Support Ticket</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Can't find an answer? Our support team is here to help.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                            <select 
                                id="category"
                                name="category"
                                value={ticket.category}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option>Billing</option>
                                <option>Technical</option>
                                <option>Voucher Issue</option>
                                <option>General Inquiry</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={ticket.subject}
                                onChange={handleInputChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={ticket.description}
                                onChange={handleInputChange}
                                rows={5}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                            >
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HelpAndSupportPage;
