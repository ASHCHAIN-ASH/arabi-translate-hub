import React from 'react';
import type { CVData, CVLanguage, CVTemplate } from '../types';
import { tr } from '../i18n';
import {
  Mail, Phone, MapPin, Linkedin, Globe,
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

const Section: React.FC<{ title: string; color?: string; children: React.ReactNode }> = ({ title, color = '#1f2937', children }) => (
  <section className="cv-section" style={{ marginBottom: '14px' }}>
    <h2 style={{
      fontSize: '13px', fontWeight: 700, color, marginBottom: '8px',
      paddingBottom: '4px', borderBottom: `1.5px solid ${color}`, letterSpacing: '0.3px',
    }}>{title}</h2>
    {children}
  </section>
);

const Item: React.FC<{ title: string; subtitle?: string; date?: string; description?: string }> = ({ title, subtitle, date, description }) => (
  <div style={{ marginBottom: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#111827' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '10.5px', color: '#4b5563' }}>{subtitle}</div>}
      </div>
      {date && <div style={{ fontSize: '10px', color: '#6b7280', whiteSpace: 'nowrap' }}>{date}</div>}
    </div>
    {description && <div style={{ fontSize: '10.5px', color: '#374151', marginTop: '3px', lineHeight: 1.55 }}>{description}</div>}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#1f2937' }) => (
  <span style={{
    display: 'inline-block', fontSize: '10px', padding: '3px 9px', borderRadius: '4px',
    background: `${color}10`, color, border: `1px solid ${color}30`, margin: '2px',
  }}>{children}</span>
);

// ============ MINIMAL ============
const MinimalTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  return (
    <div style={{ padding: '36px 40px', color: '#111827', fontSize: '11px', lineHeight: 1.55 }}>
      <header style={{ marginBottom: '18px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>{personal.fullName || (lang === 'ar' ? 'الاسم الكامل' : 'Your Name')}</h1>
        {personal.jobTitle && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{personal.jobTitle}</div>}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px', fontSize: '10px', color: '#4b5563' }}>
          {personal.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{personal.email}</span>}
          {personal.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{personal.phone}</span>}
          {(personal.city || personal.country) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{[personal.city, personal.country].filter(Boolean).join(', ')}</span>}
          {personal.linkedin && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Linkedin size={11} />{personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && <Section title={tr(lang, 'profile')}><p style={{ margin: 0, fontSize: '11px', color: '#374151' }}>{personal.summary}</p></Section>}

      {education.length > 0 && (
        <Section title={tr(lang, 'education')}>
          {education.map(e => (
            <Item key={e.id} title={`${e.degree} — ${e.field}`} subtitle={e.institution + (e.gpa ? ` • ${tr(lang, 'gpa')}: ${e.gpa}` : '')}
              date={`${fmtDate(e.startDate, lang)} - ${fmtDate(e.endDate, lang)}`} description={e.description} />
          ))}
        </Section>
      )}

      {experience.length > 0 && (
        <Section title={tr(lang, 'experience')}>
          {experience.map(x => (
            <Item key={x.id} title={x.role} subtitle={x.company} date={`${fmtDate(x.startDate, lang)} - ${fmtDate(x.endDate, lang)}`} description={x.description} />
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title={tr(lang, 'projects')}>
          {projects.map(p => <Item key={p.id} title={p.name} date={p.date} description={p.description} />)}
        </Section>
      )}

      {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
        <Section title={tr(lang, 'skills')}>
          {skills.technical.length > 0 && <div style={{ marginBottom: 4 }}><strong style={{ fontSize: '10.5px' }}>{tr(lang, 'technicalSkills')}: </strong>{skills.technical.map((s, i) => <Chip key={i}>{s}</Chip>)}</div>}
          {skills.soft.length > 0 && <div style={{ marginBottom: 4 }}><strong style={{ fontSize: '10.5px' }}>{tr(lang, 'softSkills')}: </strong>{skills.soft.map((s, i) => <Chip key={i}>{s}</Chip>)}</div>}
          {skills.languages.length > 0 && <div><strong style={{ fontSize: '10.5px' }}>{tr(lang, 'languages')}: </strong>{skills.languages.map((s, i) => <Chip key={i}>{s}</Chip>)}</div>}
        </Section>
      )}

      {courses.length > 0 && <Section title={tr(lang, 'courses')}>{courses.map(c => <Item key={c.id} title={c.name} subtitle={c.issuer} date={c.date} />)}</Section>}
      {activities.length > 0 && <Section title={tr(lang, 'activities')}>{activities.map(a => <Item key={a.id} title={a.name} description={a.description} />)}</Section>}
    </div>
  );
};

// ============ MODERN (sidebar) ============
const ModernTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const accent = '#0f766e';
  const sideStyle: React.CSSProperties = { background: '#f0fdfa', padding: '28px 22px', color: '#134e4a' };
  const mainStyle: React.CSSProperties = { padding: '28px 26px', color: '#111827', fontSize: '11px', lineHeight: 1.55 };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: lang === 'ar' ? '1fr 220px' : '220px 1fr', minHeight: '100%' }}>
      <aside style={{ ...sideStyle, gridColumn: lang === 'ar' ? 2 : 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: accent }}>{personal.fullName || (lang === 'ar' ? 'الاسم' : 'Name')}</h1>
          {personal.jobTitle && <div style={{ fontSize: '11px', marginTop: 4, color: '#475569' }}>{personal.jobTitle}</div>}
        </div>
        <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {personal.email && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Mail size={11} />{personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Phone size={11} />{personal.phone}</div>}
          {(personal.city || personal.country) && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><MapPin size={11} />{[personal.city, personal.country].filter(Boolean).join(', ')}</div>}
          {personal.linkedin && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Linkedin size={11} />{personal.linkedin}</div>}
          {personal.website && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Globe size={11} />{personal.website}</div>}
        </div>
        {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: '11.5px', fontWeight: 700, color: accent, marginBottom: 6 }}>{tr(lang, 'skills')}</h3>
            {skills.technical.map((s, i) => <Chip key={`t${i}`} color={accent}>{s}</Chip>)}
            {skills.soft.map((s, i) => <Chip key={`s${i}`} color={accent}>{s}</Chip>)}
            {skills.languages.length > 0 && <div style={{ marginTop: 6 }}><strong style={{ fontSize: '10px' }}>{tr(lang, 'languages')}</strong><div>{skills.languages.map((l, i) => <Chip key={i} color={accent}>{l}</Chip>)}</div></div>}
          </div>
        )}
      </aside>
      <main style={{ ...mainStyle, gridColumn: lang === 'ar' ? 1 : 2 }}>
        {personal.summary && <Section title={tr(lang, 'profile')} color={accent}><p style={{ margin: 0 }}>{personal.summary}</p></Section>}
        {education.length > 0 && <Section title={tr(lang, 'education')} color={accent}>{education.map(e => <Item key={e.id} title={`${e.degree} — ${e.field}`} subtitle={e.institution + (e.gpa ? ` • ${tr(lang, 'gpa')}: ${e.gpa}` : '')} date={`${fmtDate(e.startDate, lang)} - ${fmtDate(e.endDate, lang)}`} description={e.description} />)}</Section>}
        {experience.length > 0 && <Section title={tr(lang, 'experience')} color={accent}>{experience.map(x => <Item key={x.id} title={x.role} subtitle={x.company} date={`${fmtDate(x.startDate, lang)} - ${fmtDate(x.endDate, lang)}`} description={x.description} />)}</Section>}
        {projects.length > 0 && <Section title={tr(lang, 'projects')} color={accent}>{projects.map(p => <Item key={p.id} title={p.name} date={p.date} description={p.description} />)}</Section>}
        {courses.length > 0 && <Section title={tr(lang, 'courses')} color={accent}>{courses.map(c => <Item key={c.id} title={c.name} subtitle={c.issuer} date={c.date} />)}</Section>}
        {activities.length > 0 && <Section title={tr(lang, 'activities')} color={accent}>{activities.map(a => <Item key={a.id} title={a.name} description={a.description} />)}</Section>}
      </main>
    </div>
  );
};

// ============ ELEGANT (serif-feel, accent line) ============
const ElegantTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const { personal, education, experience, projects, skills, courses, activities } = data;
  const accent = '#7c2d12';
  return (
    <div style={{ padding: '40px 44px', color: '#1c1917', fontSize: '11px', lineHeight: 1.6 }}>
      <header style={{ borderBottom: `2px solid ${accent}`, paddingBottom: '14px', marginBottom: '18px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: accent, letterSpacing: '1px' }}>{personal.fullName || (lang === 'ar' ? 'الاسم' : 'Name')}</h1>
        {personal.jobTitle && <div style={{ fontSize: '12px', color: '#57534e', marginTop: 6, fontStyle: 'italic' }}>{personal.jobTitle}</div>}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px', fontSize: '10px', color: '#57534e' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>•&nbsp;{personal.phone}</span>}
          {(personal.city || personal.country) && <span>•&nbsp;{[personal.city, personal.country].filter(Boolean).join(', ')}</span>}
          {personal.linkedin && <span>•&nbsp;{personal.linkedin}</span>}
        </div>
      </header>
      {personal.summary && <Section title={tr(lang, 'profile')} color={accent}><p style={{ margin: 0, fontStyle: 'italic' }}>{personal.summary}</p></Section>}
      {education.length > 0 && <Section title={tr(lang, 'education')} color={accent}>{education.map(e => <Item key={e.id} title={`${e.degree} — ${e.field}`} subtitle={e.institution + (e.gpa ? ` • ${tr(lang, 'gpa')}: ${e.gpa}` : '')} date={`${fmtDate(e.startDate, lang)} - ${fmtDate(e.endDate, lang)}`} description={e.description} />)}</Section>}
      {experience.length > 0 && <Section title={tr(lang, 'experience')} color={accent}>{experience.map(x => <Item key={x.id} title={x.role} subtitle={x.company} date={`${fmtDate(x.startDate, lang)} - ${fmtDate(x.endDate, lang)}`} description={x.description} />)}</Section>}
      {projects.length > 0 && <Section title={tr(lang, 'projects')} color={accent}>{projects.map(p => <Item key={p.id} title={p.name} date={p.date} description={p.description} />)}</Section>}
      {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
        <Section title={tr(lang, 'skills')} color={accent}>
          {skills.technical.length > 0 && <div><strong>{tr(lang, 'technicalSkills')}: </strong>{skills.technical.join(' • ')}</div>}
          {skills.soft.length > 0 && <div><strong>{tr(lang, 'softSkills')}: </strong>{skills.soft.join(' • ')}</div>}
          {skills.languages.length > 0 && <div><strong>{tr(lang, 'languages')}: </strong>{skills.languages.join(' • ')}</div>}
        </Section>
      )}
      {courses.length > 0 && <Section title={tr(lang, 'courses')} color={accent}>{courses.map(c => <Item key={c.id} title={c.name} subtitle={c.issuer} date={c.date} />)}</Section>}
      {activities.length > 0 && <Section title={tr(lang, 'activities')} color={accent}>{activities.map(a => <Item key={a.id} title={a.name} description={a.description} />)}</Section>}
    </div>
  );
};

// ============ CLEAN (boxed header) ============
const CleanTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const accent = '#1e40af';
  const { personal, education, experience, projects, skills, courses, activities } = data;
  return (
    <div style={{ padding: '0', color: '#0f172a', fontSize: '11px', lineHeight: 1.55 }}>
      <header style={{ background: accent, color: 'white', padding: '24px 36px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{personal.fullName || (lang === 'ar' ? 'الاسم' : 'Name')}</h1>
        {personal.jobTitle && <div style={{ fontSize: '12px', opacity: 0.9, marginTop: 4 }}>{personal.jobTitle}</div>}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: 10, fontSize: '10px', opacity: 0.95 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {(personal.city || personal.country) && <span>{[personal.city, personal.country].filter(Boolean).join(', ')}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>
      <div style={{ padding: '24px 36px' }}>
        {personal.summary && <Section title={tr(lang, 'profile')} color={accent}><p style={{ margin: 0 }}>{personal.summary}</p></Section>}
        {education.length > 0 && <Section title={tr(lang, 'education')} color={accent}>{education.map(e => <Item key={e.id} title={`${e.degree} — ${e.field}`} subtitle={e.institution + (e.gpa ? ` • ${tr(lang, 'gpa')}: ${e.gpa}` : '')} date={`${fmtDate(e.startDate, lang)} - ${fmtDate(e.endDate, lang)}`} description={e.description} />)}</Section>}
        {experience.length > 0 && <Section title={tr(lang, 'experience')} color={accent}>{experience.map(x => <Item key={x.id} title={x.role} subtitle={x.company} date={`${fmtDate(x.startDate, lang)} - ${fmtDate(x.endDate, lang)}`} description={x.description} />)}</Section>}
        {projects.length > 0 && <Section title={tr(lang, 'projects')} color={accent}>{projects.map(p => <Item key={p.id} title={p.name} date={p.date} description={p.description} />)}</Section>}
        {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
          <Section title={tr(lang, 'skills')} color={accent}>
            {skills.technical.length > 0 && <div style={{ marginBottom: 4 }}><strong>{tr(lang, 'technicalSkills')}: </strong>{skills.technical.map((s, i) => <Chip key={i} color={accent}>{s}</Chip>)}</div>}
            {skills.soft.length > 0 && <div style={{ marginBottom: 4 }}><strong>{tr(lang, 'softSkills')}: </strong>{skills.soft.map((s, i) => <Chip key={i} color={accent}>{s}</Chip>)}</div>}
            {skills.languages.length > 0 && <div><strong>{tr(lang, 'languages')}: </strong>{skills.languages.map((s, i) => <Chip key={i} color={accent}>{s}</Chip>)}</div>}
          </Section>
        )}
        {courses.length > 0 && <Section title={tr(lang, 'courses')} color={accent}>{courses.map(c => <Item key={c.id} title={c.name} subtitle={c.issuer} date={c.date} />)}</Section>}
        {activities.length > 0 && <Section title={tr(lang, 'activities')} color={accent}>{activities.map(a => <Item key={a.id} title={a.name} description={a.description} />)}</Section>}
      </div>
    </div>
  );
};

// ============ COMPACT (two-col, condensed) ============
const CompactTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const accent = '#0369a1';
  const { personal, education, experience, projects, skills, courses, activities } = data;
  return (
    <div style={{ padding: '28px 32px', color: '#0f172a', fontSize: '10.5px', lineHeight: 1.5 }}>
      <header style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap', borderBottom: `1px solid ${accent}40`, paddingBottom: 10 }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: accent }}>{personal.fullName || (lang === 'ar' ? 'الاسم' : 'Name')}</h1>
          {personal.jobTitle && <div style={{ fontSize: '11px', color: '#475569' }}>{personal.jobTitle}</div>}
        </div>
        <div style={{ fontSize: '9.5px', color: '#475569', textAlign: lang === 'ar' ? 'left' : 'right' }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {(personal.city || personal.country) && <div>{[personal.city, personal.country].filter(Boolean).join(', ')}</div>}
        </div>
      </header>
      {personal.summary && <Section title={tr(lang, 'profile')} color={accent}><p style={{ margin: 0 }}>{personal.summary}</p></Section>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          {education.length > 0 && <Section title={tr(lang, 'education')} color={accent}>{education.map(e => <Item key={e.id} title={`${e.degree}`} subtitle={e.institution} date={`${fmtDate(e.startDate, lang)}-${fmtDate(e.endDate, lang)}`} />)}</Section>}
          {experience.length > 0 && <Section title={tr(lang, 'experience')} color={accent}>{experience.map(x => <Item key={x.id} title={x.role} subtitle={x.company} date={`${fmtDate(x.startDate, lang)}-${fmtDate(x.endDate, lang)}`} description={x.description} />)}</Section>}
        </div>
        <div>
          {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
            <Section title={tr(lang, 'skills')} color={accent}>
              {[...skills.technical, ...skills.soft].map((s, i) => <Chip key={i} color={accent}>{s}</Chip>)}
              {skills.languages.length > 0 && <div style={{ marginTop: 4 }}><strong style={{ fontSize: '10px' }}>{tr(lang, 'languages')}: </strong>{skills.languages.join(' • ')}</div>}
            </Section>
          )}
          {projects.length > 0 && <Section title={tr(lang, 'projects')} color={accent}>{projects.map(p => <Item key={p.id} title={p.name} description={p.description} />)}</Section>}
          {courses.length > 0 && <Section title={tr(lang, 'courses')} color={accent}>{courses.map(c => <Item key={c.id} title={c.name} subtitle={c.issuer} />)}</Section>}
          {activities.length > 0 && <Section title={tr(lang, 'activities')} color={accent}>{activities.map(a => <Item key={a.id} title={a.name} description={a.description} />)}</Section>}
        </div>
      </div>
    </div>
  );
};

// ============ CREATIVE (dark accent block) ============
const CreativeTemplate: React.FC<TemplateProps> = ({ data, lang }) => {
  const accent = '#6d28d9';
  const { personal, education, experience, projects, skills, courses, activities } = data;
  return (
    <div style={{ padding: 0, color: '#0f172a', fontSize: '11px', lineHeight: 1.55 }}>
      <header style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)', color: 'white', padding: '28px 36px', position: 'relative' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>{personal.fullName || (lang === 'ar' ? 'الاسم' : 'Name')}</h1>
        {personal.jobTitle && <div style={{ fontSize: '13px', marginTop: 6, opacity: 0.95 }}>{personal.jobTitle}</div>}
        {personal.summary && <p style={{ marginTop: 12, fontSize: '11px', opacity: 0.95, maxWidth: '90%' }}>{personal.summary}</p>}
      </header>
      <div style={{ display: 'flex', gap: 0, padding: '20px 0' }}>
        <aside style={{ width: '34%', padding: '8px 26px', borderInlineEnd: '1px solid #e5e7eb' }}>
          <Section title={tr(lang, 'contact')} color={accent}>
            <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: 4, color: '#374151' }}>
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {(personal.city || personal.country) && <div>{[personal.city, personal.country].filter(Boolean).join(', ')}</div>}
              {personal.linkedin && <div>{personal.linkedin}</div>}
            </div>
          </Section>
          {(skills.technical.length + skills.soft.length + skills.languages.length) > 0 && (
            <Section title={tr(lang, 'skills')} color={accent}>
              {skills.technical.map((s, i) => <Chip key={`t${i}`} color={accent}>{s}</Chip>)}
              {skills.soft.map((s, i) => <Chip key={`s${i}`} color={accent}>{s}</Chip>)}
              {skills.languages.length > 0 && <div style={{ marginTop: 6 }}><strong style={{ fontSize: '10px' }}>{tr(lang, 'languages')}: </strong>{skills.languages.join(' • ')}</div>}
            </Section>
          )}
          {courses.length > 0 && <Section title={tr(lang, 'courses')} color={accent}>{courses.map(c => <Item key={c.id} title={c.name} subtitle={c.issuer} />)}</Section>}
        </aside>
        <main style={{ flex: 1, padding: '8px 30px' }}>
          {education.length > 0 && <Section title={tr(lang, 'education')} color={accent}>{education.map(e => <Item key={e.id} title={`${e.degree} — ${e.field}`} subtitle={e.institution + (e.gpa ? ` • ${tr(lang, 'gpa')}: ${e.gpa}` : '')} date={`${fmtDate(e.startDate, lang)} - ${fmtDate(e.endDate, lang)}`} description={e.description} />)}</Section>}
          {experience.length > 0 && <Section title={tr(lang, 'experience')} color={accent}>{experience.map(x => <Item key={x.id} title={x.role} subtitle={x.company} date={`${fmtDate(x.startDate, lang)} - ${fmtDate(x.endDate, lang)}`} description={x.description} />)}</Section>}
          {projects.length > 0 && <Section title={tr(lang, 'projects')} color={accent}>{projects.map(p => <Item key={p.id} title={p.name} date={p.date} description={p.description} />)}</Section>}
          {activities.length > 0 && <Section title={tr(lang, 'activities')} color={accent}>{activities.map(a => <Item key={a.id} title={a.name} description={a.description} />)}</Section>}
        </main>
      </div>
    </div>
  );
};

