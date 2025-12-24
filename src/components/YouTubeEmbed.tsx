import { useState, useEffect } from "react";
import { ExternalLink, Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  privacyMode?: boolean;
  className?: string;
}

/**
 * YouTube embed component with automatic fallback for blocked videos.
 * 
 * @param videoId - The YouTube video ID (from the URL after v=)
 * @param title - Descriptive title for the video
 * @param privacyMode - Use youtube-nocookie.com for privacy-enhanced mode
 * @param className - Additional CSS classes for the container
 * 
 * Requirements met:
 * - Uses HTTPS embed URLs only
 * - No authentication required for watching
 * - Uses /embed/ format, never watch?v=
 * - No JavaScript API dependency
 * - Works on lovable.app and custom domains
 * - Graceful fallback with clickable thumbnail
 */
export const YouTubeEmbed = ({ 
  videoId, 
  title, 
  privacyMode = false,
  className = "" 
}: YouTubeEmbedProps) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const embedDomain = privacyMode 
    ? "https://www.youtube-nocookie.com" 
    : "https://www.youtube.com";
  const embedUrl = `${embedDomain}/embed/${videoId}`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  useEffect(() => {
    // Timeout to detect if video doesn't load (CSP/network blocks don't trigger onError)
    const timeoutId = setTimeout(() => {
      if (loading) {
        setVideoFailed(true);
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  if (videoFailed) {
    return (
      <div className={`aspect-video rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center p-6 text-center relative group cursor-pointer ${className}`}>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-colors">
              <Play className="w-10 h-10 text-primary-foreground fill-current" />
            </div>
          </div>
          <p className="text-sm text-foreground mb-2 font-medium">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Click to watch on YouTube
          </p>
        </a>
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Video blocked by your network?
          </p>
          <a
            href="https://www.teardownthisfirewall.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Learn more
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="border-0"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};