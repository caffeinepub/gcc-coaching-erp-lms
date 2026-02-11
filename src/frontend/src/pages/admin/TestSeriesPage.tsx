import RoleGate from '../../components/auth/RoleGate';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { FileText } from 'lucide-react';

export default function TestSeriesPage() {
  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test Series</h1>
          <p className="text-muted-foreground">Create and manage tests</p>
        </div>

        <EmptyStateCard
          icon={<FileText className="h-8 w-8 text-muted-foreground" />}
          title="Test series coming soon"
          description="This feature will allow you to create tests with multiple choice and short answer questions"
        />
      </div>
    </RoleGate>
  );
}
