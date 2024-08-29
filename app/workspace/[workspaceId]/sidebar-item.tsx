import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons/lib';
import { Button } from '~/components/ui/button';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

interface SidebarItemProps {
  label: string;
  id: string;
  icon: IconType | LucideIcon;
  variant?: VariantProps<typeof sidebarVariantItems>['variant'];
}

const sidebarVariantItems = cva('flex items-center gap-2 h-7 justify-start font-normal px-[18px] text-sm overflow-hidden', {
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

export const SidebarItem = ({ label, id, icon: Icon, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button className={cn(sidebarVariantItems({ variant }))} asChild variant='transparent' size='sm'>
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className='size-4 mr-1 shrink-0' />
        <span className='truncate text-sm'>{label}</span>
      </Link>
    </Button>
  );
};
