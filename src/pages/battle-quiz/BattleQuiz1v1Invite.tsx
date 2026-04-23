import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Swords, ArrowLeft, AlertCircle } from 'lucide-react';
import { BattleQuiz1v1Extras } from '@/utils/battleQuiz1v1Extras';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';

const BattleQuiz1v1Invite: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      // Redirect to auth, then back here
      const back = `/battle-quiz/1v1/invite/${code}`;
      navigate(`/auth?next=${encodeURIComponent(back)}`);
    }
  }, [user, code, navigate]);

  const accept = async () => {
    if (!code) return;
    setAccepting(true);
    setError(null);
    const r = await BattleQuiz1v1Extras.acceptFriendInvite(code);
    setAccepting(false);
    if (r.error) {
      const msg =
        r.error === 'invite_not_found' ? 'الدعوة غير موجودة' :
        r.error === 'invite_expired' ? 'انتهت صلاحية الدعوة' :
        r.error === 'invite_already_used' ? 'تم استخدام الدعوة من قبل' :
        r.error === 'cannot_accept_own_invite' ? 'لا يمكنك قبول دعوتك بنفسك' :
        r.error === 'no_room_available' ? 'لا توجد غرفة نشطة الآن' :
        'تعذّر قبول الدعوة';
      setError(msg);
      // If already used and we have match_id, navigate there
      if (r.error === 'invite_already_used' && (r as any).match_id) {
        toast.info('الدعوة مستخدمة — الذهاب للمباراة');
        navigate(`/battle-quiz/1v1/${(r as any).match_id}/play`);
      }
      return;
    }
    if (r.match_id) {
      navigate(`/battle-quiz/1v1/${r.match_id}/play`);
    }
  };

  if (!user) return null;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-lg mx-auto space-y-4" dir="rtl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/battle-quiz/1v1')} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </Button>

        <Card className="p-8 text-center bg-gradient-to-br from-fuchsia-500/10 to-purple-700/10 border-fuchsia-500/30">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-fuchsia-600 to-purple-700 flex items-center justify-center text-white mb-4 shadow-lg">
            <Swords className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">تحديت إلى مواجهة 1 ضد 1!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            صديقك يدعوك لمواجهة سريعة. اقبل الآن لبدء المعركة.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            size="lg"
            onClick={accept}
            disabled={accepting || !!error}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:from-fuchsia-700 hover:to-purple-800 gap-2"
          >
            {accepting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Swords className="w-5 h-5" />}
            اقبل التحدي وابدأ
          </Button>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default BattleQuiz1v1Invite;
