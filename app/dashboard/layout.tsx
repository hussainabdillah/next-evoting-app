import DashboardLayout from '@/components/layout/dashboard-layout'
import { userNavItems } from '@/constants/data'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={userNavItems}>{children}</DashboardLayout>
}