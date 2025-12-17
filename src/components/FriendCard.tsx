import { motion } from 'framer-motion';
import { MoreVertical, ArrowUp, ArrowDown, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Friend, TierType, TIER_INFO } from '@/types/friend';

interface FriendCardProps {
  friend: Friend;
  onMove: (id: string, newTier: TierType) => void;
  onRemove: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const tierOrder: TierType[] = ['core', 'inner', 'outer'];

export function FriendCard({ friend, onMove, onRemove, canMoveUp, canMoveDown }: FriendCardProps) {
  const currentTierIndex = tierOrder.indexOf(friend.tier);
  const tierAbove = currentTierIndex > 0 ? tierOrder[currentTierIndex - 1] : null;
  const tierBelow = currentTierIndex < tierOrder.length - 1 ? tierOrder[currentTierIndex + 1] : null;

  const tierInfo = TIER_INFO[friend.tier];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="friend-card bg-card border border-border flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{friend.name}</h4>
        {friend.email && (
          <p className="text-xs text-muted-foreground truncate">{friend.email}</p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {tierAbove && canMoveUp && (
            <DropdownMenuItem onClick={() => onMove(friend.id, tierAbove)}>
              <ArrowUp className="w-4 h-4 mr-2" />
              Move to {TIER_INFO[tierAbove].name}
            </DropdownMenuItem>
          )}
          {tierBelow && canMoveDown && (
            <DropdownMenuItem onClick={() => onMove(friend.id, tierBelow)}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Move to {TIER_INFO[tierBelow].name}
            </DropdownMenuItem>
          )}
          {(tierAbove || tierBelow) && <DropdownMenuSeparator />}
          <DropdownMenuItem 
            onClick={() => onRemove(friend.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}