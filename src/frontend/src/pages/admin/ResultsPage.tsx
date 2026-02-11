import RoleGate from '../../components/auth/RoleGate';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { BarChart3 } from 'lucide-react';

export default function ResultsPage() {
  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="text-muted-foreground">View test results and analytics</p>
        </div>

        <EmptyStateCard
          icon={<BarChart3 className="h-8 w-8 text-muted-foreground" />}
          title="Results coming soon"
          description="This feature will display test results and performance analytics"
        />
      </div>
    </RoleGate>
  );
}
