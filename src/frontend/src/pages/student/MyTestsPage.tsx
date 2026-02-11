import RoleGate from '../../components/auth/RoleGate';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { FileText } from 'lucide-react';

export default function MyTestsPage() {
  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Tests</h1>
          <p className="text-muted-foreground">Take assigned tests and quizzes</p>
        </div>

        <EmptyStateCard
          icon={<FileText className="h-8 w-8 text-muted-foreground" />}
          title="No tests available"
          description="Your instructor hasn't assigned any tests yet"
        />
      </div>
    </RoleGate>
  );
}
