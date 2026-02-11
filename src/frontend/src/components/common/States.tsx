import { Loader2, AlertCircle, Inbox, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        {icon || <Inbox className="h-8 w-8 text-muted-foreground" />}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function AccessDeniedState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Access Denied</h3>
        <p className="text-muted-foreground max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
