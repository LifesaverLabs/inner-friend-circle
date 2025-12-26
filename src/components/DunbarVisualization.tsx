import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface DunbarVisualizationProps {
  coreCount?: number;
  innerCount?: number;
  outerCount?: number;
  nayborCount?: number;
  parasocialCount?: number;
  interactive?: boolean;
  onTierClick?: (tier: 'core' | 'inner' | 'outer' | 'naybor' | 'parasocial') => void;
}

export function DunbarVisualization({
  coreCount = 5,
  innerCount = 15,
  outerCount = 150,
  nayborCount = 25,
  parasocialCount = 25,
  interactive = false,
  onTierClick,
}: DunbarVisualizationProps) {
  const { t } = useTranslation();

  const circles = [
    { tier: 'parasocial' as const, size: 380, count: parasocialCount, label: t('tiers.parasocial'), color: 'bg-tier-parasocial/10 border-tier-parasocial', borderWidth: 'border' },
    { tier: 'naybor' as const, size: 320, count: nayborCount, label: t('tiers.naybor'), color: 'bg-tier-naybor/15 border-tier-naybor', borderWidth: 'border-2' },
    { tier: 'outer' as const, size: 260, count: outerCount, label: t('tiers.outer'), color: 'bg-tier-outer/20 border-tier-outer', borderWidth: 'border-2' },
    { tier: 'inner' as const, size: 160, count: innerCount, label: t('tiers.inner'), color: 'bg-tier-inner/20 border-tier-inner', borderWidth: 'border-2' },
    { tier: 'core' as const, size: 80, count: coreCount, label: t('tiers.core'), color: 'bg-tier-core/30 border-tier-core', borderWidth: 'border-2' },
  ];

  return (
    <div className="relative w-[420px] h-[420px] flex items-center justify-center">
      {circles.map((circle, index) => (
        <motion.div
          key={circle.tier}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.15, duration: 0.5, type: 'spring' }}
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
        className="absolute -right-28 top-1/2 -translate-y-1/2 space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-core" />
          <span className="text-sm font-medium">{t('visualization.coreLabel', { count: 5 })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-inner" />
          <span className="text-sm font-medium">{t('visualization.innerLabel', { count: 15 })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-outer" />
          <span className="text-sm font-medium">{t('visualization.outerLabel', { count: 150 })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-naybor" />
          <span className="text-sm font-medium">{t('visualization.nayborLabel', { count: 25 })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tier-parasocial" />
          <span className="text-sm font-medium">{t('visualization.parasocialLabel', { count: 25 })}</span>
        </div>
      </motion.div>
    </div>
  );
}