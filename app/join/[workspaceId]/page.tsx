'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { useGetWorkspaceInfo } from '~/features/workspaces/api/use-get-workspace-info';
import { useJoin } from '~/features/workspaces/api/use-join';
import { useWorkspaceId } from '~/hooks/use-workspace-id';
import { cn } from '~/lib/utils';

interface JoinPageProps {
  params: {
    workspaceId: string;
  };
}

const JoinPage = ({ params }: JoinPageProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => {
    return data?.isMember;
  }, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, workspaceId, router]);

  const handleComplete = useCallback((code: string) => {
    mutate(
      { joinCode: code, workspaceId },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success('Successfully joined workspace');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }, []);

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col items-center justify-center gap-y-8 bg-white p-8 rounded-lg'>
      <CheckIcon className='size-16 text-rose-800' />
      <div className='flex flex-col gap-y-4 items-center justify-center max-w-md'>
        <div className='flex flex-col gap-y-2 items-center justify-center'>
          <h1 className='text-3xl font-bold text-rose-800'>Join {data?.name}</h1>
          <p className='text-lg text-muted-foreground text-center'>Enter the code provided by your team to join the workspace</p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          length={6}
          autoFocus
          classNames={{
            container: cn('flex gap-x-2', isPending && 'opacity-50 pointer-events-none'),
            character: 'flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-lg font-bold text-gray-800',
            characterInactive: 'text-gray-300',
            characterFilled: 'bg-gray-100',
            characterSelected: 'bg-gray-200',
          }}
        />
      </div>
      <div className='flex gap-x-4'>
        <Button className='flex items-center justify-center w-full py-2 bg-rose-800 text-white rounded-lg'>
          <Link href='/'>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
