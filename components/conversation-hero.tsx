import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Avatar } from './ui/avatar';

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero = ({ name = 'User', image }: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();
  return (
    <div className='mt-[88px] mx-5 mb-4'>
      <div className='flex items-center gap-x-1 mb-2'>
        <Avatar className='size-14 mr-2 rounded-md'>
          <AvatarImage src={image} />
          <AvatarFallback className='rounded-md bg-sky-500 w-full items-center flex justify-center text-white'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className='text-2xl font-bold'>{name}</p>
      </div>
      <p className='font-normal text-slate-800 mb-4'>
        This is the very beginning of the conversation with <strong>{name}</strong>.
      </p>
    </div>
  );
};
