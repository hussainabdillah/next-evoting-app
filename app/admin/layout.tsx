import DashboardLayout from '@/components/layout/dashboard-layout'
import { adminNavItems } from '@/constants/data'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout navItems={adminNavItems}>{children}</DashboardLayout>
}
