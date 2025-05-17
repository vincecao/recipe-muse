import { useState } from 'react';
import NavButton from './nav-button';
import { FiMessageCircle } from 'react-icons/fi';

const ChatContainer = ({ onClose }: { onClose: () => void }) => {
  const header = (
    <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Chat with Muse</h2>
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  const chatMessages = (
    <div className="h-[calc(100vh-12rem)] sm:h-[18rem] overflow-y-auto p-3 sm:p-4 space-y-3">
      <div className="flex flex-col space-y-2">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded-lg max-w-[90%] sm:max-w-[80%] self-start">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
            Hi! I'm Muse, your AI cooking assistant. How can I help you today?
          </p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">Start chatting...</p>
      </div>
    </div>
  );

  const chatInput = (
    <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white dark:focus:ring-blue-600"
        />
        <button className="p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed sm:absolute inset-0 sm:inset-auto sm:bottom-16 sm:right-0 w-full sm:w-96 h-full sm:h-[28rem] bg-white shadow-xl rounded-none sm:rounded-xl border-0 sm:border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      {header}
      {chatMessages}
      {chatInput}
    </div>
  );
};

export default function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative">
      <NavButton
        onClick={toggleChat}
        text="Chat"
        icon={<FiMessageCircle className="w-4 h-4" />} // Use an appropriate icon
        tooltip={{ content: 'Open Chat', placement: 'left' }}
      />
      {isChatOpen && <ChatContainer onClose={toggleChat} />}
    </div>
  );
}
