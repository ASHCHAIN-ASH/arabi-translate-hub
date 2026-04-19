import React from 'react';
import type { CVTemplate } from './types';

interface Props {
  template: CVTemplate;
  accent: string;
}

/**
 * Realistic miniature preview of each CV template.
 * Pure CSS — no images, scales perfectly, ~140×100px ideal.
 */
export const TemplateThumbnail: React.FC<Props> = ({ template, accent }) => {
  const Bar = ({ w, h = 3, mt = 0, op = 0.6, bg }: any) => (
    <div style={{ width: `${w}%`, height: h, background: bg || `rgba(0,0,0,${op})`, borderRadius: 1, marginTop: mt }} />
  );

  const wrap: React.CSSProperties = {
    width: '100%', aspectRatio: '210 / 297', background: 'white',
    borderRadius: 6, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,.06)',
    display: 'flex', flexDirection: 'column',
  };

  switch (template) {
    case 'minimal':
      return (
        <div style={wrap}>
          <div style={{ padding: '10px 8px 8px', borderBottom: '1px solid #e5e5e5' }}>
            <Bar w={55} h={5} bg="#0a0a0a" />
            <Bar w={35} h={2} mt={3} op={0.4} />
            <div style={{ display: 'flex', gap: 3, marginTop: 5 }}>
              <Bar w={20} h={1.5} op={0.3} />
              <Bar w={20} h={1.5} op={0.3} />
              <Bar w={20} h={1.5} op={0.3} />
            </div>
          </div>
          <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '20% 1fr', gap: 4 }}>
                <Bar w={100} h={1.5} op={0.3} />
                <div>
                  <Bar w={70} h={2} op={0.7} />
                  <Bar w={50} h={1.5} mt={2} op={0.3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'modern':
      return (
        <div style={{ ...wrap, display: 'grid', gridTemplateColumns: '38% 1fr' }}>
          <div style={{ background: `linear-gradient(180deg, ${accent}, ${accent}dd)`, padding: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,.25)', margin: '4px auto 6px' }} />
            <Bar w={80} h={2} bg="rgba(255,255,255,.7)" />
            <Bar w={60} h={1.5} mt={2} bg="rgba(255,255,255,.45)" />
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[80,65,90,55].map((w,i) => (
                <div key={i}>
                  <Bar w={w * 0.6} h={1.2} bg="rgba(255,255,255,.6)" />
                  <Bar w={w} h={2} mt={1} bg="rgba(255,255,255,.25)" />
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 7 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />
                  <Bar w={50} h={2} bg={accent} />
                </div>
                <Bar w={75} h={1.4} mt={2} op={0.35} />
                <Bar w={60} h={1.4} mt={1.5} op={0.35} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'elegant':
      return (
        <div style={{ ...wrap, background: 'linear-gradient(180deg, #fffbeb 0%, #fff 40%)' }}>
          <div style={{ textAlign: 'center', padding: '10px 8px 8px' }}>
            <div style={{ fontSize: 5, color: accent, letterSpacing: 2 }}>✦ ✦ ✦</div>
            <Bar w={60} h={4} bg={accent} mt={3} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}><Bar w={35} h={1.5} op={0.4} /></div>
            <div style={{ fontSize: 4, color: accent, letterSpacing: 2, marginTop: 4 }}>✦ ✦ ✦</div>
          </div>
          <div style={{ padding: '0 10px' }}>
            {[0,1].map(i => (
              <div key={i} style={{ marginBottom: 6, textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, justifyContent: 'center', width: '100%' }}>
                  <div style={{ width: 8, height: 1, background: accent, opacity: 0.5 }} />
                  <Bar w={30} h={2} bg={accent} />
                  <div style={{ width: 8, height: 1, background: accent, opacity: 0.5 }} />
                </div>
                <Bar w={70} h={1.5} mt={2} op={0.4} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}><Bar w={50} h={1.4} op={0.3} /></div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'clean':
      return (
        <div style={wrap}>
          <div style={{ background: `linear-gradient(135deg, ${accent}, #3b82f6)`, padding: '10px 8px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -8, right: -8, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
            <Bar w={55} h={4} bg="white" />
            <Bar w={35} h={1.8} mt={2} bg="rgba(255,255,255,.7)" />
          </div>
          <div style={{ padding: 7 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ marginBottom: 5, padding: 4, background: '#f8fafc', borderInlineStart: `2px solid ${accent}`, borderRadius: 2 }}>
                <Bar w={60} h={2} bg={accent} />
                <Bar w={75} h={1.3} mt={1.5} op={0.3} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'compact':
      return (
        <div style={wrap}>
          <div style={{ padding: '8px 8px 6px', borderBottom: `2px solid ${accent}` }}>
            <Bar w={50} h={4} bg={accent} />
            <Bar w={70} h={1.4} mt={2} op={0.4} />
          </div>
          <div style={{ padding: 6, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {[0,1,2,3].map(i => (
              <div key={i}>
                <Bar w={60} h={1.8} bg={accent} />
                <Bar w={90} h={1.2} mt={1.5} op={0.3} />
                <Bar w={70} h={1.2} mt={1} op={0.3} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'creative':
      return (
        <div style={wrap}>
          <div style={{ background: `linear-gradient(135deg, ${accent}25, transparent)`, padding: '10px 8px' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: `linear-gradient(135deg, ${accent}, #a855f7)` }} />
              <div style={{ flex: 1 }}>
                <Bar w={70} h={3} bg={accent} />
                <Bar w={50} h={1.5} mt={2} op={0.4} />
              </div>
            </div>
          </div>
          <div style={{ padding: 7 }}>
            {[0,1].map(i => (
              <div key={i} style={{ marginBottom: 6, padding: 4, background: i%2 ? `${accent}10` : 'transparent', borderRadius: 3 }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 1.5, background: accent }} />
                  <Bar w={55} h={2} bg={accent} />
                </div>
                <Bar w={80} h={1.3} mt={2} op={0.3} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 4 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ padding: '1.5px 5px', background: `${accent}20`, borderRadius: 8, height: 5, width: 18 }} />
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return <div style={wrap} />;
  }
};
