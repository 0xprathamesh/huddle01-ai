"use client";
import React, { useState, useRef } from "react";
import OpenAI from "openai";

const ContinuousTranscription = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    audioChunksRef.current = [];

    try {
      const file = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const transcriptionResponse = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
      });
      const transcribedText = transcriptionResponse.text;

      setMessages((prev) => [
        ...prev,
        { text: transcribedText, sender: "You" },
      ]);

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give short info and Guide Link on ${transcribedText}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const aiResponse =
        chatResponse.choices[0]?.message?.content || "No response.";
      setMessages((prev) => [...prev, { text: aiResponse, sender: "AI" }]);
    } catch (error) {
      console.error("Error during transcription or response:", error);
    }
  };

  return (
    <div className="h-full bg-neutral-900 text-neutral-100 border-2 border-neutral-700 rounded-lg flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.sender === "You" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                message.sender === "You"
                  ? "bg-neutral-700 text-neutral-100"
                  : "bg-neutral-800 text-neutral-300"
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>

   
      <div onClick={isRecording ? stopRecording : startRecording} className="text-[#181818] cursor-no-drop">
        {isRecording ? "." : "."}{" "}
      </div>
    </div>
  );
};

export default ContinuousTranscription;

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import OpenAI from "openai";
// import { useLocalAudio } from "@huddle01/react/hooks";

// const AudioTranscriptionComponent = () => {
//   const [transcription, setTranscription] = useState("");
//   const [response, setResponse] = useState("");
//   const audioChunksRef = useRef<Blob[]>([]);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   const { isAudioOn, enableAudio, disableAudio, stream } = useLocalAudio();

//   const openai = new OpenAI({
//     apiKey: "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",
//     dangerouslyAllowBrowser: true,
//   });

//   useEffect(() => {
//     if (stream && isAudioOn) {
//       startRecording();
//     } else {
//       stopRecording();
//     }
//   }, [isAudioOn]);

//   const startRecording = async () => {
//     try {
//       // Use the provided stream or fallback to getUserMedia
//       const mediaStream = stream || (await navigator.mediaDevices.getUserMedia({ audio: true }));

//       if (mediaStream instanceof MediaStream) {
//         mediaRecorderRef.current = new MediaRecorder(mediaStream);
//         audioChunksRef.current = []; // Clear previous audio chunks

//         mediaRecorderRef.current.ondataavailable = (event) => {
//           audioChunksRef.current.push(event.data);
//         };

