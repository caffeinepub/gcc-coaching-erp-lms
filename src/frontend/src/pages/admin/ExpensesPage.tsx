import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Receipt } from 'lucide-react';

export default function ExpensesPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.expenses')}</h1>
          <p className="text-muted-foreground mt-2">Track and manage institute expenses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.expenses')}</CardTitle>
            <CardDescription>Record and categorize expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Receipt className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Expense tracking features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
