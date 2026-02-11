import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { CreditCard } from 'lucide-react';

export default function StudentIdCardsPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.idCards')}</h1>
          <p className="text-muted-foreground mt-2">Generate and print student ID cards</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.idCards')}</CardTitle>
            <CardDescription>Create print-ready student ID cards</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<CreditCard className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="ID card generation features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
