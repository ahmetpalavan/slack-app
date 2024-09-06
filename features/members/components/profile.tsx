import { AlertTriangle, Loader2, MailIcon, Phone, XIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Id } from '~/convex/_generated/dataModel';
import { useGetMember } from '../api/use-get-member';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Separator } from '~/components/ui/separator';
import Link from 'next/link';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const { data: member, isLoading: loadingMember } = useGetMember({ id: memberId });

  if (loadingMember) {
    return (
      <div className='flex justify-center items-center h-full'>
        <Loader2 className='animate-spin text-muted-foreground size-6' />
      </div>
    );
  }

  if (!member) {
    return (
      <div className='flex flex-col h-full'>
        <div className='flex justify-between items-center p-4 border-b'>
          <p className='text-lg font-bold'>Thread</p>
          <Button onClick={onClose} className='text-muted-foreground hover:text-white'>
            <XIcon className='size-5' />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 justify-center items-center h-full'>
          <AlertTriangle className='text-muted-foreground size-8' />
          <p className='text-lg text-muted-foreground'>Message not found</p>
        </div>
      </div>
    );
  }

  const fallback = member.user.name?.charAt(0).toUpperCase() ?? 'M';

  return (
    <div className='h-full flex-col flex'>
      <div className='flex justify-between items-center px-6 py-3  border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <Button size='iconSm' variant='ghost' onClick={onClose} className='text-muted-foreground hover:text-white'>
          <XIcon className='size-5' />
        </Button>
      </div>
      <div className='flex flex-col justify-center items-center p-4'>
        <Avatar className='max-w-[256px] max-h-[256px] rounded-md size-full'>
          <AvatarImage src={member.user.image} />
          <AvatarFallback className='aspect-square bg-sky-500 text-white text-6xl rounded-md'>{fallback}</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex flex-col p-4'>
        <span className='text-lg font-bold'>{member.user.name}</span>
      </div>
      <Separator />
      <div className='flex flex-col p-4'>
        <p className='text-sm text-muted-foreground mb-4'>Contact Information</p>
        <div className='flex items-center gap-2'>
          <div className='size-9 rounded-md bg-muted flex items-center justify-center'>
            <MailIcon className='size-4 text-muted-foreground' />
          </div>
          <div className='flex flex-col'>
            <p className='text-sm font-semibold text-muted-foreground'>Email Adress</p>
            <Link className='text-sm hover:underline text-[#1264a3]' href={`mailto:${member.user.email}`}>
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
