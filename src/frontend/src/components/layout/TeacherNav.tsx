import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from '../../i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Calendar, BookMarked, ClipboardList, FileText, Clock, Presentation,
  Bell, Wallet, CalendarDays,
} from 'lucide-react';

interface TeacherNavProps {
  onNavigate?: () => void;
}

export default function TeacherNav({ onNavigate }: TeacherNavProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { t } = useTranslation();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/teacher', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/teacher/attendance', label: t('nav.attendance'), icon: Calendar },
    { path: '/teacher/materials', label: t('nav.materials'), icon: BookMarked },
    { path: '/teacher/homework', label: t('nav.homework'), icon: ClipboardList },
    { path: '/teacher/tests', label: t('nav.tests'), icon: FileText },
    { path: '/teacher/timetable', label: t('nav.timetable'), icon: Clock },
    { path: '/teacher/live-classes', label: t('nav.liveClasses'), icon: Presentation },
    { path: '/teacher/notifications', label: t('nav.notifications'), icon: Bell },
    { path: '/teacher/salary', label: t('nav.salary'), icon: Wallet },
    { path: '/teacher/leave-requests', label: t('nav.leaveRequests'), icon: CalendarDays },
  ];

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    onNavigate?.();
  };

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleNavigate(item.path)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
