import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Bell } from 'lucide-react';

export default function NotificationsAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.notifications')}</h1>
          <p className="text-muted-foreground mt-2">Send notifications to students and teachers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.notifications')}</CardTitle>
            <CardDescription>Create and send announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Bell className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Notification management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
