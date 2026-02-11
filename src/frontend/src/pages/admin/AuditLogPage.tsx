import { useTranslation } from '../../i18n/I18nProvider';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '../../components/common/States';
import { FileSearch } from 'lucide-react';

export default function AuditLogPage() {
  const { t } = useTranslation();

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.auditLog')}</h1>
          <p className="text-muted-foreground mt-2">View system activity and audit logs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('nav.auditLog')}</CardTitle>
            <CardDescription>Track system actions and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
              title={t('common.comingSoon')}
              description="Audit log features will be available soon"
            />
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
