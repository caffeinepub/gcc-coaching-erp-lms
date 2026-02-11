import RoleGate from '../../components/auth/RoleGate';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { DollarSign } from 'lucide-react';

export default function MyFeesPage() {
  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Fees</h1>
          <p className="text-muted-foreground">View your fee status and payment history</p>
        </div>

        <EmptyStateCard
          icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
          title="Fee information coming soon"
          description="Your fee details and payment history will be displayed here"
        />
      </div>
    </RoleGate>
  );
}
