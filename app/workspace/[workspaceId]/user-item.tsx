import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Id } from '~/convex/_generated/dataModel';
import { useWorkspaceId } from '~/hooks/use-workspace-id';

interface UserItemProps {
  id: Id<'members'>;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>['variant'];
}

const userItemVariants = cva('flex items-center gap-2 h-7 justify-start font-normal px-4 text-sm overflow-hidden', {
  variants: {
    variant: {
      default: 'text-[#b3b5c1] hover:text-white',
      active: 'text-[#481349] bg-white/90 hover:bg-white/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const UserItem = ({ id, image, variant, label = 'Member' }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button size='sm' asChild className={userItemVariants({ variant })}>
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className='size-5 rounded-md mr-1'>
          <AvatarImage className='rounded-md' src={image} />
          <AvatarFallback className='rounded-md bg-sky-500 text-white'>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='truncate text-sm'>{label}</span>
      </Link>
    </Button>
  );
};
