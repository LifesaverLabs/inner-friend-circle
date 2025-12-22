import { motion } from 'framer-motion';

interface DunbarVisualizationProps {
  coreCount?: number;
  innerCount?: number;
  outerCount?: number;
  parasocialCount?: number;
  interactive?: boolean;
  onTierClick?: (tier: 'core' | 'inner' | 'outer' | 'parasocial') => void;
}

export function DunbarVisualization({
  coreCount = 5,
  innerCount = 15,
  outerCount = 150,
  parasocialCount = 25,
  interactive = false,
  onTierClick,
}: DunbarVisualizationProps) {
  const circles = [
    { tier: 'parasocial' as const, size: 340, count: parasocialCount, label: 'Parasocial', color: 'bg-tier-parasocial/10 border-tier-parasocial', borderWidth: 'border' },
    { tier: 'outer' as const, size: 280, count: outerCount, label: 'Outer', color: 'bg-tier-outer/20 border-tier-outer', borderWidth: 'border-2' },
    { tier: 'inner' as const, size: 180, count: innerCount, label: 'Inner', color: 'bg-tier-inner/20 border-tier-inner', borderWidth: 'border-2' },
    { tier: 'core' as const, size: 90, count: coreCount, label: 'Core', color: 'bg-tier-core/30 border-tier-core', borderWidth: 'border-2' },
  ];

  return (
    <div className="relative w-[380px] h-[380px] flex items-center justify-center">
      {circles.map((circle, index) => (
        <motion.div
          key={circle.tier}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.2, duration: 0.5, type: 'spring' }}
          className={`absolute concentric-circle ${circle.borderWidth} ${circle.color} ${
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
        transition={{ delay: 1 }}
        className="absolute -right-24 top-1/2 -translate-y-1/2 space-y-3"
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-parasocial" />
          <span className="text-sm font-medium">25 Parasocial</span>
        </div>
      </motion.div>
    </div>
  );
}