import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Calendar } from 'lucide-react';

export default function MyAttendancePage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myAttendance')}</h1>
          <p className="text-muted-foreground mt-2">View your attendance records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myAttendance')}</CardTitle>
            <CardDescription>Your attendance summary and history</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Attendance tracking features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
