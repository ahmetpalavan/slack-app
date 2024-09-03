import { ImageIcon, Smile, XIcon } from 'lucide-react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';
import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import { Hint } from './hint';
import { Button } from './ui/button';
import { cn } from '~/lib/utils';
import { EmojiPopover } from './emoji-popover';
import Image from 'next/image';

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  onSubmit: ({ body, image }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | 'update';
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const quillRef = useRef<Quill | null>(null);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike', 'link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                const text = quill.getText();
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;
                if (isEmpty) return;
                const body = JSON.stringify(quill.getContents());
                submitRef.current({ body, image: addedImage });
                return;
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = useCallback(() => {
    setIsToolbarVisible((prev) => !prev);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  }, []);

  const onEmojiSelect = useCallback((emoji: any) => {
    const quill = quillRef.current;
    if (quill) {
      let selection = quill.getSelection();

      if (!selection) {
        quill.setSelection(quill.getLength() - 1);
        selection = quill.getSelection();
      }

      const index = selection ? selection.index : 0;
      quill.insertText(index, emoji.emoji);
      quill.setSelection(index + emoji.emoji.length);
    }
  }, []);

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className='flex flex-col'>
      <input
        ref={imageElementRef}
        onChange={(e) => {
          setImage(e.target.files?.[0] || null);
        }}
        type='file'
        accept='image/*'
        className='hidden'
      />
      <div
        className={cn(
          'flex flex-col rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-lg transition bg-white border border-slate-500',
          disabled && 'opacity-50'
        )}
      >
        <div ref={containerRef} className='h-full ql-custom' />
        {!!image && (
          <div className='p-2'>
            <div className='relative size-[62px] flex items-center justify-center group/image'>
              <Hint label='Remove image'>
                <button
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black -top-2.5 absolute -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center'
                >
                  <XIcon className='size-5 text-muted-foreground' />
                </button>
              </Hint>
              <Image alt='image' src={URL.createObjectURL(image)} fill className='rounded-xl object-cover border overflow-hidden' />
            </div>
          </div>
        )}
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label={isToolbarVisible ? 'Hide toolbar' : 'Show toolbar'}>
            <Button onClick={toggleToolbar} disabled={disabled} size='iconSm' variant='ghost'>
              <PiTextAa className='size-5' />
            </Button>
          </Hint>
          <EmojiPopover hint='Emoji' onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size='iconSm' variant='ghost'>
              <Smile className='size-5' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button onClick={() => imageElementRef.current?.click()} disabled={disabled} size='iconSm' variant='ghost'>
                <ImageIcon className='size-5' />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className='flex items-center ml-auto gap-x-2'>
              <Button onClick={onCancel} disabled={disabled} size='sm' variant='outline'>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  });
                }}
                size='sm'
                disabled={disabled || isEmpty}
                className='bg-[#2d9c7f] hover:bg-[#2d9c7f]/80 text-white'
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              className={cn(
                'ml-auto',
                isEmpty ? 'bg-white hover:bg-white text-muted-foreground' : 'bg-[#2d9c7f] hover:bg-[#2d9c7f]/80 text-white'
              )}
              onClick={() => {
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                });
              }}
              size='iconSm'
            >
              <MdSend className='size-5' />
            </Button>
          )}
        </div>
      </div>
      {variant === 'update' && (
        <div className={cn('p-2 text-xs text-muted-foreground  flex justify-end', !isEmpty && 'opacity-100')}>
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
