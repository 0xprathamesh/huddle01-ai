// import {
//   useRemoteAudio,
//   useRemoteScreenShare,
//   useRemoteVideo,
// } from '@huddle01/react/hooks';
// import React, { useEffect, useRef } from 'react';

// type Props = {
//   peerId: string;
// };

// const RemotePeer = ({ peerId }: Props) => {
//   const { stream, state } = useRemoteVideo({ peerId });
//   const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
//   const { videoStream: screenVideo, audioStream: screenAudio } =
//     useRemoteScreenShare({ peerId });
//   const vidRef = useRef<HTMLVideoElement>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const screenVideoRef = useRef<HTMLVideoElement>(null);
//   const screenAudioRef = useRef<HTMLAudioElement>(null);

//   // Existing useEffect hooks remain the same as in the original component

//   return (
//     <div className="bg-white rounded-lg border-4 border-black p-2 space-y-4 shadow-lg">
//       <div className="bg-[#F0EAD6] rounded-lg border-2 border-black overflow-hidden">
//         <video
//           ref={vidRef}
//           autoPlay
//           muted
//           className="w-full rounded-lg"
//         />
//       </div>

//       {screenVideo && (
//         <div className="bg-[#F0EAD6] rounded-lg border-2 border-black overflow-hidden">
//           <video
//             ref={screenVideoRef}
//             autoPlay
//             muted
//             className="w-full rounded-lg"
//           />
//         </div>
//       )}

//       <audio ref={audioRef} autoPlay className="hidden"></audio>
//       {screenAudio && <audio ref={screenAudioRef} autoPlay className="hidden"></audio>}
//     </div>
//   );
// };

// export default React.memo(RemotePeer);

import {
  useRemoteAudio,
  useRemoteScreenShare,
  useRemoteVideo,
} from "@huddle01/react/hooks";
import React, { useEffect, useRef } from "react";

type Props = {
  peerId: string;
};

const RemotePeer = ({ peerId }: Props) => {
  const { stream, state } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  const { videoStream: screenVideo, audioStream: screenAudio } =
    useRemoteScreenShare({ peerId });
  const vidRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (stream && vidRef.current) {
      vidRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (audioStream && audioRef.current) {
      audioRef.current.srcObject = audioStream;
    }
  }, [audioStream]);

  useEffect(() => {
    if (screenVideo && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenVideo;
    }
  }, [screenVideo]);

  useEffect(() => {
    if (screenAudio && screenAudioRef.current) {
      screenAudioRef.current.srcObject = screenAudio;
    }
  }, [screenAudio]);

  return (
    <div className="bg-neutral-800 rounded-lg border-2 border-neutral-700 p-2 space-y-4 shadow-lg ">
      {/* Main Video Stream */}
      {/* {stream && (
        <div className="border-2 border-neutral-700 rounded-lg overflow-hidden">
          <video
            ref={vidRef}
            autoPlay
            muted
            className="w-full aspect-video bg-black"
          />
        </div>
      )} */}
      {stream ? (
        <div className="border-2 border-neutral-700">
          <video
            ref={vidRef}
            className="w-full aspect-video bg-black h-60"
            autoPlay
            muted
          />
        </div>
      ) : (
        <>
          <div className=" border-neutral-700 ">
            <div className="w-full aspect-video bg-black flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-[130px] h-[130px] rounded-full bg-purple-300 flex items-center justify-center">
                  <div className="w-[115px] h-[115px] rounded-full bg-purple-300 shadow-2xl"></div>
                </div>
                <p className="text-center mt-2 text-white">Peer</p>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Screen Share Video */}
      {screenVideo && (
        <div className="border-2 border-neutral-700 rounded-lg overflow-hidden">
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full aspect-video bg-black"
          />
        </div>
      )}

      {/* Hidden Audio Elements */}
      <audio ref={audioRef} autoPlay className="hidden"></audio>
      {screenAudio && (
        <audio ref={screenAudioRef} autoPlay className="hidden"></audio>
      )}
    </div>
  );
};

export default React.memo(RemotePeer);
