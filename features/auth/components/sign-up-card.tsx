'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlert } from 'lucide-react';
import { useState, useTransition } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { SignInFlow } from '../types';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const [isPending, startTransition] = useTransition();

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    startTransition(async () => {
      try {
        await signIn('password', { name, email, password, flow: 'signUp' });
      } catch (error: any) {
        console.error(error);
        setError("Couldn't sign in. Please check your email and password.");
      }
    });
  };

  const onProviderSignIn = (value: 'google' | 'github') => {
    startTransition(async () => {
      await signIn(value);
    });
  };

  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Sign up to continue</CardTitle>
      </CardHeader>
      {!!error && (
        <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}
      <CardDescription className='px-0 pt-0'>Enter your email and password to access your account</CardDescription>
      <CardContent className='space-y-5 px-0 pb-0'>
        <form onSubmit={onPasswordSignIn} className='space-y-5 mt-3'>
          <Input disabled={isPending} value={name} onChange={(e) => setName(e.target.value)} required placeholder='Name' />
          <Input disabled={isPending} value={email} onChange={(e) => setEmail(e.target.value)} required type='email' placeholder='Email' />
          <Input
            disabled={isPending}
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
          />
          <Input
            type='password'
            disabled={isPending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder='Confirm Password'
          />
          <Button disabled={isPending || password !== confirmPassword} type='submit' size='lg' variant='default' className='w-full'>
            Sign Up
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button onClick={() => onProviderSignIn('google')} size='lg' variant='outline' className='w-full relative'>
            <FcGoogle className='size-5 absolute top-2.5 left-2.5' />
            Sign in with Google
          </Button>
          <Button onClick={() => onProviderSignIn('github')} size='lg' variant='outline' className='w-full relative'>
            <FaGithub className='size-5 absolute top-2.5 left-2.5' />
            Sign in with GitHub
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          Already have an account?{' '}
          <span onClick={() => setState('sign-in')} className='text-sky-600 hover:underline cursor-pointer'>
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
