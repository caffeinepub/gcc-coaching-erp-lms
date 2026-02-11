import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { UserPlus } from 'lucide-react';

export default function AdmissionsPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.admissions')}</h1>
          <p className="text-muted-foreground mt-2">Manage admission inquiries and registrations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.admissions')}</CardTitle>
            <CardDescription>Track and manage admission leads</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<UserPlus className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Admissions management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
