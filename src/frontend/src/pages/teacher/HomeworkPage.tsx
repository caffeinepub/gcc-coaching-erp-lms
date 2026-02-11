import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { ClipboardList } from 'lucide-react';

export default function HomeworkTeacherPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.homework')}</h1>
          <p className="text-muted-foreground mt-2">Assign homework and review submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.homework')}</CardTitle>
            <CardDescription>Create assignments and provide feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<ClipboardList className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Homework assignment features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
