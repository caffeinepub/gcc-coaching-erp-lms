import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { CalendarDays } from 'lucide-react';

export default function LeaveRequestsAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.leaveRequests')}</h1>
          <p className="text-muted-foreground mt-2">Review and approve leave requests</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.leaveRequests')}</CardTitle>
            <CardDescription>Manage staff leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<CalendarDays className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Leave request management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
