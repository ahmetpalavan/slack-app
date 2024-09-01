import { ImageIcon, Smile } from 'lucide-react';
import Quill, { QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';
import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';
import { Hint } from './hint';
import { Button } from './ui/button';
import { cn } from '~/lib/utils';

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
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const quillRef = useRef<Quill | null>(null);
  const disabledRef = useRef(disabled);

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
        toolbar: [['bold', 'italic', 'strike', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              shiftKey: true,
              handler: (range: any) => {
                const quill = quillRef.current;
                if (!quill) return;

                quill.insertText(range.index, '\n');
                quill.setSelection(range.index + 1, 0);
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

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-lg transition bg-white border border-slate-500'>
        <div ref={containerRef} className='h-full ql-custom' />
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label={isToolbarVisible ? 'Hide toolbar' : 'Show toolbar'}>
            <Button onClick={toggleToolbar} disabled={disabled} size='iconSm' variant='ghost'>
              <PiTextAa className='size-5' />
            </Button>
          </Hint>
          <Hint label='Emoji'>
            <Button disabled={disabled} size='iconSm' variant='ghost'>
              <Smile className='size-5' />
            </Button>
          </Hint>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button disabled={disabled} size='iconSm' variant='ghost'>
                <ImageIcon className='size-5' />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className='flex items-center ml-auto gap-x-2'>
              <Button disabled={disabled} size='sm' variant='outline'>
                Cancel
              </Button>
              <Button size='sm' disabled={disabled || isEmpty} className='bg-[#2d9c7f] hover:bg-[#2d9c7f]/80 text-white'>
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
              onClick={() => submitRef.current({ body: text, image: null } as EditorValue)}
              size='iconSm'
            >
              <MdSend className='size-5' />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div className='p-2 text-xs text-muted-foreground flex justify-end'>
          <p>
            <strong>Shift + Return</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
