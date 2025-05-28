import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import NavButton from './nav-button';
import { FiMessageCircle } from 'react-icons/fi';
import { ChatProgressEvent } from '~/application/controllers/llm.controller';
import { DeepseekModel, ModelFamily } from '~/domain/entities/llm.entity';
import type { DbRecipe } from '~/domain/entities/recipe.entity';

type ChatMessage = {
  role: 'user' | 'bot';
  content: string;
  recipes?: DbRecipe[]; // Add references to the type
};

const sendChatMessage = async (conversation: ChatMessage[]) => {
  try {
    const body = {
      messages: conversation.filter((c) => ({
        // filter out recipes
        role: c.role,
        content: c.content,
      })),
      model: DeepseekModel.CHAT,
      family: ModelFamily.DEEPSEEK,
    };
    const response = await fetch('/api/llm/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botResponse = '';
    let recipes: DbRecipe[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // The backend sends multiple SSE events, so split and process each
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data: ')) continue;
        const event = JSON.parse(line.slice(6)) as ChatProgressEvent;
        if (event.output?.status === 'success') {
          botResponse = event.output.response;
          recipes = event.output.recipes;
        }
        if (event.output?.status === 'error') {
          botResponse = event.output.message;
        }
      }
    }

    return { response: botResponse, recipes };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to fetch response from the chat API');
  }
};

const ChatContainer = ({ onClose }: { onClose: () => void }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<ChatMessage>>([
    {
      role: 'bot',
      content: "Hi! I'm Muse, your AI cooking assistant. How can I help you today?",
      recipes: [],
    },
  ]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to the chat
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: input, recipes: [] }];
    setMessages(newMessages);
    setInput('');

    try {
      const conversation = newMessages
        .filter((msg, idx) => idx !== 0 || msg.role !== 'bot')
        .map((msg) => ({ role: msg.role, content: msg.content }));

      const { response, recipes } = await sendChatMessage(conversation);

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: response,
          recipes: recipes,
        },
      ]);
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: 'An error occurred while processing your request.',
          references: [],
        },
      ]);
    }
  };

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
      {messages.map((msg, index) => (
        <div key={index} className={`flex flex-col space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
          <div
            className={`p-2 sm:p-3 rounded-lg max-w-[90%] sm:max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            <div className="text-sm sm:text-base">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {msg.recipes && msg.recipes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Related recipes:</p>
                  <div className="space-y-1">
                    {msg.recipes.map((recipe) => (
                      <a
                        key={recipe.id}
                        href={`/menu/recipe/${recipe.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                      >
                        {recipe.en.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const chatInput = (
    <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white dark:focus:ring-blue-600"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
        >
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
      {process.env.NODE_ENV === 'production' && (
        <div className="absolute top-[65px] inset-0 bg-black/30 z-40 flex items-center justify-center rounded-b-xl">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-lg max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Chat Unavailable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please try the chat feature in local development environment only.
            </p>
          </div>
        </div>
      )}
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
