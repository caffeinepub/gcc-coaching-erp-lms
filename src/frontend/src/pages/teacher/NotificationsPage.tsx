import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Bell } from 'lucide-react';

export default function NotificationsTeacherPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.notifications')}</h1>
          <p className="text-muted-foreground mt-2">View your notifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.notifications')}</CardTitle>
            <CardDescription>Your notifications and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Bell className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No notifications yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
