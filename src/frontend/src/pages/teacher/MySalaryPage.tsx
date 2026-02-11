import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Wallet } from 'lucide-react';

export default function MySalaryPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.salary')}</h1>
          <p className="text-muted-foreground mt-2">View your salary records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.salary')}</CardTitle>
            <CardDescription>Your salary payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No salary records available yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
