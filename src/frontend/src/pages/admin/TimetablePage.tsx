import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Clock } from 'lucide-react';

export default function TimetableAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.timetable')}</h1>
          <p className="text-muted-foreground mt-2">Manage class schedules and holidays</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.timetable')}</CardTitle>
            <CardDescription>Create and manage timetables and holiday lists</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Clock className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Timetable management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
