import React from 'react';
import type { CVData, CVLanguage, CVTemplate } from '../types';
import { tr } from '../i18n';
import {
  Mail, Phone, MapPin, Linkedin, Globe, GraduationCap, Briefcase, FolderGit2,
  Sparkles, Award, Heart, User, Languages, Code2, Lightbulb, Star, Calendar,
  Building2, BookOpen, Trophy, Target, Zap, CircleDot, ChevronRight, Quote,
} from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang: CVLanguage;
}

const fmtDate = (d: string, lang: CVLanguage) => {
  if (!d) return '';
  if (d.toLowerCase() === 'present' || d === 'حتى الآن') return tr(lang, 'present');
  return d;
};

const placeholderName = (lang: CVLanguage) => lang === 'ar' ? 'الاسم الكامل' : 'Your Full Name';
const placeholderTitle = (lang: CVLanguage) => lang === 'ar' ? 'المسمى الوظيفي' : 'Professional Title';

/* ════════════════════════════════════════════════════════════════
   TEMPLATE 1 — MINIMAL (Swiss-style, ultra clean, monochrome)
   ════════════════════════════════════════════════════════════════ */
const MinimalTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const ink = '#0a0a0a';
  const muted = '#525252';
  const line = '#e5e5e5';

  const SecHead = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 10px' }}>
      <div style={{ width: 24, height: 1, background: ink }} />
      <h2 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: ink, margin: 0 }}>
        {children}
      </h2>
    </div>
  );

  return (
    <div style={{ padding: '48px 52px', color: ink, fontSize: '10.5px', lineHeight: 1.65, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
      {/* Header */}
      <header style={{ marginBottom: 28, paddingBottom: 22, borderBottom: `1px solid ${line}` }}>
        <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '4px', color: muted, marginBottom: 8, textTransform: 'uppercase' }}>
          {lang === 'ar' ? '— سيرة ذاتية —' : '— Curriculum Vitae —'}
        </div>
        <h1 style={{ fontSize: '34px', fontWeight: 300, margin: 0, letterSpacing: '-1px', lineHeight: 1.1 }}>
          {personal.fullName || placeholderName(lang)}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '13px', color: muted, marginTop: 8, fontWeight: 400, letterSpacing: '0.5px' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 16, fontSize: '9.5px', color: muted, letterSpacing: '0.3px' }}>
          {personal.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Mail size={10} strokeWidth={1.5} />{personal.email}</span>}
          {personal.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Phone size={10} strokeWidth={1.5} />{personal.phone}</span>}
          {(personal.city || personal.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MapPin size={10} strokeWidth={1.5} />{[personal.city, personal.country].filter(Boolean).join(' · ')}</span>}
          {personal.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Linkedin size={10} strokeWidth={1.5} />{personal.linkedin}</span>}
          {personal.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Globe size={10} strokeWidth={1.5} />{personal.website}</span>}
        </div>
      </header>

      {personal.summary && (
        <>
          <SecHead>{tr(lang, 'profile')}</SecHead>
          <p style={{ margin: 0, fontSize: '11px', color: '#1f1f1f', lineHeight: 1.75, fontWeight: 300 }}>{personal.summary}</p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SecHead>{tr(lang, 'experience')}</SecHead>
          {experience.map(x => (
            <div key={x.id} style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16 }}>
              <div style={{ fontSize: '9px', color: muted, paddingTop: 2, letterSpacing: '0.5px' }}>
                {fmtDate(x.startDate, lang)}<br/>—<br/>{fmtDate(x.endDate, lang)}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{x.role}</div>
                <div style={{ fontSize: '10.5px', color: muted, marginBottom: 4 }}>{x.company}</div>
                {x.description && <div style={{ fontSize: '10.5px', color: '#262626', lineHeight: 1.7 }}>{x.description}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SecHead>{tr(lang, 'education')}</SecHead>
          {education.map(e => (
            <div key={e.id} style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16 }}>
              <div style={{ fontSize: '9px', color: muted, paddingTop: 2, letterSpacing: '0.5px' }}>
                {fmtDate(e.startDate, lang)}<br/>—<br/>{fmtDate(e.endDate, lang)}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{e.degree} · {e.field}</div>
                <div style={{ fontSize: '10.5px', color: muted }}>{e.institution}{e.gpa ? ` · ${tr(lang, 'gpa')} ${e.gpa}` : ''}</div>
                {e.description && <div style={{ fontSize: '10.5px', color: '#262626', marginTop: 3 }}>{e.description}</div>}
              </div>
            </div>
          ))}
        </>
      )}

      {projects.length > 0 && (
        <>
          <SecHead>{tr(lang, 'projects')}</SecHead>
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 600 }}>{p.name}</div>
                {p.date && <div style={{ fontSize: '9px', color: muted }}>{p.date}</div>}
              </div>
              {p.description && <div style={{ fontSize: '10.5px', color: '#262626', marginTop: 2 }}>{p.description}</div>}
            </div>
          ))}
        </>
      )}

      {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
        <>
          <SecHead>{tr(lang, 'skills')}</SecHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
            {skills.technical.length > 0 && <div><div style={{ fontSize: '9px', color: muted, letterSpacing: '1.5px', marginBottom: 6, textTransform: 'uppercase' }}>{tr(lang, 'technicalSkills')}</div><div style={{ fontSize: '10.5px', lineHeight: 1.9 }}>{skills.technical.join(' · ')}</div></div>}
            {skills.soft.length > 0 && <div><div style={{ fontSize: '9px', color: muted, letterSpacing: '1.5px', marginBottom: 6, textTransform: 'uppercase' }}>{tr(lang, 'softSkills')}</div><div style={{ fontSize: '10.5px', lineHeight: 1.9 }}>{skills.soft.join(' · ')}</div></div>}
            {skills.languages.length > 0 && <div><div style={{ fontSize: '9px', color: muted, letterSpacing: '1.5px', marginBottom: 6, textTransform: 'uppercase' }}>{tr(lang, 'languages')}</div><div style={{ fontSize: '10.5px', lineHeight: 1.9 }}>{skills.languages.join(' · ')}</div></div>}
          </div>
        </>
      )}

      {courses.length > 0 && (
        <>
          <SecHead>{tr(lang, 'courses')}</SecHead>
          {courses.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '10.5px' }}>
              <span><strong style={{ fontWeight: 600 }}>{c.name}</strong> <span style={{ color: muted }}>· {c.issuer}</span></span>
              {c.date && <span style={{ color: muted, fontSize: '9px' }}>{c.date}</span>}
            </div>
          ))}
        </>
      )}

      {activities.length > 0 && (
        <>
          <SecHead>{tr(lang, 'activities')}</SecHead>
          {activities.map(a => (
            <div key={a.id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: '11px', fontWeight: 600 }}>{a.name}</div>
              {a.description && <div style={{ fontSize: '10.5px', color: '#262626' }}>{a.description}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   TEMPLATE 2 — MODERN (sidebar with avatar circle, teal accent)
   ════════════════════════════════════════════════════════════════ */
const ModernTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const accent = '#0d9488';
  const sideBg = 'linear-gradient(180deg, #134e4a 0%, #0f766e 100%)';
  const initials = (personal.fullName || 'YN').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  const SidebarSec = ({ icon: Icon, title, children }: any) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <Icon size={13} strokeWidth={2} color="#5eead4" />
        <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#f0fdfa', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const MainSec = ({ icon: Icon, title, children }: any) => (
    <section style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} strokeWidth={2} color={accent} />
        </div>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#134e4a', margin: 0, letterSpacing: '0.3px' }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: `${accent}25` }} />
      </div>
      <div style={{ paddingInlineStart: 38 }}>{children}</div>
    </section>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: lang === 'ar' ? '1fr 240px' : '240px 1fr', flex: 1, minHeight: '297mm' }}>
      <aside style={{ background: sideBg, padding: '32px 22px', color: 'white', gridColumn: lang === 'ar' ? 2 : 1 }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 86, height: 86, borderRadius: '50%', background: 'linear-gradient(135deg,#5eead4,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '28px', fontWeight: 700, color: '#134e4a', border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {initials}
          </div>
          <h1 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'white', lineHeight: 1.2 }}>{personal.fullName || placeholderName(lang)}</h1>
          {personal.jobTitle && <div style={{ fontSize: '10.5px', marginTop: 4, color: '#99f6e4' }}>{personal.jobTitle}</div>}
        </div>

        <SidebarSec icon={User} title={tr(lang, 'contact')}>
          <div style={{ fontSize: '9.5px', display: 'flex', flexDirection: 'column', gap: 7, color: '#ccfbf1' }}>
            {personal.email && <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}><Mail size={11} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ wordBreak: 'break-all' }}>{personal.email}</span></div>}
            {personal.phone && <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}><Phone size={11} />{personal.phone}</div>}
            {(personal.city || personal.country) && <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}><MapPin size={11} />{[personal.city, personal.country].filter(Boolean).join(', ')}</div>}
            {personal.linkedin && <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}><Linkedin size={11} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ wordBreak: 'break-all' }}>{personal.linkedin}</span></div>}
            {personal.website && <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}><Globe size={11} style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ wordBreak: 'break-all' }}>{personal.website}</span></div>}
          </div>
        </SidebarSec>

        {skills.technical.length > 0 && (
          <SidebarSec icon={Code2} title={tr(lang, 'technicalSkills')}>
            {skills.technical.map((s, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: '9.5px', color: 'white', marginBottom: 3 }}>{s}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${75 + ((i * 7) % 25)}%`, background: 'linear-gradient(90deg,#5eead4,#2dd4bf)' }} />
                </div>
              </div>
            ))}
          </SidebarSec>
        )}

        {skills.soft.length > 0 && (
          <SidebarSec icon={Heart} title={tr(lang, 'softSkills')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {skills.soft.map((s, i) => (
                <span key={i} style={{ fontSize: '9px', padding: '3px 8px', background: 'rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>{s}</span>
              ))}
            </div>
          </SidebarSec>
        )}

        {skills.languages.length > 0 && (
          <SidebarSec icon={Languages} title={tr(lang, 'languages')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {skills.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: 'white' }}>
                  <span>{l}</span>
                  <span style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, k) => <CircleDot key={k} size={6} fill={k < 4 ? '#5eead4' : 'transparent'} color="#5eead4" />)}
                  </span>
                </div>
              ))}
            </div>
          </SidebarSec>
        )}
      </aside>

      <main style={{ padding: '32px 28px', color: '#0f172a', fontSize: '10.5px', lineHeight: 1.6, gridColumn: lang === 'ar' ? 1 : 2 }}>
        {personal.summary && (
          <MainSec icon={Sparkles} title={tr(lang, 'profile')}>
            <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
          </MainSec>
        )}

        {experience.length > 0 && (
          <MainSec icon={Briefcase} title={tr(lang, 'experience')}>
            <div style={{ position: 'relative', paddingInlineStart: 14 }}>
              <div style={{ position: 'absolute', insetInlineStart: 4, top: 6, bottom: 6, width: 1.5, background: `${accent}30` }} />
              {experience.map(x => (
                <div key={x.id} style={{ position: 'relative', marginBottom: 12 }}>
                  <div style={{ position: 'absolute', insetInlineStart: -14, top: 4, width: 9, height: 9, borderRadius: '50%', background: accent, border: '2px solid white', boxShadow: `0 0 0 2px ${accent}40` }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>{x.role}</div>
                    <div style={{ fontSize: '9.5px', color: accent, fontWeight: 600, background: `${accent}10`, padding: '2px 8px', borderRadius: 10 }}>{fmtDate(x.startDate, lang)} — {fmtDate(x.endDate, lang)}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#475569', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}><Building2 size={10} />{x.company}</div>
                  {x.description && <div style={{ fontSize: '10.5px', color: '#334155', marginTop: 4 }}>{x.description}</div>}
                </div>
              ))}
            </div>
          </MainSec>
        )}

        {education.length > 0 && (
          <MainSec icon={GraduationCap} title={tr(lang, 'education')}>
            {education.map(e => (
              <div key={e.id} style={{ marginBottom: 10, padding: 10, background: '#f0fdfa', borderRadius: 6, borderInlineStart: `3px solid ${accent}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700 }}>{e.degree} — {e.field}</div>
                  <div style={{ fontSize: '9.5px', color: '#0f766e' }}>{fmtDate(e.startDate, lang)} - {fmtDate(e.endDate, lang)}</div>
                </div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: 2 }}>{e.institution}{e.gpa ? ` · ${tr(lang, 'gpa')}: ${e.gpa}` : ''}</div>
                {e.description && <div style={{ fontSize: '10.5px', color: '#334155', marginTop: 3 }}>{e.description}</div>}
              </div>
            ))}
          </MainSec>
        )}

        {projects.length > 0 && (
          <MainSec icon={FolderGit2} title={tr(lang, 'projects')}>
            {projects.map(p => (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700 }}>{p.name}</div>
                  {p.date && <div style={{ fontSize: '9px', color: '#64748b' }}>{p.date}</div>}
                </div>
                {p.description && <div style={{ fontSize: '10.5px', color: '#475569' }}>{p.description}</div>}
              </div>
            ))}
          </MainSec>
        )}

        {courses.length > 0 && (
          <MainSec icon={Award} title={tr(lang, 'courses')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {courses.map(c => (
                <div key={c.id} style={{ fontSize: '10px', padding: 6, background: '#f8fafc', borderRadius: 4 }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                  <div style={{ color: '#64748b', fontSize: '9px' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
                </div>
              ))}
            </div>
          </MainSec>
        )}

        {activities.length > 0 && (
          <MainSec icon={Heart} title={tr(lang, 'activities')}>
            {activities.map(a => (
              <div key={a.id} style={{ marginBottom: 5, fontSize: '10.5px' }}>
                <ChevronRight size={10} style={{ display: 'inline', verticalAlign: 'middle', color: accent }} />
                <strong style={{ marginInlineStart: 4 }}>{a.name}</strong>
                {a.description && <span style={{ color: '#475569' }}> — {a.description}</span>}
              </div>
            ))}
          </MainSec>
        )}
      </main>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   TEMPLATE 3 — ELEGANT (luxury serif feel, gold/burgundy, centered)
   ════════════════════════════════════════════════════════════════ */
const ElegantTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const accent = '#7c2d12';
  const gold = '#a16207';
  const cream = '#fffbeb';

  const Sec = ({ icon: Icon, title, children }: any) => (
    <section style={{ marginBottom: 22 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 1, background: gold }} />
          <Icon size={14} color={accent} strokeWidth={1.8} />
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: accent, margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>{title}</h2>
          <Icon size={14} color={accent} strokeWidth={1.8} />
          <div style={{ width: 30, height: 1, background: gold }} />
        </div>
      </div>
      {children}
    </section>
  );

  return (
    <div style={{ padding: '44px 50px', color: '#1c1917', fontSize: '11px', lineHeight: 1.7, background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 120px)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
      {/* Ornamental Header */}
      <header style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 22, position: 'relative' }}>
        <div style={{ fontSize: '10px', color: gold, letterSpacing: '6px', marginBottom: 8 }}>✦ ✦ ✦</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: accent, letterSpacing: '2px', fontFamily: 'Georgia, serif' }}>
          {personal.fullName || placeholderName(lang)}
        </h1>
        {personal.jobTitle && (
          <div style={{ fontSize: '13px', color: '#78350f', marginTop: 8, fontStyle: 'italic', letterSpacing: '1px' }}>
            ~ {personal.jobTitle} ~
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 14, fontSize: '10px', color: '#57534e' }}>
          {personal.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={10} color={gold} />{personal.email}</span>}
          {personal.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} color={gold} />{personal.phone}</span>}
          {(personal.city || personal.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={10} color={gold} />{[personal.city, personal.country].filter(Boolean).join(', ')}</span>}
          {personal.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={10} color={gold} />{personal.linkedin}</span>}
        </div>
        <div style={{ marginTop: 14, fontSize: '10px', color: gold, letterSpacing: '6px' }}>✦ ✦ ✦</div>
      </header>

      {personal.summary && (
        <Sec icon={Quote} title={tr(lang, 'profile')}>
          <p style={{ margin: 0, fontStyle: 'italic', textAlign: 'center', color: '#44403c', fontSize: '11.5px', maxWidth: '90%', marginInline: 'auto', lineHeight: 1.8 }}>
            "{personal.summary}"
          </p>
        </Sec>
      )}

      {education.length > 0 && (
        <Sec icon={GraduationCap} title={tr(lang, 'education')}>
          {education.map(e => (
            <div key={e.id} style={{ marginBottom: 12, padding: '10px 14px', background: cream, borderInlineStart: `3px double ${gold}`, borderInlineEnd: `3px double ${gold}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: accent }}>{e.degree} — {e.field}</div>
                <div style={{ fontSize: '10px', color: gold, fontStyle: 'italic' }}>{fmtDate(e.startDate, lang)} - {fmtDate(e.endDate, lang)}</div>
              </div>
              <div style={{ fontSize: '10.5px', color: '#57534e', marginTop: 2 }}>{e.institution}{e.gpa ? ` · ${tr(lang, 'gpa')}: ${e.gpa}` : ''}</div>
              {e.description && <div style={{ fontSize: '10.5px', color: '#44403c', marginTop: 4 }}>{e.description}</div>}
            </div>
          ))}
        </Sec>
      )}

      {experience.length > 0 && (
        <Sec icon={Briefcase} title={tr(lang, 'experience')}>
          {experience.map(x => (
            <div key={x.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: accent }}>{x.role}</div>
                <div style={{ fontSize: '10px', color: gold, fontStyle: 'italic' }}>{fmtDate(x.startDate, lang)} - {fmtDate(x.endDate, lang)}</div>
              </div>
              <div style={{ fontSize: '10.5px', color: '#78350f', fontWeight: 500 }}>{x.company}</div>
              {x.description && <div style={{ fontSize: '10.5px', color: '#44403c', marginTop: 4, lineHeight: 1.7 }}>{x.description}</div>}
            </div>
          ))}
        </Sec>
      )}

      {projects.length > 0 && (
        <Sec icon={BookOpen} title={tr(lang, 'projects')}>
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: 9 }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: accent }}>❖ {p.name}{p.date && <span style={{ color: gold, fontSize: '9.5px', fontStyle: 'italic', fontWeight: 400 }}> · {p.date}</span>}</div>
              {p.description && <div style={{ fontSize: '10.5px', color: '#44403c', marginTop: 2 }}>{p.description}</div>}
            </div>
          ))}
        </Sec>
      )}

      {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
        <Sec icon={Star} title={tr(lang, 'skills')}>
          <div style={{ textAlign: 'center', fontSize: '10.5px', color: '#44403c', lineHeight: 2 }}>
            {skills.technical.length > 0 && <div><strong style={{ color: accent }}>{tr(lang, 'technicalSkills')}:</strong> <em>{skills.technical.join(' ❖ ')}</em></div>}
            {skills.soft.length > 0 && <div><strong style={{ color: accent }}>{tr(lang, 'softSkills')}:</strong> <em>{skills.soft.join(' ❖ ')}</em></div>}
            {skills.languages.length > 0 && <div><strong style={{ color: accent }}>{tr(lang, 'languages')}:</strong> <em>{skills.languages.join(' ❖ ')}</em></div>}
          </div>
        </Sec>
      )}

      {courses.length > 0 && (
        <Sec icon={Award} title={tr(lang, 'courses')}>
          {courses.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: 4 }}>
              <span><strong style={{ color: accent }}>◆ {c.name}</strong> <span style={{ color: '#78350f', fontStyle: 'italic' }}>· {c.issuer}</span></span>
              {c.date && <span style={{ color: gold, fontSize: '9.5px' }}>{c.date}</span>}
            </div>
          ))}
        </Sec>
      )}

      {activities.length > 0 && (
        <Sec icon={Heart} title={tr(lang, 'activities')}>
          {activities.map(a => (
            <div key={a.id} style={{ fontSize: '10.5px', marginBottom: 4, textAlign: 'center' }}>
              <strong style={{ color: accent }}>✦ {a.name}</strong>
              {a.description && <span style={{ color: '#44403c' }}> — {a.description}</span>}
            </div>
          ))}
        </Sec>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   TEMPLATE 4 — CLEAN (corporate blue, structured timeline)
   ════════════════════════════════════════════════════════════════ */
const CleanTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const accent = '#1e40af';
  const accent2 = '#3b82f6';

  const Sec = ({ icon: Icon, title, children }: any) => (
    <section style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: `linear-gradient(135deg, ${accent}, ${accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 6px ${accent}40` }}>
          <Icon size={15} color="white" strokeWidth={2.2} />
        </div>
        <h2 style={{ fontSize: '13.5px', fontWeight: 800, color: accent, margin: 0, letterSpacing: '0.3px' }}>{title}</h2>
        <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${accent}30, transparent)`, borderRadius: 1 }} />
      </div>
      <div style={{ paddingInlineStart: 4 }}>{children}</div>
    </section>
  );

  return (
    <div style={{ padding: 0, color: '#0f172a', fontSize: '11px', lineHeight: 1.6, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
      {/* Strong colored header */}
      <header style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`, color: 'white', padding: '32px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, insetInlineEnd: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, insetInlineEnd: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{personal.fullName || placeholderName(lang)}</h1>
          {personal.jobTitle && <div style={{ fontSize: '14px', marginTop: 4, opacity: 0.95, fontWeight: 500 }}>{personal.jobTitle}</div>}
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 16, fontSize: '10.5px', opacity: 0.95 }}>
            {personal.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Mail size={12} />{personal.email}</span>}
            {personal.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Phone size={12} />{personal.phone}</span>}
            {(personal.city || personal.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={12} />{[personal.city, personal.country].filter(Boolean).join(', ')}</span>}
            {personal.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Linkedin size={12} />{personal.linkedin}</span>}
            {personal.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Globe size={12} />{personal.website}</span>}
          </div>
        </div>
      </header>

      <div style={{ padding: '26px 36px', flex: 1 }}>
        {personal.summary && (
          <Sec icon={Target} title={tr(lang, 'profile')}>
            <p style={{ margin: 0, color: '#334155', padding: 12, background: '#eff6ff', borderRadius: 6, borderInlineStart: `3px solid ${accent}` }}>{personal.summary}</p>
          </Sec>
        )}

        {experience.length > 0 && (
          <Sec icon={Briefcase} title={tr(lang, 'experience')}>
            {experience.map(x => (
              <div key={x.id} style={{ marginBottom: 12, padding: '10px 14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 6, borderInlineStart: `4px solid ${accent}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>{x.role}</div>
                    <div style={{ fontSize: '10.5px', color: accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}><Building2 size={11} />{x.company}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: 'white', background: accent, padding: '3px 9px', borderRadius: 12, fontWeight: 600, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={10} />{fmtDate(x.startDate, lang)} - {fmtDate(x.endDate, lang)}</div>
                </div>
                {x.description && <div style={{ fontSize: '10.5px', color: '#475569', marginTop: 6 }}>{x.description}</div>}
              </div>
            ))}
          </Sec>
        )}

        {education.length > 0 && (
          <Sec icon={GraduationCap} title={tr(lang, 'education')}>
            {education.map(e => (
              <div key={e.id} style={{ marginBottom: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700 }}>{e.degree} — {e.field}</div>
                  <div style={{ fontSize: '10px', color: accent, fontWeight: 600 }}>{fmtDate(e.startDate, lang)} - {fmtDate(e.endDate, lang)}</div>
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: 2 }}>{e.institution}{e.gpa ? ` · ${tr(lang, 'gpa')}: ${e.gpa}` : ''}</div>
                {e.description && <div style={{ fontSize: '10.5px', color: '#475569', marginTop: 3 }}>{e.description}</div>}
              </div>
            ))}
          </Sec>
        )}

        {projects.length > 0 && (
          <Sec icon={FolderGit2} title={tr(lang, 'projects')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {projects.map(p => (
                <div key={p.id} style={{ padding: 10, background: '#eff6ff', borderRadius: 6, border: `1px solid ${accent}30` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: accent }}>{p.name}</div>
                    {p.date && <div style={{ fontSize: '9px', color: '#64748b' }}>{p.date}</div>}
                  </div>
                  {p.description && <div style={{ fontSize: '10px', color: '#475569', marginTop: 3 }}>{p.description}</div>}
                </div>
              ))}
            </div>
          </Sec>
        )}

        {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
          <Sec icon={Zap} title={tr(lang, 'skills')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {skills.technical.length > 0 && (
                <div style={{ padding: 10, background: '#eff6ff', borderRadius: 6 }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Code2 size={11} />{tr(lang, 'technicalSkills')}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {skills.technical.map((s, i) => <span key={i} style={{ fontSize: '9.5px', padding: '3px 8px', background: 'white', color: accent, borderRadius: 10, border: `1px solid ${accent}30`, fontWeight: 500 }}>{s}</span>)}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div style={{ padding: 10, background: '#f0fdf4', borderRadius: 6 }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803d', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={11} />{tr(lang, 'softSkills')}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {skills.soft.map((s, i) => <span key={i} style={{ fontSize: '9.5px', padding: '3px 8px', background: 'white', color: '#15803d', borderRadius: 10, border: '1px solid #15803d30', fontWeight: 500 }}>{s}</span>)}
                  </div>
                </div>
              )}
              {skills.languages.length > 0 && (
                <div style={{ padding: 10, background: '#fef3c7', borderRadius: 6 }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#a16207', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Languages size={11} />{tr(lang, 'languages')}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {skills.languages.map((s, i) => <span key={i} style={{ fontSize: '9.5px', padding: '3px 8px', background: 'white', color: '#a16207', borderRadius: 10, border: '1px solid #a1620730', fontWeight: 500 }}>{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </Sec>
        )}

        {courses.length > 0 && (
          <Sec icon={Award} title={tr(lang, 'courses')}>
            {courses.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', padding: '6px 10px', borderRadius: 4, marginBottom: 3, background: '#f8fafc' }}>
                <span><Trophy size={10} style={{ display: 'inline', color: accent, verticalAlign: 'middle' }} /> <strong>{c.name}</strong> <span style={{ color: '#64748b' }}>· {c.issuer}</span></span>
                {c.date && <span style={{ color: '#64748b', fontSize: '9.5px' }}>{c.date}</span>}
              </div>
            ))}
          </Sec>
        )}

        {activities.length > 0 && (
          <Sec icon={Heart} title={tr(lang, 'activities')}>
            {activities.map(a => (
              <div key={a.id} style={{ fontSize: '10.5px', marginBottom: 4, paddingInlineStart: 14, position: 'relative' }}>
                <span style={{ position: 'absolute', insetInlineStart: 0, top: 5, width: 6, height: 6, borderRadius: '50%', background: accent }} />
                <strong>{a.name}</strong>{a.description && <span style={{ color: '#475569' }}> — {a.description}</span>}
              </div>
            ))}
          </Sec>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   TEMPLATE 5 — COMPACT (two columns, dense, sky theme, infographic)
   ════════════════════════════════════════════════════════════════ */
const CompactTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const accent = '#0369a1';
  const accent2 = '#0ea5e9';
  const { personal, education, experience, projects, skills, courses, activities } = data;

  const Sec = ({ icon: Icon, title, color = accent, children }: any) => (
    <section style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, paddingBottom: 4, borderBottom: `1.5px solid ${color}` }}>
        <Icon size={12} color={color} strokeWidth={2.2} />
        <h2 style={{ fontSize: '11px', fontWeight: 800, color, margin: 0, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{title}</h2>
      </div>
      {children}
    </section>
  );

  return (
    <div style={{ padding: '26px 32px', color: '#0c4a6e', fontSize: '10px', lineHeight: 1.55, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
      {/* Compact two-row header */}
      <header style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'flex-start', paddingBottom: 12, borderBottom: `2px solid ${accent}` }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: accent, letterSpacing: '-0.3px', lineHeight: 1.1 }}>{personal.fullName || placeholderName(lang)}</h1>
          {personal.jobTitle && (
            <div style={{ fontSize: '12px', color: accent2, fontWeight: 600, marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={11} /> {personal.jobTitle}
            </div>
          )}
          {personal.summary && <div style={{ fontSize: '10px', color: '#475569', marginTop: 6, lineHeight: 1.6 }}>{personal.summary}</div>}
        </div>
        <div style={{ fontSize: '9px', color: '#475569', display: 'flex', flexDirection: 'column', gap: 3, textAlign: lang === 'ar' ? 'left' : 'right' }}>
          {personal.email && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}><Mail size={10} color={accent} />{personal.email}</div>}
          {personal.phone && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}><Phone size={10} color={accent} />{personal.phone}</div>}
          {(personal.city || personal.country) && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}><MapPin size={10} color={accent} />{[personal.city, personal.country].filter(Boolean).join(', ')}</div>}
          {personal.linkedin && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}><Linkedin size={10} color={accent} />{personal.linkedin}</div>}
          {personal.website && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}><Globe size={10} color={accent} />{personal.website}</div>}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, flex: 1 }}>
        <div>
          {experience.length > 0 && (
            <Sec icon={Briefcase} title={tr(lang, 'experience')}>
              {experience.map(x => (
                <div key={x.id} style={{ marginBottom: 8, paddingInlineStart: 10, borderInlineStart: `2px solid ${accent2}40`, position: 'relative' }}>
                  <div style={{ position: 'absolute', insetInlineStart: -4, top: 3, width: 6, height: 6, borderRadius: '50%', background: accent }} />
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#0c4a6e' }}>{x.role}</div>
                  <div style={{ fontSize: '9.5px', color: accent2, fontWeight: 500 }}>{x.company} · <span style={{ color: '#64748b' }}>{fmtDate(x.startDate, lang)}-{fmtDate(x.endDate, lang)}</span></div>
                  {x.description && <div style={{ fontSize: '10px', color: '#334155', marginTop: 2 }}>{x.description}</div>}
                </div>
              ))}
            </Sec>
          )}

          {education.length > 0 && (
            <Sec icon={GraduationCap} title={tr(lang, 'education')}>
              {education.map(e => (
                <div key={e.id} style={{ marginBottom: 7 }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 700 }}>{e.degree}</div>
                  <div style={{ fontSize: '9.5px', color: accent }}>{e.institution} · {e.field}{e.gpa ? ` · ${tr(lang, 'gpa')}: ${e.gpa}` : ''}</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>{fmtDate(e.startDate, lang)} - {fmtDate(e.endDate, lang)}</div>
                </div>
              ))}
            </Sec>
          )}

          {projects.length > 0 && (
            <Sec icon={FolderGit2} title={tr(lang, 'projects')}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: accent }}>▸ {p.name}{p.date && <span style={{ color: '#64748b', fontWeight: 400, fontSize: '9px' }}> · {p.date}</span>}</div>
                  {p.description && <div style={{ fontSize: '10px', color: '#334155' }}>{p.description}</div>}
                </div>
              ))}
            </Sec>
          )}
        </div>

        <div>
          {skills.technical.length > 0 && (
            <Sec icon={Code2} title={tr(lang, 'technicalSkills')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.technical.map((s, i) => (
                  <span key={i} style={{ fontSize: '9.5px', padding: '3px 8px', background: `linear-gradient(135deg, ${accent}, ${accent2})`, color: 'white', borderRadius: 4, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </Sec>
          )}

          {skills.soft.length > 0 && (
            <Sec icon={Heart} title={tr(lang, 'softSkills')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.soft.map((s, i) => (
                  <span key={i} style={{ fontSize: '9.5px', padding: '3px 8px', background: '#e0f2fe', color: accent, borderRadius: 4, fontWeight: 500, border: `1px solid ${accent}30` }}>{s}</span>
                ))}
              </div>
            </Sec>
          )}

          {skills.languages.length > 0 && (
            <Sec icon={Languages} title={tr(lang, 'languages')}>
              {skills.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', marginBottom: 4, alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{l}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, k) => <div key={k} style={{ width: 14, height: 4, borderRadius: 1, background: k < 4 ? accent : '#cbd5e1' }} />)}
                  </div>
                </div>
              ))}
            </Sec>
          )}

          {courses.length > 0 && (
            <Sec icon={Award} title={tr(lang, 'courses')}>
              {courses.map(c => (
                <div key={c.id} style={{ marginBottom: 4, fontSize: '9.5px' }}>
                  <Trophy size={9} style={{ display: 'inline', color: accent2, verticalAlign: 'middle' }} /> <strong>{c.name}</strong>
                  <div style={{ color: '#64748b', paddingInlineStart: 12 }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                </div>
              ))}
            </Sec>
          )}

          {activities.length > 0 && (
            <Sec icon={Lightbulb} title={tr(lang, 'activities')}>
              {activities.map(a => (
                <div key={a.id} style={{ marginBottom: 4, fontSize: '9.5px' }}>
                  <strong style={{ color: accent }}>◆ {a.name}</strong>
                  {a.description && <div style={{ color: '#475569' }}>{a.description}</div>}
                </div>
              ))}
            </Sec>
          )}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   TEMPLATE 6 — CREATIVE (bold gradient, magazine-style, vibrant)
   ════════════════════════════════════════════════════════════════ */
const CreativeTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const accent = '#7c3aed';
  const accent2 = '#ec4899';
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const initials = (personal.fullName || 'YN').split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();

  const Sec = ({ icon: Icon, title, children }: any) => (
    <section style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${accent}, ${accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${accent}40`, transform: 'rotate(-5deg)' }}>
          <Icon size={16} color="white" strokeWidth={2.2} />
        </div>
        <h2 style={{ fontSize: '14px', fontWeight: 800, margin: 0, background: `linear-gradient(135deg, ${accent}, ${accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.3px' }}>{title}</h2>
      </div>
      {children}
    </section>
  );

  return (
    <div style={{ padding: 0, color: '#1e1b4b', fontSize: '11px', lineHeight: 1.6, background: 'white', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '297mm' }}>
      {/* Bold gradient header with avatar */}
      <header style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent2} 100%)`, color: 'white', padding: '32px 36px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', top: -50, insetInlineEnd: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -80, insetInlineStart: 100, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', top: 30, insetInlineStart: 30, width: 60, height: 60, borderRadius: 12, background: 'rgba(255,255,255,0.08)', transform: 'rotate(15deg)' }} />

        <div style={{ position: 'relative', display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 800, color: accent, flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', border: '4px solid rgba(255,255,255,0.3)' }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{personal.fullName || placeholderName(lang)}</h1>
            {personal.jobTitle && (
              <div style={{ fontSize: '13px', marginTop: 5, fontWeight: 600, display: 'inline-block', padding: '3px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
                ✦ {personal.jobTitle}
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12, fontSize: '10px' }}>
              {personal.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Mail size={11} />{personal.email}</span>}
              {personal.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Phone size={11} />{personal.phone}</span>}
              {(personal.city || personal.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><MapPin size={11} />{[personal.city, personal.country].filter(Boolean).join(', ')}</span>}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 4, fontSize: '10px', opacity: 0.95 }}>
              {personal.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Linkedin size={11} />{personal.linkedin}</span>}
              {personal.website && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Globe size={11} />{personal.website}</span>}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: lang === 'ar' ? '1fr 220px' : '220px 1fr', gap: 0, flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ padding: '24px 22px', background: 'linear-gradient(180deg, #faf5ff 0%, #fdf2f8 100%)', gridColumn: lang === 'ar' ? 2 : 1 }}>
          {personal.summary && (
            <div style={{ marginBottom: 18, padding: 12, background: 'white', borderRadius: 10, boxShadow: '0 2px 8px rgba(124,58,237,0.08)', borderInlineStart: `3px solid ${accent}` }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Sparkles size={11} /> {tr(lang, 'profile')}
              </div>
              <p style={{ margin: 0, fontSize: '10px', color: '#4c1d95', lineHeight: 1.6 }}>{personal.summary}</p>
            </div>
          )}

          {skills.technical.length > 0 && (
            <Sec icon={Code2} title={tr(lang, 'technicalSkills')}>
              {skills.technical.map((s, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 600, color: '#4c1d95', marginBottom: 3 }}>
                    <span>{s}</span><span style={{ color: accent2 }}>{75 + ((i * 7) % 25)}%</span>
                  </div>
                  <div style={{ height: 5, background: 'white', borderRadius: 3, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)' }}>
                    <div style={{ height: '100%', width: `${75 + ((i * 7) % 25)}%`, background: `linear-gradient(90deg, ${accent}, ${accent2})`, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </Sec>
          )}

          {skills.soft.length > 0 && (
            <Sec icon={Heart} title={tr(lang, 'softSkills')}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.soft.map((s, i) => (
                  <span key={i} style={{ fontSize: '9.5px', padding: '4px 9px', background: 'white', color: accent, borderRadius: 12, border: `1.5px solid ${accent}30`, fontWeight: 600, boxShadow: '0 1px 3px rgba(124,58,237,0.1)' }}>{s}</span>
                ))}
              </div>
            </Sec>
          )}

          {skills.languages.length > 0 && (
            <Sec icon={Languages} title={tr(lang, 'languages')}>
              {skills.languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: 5, padding: '5px 8px', background: 'white', borderRadius: 6, fontWeight: 600, color: '#4c1d95' }}>
                  <span>{l}</span>
                  <span style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, k) => <Star key={k} size={8} fill={k < 4 ? accent2 : 'transparent'} color={accent2} />)}
                  </span>
                </div>
              ))}
            </Sec>
          )}

          {courses.length > 0 && (
            <Sec icon={Award} title={tr(lang, 'courses')}>
              {courses.map(c => (
                <div key={c.id} style={{ marginBottom: 6, fontSize: '9.5px', padding: 7, background: 'white', borderRadius: 6 }}>
                  <div style={{ fontWeight: 700, color: accent, display: 'flex', alignItems: 'center', gap: 4 }}><Trophy size={10} />{c.name}</div>
                  <div style={{ color: '#7c3aed', fontSize: '9px', marginTop: 1 }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
                </div>
              ))}
            </Sec>
          )}
        </aside>

        {/* Main content */}
        <main style={{ padding: '24px 28px', gridColumn: lang === 'ar' ? 1 : 2 }}>
          {experience.length > 0 && (
            <Sec icon={Briefcase} title={tr(lang, 'experience')}>
              {experience.map(x => (
                <div key={x.id} style={{ marginBottom: 12, padding: 12, background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)', borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, insetInlineStart: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${accent}, ${accent2})` }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, paddingInlineStart: 8 }}>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#4c1d95' }}>{x.role}</div>
                      <div style={{ fontSize: '10.5px', color: accent, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><Building2 size={11} />{x.company}</div>
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'white', background: `linear-gradient(135deg, ${accent}, ${accent2})`, padding: '4px 10px', borderRadius: 12, fontWeight: 700, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={10} />{fmtDate(x.startDate, lang)} → {fmtDate(x.endDate, lang)}
                    </div>
                  </div>
                  {x.description && <div style={{ fontSize: '10.5px', color: '#5b21b6', marginTop: 6, paddingInlineStart: 8 }}>{x.description}</div>}
                </div>
              ))}
            </Sec>
          )}

          {education.length > 0 && (
            <Sec icon={GraduationCap} title={tr(lang, 'education')}>
              {education.map(e => (
                <div key={e.id} style={{ marginBottom: 10, padding: 11, border: `2px dashed ${accent}40`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#4c1d95' }}>🎓 {e.degree} — {e.field}</div>
                      <div style={{ fontSize: '10.5px', color: accent2, fontWeight: 600, marginTop: 1 }}>{e.institution}{e.gpa ? ` · ${tr(lang, 'gpa')}: ${e.gpa}` : ''}</div>
                    </div>
                    <div style={{ fontSize: '9.5px', color: accent, fontWeight: 700 }}>{fmtDate(e.startDate, lang)} - {fmtDate(e.endDate, lang)}</div>
                  </div>
                  {e.description && <div style={{ fontSize: '10.5px', color: '#5b21b6', marginTop: 4 }}>{e.description}</div>}
                </div>
              ))}
            </Sec>
          )}

          {projects.length > 0 && (
            <Sec icon={FolderGit2} title={tr(lang, 'projects')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {projects.map(p => (
                  <div key={p.id} style={{ padding: 10, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(124,58,237,0.1)', borderTop: `3px solid ${accent2}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: accent }}>✨ {p.name}</div>
                      {p.date && <div style={{ fontSize: '9px', color: accent2, fontWeight: 600 }}>{p.date}</div>}
                    </div>
                    {p.description && <div style={{ fontSize: '10px', color: '#5b21b6', marginTop: 3 }}>{p.description}</div>}
                  </div>
                ))}
              </div>
            </Sec>
          )}

          {activities.length > 0 && (
            <Sec icon={Heart} title={tr(lang, 'activities')}>
              {activities.map(a => (
                <div key={a.id} style={{ marginBottom: 6, fontSize: '10.5px', padding: '6px 10px', background: '#fdf2f8', borderRadius: 6, borderInlineStart: `3px solid ${accent2}` }}>
                  <strong style={{ color: accent }}>💜 {a.name}</strong>
                  {a.description && <span style={{ color: '#5b21b6' }}> — {a.description}</span>}
                </div>
              ))}
            </Sec>
          )}
        </main>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   REGISTRY & EXPORTS
   ════════════════════════════════════════════════════════════════ */
const REGISTRY: Record<CVTemplate, React.FC<TemplateProps>> = {
  minimal: MinimalTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  clean: CleanTemplate,
  compact: CompactTemplate,
  creative: CreativeTemplate,
};

export type TemplateBadge = 'ats' | 'academic' | 'creative' | 'professional' | 'recommended';

export const TEMPLATES_META: {
  key: CVTemplate;
  nameAr: string; nameEn: string;
  descAr: string; descEn: string;
  accent: string;
  badges: TemplateBadge[];
  bestForAr: string; bestForEn: string;
}[] = [
  { key: 'minimal', nameAr: 'مينيمال سويسري', nameEn: 'Minimal Swiss', descAr: 'تصميم سويسري نقي بمساحات بيضاء راقية', descEn: 'Pure Swiss design, refined whitespace', accent: '#0a0a0a', badges: ['ats', 'professional', 'recommended'], bestForAr: 'الوظائف الرسمية وأنظمة ATS', bestForEn: 'Formal jobs & ATS systems' },
  { key: 'modern', nameAr: 'حديث (شريط جانبي)', nameEn: 'Modern Sidebar', descAr: 'شريط جانبي ملوّن بأشرطة مهارات وصورة بادج', descEn: 'Color sidebar, skill bars & avatar', accent: '#0d9488', badges: ['professional', 'recommended'], bestForAr: 'المتدربين والخريجين الجدد', bestForEn: 'Interns & new graduates' },
  { key: 'elegant', nameAr: 'فاخر كلاسيكي', nameEn: 'Elegant Luxury', descAr: 'تصميم رسمي بنقوش ذهبية للأبحاث الأكاديمية', descEn: 'Gold ornaments, academic prestige', accent: '#7c2d12', badges: ['academic'], bestForAr: 'الباحثين والسير الأكاديمية', bestForEn: 'Researchers & academic CVs' },
  { key: 'clean', nameAr: 'كوربوريت احترافي', nameEn: 'Corporate Pro', descAr: 'هيدر متدرّج وبطاقات منظّمة بأيقونات', descEn: 'Gradient header, iconic cards', accent: '#1e40af', badges: ['professional'], bestForAr: 'الإدارة والاستشارات', bestForEn: 'Management & consulting' },
  { key: 'compact', nameAr: 'مدمج (انفوجرافيك)', nameEn: 'Infographic Compact', descAr: 'عمودين كثيفين مع تقييمات بصرية', descEn: 'Two columns with visual ratings', accent: '#0369a1', badges: ['ats'], bestForAr: 'سيرة من صفحة واحدة بمحتوى كثيف', bestForEn: 'One-page dense content' },
  { key: 'creative', nameAr: 'إبداعي مجاني', nameEn: 'Creative Magazine', descAr: 'تدرّجات جريئة وأشكال هندسية لتميّز كامل', descEn: 'Bold gradients, geometric shapes', accent: '#7c3aed', badges: ['creative'], bestForAr: 'التصميم والمجالات الإبداعية', bestForEn: 'Design & creative fields' },
];

export const BADGE_META: Record<TemplateBadge, { ar: string; en: string; cls: string }> = {
  ats:          { ar: 'متوافق ATS', en: 'ATS-friendly',  cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' },
  academic:     { ar: 'أكاديمي',     en: 'Academic',      cls: 'bg-indigo-500/15 text-indigo-700 border-indigo-500/30' },
  creative:     { ar: 'إبداعي',      en: 'Creative',      cls: 'bg-fuchsia-500/15 text-fuchsia-700 border-fuchsia-500/30' },
  professional: { ar: 'احترافي',     en: 'Professional',  cls: 'bg-blue-500/15 text-blue-700 border-blue-500/30' },
  recommended:  { ar: 'موصى به',     en: 'Recommended',   cls: 'bg-amber-500/15 text-amber-700 border-amber-500/30' },
};

/**
 * CVRenderer wraps a template with:
 *  - explicit `dir` for RTL/LTR
 *  - the correct font stack per language
 *  - data-cv-mode attribute that print CSS can target to neutralize
 *    on-screen-only sizing (min-height: 297mm + flex:1) so PDF flows naturally
 */
export const CVRenderer: React.FC<{
  template: CVTemplate;
  data: CVData;
  lang: CVLanguage;
  /** "screen" (default) keeps full-page sizing; "print" lets content flow for accurate PDF pagination */
  mode?: 'screen' | 'print';
}> = ({ template, data, lang, mode = 'screen' }) => {
  const Comp = REGISTRY[template] || MinimalTemplate;
  const isPrint = mode === 'print';
  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      data-cv-root
      data-cv-mode={mode}
      lang={lang}
      style={{
        fontFamily: lang === 'ar'
          ? "'IBM Plex Sans Arabic', 'Tajawal', 'Cairo', system-ui, sans-serif"
          : "'Inter', 'IBM Plex Sans', system-ui, sans-serif",
        background: 'white',
        width: '100%',
        minHeight: isPrint ? 'auto' : '297mm',
        display: 'flex',
        flexDirection: 'column',
        textAlign: lang === 'ar' ? 'right' : 'left',
      }}
    >
      <div
        style={{
          flex: isPrint ? 'none' : 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isPrint ? 'auto' : '297mm',
        }}
      >
        <Comp data={data} lang={lang} />
      </div>
    </div>
  );
};
