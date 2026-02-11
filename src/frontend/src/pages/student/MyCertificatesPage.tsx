import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Award } from 'lucide-react';

export default function MyCertificatesPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myCertificates')}</h1>
          <p className="text-muted-foreground mt-2">View and download your certificates</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myCertificates')}</CardTitle>
            <CardDescription>Your achievement certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Award className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No certificates available yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
