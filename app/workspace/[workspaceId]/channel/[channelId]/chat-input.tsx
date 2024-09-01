import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';

const Editor = dynamic(() => import('~/components/editor'), { ssr: true });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  return (
    <div className='px-5 w-full'>
      <Editor
        variant='update'
        onSubmit={() => {}}
        defaultValue={[]}
        disabled={false}
        innerRef={editorRef}
        onCancel={() => {}}
        placeholder={placeholder}
      />
    </div>
  );
};