const REGISTRY: Record<CVTemplate, React.FC<TemplateProps>> = {
  minimal: MinimalTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  clean: CleanTemplate,
  compact: CompactTemplate,
  creative: CreativeTemplate,
};

export const TEMPLATES_META: { key: CVTemplate; nameAr: string; nameEn: string; descAr: string; descEn: string; accent: string }[] = [
  { key: 'minimal', nameAr: 'مينيمال أكاديمي', nameEn: 'Minimal Academic', descAr: 'بسيط، أنيق، ومناسب لكل التخصصات', descEn: 'Clean lines, focused on content', accent: '#1f2937' },
  { key: 'modern', nameAr: 'حديث (شريط جانبي)', nameEn: 'Modern Sidebar', descAr: 'شريط جانبي للمعلومات والمهارات', descEn: 'Sidebar layout, contemporary feel', accent: '#0f766e' },
  { key: 'elegant', nameAr: 'كلاسيكي راقٍ', nameEn: 'Elegant Classic', descAr: 'تصميم رسمي مناسب للأبحاث', descEn: 'Formal & timeless for academia', accent: '#7c2d12' },
  { key: 'clean', nameAr: 'احترافي نظيف', nameEn: 'Clean Professional', descAr: 'هيدر ملوّن واضح ومنظّم', descEn: 'Bold header, structured body', accent: '#1e40af' },
  { key: 'compact', nameAr: 'مدمج (عمودين)', nameEn: 'Compact Two-Col', descAr: 'يوفر مساحة لمحتوى كثيف', descEn: 'Maximize content density', accent: '#0369a1' },
  { key: 'creative', nameAr: 'إبداعي', nameEn: 'Creative', descAr: 'هيدر متدرّج لمسة عصرية', descEn: 'Gradient header, modern vibe', accent: '#6d28d9' },
];

export const CVRenderer: React.FC<{ template: CVTemplate; data: CVData; lang: CVLanguage }> = ({ template, data, lang }) => {
  const Comp = REGISTRY[template] || MinimalTemplate;
  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        fontFamily: lang === 'ar'
          ? "'IBM Plex Sans Arabic', 'Tajawal', 'Cairo', system-ui, sans-serif"
          : "'Inter', 'IBM Plex Sans', system-ui, sans-serif",
        background: 'white',
        width: '100%',
        height: '100%',
      }}
    >
      <Comp data={data} lang={lang} />
    </div>
  );
};
