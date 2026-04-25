import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Palette } from 'lucide-react';

const SEMANTIC_TOKENS = [
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'border', 'input', 'ring',
];

const BUTTON_VARIANTS = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const;

const ThemePreview: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">معاينة الثيم</h1>
              <p className="text-xs text-muted-foreground">ضبط الهوية البصرية بسهولة</p>
            </div>
          </div>
          <Button onClick={toggle} variant="outline" size="sm" className="gap-2">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? 'فاتح' : 'داكن'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        {/* Tokens */}
        <section>
          <h2 className="mb-4 text-lg font-bold">الألوان الدلالية (Semantic Tokens)</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {SEMANTIC_TOKENS.map((token) => (
              <div key={token} className="overflow-hidden rounded-xl border border-border bg-card">
                <div
                  className="h-20 w-full border-b border-border"
                  style={{ background: `hsl(var(--${token}))` }}
                />
                <div className="p-3">
                  <p className="text-xs font-mono font-semibold">--{token}</p>
                  <p className="text-[10px] text-muted-foreground font-mono break-all">
                    hsl(var(--{token}))
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="mb-4 text-lg font-bold">النصوص (Typography)</h2>
          <Card>
            <CardContent className="space-y-3 p-6">
              <h1 className="text-4xl font-black">عنوان رئيسي H1</h1>
              <h2 className="text-3xl font-bold">عنوان ثانوي H2</h2>
              <h3 className="text-2xl font-semibold">عنوان فرعي H3</h3>
              <h4 className="text-xl font-medium">عنوان صغير H4</h4>
              <p className="text-base">نص أساسي عادي بحجم متوسط لاختبار قابلية القراءة.</p>
              <p className="text-sm text-muted-foreground">نص ثانوي خافت — Muted Foreground</p>
              <p className="text-xs text-muted-foreground">نص صغير للتلميحات والشروحات</p>
              <p className="text-base">
                <a href="#" className="text-primary underline-offset-4 hover:underline">رابط أساسي</a>
                {' • '}
                <span className="text-destructive font-medium">نص تحذيري</span>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="mb-4 text-lg font-bold">الأزرار (Buttons)</h2>
          <Card>
            <CardContent className="space-y-6 p-6">
              {BUTTON_SIZES.map((size) => (
                <div key={size}>
                  <p className="mb-3 text-xs font-mono text-muted-foreground">size: {size}</p>
                  <div className="flex flex-wrap gap-3">
                    {BUTTON_VARIANTS.map((variant) => (
                      <Button key={variant} variant={variant} size={size}>
                        {variant}
                      </Button>
                    ))}
                    <Button variant="default" size={size} disabled>
                      disabled
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="mb-4 text-lg font-bold">البطاقات (Cards)</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>بطاقة افتراضية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  بطاقة بألوان النظام الأساسية تستخدم card و card-foreground.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>بطاقة أساسية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90">Primary background للمحتوى البارز والمميز.</p>
                <Button variant="secondary" size="sm" className="mt-3">إجراء</Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-secondary-foreground">
              <CardHeader>
                <CardTitle>بطاقة ثانوية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90">Secondary background للمحتوى الداعم.</p>
                <Button variant="default" size="sm" className="mt-3">إجراء</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges & Inputs */}
        <section>
          <h2 className="mb-4 text-lg font-bold">الشارات والمدخلات (Badges & Inputs)</h2>
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="مدخل عادي..." />
                <Input placeholder="معطّل..." disabled />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* States */}
        <section>
          <h2 className="mb-4 text-lg font-bold">حالات الخلفيات (Surface States)</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { name: 'background', cls: 'bg-background text-foreground' },
              { name: 'card', cls: 'bg-card text-card-foreground' },
              { name: 'muted', cls: 'bg-muted text-muted-foreground' },
              { name: 'accent', cls: 'bg-accent text-accent-foreground' },
            ].map((s) => (
              <div key={s.name} className={`rounded-xl border border-border p-5 ${s.cls}`}>
                <p className="font-mono text-xs font-bold">{s.name}</p>
                <p className="mt-2 text-sm">عينة نص — Sample text 123</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ThemePreview;
