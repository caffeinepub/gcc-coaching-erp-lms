import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Presentation } from 'lucide-react';

export default function MyLiveClassesPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myLiveClasses')}</h1>
          <p className="text-muted-foreground mt-2">Join your live classes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myLiveClasses')}</CardTitle>
            <CardDescription>Upcoming and past live class sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Presentation className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No live classes scheduled yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
