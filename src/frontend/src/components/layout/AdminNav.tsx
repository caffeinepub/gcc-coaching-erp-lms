import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useTranslation } from '../../i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard, Users, BookOpen, Video, DollarSign, FileText, BarChart3, Database, TrendingUp,
  Calendar, BookMarked, ClipboardList, Clock, Presentation, Bell, UserPlus, Receipt,
  UsersRound, Wallet, CalendarDays, CreditCard, Award, FileSearch,
} from 'lucide-react';

interface AdminNavProps {
  onNavigate?: () => void;
}

export default function AdminNav({ onNavigate }: AdminNavProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { t } = useTranslation();
  const currentPath = routerState.location.pathname;

  const navSections = [
    {
      title: 'Main',
      items: [
        { path: '/admin', label: t('nav.dashboard'), icon: LayoutDashboard },
        { path: '/admin/students', label: t('nav.students'), icon: Users },
        { path: '/admin/classes', label: t('nav.classes'), icon: BookOpen },
        { path: '/admin/lessons', label: t('nav.lessons'), icon: Video },
        { path: '/admin/progress', label: t('nav.progress'), icon: TrendingUp },
      ],
    },
    {
      title: 'Academic',
      items: [
        { path: '/admin/attendance', label: t('nav.attendance'), icon: Calendar },
        { path: '/admin/materials', label: t('nav.materials'), icon: BookMarked },
        { path: '/admin/homework', label: t('nav.homework'), icon: ClipboardList },
        { path: '/admin/timetable', label: t('nav.timetable'), icon: Clock },
        { path: '/admin/live-classes', label: t('nav.liveClasses'), icon: Presentation },
      ],
    },
    {
      title: 'Assessment',
      items: [
        { path: '/admin/tests', label: t('nav.tests'), icon: FileText },
        { path: '/admin/results', label: t('nav.results'), icon: BarChart3 },
      ],
    },
    {
      title: 'Finance & HR',
      items: [
        { path: '/admin/fees', label: t('nav.fees'), icon: DollarSign },
        { path: '/admin/admissions', label: t('nav.admissions'), icon: UserPlus },
        { path: '/admin/expenses', label: t('nav.expenses'), icon: Receipt },
        { path: '/admin/staff', label: t('nav.staff'), icon: UsersRound },
        { path: '/admin/salary-logs', label: t('nav.salaryLogs'), icon: Wallet },
        { path: '/admin/leave-requests', label: t('nav.leaveRequests'), icon: CalendarDays },
      ],
    },
    {
      title: 'Documents',
      items: [
        { path: '/admin/id-cards', label: t('nav.idCards'), icon: CreditCard },
        { path: '/admin/certificates', label: t('nav.certificates'), icon: Award },
      ],
    },
    {
      title: 'System',
      items: [
        { path: '/admin/notifications', label: t('nav.notifications'), icon: Bell },
        { path: '/admin/audit-log', label: t('nav.auditLog'), icon: FileSearch },
      ],
    },
  ];

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    onNavigate?.();
  };

  return (
    <div className="space-y-4">
      {navSections.map((section, idx) => (
        <div key={section.title}>
          {idx > 0 && <Separator className="my-3" />}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">{section.title}</p>
            {section.items.map((item) => {
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
        </div>
      ))}

      <Separator />

      <Button
        variant={currentPath === '/admin/demo' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => handleNavigate('/admin/demo')}
      >
        <Database className="mr-2 h-4 w-4" />
        Demo Data
      </Button>
    </div>
  );
}
