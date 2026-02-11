import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BookMarked, ClipboardList, FileText, Bell, Wallet } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function TeacherDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickLinks = [
    { title: t('nav.attendance'), description: 'Mark student attendance', icon: Calendar, path: '/teacher/attendance' },
    { title: t('nav.materials'), description: 'Upload study materials', icon: BookMarked, path: '/teacher/materials' },
    { title: t('nav.homework'), description: 'Assign and review homework', icon: ClipboardList, path: '/teacher/homework' },
    { title: t('nav.tests'), description: 'Create and grade tests', icon: FileText, path: '/teacher/tests' },
    { title: t('nav.notifications'), description: 'View notifications', icon: Bell, path: '/teacher/notifications' },
    { title: t('nav.salary'), description: 'View salary logs', icon: Wallet, path: '/teacher/salary' },
  ];

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.dashboard')}</h1>
          <p className="text-muted-foreground mt-2">Teacher Portal - Manage your classes and students</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card
                key={link.path}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate({ to: link.path })}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </RoleGate>
  );
}
