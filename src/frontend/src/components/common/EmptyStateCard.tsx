import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyStateCard({ icon, title, description, action }: EmptyStateCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        {icon && <div className="rounded-full bg-muted p-4">{icon}</div>}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
