import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Play } from "lucide-react";

export const NayborVideo = () => {
  const { t } = useTranslation();
  const [videoFailed, setVideoFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoId = "ed5sac4OLbI";
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

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
      <div className="aspect-video rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center p-6 text-center relative group cursor-pointer">
        <a
          href={videoUrl}
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
            {t('nayborVideo.title')}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {t('nayborVideo.clickToWatch')}
          </p>
        </a>
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {t('nayborVideo.blocked')}
          </p>
          <a
            href="https://www.teardownthisfirewall.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            {t('nayborVideo.learnMore')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?si=dQr0ssS5e-6rps7j`}
        title={t('nayborVideo.iframeTitle')}
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