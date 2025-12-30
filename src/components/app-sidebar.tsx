'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, BookOpen, CalendarDays, FileText, Home, MessageSquare } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/notes', label: 'Note Generator', icon: FileText },
  { href: '/mock-tests', label: 'Mock Tests', icon: BookOpen },
  { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { href: '/planner', label: 'Study Planner', icon: CalendarDays },
];

export default function AppSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const navContent = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  const mobileNav = (
    <>
        <Link
            href="/"
            className="mb-4 flex items-center gap-2 text-lg font-semibold"
        >
            <Bot className="h-6 w-6 text-primary" />
            <span>Porobangla AI</span>
        </Link>
        {navContent}
    </>
  );

  if (isMobile) {
    return mobileNav;
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6 text-primary" />
            <span className="">Porobangla AI</span>
          </Link>
        </div>
        <div className="flex-1">
          {navContent}
        </div>
      </div>
    </div>
  );
}
