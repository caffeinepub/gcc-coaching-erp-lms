import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Calendar } from 'lucide-react';

export default function AttendanceTeacherPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.attendance')}</h1>
          <p className="text-muted-foreground mt-2">Mark attendance for your classes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.attendance')}</CardTitle>
            <CardDescription>Mark student attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Attendance marking features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
