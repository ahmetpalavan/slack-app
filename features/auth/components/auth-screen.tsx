'use client';

import { useState } from 'react';
import { SignInFlow } from '../types';
import { SignInCard } from './sign-in-card';
import { SignUpCard } from './sign-up-card';

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>('sign-in');
  return (
    <div className='h-full flex items-center justify-center bg-[#5C3B58]'>
      <div className='md:h-auto flex justify-center md:w-[420px]'>
        {state === 'sign-in' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
      </div>
    </div>
  );
};
