import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Presentation } from 'lucide-react';

export default function LiveClassesAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.liveClasses')}</h1>
          <p className="text-muted-foreground mt-2">Manage live class sessions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.liveClasses')}</CardTitle>
            <CardDescription>Schedule and manage live class sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Presentation className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Live classes management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
