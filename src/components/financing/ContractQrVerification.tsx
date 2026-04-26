import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ContractQrVerificationProps {
  verificationToken: string;
  contractNumber?: string;
}

/**
 * QR Code للتحقق من صحة العقد — يفتح صفحة /verify/contract/:token
 */
export const ContractQrVerification: React.FC<ContractQrVerificationProps> = ({
  verificationToken,
  contractNumber,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const verifyUrl = `${window.location.origin}/verify/contract/${verificationToken}`;

  const copy = async () => {
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    toast({ title: 'تم نسخ رابط التحقق' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5 bg-gradient-to-br from-emerald-50 to-card dark:from-emerald-950/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-bold text-sm">رمز التحقق من العقد</h4>
          <p className="text-xs text-muted-foreground">
            امسح الرمز للتأكد من صحة العقد
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="bg-white p-3 rounded-xl shadow-sm border">
          <QRCodeSVG
            value={verifyUrl}
            size={130}
            level="M"
            bgColor="#ffffff"
            fgColor="#0f172a"
          />
        </div>
        <div className="flex-1 w-full space-y-2 text-center sm:text-right">
          {contractNumber && (
            <div>
              <div className="text-xs text-muted-foreground">رقم العقد</div>
              <div className="font-mono font-bold text-sm">{contractNumber}</div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={copy}
            className="w-full gap-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                تم النسخ
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                نسخ رابط التحقق
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full gap-1.5"
          >
            <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" />
              فتح صفحة التحقق
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContractQrVerification;
