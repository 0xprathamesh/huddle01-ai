import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { useState } from 'react';
import AIChatComponent from './AI';
import RemoteMessageBubble from './RemoteMessageBubble';
import LocalMessageBubble from './LocalMessageBubble';
import AudioTranscriptionComponent from './AudioTranscribe';
import ContinuousTranscription from './ContinuousTranscription';


export type TMessage = {
  text: string;
  sender: string;
};

export type TabType = 'chat' | 'ai' | 'transcript';

function ChatBox() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const { peerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === 'chat') {
        setMessages((prev) => [...prev, { text: payload, sender: from }]);
      }
    },
  });

  const sendMessage = () => {
    if (text.trim()) {
      sendData({
        to: '*',
        payload: text,
        label: 'chat',
      });
      setText('');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) =>
              message.sender === peerId ? (
                <LocalMessageBubble key={index} message={message} />
              ) : (
                <RemoteMessageBubble key={index} message={message} />
              )
            )}
          </div>
        );
      case 'ai':
        return (
          <div className="flex-1 p-4 text-neutral-300">
        <AIChatComponent />
          </div>
        );
      case 'transcript':
        return (
          <div className="flex-1 p-4 text-neutral-300">
            <ContinuousTranscription />
          </div>
        );
      
    }
  };

  return (
    <div className="h-full bg-neutral-900 text-neutral-100 border-2 border-neutral-700 rounded-lg flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-neutral-700">
        {(['chat', 'ai', 'transcript'] as TabType[]).map((tab) => (
          <button
            key={tab}
            className={`flex-1 px-4 py-2 uppercase tracking-wider text-sm font-bold 
              ${activeTab === tab 
                ? 'bg-neutral-700 text-neutral-100' 
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {renderTabContent()}

      {/* Input Area (only show for chat tab) */}
      {activeTab === 'chat' && (
        <div className="flex p-2 border-t-2 border-neutral-700">
          <input
            type="text"
            className="flex-1 bg-neutral-800 text-neutral-100 px-3 py-2 
              border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 
              rounded-l-lg text-sm"
            placeholder="Type Message..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-neutral-700 text-neutral-100 
              border-2 border-neutral-600 hover:bg-neutral-600 
              transition-colors duration-200 rounded-r-lg"
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
      )}
    </div>
  );
}

export default ChatBox;