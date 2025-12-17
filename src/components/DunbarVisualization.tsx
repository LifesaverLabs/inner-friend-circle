import { motion } from 'framer-motion';

interface DunbarVisualizationProps {
  coreCount?: number;
  innerCount?: number;
  outerCount?: number;
  interactive?: boolean;
  onTierClick?: (tier: 'core' | 'inner' | 'outer') => void;
}

export function DunbarVisualization({
  coreCount = 5,
  innerCount = 15,
  outerCount = 150,
  interactive = false,
  onTierClick,
}: DunbarVisualizationProps) {
  const circles = [
    { tier: 'outer' as const, size: 280, count: outerCount, label: 'Outer', color: 'bg-tier-outer/20 border-tier-outer' },
    { tier: 'inner' as const, size: 180, count: innerCount, label: 'Inner', color: 'bg-tier-inner/20 border-tier-inner' },
    { tier: 'core' as const, size: 90, count: coreCount, label: 'Core', color: 'bg-tier-core/30 border-tier-core' },
  ];

  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center">
      {circles.map((circle, index) => (
        <motion.div
          key={circle.tier}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.2, duration: 0.5, type: 'spring' }}
          className={`absolute concentric-circle border-2 ${circle.color} ${
            interactive ? 'cursor-pointer hover:scale-105' : ''
          }`}
          style={{ width: circle.size, height: circle.size }}
          onClick={() => interactive && onTierClick?.(circle.tier)}
        >
          {circle.tier === 'core' && (
            <div className="text-center">
              <div className="text-lg font-display font-bold text-foreground">{circle.count}</div>
              <div className="text-xs text-muted-foreground">{circle.label}</div>
            </div>
          )}
        </motion.div>
      ))}
      
      {/* Labels outside circles */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -right-20 top-1/2 -translate-y-1/2 space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-core" />
          <span className="text-sm font-medium">5 Core</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-inner" />
          <span className="text-sm font-medium">15 Inner</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-outer" />
          <span className="text-sm font-medium">150 Outer</span>
        </div>
      </motion.div>
    </div>
  );
}