import { useProfileMemberId } from '~/features/members/store/use-profile-member-id';
import { useParentMessageId } from '~/features/messages/store/use-parent-message-id';

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const openProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const openParentMessage = (id: string) => {
    setParentMessageId(id);
    setProfileMemberId(null);
  };

  const closeParentMessage = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return { parentMessageId, profileMemberId, openParentMessage, closeParentMessage, openProfile };
};