//         mediaRecorderRef.current.onstop = handleStop;
//         mediaRecorderRef.current.start();
//       } else {
//         console.error("Invalid MediaStream:", mediaStream);
//       }
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleStop = async () => {
//     const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//     audioChunksRef.current = []; // Reset after each stop

//     try {
//       // Convert Blob to File
//       const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });

//       // Transcribe audio
//       const transcriptionResponse = await openai.audio.transcriptions.create({
//         file: file,
//         model: "whisper-1",
//       });

//       const transcribedText = transcriptionResponse.text;
//       setTranscription(transcribedText);

//       // Get AI response to transcription
//       const chatResponse = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "user",
//             content: transcribedText,
//           },
//         ],
//       });

//       setResponse(chatResponse.choices[0].message.content);
//     } catch (error) {
//       console.error("Error in transcription or response:", error);
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Audio Transcription & Response</h2>

//       <div className="flex space-x-2 mb-4">
//         <button
//           onClick={enableAudio}
//           disabled={isAudioOn}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//         >
//           Enable Audio
//         </button>
//         <button
//           onClick={disableAudio}
//           disabled={!isAudioOn}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
//         >
//           Disable Audio
//         </button>
//       </div>

//       {transcription && (
//         <div className="mb-4">
//           <h3 className="font-semibold">Transcription:</h3>
//           <p className="bg-gray-100 p-2 rounded">{transcription}</p>
//         </div>
//       )}

//       {response && (
//         <div>
//           <h3 className="font-semibold">AI Response:</h3>
//           <p className="bg-gray-100 p-2 rounded">{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AudioTranscriptionComponent;

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import OpenAI from "openai";
// import { useLocalAudio } from "@huddle01/react/hooks";

// const ContinuousTranscription = () => {
//   const [transcription, setTranscription] = useState("");
//   const [response, setResponse] = useState("");
//   const { enableAudio, disableAudio, isAudioOn, stream } = useLocalAudio();
//   const audioChunksRef = useRef<Blob[]>([]);
//   const isProcessingRef = useRef(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);

//   const openai = new OpenAI({
//     apiKey:
//       "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",
//     dangerouslyAllowBrowser: true,
//   });
//   useEffect(() => {
//     enableAudio();
//     return () => disableAudio();
//   }, [enableAudio, disableAudio]);

//   useEffect(() => {
//     if (stream) {
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };
//       mediaRecorderRef.current.start(1000); // Collect chunks every second
//     }
//     return () => {
//       mediaRecorderRef.current?.stop();
//     };
//   }, [stream]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (audioChunksRef.current.length > 0 && !isProcessingRef.current) {
//         processAudio();
//       }
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   const processAudio = async () => {
//     if (!mediaRecorderRef.current || isProcessingRef.current) return;

//     isProcessingRef.current = true;
//     const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//     audioChunksRef.current = [];

//     try {
//       const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });

//       // Whisper Transcription
//       const transcriptionResponse = await openai.audio.transcriptions.create({
//         file: file,
//         model: "whisper-1",
//       });
//       const transcribedText = transcriptionResponse.text;
//       setTranscription((prev) => `${prev}\n${transcribedText}`);

//       // GPT Chat Response
//       const chatResponse = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: transcribedText }],
//       });
//       setResponse(chatResponse.choices[0].message.content);
//     } catch (error) {
//       console.error("Error processing audio:", error);
//     } finally {
//       isProcessingRef.current = false;
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Continuous Audio Transcription</h2>
//       <p className="mb-4">
//         Audio is automatically transcribed and analyzed for AI responses.
//       </p>

//       <div className="mb-4">
//         <h3 className="font-semibold">Transcription:</h3>
//         <div className="bg-gray-100 p-2 rounded h-40 overflow-y-auto">
//           <p>{transcription || "Waiting for audio..."}</p>
//         </div>
//       </div>

//       <div>
//         <h3 className="font-semibold">AI Response:</h3>
//         <div className="bg-gray-100 p-2 rounded h-24 overflow-y-auto">
//           <p>{response || "Waiting for response..."}</p>
//         </div>
//       </div>
//       <div className="mt-4">
//         <button
//           onClick={isAudioOn ? disableAudio : enableAudio}
//           className="bg-blue-500 text-white py-2 px-4 rounded"
//         >
//           {isAudioOn ? "Disable Audio" : "Enable Audio"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContinuousTranscription;

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import OpenAI from "openai";
// import { useLocalAudio } from "@huddle01/react/hooks";

// const ContinuousTranscription = () => {
//   const [messages, setMessages] = useState<
//     { text: string; sender: string }[]
//   >([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { enableAudio, disableAudio, isAudioOn, stream } = useLocalAudio();
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const isProcessingRef = useRef(false);

//   const openai = new OpenAI({
//     apiKey:
//       "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",
//     dangerouslyAllowBrowser: true,
//   });

//   useEffect(() => {
//     enableAudio();
//     return () => disableAudio();
//   }, [enableAudio, disableAudio]);

//   useEffect(() => {
//     if (stream && !audioContextRef.current) {
//       audioContextRef.current = new AudioContext();
//       const input = audioContextRef.current.createMediaStreamSource(stream);
//       const processor = audioContextRef.current.createScriptProcessor(
//         4096,
//         1,
//         1
//       );

//       input.connect(processor);
//       processor.connect(audioContextRef.current.destination);

//       processor.onaudioprocess = () => {
//         if (!isProcessingRef.current && audioChunksRef.current.length > 0) {
//           processAudio();
//         }
//       };

//       mediaRecorderRef.current = new MediaRecorder(stream);
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };
//       mediaRecorderRef.current.start(1000);
//     }
//   }, [stream]);

//   const processAudio = async () => {
//     if (!mediaRecorderRef.current || isProcessingRef.current) return;

//     isProcessingRef.current = true;
//     const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//     audioChunksRef.current = [];

//     try {
//       const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
//       const transcriptionResponse = await openai.audio.transcriptions.create({
//         file,
//         model: "whisper-1",
//       });
//       const transcribedText = transcriptionResponse.text;

//       setMessages((prev) => [
//         ...prev,
//         { text: transcribedText, sender: "You" },
//       ]);

//       const chatResponse = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           { role: "user", content: `Give short info and Guides on ${transcribedText}` },
//         ],
//         max_tokens: 150,
//         temperature: 0.7,
//       });

//       const aiResponse = chatResponse.choices[0]?.message?.content || "No response.";
//       setMessages((prev) => [...prev, { text: aiResponse, sender: "AI" }]);
//     } catch (error) {
//       console.error("Error during transcription or response:", error);
//     } finally {
//       isProcessingRef.current = false;
//     }
//   };

//   return (
//     <div className="h-full bg-neutral-900 text-neutral-100 border-2 border-neutral-700 rounded-lg flex flex-col">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`mb-2 ${message.sender === "You" ? "text-right" : "text-left"}`}
//           >
//             <span
//               className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
//                 message.sender === "You"
//                   ? "bg-neutral-700 text-neutral-100"
//                   : "bg-neutral-800 text-neutral-300"
//               }`}
//             >
//               {message.text}
//             </span>
//           </div>
//         ))}
//         {isLoading && <div className="text-center text-neutral-500 mt-2">Processing...</div>}
//       </div>

//       {/* Status */}
//       <div className="p-2 border-t-2 border-neutral-700 text-center">
//         <button
//           onClick={() => {
//             if (isAudioOn) {
//               disableAudio();
//             } else {
//               enableAudio();
//             }
//           }}
//           className={`px-4 py-2 text-sm rounded-lg ${
//             isAudioOn
//               ? "bg-red-600 hover:bg-red-700"
//               : "bg-green-600 hover:bg-green-700"
//           } text-neutral-100 transition duration-200`}
//         >
//           {isAudioOn ? "Stop Listening" : "Start Listening"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ContinuousTranscription;
