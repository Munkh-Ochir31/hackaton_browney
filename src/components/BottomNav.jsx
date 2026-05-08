'use client';
import { usePathname, useRouter } from 'next/navigation';
import { theme } from '../lib/theme';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: 'home', label: 'Нүүр', path: '/parking', icon: HomeIcon },
    { id: 'reserve', label: 'Захиалга', path: '/reserve', icon: ParkingIcon, isPartial: true },
    { id: 'profile', label: 'Профайл', path: '/profile', icon: ProfileIcon },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '390px',
      height: '64px',
      backgroundColor: theme.colors.surface,
      borderTop: `1px solid rgba(255,255,255,0.1)`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      {tabs.map(tab => {
        const isActive = tab.isPartial ? pathname.startsWith(tab.path) : pathname === tab.path;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? theme.colors.accent : theme.colors.textMuted,
              flex: 1,
              height: '100%',
            }}
          >
            <Icon color={isActive ? theme.colors.accent : theme.colors.textMuted} />
            <span style={{
              fontSize: '10px',
              marginTop: '4px',
              fontWeight: isActive ? 'bold' : 'normal'
            }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  );
}

function HomeIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function ParkingIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9"></path>
    </svg>
  );
}

function ProfileIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
