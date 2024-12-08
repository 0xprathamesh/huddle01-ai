import React, { useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MessageSquare, 
  Bot, 
  Send 
} from 'lucide-react';

const BrutalistVideoConference = () => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('room');
  const [roomMessage, setRoomMessage] = useState('');
  const [aiMessage, setAIMessage] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [aiMessages, setAIMessages] = useState([]);

  const toggleVideo = () => setVideoEnabled(!videoEnabled);
  const toggleAudio = () => setAudioEnabled(!audioEnabled);

  const handleRoomMessageSend = () => {
    if (roomMessage.trim()) {
      setRoomMessages([...roomMessages, { text: roomMessage, sender: 'You' }]);
      setRoomMessage('');
    }
  };

  const handleAIMessageSend = () => {
    if (aiMessage.trim()) {
      setAIMessages([...aiMessages, { text: aiMessage, sender: 'You' }]);
      // Simulate AI response
      setAIMessages(prev => [...prev, { 
        text: `AI Response to: ${aiMessage}`, 
        sender: 'AI' 
      }]);
      setAIMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 space-x-4">
      {/* Video Container */}
      <div className="flex-grow bg-white border-4 border-black p-2">
        <div className="w-full h-[calc(100%-60px)] bg-gray-200 border-2 border-black mb-2">
          {/* Video placeholder */}
          {videoEnabled ? (
            <div className="w-full h-full bg-gray-300"></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-black">
              Video Disabled
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 p-2 bg-white border-2 border-black">
          <button 
            onClick={toggleVideo} 
            className={`p-2 border-2 border-black ${videoEnabled ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {videoEnabled ? <Camera /> : <CameraOff />}
          </button>
          <button 
            onClick={toggleAudio} 
            className={`p-2 border-2 border-black ${audioEnabled ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {audioEnabled ? <Mic /> : <MicOff />}
          </button>
          <button 
            className="p-2 border-2 border-black bg-blue-500"
          >
            <Monitor />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="w-96 bg-white border-4 border-black">
        {/* Chat Tabs */}
        <div className="flex border-b-4 border-black">
          <button 
            onClick={() => setActiveTab('room')}
            className={`flex-1 p-2 border-r-4 border-black ${activeTab === 'room' ? 'bg-yellow-500' : 'bg-white'}`}
          >
            <MessageSquare className="inline-block mr-2" /> Room Chat
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 p-2 ${activeTab === 'ai' ? 'bg-yellow-500' : 'bg-white'}`}
          >
            <Bot className="inline-block mr-2" /> AI Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-[calc(100%-120px)] overflow-y-auto p-2 bg-gray-100 border-b-4 border-black">
          {activeTab === 'room' 
            ? roomMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-2 mb-2 border-2 border-black ${msg.sender === 'You' ? 'bg-blue-200' : 'bg-green-200'}`}
                >
                  <strong>{msg.sender}: </strong>{msg.text}
                </div>
              ))
            : aiMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-2 mb-2 border-2 border-black ${msg.sender === 'You' ? 'bg-blue-200' : 'bg-green-200'}`}
                >
                  <strong>{msg.sender}: </strong>{msg.text}
                </div>
              ))
          }
        </div>

        {/* Message Input */}
        <div className="flex p-2 border-t-4 border-black">
          <input 
            type="text"
            value={activeTab === 'room' ? roomMessage : aiMessage}
            onChange={(e) => 
              activeTab === 'room' 
                ? setRoomMessage(e.target.value) 
                : setAIMessage(e.target.value)
            }
            placeholder={`Message in ${activeTab === 'room' ? 'Room Chat' : 'AI Chat'}`}
            className="flex-grow p-2 border-2 border-black mr-2"
          />
          <button 
            onClick={activeTab === 'room' ? handleRoomMessageSend : handleAIMessageSend}
            className="p-2 bg-yellow-500 border-2 border-black"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrutalistVideoConference;