"use client"
import React, { useState, useRef } from 'react';
import OpenAI from 'openai';

const AudioTranscriptionComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);


  const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true 
});
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = handleStop;
    mediaRecorderRef.current.start();
    setIsRecording(true);
  } catch (error) {
    console.error('Error starting recording:', error);
  }
};

const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};

const handleStop = async () => {
  const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
  audioChunksRef.current = [];

  try {
    // Convert Blob to File
    const file = new File([audioBlob], 'recording.webm', { 
      type: 'audio/webm' 
    });

    // Transcribe audio
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1'
    });

    const transcribedText = transcriptionResponse.text;
    setTranscription(transcribedText);

    // Get AI response to transcription
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ 
        role: 'user', 
        content: transcribedText 
      }]
    });

    setResponse(chatResponse.choices[0].message.content);
  } catch (error) {
    console.error('Error in transcription or response:', error);
    // Log the full error for more details
    console.error(JSON.stringify(error, null, 2));
  }
};

return (
  <div className="p-4 max-w-md mx-auto">
    <h2 className="text-xl font-bold mb-4">Audio Transcription & Response</h2>
    
    <div className="flex space-x-2 mb-4">
      <button 
        onClick={startRecording} 
        disabled={isRecording}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        Start Recording
      </button>
      <button 
        onClick={stopRecording} 
        disabled={!isRecording}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        Stop Recording
      </button>
    </div>

    {transcription && (
      <div className="mb-4">
        <h3 className="font-semibold">Transcription:</h3>
        <p className="bg-gray-100 p-2 rounded">{transcription}</p>
      </div>
    )}

    {response && (
      <div>
        <h3 className="font-semibold">AI Response:</h3>
        <p className="bg-gray-100 p-2 rounded">{response}</p>
      </div>
    )}
  </div>
);
};

export default AudioTranscriptionComponent;