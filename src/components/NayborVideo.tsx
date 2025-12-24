import { useState } from "react";
import { ExternalLink } from "lucide-react";

export const NayborVideo = () => {
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-muted flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          The video couldn't load. Your network may be blocking it.
        </p>
        <a
          href="https://www.teardownthisfirewall.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Tear Down This Firewall
        </a>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/AQS3JGqx46U"
        title="Won't You Be My Naybor? - Mr. Rogers"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-0"
        onError={() => setVideoFailed(true)}
        onLoad={(e) => {
          // Check if iframe loaded but content is blocked
          try {
            const iframe = e.target as HTMLIFrameElement;
            // If we can't access contentWindow, it might be blocked
            if (!iframe.contentWindow) {
              setVideoFailed(true);
            }
          } catch {
            // Cross-origin errors indicate the video loaded successfully
          }
        }}
      />
    </div>
  );
};
