import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Share2, MessageCircle, Check } from 'lucide-react';
import { BattleQuiz1v1Extras, buildInviteUrl, type BQ1v1Mode } from '@/utils/battleQuiz1v1Extras';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultMode?: BQ1v1Mode;
}

const FriendInviteDialog: React.FC<Props> = ({ open, onOpenChange, defaultMode = 'classic' }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<BQ1v1Mode>(defaultMode);

  const create = async () => {
    setLoading(true);
    const r = await BattleQuiz1v1Extras.createFriendInvite('general', mode);
    setLoading(false);
    if ('error' in r) {
      toast.error('تعذّر إنشاء الدعوة');
      return;
    }
    setCode(r.invite_code);
  };

  const reset = () => { setCode(null); setCopied(false); };

  const inviteUrl = code ? buildInviteUrl(code) : '';
  const message = `⚔️ تحدّيتك في مواجهة 1 ضد 1 على Battle Quiz!\n\nانضم عبر هذا الرابط:\n${inviteUrl}`;

  const copy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success('تم نسخ الرابط');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'تحدِّ صديقك على Battle Quiz', text: message, url: inviteUrl });
      } catch { /* user cancelled */ }
    } else {
      copy();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle>🤝 تحدَّ صديقاً</DialogTitle>
          <DialogDescription>
            أنشئ رابط دعوة خاص وشاركه — أول من يفتح الرابط يبدأ المباراة معك فوراً.
          </DialogDescription>
        </DialogHeader>

        {!code ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm">وضع المباراة</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={mode === 'classic' ? 'default' : 'outline'}
                  onClick={() => setMode('classic')}
                  className="h-auto py-3 flex flex-col gap-1"
                >
                  <span className="text-base">⚔️ كلاسيكي</span>
                  <span className="text-[10px] opacity-80">5 أسئلة عادية</span>
                </Button>
                <Button
                  type="button"
                  variant={mode === 'blitz' ? 'default' : 'outline'}
                  onClick={() => setMode('blitz')}
                  className="h-auto py-3 flex flex-col gap-1"
                >
                  <span className="text-base">⚡ Blitz</span>
                  <span className="text-[10px] opacity-80">سريع — 6 ثوانٍ/سؤال</span>
                </Button>
              </div>
            </div>
            <Button onClick={create} disabled={loading} className="w-full" size="lg">
              {loading && <Loader2 className="w-4 h-4 animate-spin ml-1" />}
              أنشئ رابط التحدي
            </Button>
            <p className="text-xs text-muted-foreground text-center">الرابط ساري لمدة 24 ساعة</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-xs">رابط الدعوة</Label>
              <Input value={inviteUrl} readOnly className="mt-1 font-mono text-xs ltr:text-left" dir="ltr" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={copy} className="gap-1">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                نسخ
              </Button>
              <Button variant="outline" onClick={shareWhatsApp} className="gap-1">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                واتساب
              </Button>
              <Button variant="outline" onClick={shareNative} className="gap-1">
                <Share2 className="w-4 h-4" />
                مشاركة
              </Button>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              عند انضمام صديقك، ستنتقل المباراة تلقائياً.
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="w-full">
              إنشاء رابط آخر
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FriendInviteDialog;
