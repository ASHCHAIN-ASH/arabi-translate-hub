import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';

interface MindNodeData {
  label: string;
  level: number;
  color: string;
  textColor: string;
  borderColor?: string;
}

const MindNode: React.FC<NodeProps> = ({ data }) => {
  const d = data as unknown as MindNodeData;
  const isRoot = d.level === 0;
  const isBranch = d.level === 1;

  const sizeClass = isRoot
    ? 'min-w-[180px] max-w-[260px] text-lg font-bold px-6 py-4'
    : isBranch
    ? 'min-w-[140px] max-w-[220px] text-base font-semibold px-5 py-3'
    : 'min-w-[110px] max-w-[200px] text-sm font-medium px-4 py-2.5';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: d.level * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${sizeClass} rounded-2xl shadow-lg border-2 text-center leading-relaxed select-none transition-transform hover:scale-105`}
      style={{
        background: d.color,
        color: d.textColor,
        borderColor: d.borderColor || d.color,
        fontFamily: '"IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif',
        boxShadow: isRoot
          ? '0 20px 50px -12px hsl(var(--primary) / 0.5), 0 0 0 4px hsl(var(--primary) / 0.1)'
          : isBranch
          ? `0 10px 30px -10px ${d.color}`
          : '0 4px 12px hsl(var(--foreground) / 0.08)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <span style={{ wordBreak: 'break-word' }}>{d.label}</span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
};

export default MindNode;
