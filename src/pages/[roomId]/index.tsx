import ChatBox from "@/component/ChatBox/ChatBox";
import RemotePeer from "@/component/RemotePeer/RemotePeer";
import { TPeerMetadata } from "@/utils/types";
import Navbar from "@/component/NavBar/Navbar";

import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from "@huddle01/react/hooks";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Users2Icon,
  Video as VideoShare,
  VideoOff as VideoShareOff,
  Disc,
  BookOpen,
  Zap,UsersIcon, Shield, MessageCircle, User2Icon, Lock
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  token: string;
};

export default function Home({ token }: Props) {
  const [displayName, setDisplayName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const { joinRoom, state } = useRoom({
    onJoin: (room) => {
      console.log("onJoin", room);
      updateMetadata({ displayName });
    },
    onPeerJoin: (peer) => {
      console.log("onPeerJoin", peer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();
  const [status, setStatus] = useState<String | any>("");
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (shareStream && screenRef.current) {
      screenRef.current.srcObject = shareStream;
    }
  }, [shareStream]);
  const isRoomConnected = state === "connected";

  return (
    <main
      className={`min-h-screen bg-neutral-900 text-neutral-100 p-4 ${inter.className}`}
    >
      <Navbar state={state} peerIds={peerIds} displayName={displayName} />
      {state === "idle" && (
  <div className="relative min-h-[calc(100vh-200px)] w-full flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
    {/* Subtle Background Animations */}
    <div className="absolute inset-0 pointer-events-none h-screen">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
    </div>

    <div className="relative z-10 w-full max-w-4xl h-screen py-12 ">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Descriptive Content */}
        <div className="space-y-6 mt-60">
          <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 backdrop-blur-sm">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Video Meeting Reimagined
            </h1>
            <p className="text-neutral-300 text-lg leading-relaxed">
              Connect, collaborate, and communicate seamlessly. 
              Our platform brings teams together with crystal-clear audio, 
              robust security, and an intuitive interface.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                disabled={state !== "idle"}
                placeholder="Enter Your Display Name"
                type="text"
                className="w-full px-4 py-3 pl-10 bg-neutral-800 text-neutral-100 
                  border-2 border-neutral-700 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all duration-300"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
              <User2Icon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
                  text-neutral-400 transition-colors duration-300 
                  group-focus-within:text-blue-500"
              />
            </div>

            <button
              disabled={!displayName}
              type="button"
              className="w-full px-6 py-3 
                bg-gradient-to-r from-blue-600 to-purple-600 
                text-white rounded-lg 
                hover:from-blue-700 hover:to-purple-700 
                transition-all duration-300
                flex items-center justify-center
                disabled:opacity-50 disabled:cursor-not-allowed
                group"
              onClick={async () => {
                await joinRoom({
                  roomId: router.query.roomId as string,
                  token,
                });
              }}
            >
              <Zap 
                className="mr-2 group-hover:animate-pulse" 
                strokeWidth={2.5} 
              /> 
              Join Meeting
            </button>

            <p className="text-neutral-500 text-sm text-center flex items-center justify-center">
              <Shield className="mr-2 text-green-500" /> 
              Secure and encrypted connection
            </p>
          </div>
        </div>

        {/* Right Side - Feature Highlights */}
        <div className="space-y-6">
          {[
            { 
              icon: Video, 
              title: "High-Quality Streaming", 
              description: "Good Video",
              color: "text-blue-400"
            },
            { 
              icon: Lock, 
              title: "End-to-End Encryption", 
              description: "Secure your conversations",
              color: "text-green-400"
            },
            { 
              icon: MessageCircle, 
              title: "Seamless Collaboration", 
              description: "Integrated chat and screen sharing",
              color: "text-purple-400"
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-neutral-800/50 rounded-xl p-5 
                border border-neutral-700/50 
                backdrop-blur-sm 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center mb-3">
                <feature.icon 
                  className={`w-10 h-10 mr-4 ${feature.color}`} 
                  strokeWidth={1.5} 
                />
                <h3 className="text-xl font-semibold text-neutral-100">
                  {feature.title}
                </h3>
              </div>
              <p className="text-neutral-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
      <div className="flex mt-24 space-x-6 h-[calc(100vh-6rem)] ">
        <div className="flex-1 overflow-y-auto pr-">
          {/* {state === "idle" && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-6 text-center">
              <div className="max-w-2xl px-4">
                <h1 className="text-4xl font-bold mb-4 text-neutral-100">
                  Welcome to Your Video Meeting Space
                </h1>
                <p className="text-neutral-400 mb-8 text-lg">
                  Connect seamlessly with colleagues, friends, and teammates.
                  Simply enter your display name to join the room and start
                  collaborating.
                </p>
              </div>

              <div className="w-full max-w-md space-y-4">
                <input
                  disabled={state !== "idle"}
                  placeholder="Enter Display Name"
                  type="text"
                  className="w-full max-w-md px-4 py-2 bg-neutral-800 text-neutral-100 border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />

                <div className="flex flex-col items-center space-y-2">
                  <button
                    disabled={!displayName}
                    type="button"
                    className="px-6 py-2 bg-neutral-700 text-neutral-100 border-2 border-neutral-600 hover:bg-neutral-600 transition-colors duration-200 disabled:opacity-50 w-full"
                    onClick={async () => {
                      await joinRoom({
                        roomId: router.query.roomId as string,
                        token,
                      });
                    }}
                  >
                    Join Room
                  </button>

                  <p className="text-neutral-500 text-sm">
                    Ensure a stable internet connection for the best experience
                  </p>
                </div>
              </div>

              <div className="max-w-2xl px-4 mt-8">
                <div className="grid grid-cols-3 gap-4 text-neutral-400">
                  <div className="text-center">
                    <div className="mb-2 text-neutral-200 font-semibold">
                      High Quality
                    </div>
                    <p className="text-sm">Crystal clear audio and video</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-neutral-200 font-semibold">
                      Secure
                    </div>
                    <p className="text-sm">End-to-end encrypted connections</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-neutral-200 font-semibold">
                      Easy to Use
                    </div>
                    <p className="text-sm">Simple, intuitive interface</p>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isVideoOn ? (
              <div className="border-2 border-neutral-700 p-2">
                <video
                  ref={videoRef}
                  className="w-full aspect-video bg-black"
                  autoPlay
                  muted
                />
              </div>
            ) : (
              <>
                {state === "connected" ? (
                  <div className="border-2 border-neutral-700 p-2">
                    <div className="w-full aspect-video bg-black flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-[130px] h-[130px] rounded-full bg-purple-300 flex items-center justify-center">
                          <div className="w-[115px] h-[115px] rounded-full bg-purple-300 shadow-2xl"></div>
                        </div>
                        <p className="text-center mt-4 text-white">
                          {displayName}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
            {shareStream && (
              <div className="border-2 border-neutral-700 p-2">
                <video
                  ref={screenRef}
                  className="w-full aspect-video bg-black"
                  autoPlay
                  muted
                />
              </div>
            )}
          </div>
          {/* Remote Peers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>

          {/* Additional Controls */}
          {state === "connected" && (
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-neutral-800 text-neutral-100 border-2 border-neutral-700 hover:bg-neutral-700 transition-colors duration-200"
                onClick={async () => {
                  isVideoOn ? await disableVideo() : await enableVideo();
                }}
              >
                {isVideoOn ? <Video /> : <VideoOff />}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-neutral-800 text-neutral-100 border-2 border-neutral-700 hover:bg-neutral-700 transition-colors duration-200"
                onClick={async () => {
                  isAudioOn ? await disableAudio() : await enableAudio();
                }}
              >
                {isAudioOn ? <Mic /> : <MicOff />}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-neutral-800 text-neutral-100 border-2 border-neutral-700 hover:bg-neutral-700 transition-colors duration-200"
                onClick={async () => {
                  shareStream
                    ? await stopScreenShare()
                    : await startScreenShare();
                }}
              >
                <Monitor />
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-neutral-800 text-neutral-100 border-2 border-neutral-700 hover:bg-neutral-700 transition-colors duration-200"
                onClick={async () => {
                  const status = isRecording
                    ? await fetch(
                        `/api/stopRecording?roomId=${router.query.roomId}`
                      )
                    : await fetch(
                        `/api/startRecording?roomId=${router.query.roomId}`
                      );
                  const data = await status.json();
                  console.log({ data });
                  setIsRecording(!isRecording);
                }}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
            </div>
          )}
        </div>

        {/* Right Column - ChatBox */}
        <div className="w-1/3 max-h-full">
          {state === "connected" && <ChatBox />}
        </div>
      </div>
    </main>
  );
}
import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const accessToken = new AccessToken({
    apiKey: process.env.API_KEY || "",
    roomId: ctx.params?.roomId?.toString() || "",
    role: Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const token = await accessToken.toJwt();

  return {
    props: { token },
  };
};
