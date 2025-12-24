import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export const NayborVideo = () => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [loading, setLoading] = useState(true);

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
      <div className="aspect-video rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          The video couldn't load. Your network may be blocking it.
        </p>
        <a
          href="https://www.youtube.com/embed/ed5sac4OLbI?si=dQr0ssS5e-6rps7j"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium mb-3"
        >
          <ExternalLink className="w-4 h-4" />
          Watch on YouTube
        </a>
        <a
          href="https://www.teardownthisfirewall.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
        >
          Learn more: Tear Down This Firewall
        </a>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/ed5sac4OLbI?si=dQr0ssS5e-6rps7j&enablejsapi=1"
        title="Won't You Be My Naybor? - Mr. Rogers"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="border-0"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};
