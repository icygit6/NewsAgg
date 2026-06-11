import { Outlet } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { AppShell } from '../components/shell/AppShell';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { ScrollToTop } from '../components/ScrollToTop';

export function Root() {
  const { isDark } = useApp();

  return (
    <div
      className={`min-h-screen font-sans ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <AppShell>
        <Outlet />
      </AppShell>

      {/* Global overlays */}
      <ProfileSidebar />
      <ScrollToTop />
    </div>
  );
}
