import { TPeerMetadata } from '@/utils/types';
import { useRemotePeer } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';


interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({ peerId: message.sender });

  return (
    <div className="w-full flex justify-start mb-2 tracking-wider text-sm font-bold ">
      <div className="bg-neutral-800  text-green-300 px-3 py-2 rounded-lg max-w-[70%] break-words">
        <div className="flex items-center text-xs  text-green-500 mb-1 space-x-1">
          
          <span > {metadata?.displayName || 'Remote Peer'}</span>
        </div>
        <div className="text-sm">{message.text}</div>
      </div>
    </div>
  );
}

export default RemoteMessageBubble;