// Pure layout helpers: convert MindMapData → React Flow nodes/edges
// Radial layout — central node in middle, branches around, sub-children on outer ring.
import type { Node, Edge } from '@xyflow/react';
import type { MindMapData, MindMapNodeData } from '@/hooks/useMindMap';

const BRANCH_COLORS = [
  { bg: 'hsl(217 91% 60%)', text: 'hsl(0 0% 100%)' },   // blue
  { bg: 'hsl(280 87% 65%)', text: 'hsl(0 0% 100%)' },   // purple
  { bg: 'hsl(160 84% 39%)', text: 'hsl(0 0% 100%)' },   // emerald
  { bg: 'hsl(25 95% 53%)',  text: 'hsl(0 0% 100%)' },   // orange
  { bg: 'hsl(340 82% 52%)', text: 'hsl(0 0% 100%)' },   // pink
  { bg: 'hsl(199 89% 48%)', text: 'hsl(0 0% 100%)' },   // sky
  { bg: 'hsl(43 96% 56%)',  text: 'hsl(0 0% 0%)' },     // amber
];

export function buildFlow(map: MindMapData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const centerX = 0;
  const centerY = 0;

  // Central node
  nodes.push({
    id: 'root',
    type: 'mindNode',
    position: { x: centerX, y: centerY },
    data: {
      label: map.central_topic,
      level: 0,
      color: 'hsl(var(--primary))',
      textColor: 'hsl(var(--primary-foreground))',
    },
    draggable: true,
  });

  const branches = map.branches || [];
  const branchRadius = 320;
  const childRadius = 220;

  branches.forEach((branch, bi) => {
    const angle = (2 * Math.PI * bi) / branches.length - Math.PI / 2;
    const bx = centerX + Math.cos(angle) * branchRadius;
    const by = centerY + Math.sin(angle) * branchRadius;
    const color = BRANCH_COLORS[bi % BRANCH_COLORS.length];
    const branchId = `b-${bi}`;

    nodes.push({
      id: branchId,
      type: 'mindNode',
      position: { x: bx, y: by },
      data: {
        label: branch.title,
        level: 1,
        color: color.bg,
        textColor: color.text,
      },
      draggable: true,
    });

    edges.push({
      id: `e-root-${branchId}`,
      source: 'root',
      target: branchId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: color.bg, strokeWidth: 2.5 },
    });

    const children = branch.children || [];
    const spread = Math.min(Math.PI / 2.2, (children.length - 1) * 0.35 + 0.4);
    const startAngle = angle - spread / 2;
    const step = children.length > 1 ? spread / (children.length - 1) : 0;

    children.forEach((child, ci) => {
      const cAngle = startAngle + step * ci;
      const cx = bx + Math.cos(cAngle) * childRadius;
      const cy = by + Math.sin(cAngle) * childRadius;
      const childId = `${branchId}-c-${ci}`;

      nodes.push({
        id: childId,
        type: 'mindNode',
        position: { x: cx, y: cy },
        data: {
          label: child.title,
          level: 2,
          color: 'hsl(var(--card))',
          textColor: 'hsl(var(--foreground))',
          borderColor: color.bg,
        },
        draggable: true,
      });

      edges.push({
        id: `e-${branchId}-${childId}`,
        source: branchId,
        target: childId,
        type: 'smoothstep',
        style: { stroke: color.bg, strokeWidth: 1.5, opacity: 0.7 },
      });

      // Third level
      const grand = (child as MindMapNodeData).children || [];
      grand.forEach((g, gi) => {
        const gAngle = cAngle + (gi - (grand.length - 1) / 2) * 0.25;
        const gx = cx + Math.cos(gAngle) * 160;
        const gy = cy + Math.sin(gAngle) * 160;
        const gId = `${childId}-g-${gi}`;
        nodes.push({
          id: gId,
          type: 'mindNode',
          position: { x: gx, y: gy },
          data: {
            label: g.title,
            level: 3,
            color: 'hsl(var(--muted))',
            textColor: 'hsl(var(--muted-foreground))',
            borderColor: color.bg,
          },
          draggable: true,
        });
        edges.push({
          id: `e-${childId}-${gId}`,
          source: childId,
          target: gId,
          type: 'smoothstep',
          style: { stroke: color.bg, strokeWidth: 1, opacity: 0.5 },
        });
      });
    });
  });

  return { nodes, edges };
}
