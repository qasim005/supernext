import React from 'react';
import { ChevronDownIcon } from '../../icons/IconComponents';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left text-gray-800 dark:text-gray-200"
      >
        <span className="font-semibold">{question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 mt-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 dark:text-gray-400">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default FaqItem;
