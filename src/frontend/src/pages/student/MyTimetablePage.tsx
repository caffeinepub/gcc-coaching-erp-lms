import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { Clock } from 'lucide-react';

export default function MyTimetablePage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myTimetable')}</h1>
          <p className="text-muted-foreground mt-2">View your class schedule and holidays</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myTimetable')}</CardTitle>
            <CardDescription>Your class schedule and holiday list</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<Clock className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No timetable available yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
