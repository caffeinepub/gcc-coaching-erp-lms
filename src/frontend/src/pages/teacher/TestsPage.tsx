import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { FileText } from 'lucide-react';

export default function TestsTeacherPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.tests')}</h1>
          <p className="text-muted-foreground mt-2">Create tests and grade submissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.tests')}</CardTitle>
            <CardDescription>Manage test creation and grading</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<FileText className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Test management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
