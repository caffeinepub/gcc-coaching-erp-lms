import { useState } from 'react';
import RoleGate from '../../components/auth/RoleGate';
import { useGetPendingPaymentClaims, useApprovePaymentClaim } from '../../hooks/useSubscriptions';
import { useGetStudents } from '../../hooks/useQueries';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, CheckCircle2, Loader2, Clock, Info } from 'lucide-react';
import { toast } from 'sonner';

export default function FeesPage() {
  const { data: pendingClaims, isLoading } = useGetPendingPaymentClaims();
  const { data: students } = useGetStudents();
  const approveClaim = useApprovePaymentClaim();
  const [approvingClaimId, setApprovingClaimId] = useState<string | null>(null);

  const handleApproveClaim = async (claimId: string) => {
    setApprovingClaimId(claimId);
    try {
      await approveClaim.mutateAsync({ claimId });
      toast.success('Payment approved! Student subscription activated.');
    } catch (error: any) {
      console.error('Failed to approve claim:', error);
      toast.error(error.message || 'Failed to approve payment claim');
    } finally {
      setApprovingClaimId(null);
    }
  };

  const hasPendingClaims = pendingClaims && pendingClaims.length > 0;

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">Review and approve student subscription payments</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !hasPendingClaims ? (
          <EmptyStateCard
            icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
            title="No pending payment claims"
            description="When students submit payment claims for class subscriptions, they will appear here for your review"
          />
        ) : (
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>{pendingClaims.length} payment claim{pendingClaims.length > 1 ? 's' : ''} pending review.</strong> Verify the payment in your bank account before approving.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Pending Payment Claims</CardTitle>
                <CardDescription>Review and approve student subscription payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Payment Reference</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.studentName}</TableCell>
                        <TableCell>{claim.className}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{claim.reference}</code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(claim.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleApproveClaim(claim.id)}
                            disabled={approvingClaimId === claim.id}
                          >
                            {approvingClaimId === claim.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
