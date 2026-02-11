import RoleGate from '../../components/auth/RoleGate';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { BarChart3 } from 'lucide-react';

export default function MyResultsPage() {
  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Results</h1>
          <p className="text-muted-foreground">Check your test scores and performance</p>
        </div>

        <EmptyStateCard
          icon={<BarChart3 className="h-8 w-8 text-muted-foreground" />}
          title="No results yet"
          description="Your test results will appear here once you complete tests"
        />
      </div>
    </RoleGate>
  );
}
