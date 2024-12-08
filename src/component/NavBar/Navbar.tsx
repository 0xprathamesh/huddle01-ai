import React from 'react';
import { Mic, BookOpen, Zap, Link2, Users, Clock, Globe } from 'lucide-react';
import { useRouter } from 'next/router';

type NavbarProps = {
  state: string;
  peerIds: string[];
  displayName: string;
};

const Navbar: React.FC<NavbarProps> = ({ state, peerIds, displayName }) => {
  const router = useRouter();

  // Get current timezone
  const getTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  // Status color and icon mapping
  const getStatusIndicator = () => {
    switch(state.toLowerCase()) {
      case 'connected':
        return { 
          color: 'bg-green-500', 
          icon: <Users className="mr-2 text-green-500" size={20} />,
          text: 'Connected'
        };
      case 'connecting':
        return { 
          color: 'bg-yellow-500', 
          icon: <Clock className="mr-2 text-yellow-500" size={20} />,
          text: 'Connecting'
        };
      default:
        return { 
          color: 'bg-red-500', 
          icon: <Link2 className="mr-2 text-red-500" size={20} />,
          text: 'Disconnected'
        };
    }
  };

  const statusIndicator = getStatusIndicator();

  return (
    <nav className="fixed top-0 left-0 w-full bg-neutral-900 border-b border-neutral-800 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Project Name and Logo */}
          <div className="flex items-center">
            <Mic className="mr-2 text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-neutral-100 tracking-wide">
              HuddleAI
            </h1>
          </div>
          
          {/* Center - Enhanced Room Status and Information */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 shadow-md">
            <div className="flex items-center space-x-4 text-sm font-medium tracking-wider text-neutral-300">
              {/* Status Indicator */}
              <div className="flex items-center">
                {statusIndicator.icon}
                <div className="flex items-center">
                  <span 
                    className={`w-3 h-3 rounded-full mr-2 ${statusIndicator.color} animate-pulse`}
                  />
                  <span>{statusIndicator.text}</span>
                </div>
              </div>

              {/* Peers */}
              <div className="flex items-center">
                <Users className="mr-2 text-blue-400" size={20} />
                <span className="mr-1">Peers:</span>
                <span className="font-bold">{peerIds.length + 1}</span>
              </div>

              {/* Host */}
              <div className="flex items-center">
                <Globe className="mr-2 text-indigo-400" size={20} />
                <span className="mr-1">Name:</span>
                <span className="font-bold">
                  {displayName.toUpperCase() || "UNKNOWN"}
                </span>
              </div>

              {/* Timezone */}
              <div className="flex items-center">
                <Clock className="mr-2 text-purple-400" size={20} />
                <span className="mr-1">Timezone:</span>
                <span className="font-bold">{getTimeZone().toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Additional Links */}
          <div className="flex items-center space-x-4">
            <a
              href={`https://your-app.com/room/${router.query.roomId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Room Link
            </a>
            <a
              href="#"
              className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center"
            >
              <BookOpen className="mr-2" size={20} />
              Docs
            </a>
            <a
              href="#"
              className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center"
            >
              <Zap className="mr-2" size={20} />
              Features
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;