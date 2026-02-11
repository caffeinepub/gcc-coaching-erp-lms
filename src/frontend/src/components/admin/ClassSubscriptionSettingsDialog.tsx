import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useGetClassSubscriptionConfig, useSetClassSubscriptionConfig } from '../../hooks/useSubscriptions';
import { ExternalBlob } from '../../backend';
import type { Id } from '../../backend';

interface ClassSubscriptionSettingsDialogProps {
  classId: Id;
  className: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClassSubscriptionSettingsDialog({
  classId,
  className,
  open,
  onOpenChange,
}: ClassSubscriptionSettingsDialogProps) {
  const { data: config, isLoading } = useGetClassSubscriptionConfig(classId);
  const setConfig = useSetClassSubscriptionConfig();

  const [paywallEnabled, setPaywallEnabled] = useState(false);
  const [priceAmount, setPriceAmount] = useState('');
  const [qrImageFile, setQrImageFile] = useState<File | null>(null);
  const [qrImagePreview, setQrImagePreview] = useState<string | null>(null);

  // Load existing config
  useEffect(() => {
    if (config) {
      setPaywallEnabled(config.paywallEnabled);
      setPriceAmount((Number(config.priceSatoshis) / 100).toString());
      if (config.qrImage) {
        setQrImagePreview(config.qrImage.getDirectURL());
      }
    }
  }, [config]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (!priceAmount || parseFloat(priceAmount) <= 0) {
        toast.error('Please enter a valid price amount');
        return;
      }

      let qrBlob: ExternalBlob;

      if (qrImageFile) {
        // New file uploaded
        const arrayBuffer = await qrImageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        qrBlob = ExternalBlob.fromBytes(uint8Array);
      } else if (config?.qrImage) {
        // Use existing QR image
        qrBlob = config.qrImage;
      } else {
        toast.error('Please upload a payment QR code');
        return;
      }

      const priceSatoshis = BigInt(Math.round(parseFloat(priceAmount) * 100));

      await setConfig.mutateAsync({
        classId,
        paywallEnabled,
        priceSatoshis,
        qrImage: qrBlob,
      });

      toast.success('Subscription settings saved successfully');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to save subscription settings:', error);
      toast.error(error.message || 'Failed to save subscription settings');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscription & Payment Settings</DialogTitle>
          <DialogDescription>Configure subscription for {className}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="paywall-enabled">Enable Subscription Paywall</Label>
                <p className="text-sm text-muted-foreground">Limit free access to first 2 lessons</p>
              </div>
              <Switch
                id="paywall-enabled"
                checked={paywallEnabled}
                onCheckedChange={setPaywallEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Subscription Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder="e.g., 500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-image">Payment QR Code</Label>
              <div className="space-y-3">
                {qrImagePreview && (
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={qrImagePreview}
                      alt="Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    id="qr-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('qr-image')?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {qrImagePreview ? 'Change QR Code' : 'Upload QR Code'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your UPI/bank payment QR code for students to scan
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={setConfig.isPending}
                className="flex-1"
              >
                {setConfig.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
