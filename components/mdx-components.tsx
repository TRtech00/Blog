import Image from 'next/image';
import { cn } from '@/lib/utils';

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className={cn('mt-10 scroll-m-20 text-2xl font-semibold tracking-tight', props.className)} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className={cn('mt-8 scroll-m-20 text-xl font-semibold tracking-tight', props.className)} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className={cn('leading-7 text-muted-foreground', props.className)} />
  ),
  img: (props: any) => (
    <Image
      {...props}
      width={props.width ?? 1200}
      height={props.height ?? 720}
      alt={props.alt ?? ''}
      className={cn('my-6 rounded-3xl shadow-lg', props.className)}
    />
  )
};
