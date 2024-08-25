'use client';

import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { SignInFlow } from '../types';
import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { signIn } = useAuthActions();

  const handleProviderSignIn = (value: 'github' | 'google') => {
    signIn(value);
  };

  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Login to continue</CardTitle>
      </CardHeader>
      <CardDescription className='px-0 pt-0'>Enter your email and password to access your account</CardDescription>
      <CardContent className='space-y-5 px-0 pb-0'>
        <form className='space-y-5 mt-3'>
          <Input disabled={false} value={email} onChange={(e) => setEmail(e.target.value)} required type='email' placeholder='Email' />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            type='password'
            placeholder='Password'
          />
          <Button type='submit' size='lg' variant='default' className='w-full'>
            Sign In
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button onClick={() => handleProviderSignIn('google')} size='lg' variant='outline' className='w-full relative'>
            <FcGoogle className='size-5 absolute top-2.5 left-2.5' />
            Sign in with Google
          </Button>
          <Button onClick={() => handleProviderSignIn('github')} size='lg' variant='outline' className='w-full relative'>
            <FaGithub className='size-5 absolute top-2.5 left-2.5' />
            Sign in with GitHub
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Don't have an account?{' '}
          <span onClick={() => setState('sign-up')} className='text-sky-600 hover:underline cursor-pointer'>
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
