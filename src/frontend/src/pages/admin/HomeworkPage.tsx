import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { ClipboardList } from 'lucide-react';

export default function HomeworkAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.homework')}</h1>
          <p className="text-muted-foreground mt-2">Manage homework assignments and submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.homework')}</CardTitle>
            <CardDescription>View and manage all homework assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Homework management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
