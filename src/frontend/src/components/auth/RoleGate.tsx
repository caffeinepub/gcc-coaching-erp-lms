import { ReactNode } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { AccessDeniedState, LoadingState } from '../common/States';

interface RoleGateProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireStudent?: boolean;
  requireTeacher?: boolean;
}

export default function RoleGate({ children, requireAdmin, requireStudent, requireTeacher }: RoleGateProps) {
  const { isLoading, isAdmin, isStudent, isTeacher } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState />
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <AccessDeniedState />;
  }

  if (requireStudent && !isStudent) {
    return <AccessDeniedState />;
  }

  if (requireTeacher && !isTeacher) {
    return <AccessDeniedState />;
  }

  return <>{children}</>;
}
