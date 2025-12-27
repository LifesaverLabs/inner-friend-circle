import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Eye, EyeOff } from 'lucide-react';
import { ParasocialShare } from '@/hooks/useParasocial';

interface ParasocialFeedCardProps {
  share: ParasocialShare;
  isSeen: boolean;
  onEngage: (shareId: string) => void;
}

export function ParasocialFeedCard({ share, isSeen, onEngage }: ParasocialFeedCardProps) {
  const { t } = useTranslation();
  const creatorName = share.creator_profile?.display_name || share.creator_profile?.user_handle || t('parasocialFeed.unknownCreator');

  const handleClick = () => {
    onEngage(share.id);
    window.open(share.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleClick}
      className={`
        w-full text-left p-3 rounded-lg border transition-all
        ${isSeen 
          ? 'bg-muted/30 border-muted/50 opacity-75' 
          : 'bg-tier-parasocial/10 border-tier-parasocial/30 hover:bg-tier-parasocial/20'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {!isSeen && (
              <span className="inline-flex items-center gap-1 text-xs bg-tier-parasocial/20 text-tier-parasocial px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                {t('parasocialFeed.new')}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {t('parasocialFeed.from', { name: creatorName })}
            </span>
          </div>
          <h4 className="font-medium text-foreground flex items-center gap-1">
            {share.title}
            <ExternalLink className="w-3 h-3 shrink-0 text-muted-foreground" />
          </h4>
          {share.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {share.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}</span>
            <span className="flex items-center gap-1">
              {isSeen ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {isSeen ? t('parasocialFeed.seen') : t('parasocialFeed.unseen')}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
