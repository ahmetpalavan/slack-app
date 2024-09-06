'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '~/convex/_generated/dataModel';
import { useCreateOrGetConversation } from '~/features/conversations/api/use-create-or-get-conversation';
import { useMemberId } from '~/hooks/use-member-id';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { Conversation } from './conversation';

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { data, mutate, isPending } = useCreateOrGetConversation();
  const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null);

  useEffect(() => {
    mutate(
      {
        memberId,
        workspaceId,
      },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
        onError: () => {
          toast.error('Failed to create conversation');
        },
      }
    );
  }, [memberId, workspaceId]);

  if (isPending) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='animate-spin size-6 text-muted-foreground' />
      </div>
    );
  }

  return <Conversation id={conversationId as Id<'conversations'>} />;
};

export default MemberIdPage;
