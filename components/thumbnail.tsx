import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface ThumbnailProps {
  image: string | null | undefined;
}

export const Thumbnail = ({ image }: ThumbnailProps) => {
  if (!image) return null;
  return (
    <Dialog>
      <DialogTrigger>
        <div className='relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in'>
          <img src={image} alt='thumbnail' className='object-cover size-full rounded-md' />
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[800px] border-none bg-transparent p-0 shadow-none'>
        <img src={image} alt='thumbnail' className='object-cover size-full rounded-md' />
      </DialogContent>
    </Dialog>
  );
};
