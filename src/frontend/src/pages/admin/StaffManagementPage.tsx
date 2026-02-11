import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { UsersRound } from 'lucide-react';

export default function StaffManagementPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.staff')}</h1>
          <p className="text-muted-foreground mt-2">Manage teachers and staff members</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.staff')}</CardTitle>
            <CardDescription>Register and manage staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<UsersRound className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Staff management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
