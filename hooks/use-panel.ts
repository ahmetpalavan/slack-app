import { useParentMessageId } from '~/features/messages/store/use-parent-message-id';

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const openParentMessage = (id: string) => {
    setParentMessageId(id);
  };

  const closeParentMessage = () => {
    setParentMessageId(null);
  };

  return { parentMessageId, openParentMessage, closeParentMessage };
};
