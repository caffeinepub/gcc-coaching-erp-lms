import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitPaymentClaim, useGetMyPaymentClaims } from '../../hooks/useSubscriptions';
import type { Id, GetSubscriptionConfig } from '../../backend';

interface SubscriptionPaywallCardProps {
  classId: Id;
  className: string;
  studentId: Id;
  studentName: string;
  config: GetSubscriptionConfig;
  hasSubscription: boolean;
}

export default function SubscriptionPaywallCard({
  classId,
  className,
  studentId,
  studentName,
  config,
  hasSubscription,
}: SubscriptionPaywallCardProps) {
  const [reference, setReference] = useState('');
  const submitClaim = useSubmitPaymentClaim();
  const { data: myClaims } = useGetMyPaymentClaims(studentId, classId);

  const pendingClaim = myClaims?.find((c) => c.status === 'pending');
  const approvedClaim = myClaims?.find((c) => c.status === 'approved');

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      toast.error('Please enter a payment reference');
      return;
    }

    try {
      await submitClaim.mutateAsync({
        studentId,
        studentName,
        classId,
        className,
        reference: reference.trim(),
      });
      toast.success('Payment claim submitted! Waiting for admin approval.');
      setReference('');
    } catch (error: any) {
      console.error('Failed to submit claim:', error);
      toast.error('Failed to submit payment claim');
    }
  };

  if (hasSubscription || approvedClaim) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Subscription Active</strong> - You have full access to all lessons in {className}
        </AlertDescription>
      </Alert>
    );
  }

  if (pendingClaim) {
    return (
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <Clock className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Payment Verification Pending</strong> - Your payment claim is under review. You'll get access once approved by admin.
          <div className="mt-2 text-sm">
            Reference: <span className="font-mono">{pendingClaim.reference}</span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const priceInRupees = Number(config.priceSatoshis) / 100;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Subscription Required</CardTitle>
          </div>
          <Badge variant="secondary">₹{priceInRupees.toFixed(2)}</Badge>
        </div>
        <CardDescription>
          Subscribe to {className} to unlock all lessons. You currently have access to the first 2 lessons only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {config.qrImage && (
          <div className="space-y-2">
            <Label>Scan to Pay</Label>
            <div className="relative w-full aspect-square max-w-[250px] mx-auto border-2 rounded-lg overflow-hidden bg-white">
              <img
                src={config.qrImage.getDirectURL()}
                alt="Payment QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Scan this QR code with any UPI app to pay ₹{priceInRupees.toFixed(2)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmitClaim} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reference">Payment Reference / Transaction ID</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., UPI Ref: 123456789"
              required
            />
            <p className="text-xs text-muted-foreground">
              After making payment, enter your transaction ID or UPI reference number here
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={submitClaim.isPending}>
            {submitClaim.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'I Have Paid - Submit for Verification'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
