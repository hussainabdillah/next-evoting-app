import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';
import { NavItem } from '@/types'

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children,
  navItems
}: {
  children: React.ReactNode;
  navItems: NavItem[]
}) {
  return (
    <div className="flex">
      <Sidebar items={navItems} />
      <main className="w-full flex-1 overflow-hidden">
        <Header items={navItems} />
        {children}
      </main>
    </div>
  );
}
