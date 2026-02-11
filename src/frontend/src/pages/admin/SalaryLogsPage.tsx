import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Wallet } from 'lucide-react';

export default function SalaryLogsPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.salaryLogs')}</h1>
          <p className="text-muted-foreground mt-2">Manage staff salary records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.salaryLogs')}</CardTitle>
            <CardDescription>Record and track salary payments</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Salary management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
