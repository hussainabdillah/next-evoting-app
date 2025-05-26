'use client';
import { DashboardNav } from '@/components/dashboard-nav';
// import { navItems } from '@/constants/data';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import { ChevronLeft, Vote } from 'lucide-react';
import Link from 'next/link';
import { NavItem } from '@/types'

type SidebarProps = {
  className?: string,
  items: NavItem[]
};

export default function Sidebar({ className, items }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={'#'} className="flex items-start"
        >
          {!isMinimized && (
            <>
              <Vote className="mr-2 h-6 w-6 text-foreground" />
              <span className="text-xl font-bold text-foreground">Evoting</span>
            </>
          )}
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={items} />
          </div>
        </div>
      </div>
    </aside>
  );
}
