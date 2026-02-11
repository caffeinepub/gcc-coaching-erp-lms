import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { ClipboardList } from 'lucide-react';

export default function MyHomeworkPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myHomework')}</h1>
          <p className="text-muted-foreground mt-2">View and submit your homework</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myHomework')}</CardTitle>
            <CardDescription>Your homework assignments and submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No homework assignments yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
