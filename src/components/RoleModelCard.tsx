import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Trash2, Star, GripVertical, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Friend } from '@/types/friend';

interface RoleModelCardProps {
  friend: Friend;
  rank: number;
  onRemove: (id: string) => void;
  onUpdateReason?: (id: string, reason: string) => void;
}

export function RoleModelCard({ 
  friend, 
  rank,
  onRemove,
  onUpdateReason,
}: RoleModelCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedReason, setEditedReason] = useState(friend.roleModelReason || '');

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

  const handleSaveReason = () => {
    if (onUpdateReason && editedReason.trim()) {
      onUpdateReason(friend.id, editedReason.trim());
      setEditDialogOpen(false);
    }
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="friend-card bg-card border border-border"
      >
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-full bg-tier-rolemodel/20 flex items-center justify-center flex-shrink-0 text-tier-rolemodel font-bold">
            #{rank}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-tier-rolemodel flex-shrink-0" />
              <h4 className="font-medium text-foreground truncate">{friend.name}</h4>
            </div>
            {friend.roleModelReason && !expanded && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {friend.roleModelReason}
              </p>
            )}
          </div>

          {friend.roleModelReason && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onUpdateReason && (
                <DropdownMenuItem onClick={() => {
                  setEditedReason(friend.roleModelReason || '');
                  setEditDialogOpen(true);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Reason
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onRemove(friend.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {expanded && friend.roleModelReason && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border"
          >
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {friend.roleModelReason}
            </p>
          </motion.div>
        )}
      </motion.div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-tier-rolemodel" />
              Edit Role Model Reason
            </DialogTitle>
            <DialogDescription>
              Update why {friend.name} is a role model to you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editReason">Why is this person a role model?</Label>
              <Textarea
                id="editReason"
                value={editedReason}
                onChange={(e) => setEditedReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReason} disabled={!editedReason.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
