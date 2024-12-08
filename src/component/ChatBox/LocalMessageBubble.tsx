import { TPeerMetadata } from '@/utils/types';
import { useLocalPeer } from '@huddle01/react/hooks';
import { TMessage } from './ChatBox';

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className="w-full flex justify-end mb-2">
      <div className="bg-neutral-700 text-neutral-100 px-3 py-2 rounded-lg max-w-[70%] break-words">
        <div className="text-xs text-neutral-400 mb-1">
          {metadata?.displayName || 'You'}
        </div>
        <div className="text-sm">{message.text}</div>
      </div>
    </div>
  );
}

export default LocalMessageBubble;