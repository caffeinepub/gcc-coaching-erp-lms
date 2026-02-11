import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { CreditCard } from 'lucide-react';

export default function MyIdCardPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myIdCard')}</h1>
          <p className="text-muted-foreground mt-2">View and download your student ID card</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myIdCard')}</CardTitle>
            <CardDescription>Your digital student ID card</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<CreditCard className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="ID card will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
