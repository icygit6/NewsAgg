import { NavLink, Link } from 'react-router';
import { Home, TrendingUp, MessageSquareQuote, Bookmark, Sun, Moon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { POSTS_ENABLED } from '../../constants';

interface NavItem {
  to: string;
  icon: typeof Home;
  label: string;
}

/** Left navigation rail (X-style): icon-only between md and xl, icon+label at
 * xl and up. Hidden on mobile, where BottomTabBar takes over. */
export function NavRail() {
  const { t, isDark, toggleTheme, setSidebarOpen, avatarSrc, user } = useApp();

  const items: NavItem[] = [
    { to: '/', icon: Home, label: t.home },
    { to: '/top-headlines', icon: TrendingUp, label: t.topHeadlines },
    ...(POSTS_ENABLED ? [{ to: '/posts', icon: MessageSquareQuote, label: t.posts }] : []),
    { to: '/bookmarks', icon: Bookmark, label: t.bookmarks },
  ];

  const baseItem = `flex items-center gap-4 rounded-full transition-colors px-3 py-3 xl:px-4
    ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200/70'}`;

  return (
    <nav
      className={`hidden md:flex sticky top-0 h-screen w-[68px] xl:w-[240px] shrink-0 flex-col
        items-center xl:items-stretch gap-1 px-2 xl:px-4 py-4 border-r
        ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
      aria-label={t.menu}
    >
      <Link to="/" className="mb-4 flex items-center gap-2 px-2 py-2">
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center font-poppins font-bold text-white text-lg shrink-0"
          style={{ background: 'var(--accent, #6366f1)' }}
        >
          N
        </span>
        <span className={`hidden xl:inline font-poppins text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          NewsAgg
        </span>
      </Link>

      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          title={label}
          className={({ isActive }) =>
            `${baseItem} ${
              isActive
                ? `font-semibold text-white`
                : isDark
                  ? 'text-slate-200'
                  : 'text-slate-700'
            }`
          }
          style={({ isActive }) => (isActive ? { background: 'var(--accent, #6366f1)' } : undefined)}
        >
          <Icon size={22} className="shrink-0" />
          <span className="hidden xl:inline text-[15px]">{label}</span>
        </NavLink>
      ))}

      <div className="mt-auto flex flex-col items-center xl:items-stretch gap-1 w-full">
        <button
          onClick={toggleTheme}
          title={isDark ? t.lightMode : t.darkMode}
          className={`${baseItem} ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
        >
          {isDark ? <Sun size={22} className="shrink-0" /> : <Moon size={22} className="shrink-0" />}
          <span className="hidden xl:inline text-[15px]">{isDark ? t.lightMode : t.darkMode}</span>
        </button>

        <button
          onClick={() => setSidebarOpen(true)}
          title={t.profile}
          className={`${baseItem} ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
        >
          <img
            src={avatarSrc}
            alt={t.profile}
            className="w-7 h-7 rounded-full object-cover shrink-0 bg-slate-300"
          />
          <span className="hidden xl:inline text-[15px] truncate">
            {user?.username || t.signIn}
          </span>
        </button>
      </div>
    </nav>
  );
}
