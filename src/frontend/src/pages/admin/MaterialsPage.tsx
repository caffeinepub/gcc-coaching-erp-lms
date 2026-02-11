import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { BookMarked } from 'lucide-react';

export default function MaterialsAdminPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.materials')}</h1>
          <p className="text-muted-foreground mt-2">Manage study materials, notes, and assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.materials')}</CardTitle>
            <CardDescription>Upload and manage study materials</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<BookMarked className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Study materials management features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
