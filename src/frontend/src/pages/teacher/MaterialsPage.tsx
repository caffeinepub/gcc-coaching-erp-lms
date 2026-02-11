import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { BookMarked } from 'lucide-react';

export default function MaterialsTeacherPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireTeacher>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.materials')}</h1>
          <p className="text-muted-foreground mt-2">Upload study materials for your students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.materials')}</CardTitle>
            <CardDescription>Upload notes, assignments, and sample papers</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<BookMarked className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Study materials upload features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
