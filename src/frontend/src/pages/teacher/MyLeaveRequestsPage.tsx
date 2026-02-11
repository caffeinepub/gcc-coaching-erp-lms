import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { CalendarDays } from 'lucide-react';

export default function MyLeaveRequestsPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.leaveRequests')}</h1>
          <p className="text-muted-foreground mt-2">Submit and track your leave requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.leaveRequests')}</CardTitle>
            <CardDescription>Your leave request history</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<CalendarDays className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No leave requests yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
