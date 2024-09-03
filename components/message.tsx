import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { Doc, Id } from '~/convex/_generated/dataModel';
import { Hint } from './hint';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Thumbnail } from './thumbnail';
import { Toolbar } from './toolbar';
import { useUpdateMessage } from '~/features/messages/api/use-update-message';
import { toast } from 'sonner';
import { cn } from '~/lib/utils';

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorImage?: string;
  authorName?: string;
  reactions?: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  body: Doc<'messages'>['body'];
  isAuthor: boolean;
  image: string | null | undefined;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEditing: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount: number;
  threadImage?: string;
  threadTimestamp?: string;
}

const Renderer = dynamic(() => import('~/components/renderer'), { ssr: false });
const Editor = dynamic(() => import('~/components/editor'), { ssr: false });

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = 'Member',
  reactions,
  isAuthor,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const formatFulltime = (date: Date) => {
    return `${isToday(new Date(date)) ? 'Today' : isYesterday(new Date(date)) ? 'Yesterday' : format(new Date(date), 'MMM d yyyy')} at ${format(new Date(date), 'h:mm:ss a')}`;
  };
  const { mutate: updateMessage, isPending: pendingMessage } = useUpdateMessage();

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated');
          setEditingId(null);
        },
        onError: () => {
          toast.error('Failed to update message');
        },
      }
    );
  };

  if (isCompact) {
    return (
      <div className='flex flex-col gap-1 p-1.5 px-5 hover:bg-gray-100/50 group relative'>
        <div className='flex items-start gap-2'>
          <Hint label={formatFulltime(new Date(createdAt))}>
            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 text-center leading-5'>
              {format(new Date(createdAt), 'HH:mm')}
            </button>
          </Hint>

          {isEditing ? (
            <div className='w-full h-full'>
              <Editor
                onSubmit={handleUpdate}
                defaultValue={JSON.parse(body)}
                disabled={pendingMessage}
                onCancel={() => setEditingId(null)}
                placeholder='Type a message'
                variant='update'
              />
            </div>
          ) : (
            <div className='flex flex-col w-full'>
              <Renderer value={body} />
              <Thumbnail image={image} />
              {updatedAt ? <div className='text-xs text-muted-foreground'>(edited)</div> : null}
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            handleReaction={() => {}}
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleDelete={() => {}}
            handleThread={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-1.5 px-5 hover:bg-gray-100/50 group relative',
        isEditing && 'bg-[#f1f1f1] border border-slate-500 rounded'
      )}
    >
      <div className='flex items-start gap-2'>
        <button>
          <Avatar className='rounded-md'>
            <AvatarImage className='rounded-md' src={authorImage} alt={authorName} />
            <AvatarFallback className='rounded-md bg-sky-500 text-white text-xs'>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className='w-full'>
            <Editor
              onSubmit={handleUpdate}
              defaultValue={JSON.parse(body)}
              disabled={pendingMessage}
              onCancel={() => setEditingId(null)}
              placeholder='Type a message'
              variant='update'
            />
          </div>
        ) : (
          <div className='flex flex-col w-full overflow-hidden'>
            <div className='text-xs'>
              <button className='font-bold text-primary hover:underline'>{authorName}</button>
              <span>&nbsp;·&nbsp;</span>
              <Hint label={formatFulltime(new Date(createdAt))}>
                <button className='text-muted-foreground'>{format(new Date(createdAt), 'h:mm a')}</button>
              </Hint>
            </div>
            <Renderer value={body} />
            <Thumbnail image={image} />
            {updatedAt ? <div className='text-xs text-muted-foreground'>(edited)</div> : null}
          </div>
        )}
      </div>
      {!isEditing && (
        <Toolbar
          handleReaction={() => {}}
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleDelete={() => {}}
          handleThread={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};
