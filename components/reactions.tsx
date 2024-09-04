import React from 'react';
import { Doc, Id } from '~/convex/_generated/dataModel';
import { useCurrentMember } from '~/features/members/api/use-current-member';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { cn } from '~/lib/utils';
import { Hint } from './hint';
import { EmojiPopover } from './emoji-popover';
import { MdOutlineAddReaction } from 'react-icons/md';

interface ReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds?: Id<'members'>[];
      memberId?: Id<'members'>;
    }
  >;
  onChange: (reaction: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  console.log(data);
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className='flex items-center gap-1 mt-1 mb-1'>
      {data.map((reaction) => (
        <Hint key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}>
          <button
            key={reaction._id}
            className={cn(
              'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center',
              reaction.memberId?.includes(currentMemberId) && 'bg-blue-100/70 border-blue-500 text-white'
            )}
            onClick={() => onChange(reaction.value)}
          >
            {reaction.value}
            <span
              className={cn(
                'ml-1 text-xs font-semibold text-muted-foreground',
                reaction.memberId?.includes(currentMemberId) && 'text-blue-500'
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint='Add reaction'
        onEmojiSelect={(emoji) => {
          onChange(emoji.emoji);
        }}
      >
        <button className='h-6 px-3 rounded-full bg-slate-200/70 border border-transparent hover:bg-slate-300/70 hover:border-slate-300 text-slate-800 flex items-center'>
          <MdOutlineAddReaction className='size-4' />
        </button>
      </EmojiPopover>
    </div>
  );
};
