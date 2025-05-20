'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Clipboard,
  Dumbbell,
  Home,
  LineChart,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const allRoutes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/workouts',
      label: 'Workouts',
      icon: Dumbbell,
    },
    {
      href: '/templates',
      label: 'Templates',
      icon: Clipboard,
    },
    {
      href: '/progress',
      label: 'Progress',
      icon: BarChart,
    },
    {
      href: '/stats',
      label: 'Statistics',
      icon: LineChart,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  const routesToShow = user ? allRoutes : [];

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex-1 py-1">
        {user && routesToShow.length > 0 && (
          <nav className="grid gap-1">
            {routesToShow.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? 'secondary' : 'ghost'}
                className={cn(
                  'flex h-10 items-center justify-start gap-2 px-4 text-sm font-medium',
                  pathname === route.href
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
