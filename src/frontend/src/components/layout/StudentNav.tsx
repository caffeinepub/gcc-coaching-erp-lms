import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from '../../i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import {
  Home, Video, DollarSign, FileText, BarChart3, TrendingUp, Calendar, BookMarked,
  ClipboardList, Clock, Presentation, Bell, CreditCard, Award,
} from 'lucide-react';

interface StudentNavProps {
  onNavigate?: () => void;
}

export default function StudentNav({ onNavigate }: StudentNavProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { t } = useTranslation();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/student', label: t('nav.home'), icon: Home },
    { path: '/student/lessons', label: t('nav.myLessons'), icon: Video },
    { path: '/student/progress', label: t('nav.myProgress'), icon: TrendingUp },
    { path: '/student/attendance', label: t('nav.myAttendance'), icon: Calendar },
    { path: '/student/materials', label: t('nav.myMaterials'), icon: BookMarked },
    { path: '/student/homework', label: t('nav.myHomework'), icon: ClipboardList },
    { path: '/student/timetable', label: t('nav.myTimetable'), icon: Clock },
    { path: '/student/live-classes', label: t('nav.myLiveClasses'), icon: Presentation },
    { path: '/student/fees', label: t('nav.myFees'), icon: DollarSign },
    { path: '/student/tests', label: t('nav.myTests'), icon: FileText },
    { path: '/student/results', label: t('nav.myResults'), icon: BarChart3 },
    { path: '/student/notifications', label: t('nav.myNotifications'), icon: Bell },
    { path: '/student/id-card', label: t('nav.myIdCard'), icon: CreditCard },
    { path: '/student/certificates', label: t('nav.myCertificates'), icon: Award },
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
