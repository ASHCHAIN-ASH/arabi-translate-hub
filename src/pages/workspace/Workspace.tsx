import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Wand2, FileText, Brain, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WritingPanel from '@/components/workspace/WritingPanel';
import SummarizerPanel from '@/components/workspace/SummarizerPanel';
import StudyPanel from '@/components/workspace/StudyPanel';
import NotesPanel, { Note } from '@/components/workspace/NotesPanel';
import { supabase } from '@/integrations/supabase/client';

export default function Workspace() {
  const [tab, setTab] = useState('write');

  // Shared state — يتيح التدفق Writing → Summarizer → Study → Notes
  const [writeText, setWriteText] = useState('');
  const [writeOutput, setWriteOutput] = useState('');
  const [sumText, setSumText] = useState('');
  const [sumOutput, setSumOutput] = useState('');
  const [studyText, setStudyText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  const saveToNotes = async (content: string, title: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('workspace_notes')
      .insert({ user_id: user.id, title, content })
      .select().single();
    if (data) {
      const n: Note = { id: data.id, title: data.title, content: data.content, updatedAt: Date.now() };
      setNotes([n, ...notes]);
    }
  };

  const sendToSummarizer = (content: string) => {
    setSumText(content);
    setTab('summarize');
  };
  const sendToStudy = (content: string) => {
    setStudyText(content);
    setTab('study');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5" dir="rtl">
      <Header />
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <Wand2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">مساحة العمل الأكاديمية الذكية</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent mb-2">
              Smart Academic Workspace
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              اكتب · لخّص · ادرس · احفظ — كل شيء في مكان واحد بدون تنقّل بين الصفحات
            </p>
          </motion.div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-6 h-12">
              <TabsTrigger value="write" className="gap-2"><Wand2 className="h-4 w-4" /> الكتابة</TabsTrigger>
              <TabsTrigger value="summarize" className="gap-2"><FileText className="h-4 w-4" /> التلخيص</TabsTrigger>
              <TabsTrigger value="study" className="gap-2"><Brain className="h-4 w-4" /> الدراسة</TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <StickyNote className="h-4 w-4" /> ملاحظاتي
                {notes.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5">{notes.length}</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write">
              <WritingPanel
                text={writeText} setText={setWriteText}
                output={writeOutput} setOutput={setWriteOutput}
                onSaveToNotes={saveToNotes}
                onSendToSummarizer={sendToSummarizer}
              />
            </TabsContent>
            <TabsContent value="summarize">
              <SummarizerPanel
                text={sumText} setText={setSumText}
                output={sumOutput} setOutput={setSumOutput}
                onSaveToNotes={saveToNotes}
                onSendToStudy={sendToStudy}
              />
            </TabsContent>
            <TabsContent value="study">
              <StudyPanel text={studyText} setText={setStudyText} />
            </TabsContent>
            <TabsContent value="notes">
              <NotesPanel notes={notes} setNotes={setNotes} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
