import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { BookMarked } from 'lucide-react';

export default function MyMaterialsPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.myMaterials')}</h1>
          <p className="text-muted-foreground mt-2">Access your study materials and notes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.myMaterials')}</CardTitle>
            <CardDescription>Browse and download study materials</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<BookMarked className="h-8 w-8 text-muted-foreground" />}
              title={t('common.noData')}
              description="No study materials available yet"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
