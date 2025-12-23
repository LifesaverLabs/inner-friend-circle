import { motion } from 'framer-motion';
import { MoreVertical, ArrowUp, ArrowDown, Trash2, User, GripVertical, Phone } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Friend, TierType, TIER_INFO, CONTACT_METHODS } from '@/types/friend';
import { toast } from 'sonner';

interface FriendCardProps {
  friend: Friend;
  onMove: (id: string, newTier: TierType) => void;
  onRemove: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  getAllowedMoves: (fromTier: TierType) => TierType[];
  getTierCapacity: (tier: TierType) => { available: number; used: number; limit: number };
}

const tierOrder: TierType[] = ['core', 'inner', 'outer', 'parasocial', 'rolemodel', 'acquainted'];

export function FriendCard({ 
  friend, 
  onMove, 
  onRemove, 
  canMoveUp, 
  canMoveDown,
  getAllowedMoves,
  getTierCapacity,
}: FriendCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: friend.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const currentTierIndex = tierOrder.indexOf(friend.tier);
  const allowedMoves = getAllowedMoves(friend.tier);
  
  // Get the tier above (closer to core) that's allowed
  const tierAbove = allowedMoves.find(t => tierOrder.indexOf(t) < currentTierIndex);
  // Get the tier below (further from core) that's allowed
  const tierBelow = allowedMoves.find(t => tierOrder.indexOf(t) > currentTierIndex);
  
  // Check if we can actually move (capacity available)
  const canActuallyMoveUp = tierAbove && getTierCapacity(tierAbove).available > 0;
  const canActuallyMoveDown = tierBelow && getTierCapacity(tierBelow).available > 0;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="friend-card bg-card border border-border flex items-center gap-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{friend.name}</h4>
        {friend.email && (
          <p className="text-xs text-muted-foreground truncate">{friend.email}</p>
        )}
        {friend.phone && (
          <p className="text-xs text-muted-foreground truncate">{friend.phone}</p>
        )}
      </div>

      {friend.phone && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary/80"
                onClick={() => {
                  const method = friend.preferredContact || 'tel';
                  const contactInfo = CONTACT_METHODS[method];
                  window.open(contactInfo.getUrl(friend.phone!), '_blank');
                  toast.success(`Connecting via ${contactInfo.name}`);
                }}
              >
                <Phone className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {friend.preferredContact 
                  ? `Call via ${CONTACT_METHODS[friend.preferredContact].name}` 
                  : 'Call'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {tierAbove && canActuallyMoveUp && (
            <DropdownMenuItem onClick={() => onMove(friend.id, tierAbove)}>
              <ArrowUp className="w-4 h-4 mr-2" />
              Move to {TIER_INFO[tierAbove].name}
            </DropdownMenuItem>
          )}
          {tierBelow && canActuallyMoveDown && (
            <DropdownMenuItem onClick={() => onMove(friend.id, tierBelow)}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Move to {TIER_INFO[tierBelow].name}
            </DropdownMenuItem>
          )}
          {((tierAbove && canActuallyMoveUp) || (tierBelow && canActuallyMoveDown)) && <DropdownMenuSeparator />}
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
