'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export function PageHeader({ title, backHref = '/' }: PageHeaderProps) {
  const router = useRouter();

  const handleClick = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="font-pixel text-2xl md:text-3xl lg:text-4xl text-charcoal tracking-wider hover:opacity-70 transition-opacity cursor-pointer text-left flex items-center gap-3"
    >
      <span className="text-lg md:text-xl lg:text-2xl">←</span>
      {title}
    </button>
  );
}
