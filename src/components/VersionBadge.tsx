import { Badge } from '@/components/ui/badge';
import { FULL_VERSION } from '@/lib/version';

interface VersionBadgeProps {
  className?: string;
}

export function VersionBadge({ className }: VersionBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 ${className}`}
    >
      {FULL_VERSION}
    </Badge>
  );
}
