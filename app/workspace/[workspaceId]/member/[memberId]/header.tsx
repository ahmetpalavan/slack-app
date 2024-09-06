import { FaChevronDown } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({ memberImage, memberName, onClick }: HeaderProps) => {
  const avatarFallback = memberName?.charAt(0).toUpperCase();

  return (
    <>
      <div className='flex items-center h-12 px-4 overflow-hidden border-b'>
        <Button
          size='sm'
          onClick={onClick}
          variant='ghost'
          className='px-2 gap-2 flex items-center overflow-hidden text-lg font-semibold w-auto'
        >
          <Avatar className='size-6 mr2'>
            <AvatarImage src={memberImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className='flex items-center'>
            <span className='truncate'>{memberName}</span>
            <FaChevronDown className='ml-2 size-2.5' />
          </div>
        </Button>
      </div>
    </>
  );
};
