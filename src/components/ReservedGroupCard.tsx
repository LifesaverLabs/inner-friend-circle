import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ReservedGroup, TierType } from '@/types/friend';
import { EditReservedGroupDialog } from './EditReservedGroupDialog';

interface ReservedGroupCardProps {
  group: ReservedGroup;
  tier: TierType;
  friendCount: number;
  tierLimit: number;
  otherGroupsTotal: number;
  onUpdate: (groupId: string, count: number, note?: string) => void;
  onRemove: (groupId: string) => void;
}

export function ReservedGroupCard({
  group,
  tier,
  friendCount,
  tierLimit,
  otherGroupsTotal,
  onUpdate,
  onRemove,
}: ReservedGroupCardProps) {
  const { t } = useTranslation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const maxForThisGroup = tierLimit - friendCount - otherGroupsTotal;

  return (
    <>
      <motion.div
        layout
        className="friend-card bg-muted/50 border border-dashed border-border flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-muted-foreground">
            {t('reserved.spotsCount', { count: group.count })}
          </h4>
          {group.note && (
            <p className="text-xs text-muted-foreground/70 truncate italic">
              {group.note}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Pencil className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              {t('reserved.editGroup')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('reserved.deleteGroup')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <EditReservedGroupDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tier={tier}
        group={group}
        maxCount={maxForThisGroup}
        onSave={(count, note) => {
          onUpdate(group.id, count, note);
          setEditDialogOpen(false);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('reserved.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('reserved.deleteConfirmDescription', {
                count: group.count,
                note: group.note ? ` (${group.note})` : '',
                tier: t(`tiers.${tier}`)
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onRemove(group.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
