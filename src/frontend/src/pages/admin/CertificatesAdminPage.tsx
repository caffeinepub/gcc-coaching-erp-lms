import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Award } from 'lucide-react';

export default function CertificatesAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.certificates')}</h1>
          <p className="text-muted-foreground mt-2">Upload and manage student certificates</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.certificates')}</CardTitle>
            <CardDescription>Assign certificates to students</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Award className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Certificate management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
