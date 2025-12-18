import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: 'Nebula Blog',
  url: 'https://example.com',
  description: 'An ultra-modern, animated blog experience',
  ogImage: '/images/cover-1.jpg'
};
