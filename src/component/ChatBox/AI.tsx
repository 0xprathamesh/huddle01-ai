import React, { useState } from 'react';
import OpenAI from 'openai';

export type TMessage = {
  text: string;
  sender: string;
};

function AIChatComponent() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true 
  });

  const sendMessage = async () => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage: TMessage = { text, sender: 'You' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setText('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = updatedMessages
        .slice(-5) // Limit context to last 5 messages
        .map(msg => ({
          role: msg.sender === 'You' ? 'user' : 'assistant',
          content: msg.text
        }));

      // Send message to OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
        max_tokens: 150,
        temperature: 0.7
      });
      
      const aiResponse = response.choices[0].message?.content || 'I did not understand that.';
      
      const aiMessage: TMessage = { 
        text: aiResponse.trim(), 
        sender: 'AI' 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      const errorMessage: TMessage = { 
        text: 'Sorry, there was an error processing your message.', 
        sender: 'System' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-neutral-900 text-neutral-100 border-2 border-neutral-700 rounded-lg flex flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-2 ${message.sender === 'You' ? 'text-right' : 'text-left'}`}
          >
            <span className={`
              inline-block px-3 py-2 rounded-lg max-w-[80%]
              ${message.sender === 'You' 
                ? 'bg-neutral-700 text-neutral-100' 
                : 'bg-neutral-800 text-neutral-300'}
            `}>
              {message.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-neutral-500 mt-2">
            AI is typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex p-2 border-t-2 border-neutral-700">
        <input
          type="text"
          className="flex-1 bg-neutral-800 text-neutral-100 px-3 py-2 
            border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 
            rounded-l-lg text-sm"
          placeholder="Ask AI a question..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              sendMessage();
            }
          }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-neutral-700 text-neutral-100 
            border-2 border-neutral-600 hover:bg-neutral-600 
            transition-colors duration-200 rounded-r-lg"
          disabled={isLoading}
        >
          <svg
            width="24"
            height="24"
            viewBox="-2.4 -2.4 28.80 28.80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.265 4.42619C1.04293 2.87167 2.6169 1.67931 4.05323 2.31397L21.8341 10.1706C23.423 10.8727 23.423 13.1273 21.8341 13.8294L4.05323 21.686C2.6169 22.3207 1.04293 21.1283 1.265 19.5738L1.99102 14.4917C2.06002 14.0087 2.41458 13.6156 2.88791 13.4972L8.87688 12L2.88791 10.5028C2.41458 10.3844 2.06002 9.99129 1.99102 9.50829L1.265 4.42619ZM21.0257 12L3.2449 4.14335L3.89484 8.69294L12.8545 10.9328C13.9654 11.2106 13.9654 12.7894 12.8545 13.0672L3.89484 15.3071L3.2449 19.8566L21.0257 12Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AIChatComponent;