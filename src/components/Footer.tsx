import { ExternalLink, Github } from 'lucide-react';
import lifesaverLabsLogo from '@/assets/lifesaver-labs-logo.webp';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Lifesaver Labs Link */}
          <a
            href="https://www.lifesaverlabs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <img
              src={lifesaverLabsLogo}
              alt="Lifesaver Labs"
              className="h-10 w-10 object-contain"
            />
            <span className="text-sm font-medium">
              A Lifesaver Labs Project
            </span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/LifesaverLabs/inner-friend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm">Contribute on GitHub</span>
          </a>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Open source. Built with care for meaningful connections.
          </p>
        </div>
      </div>
    </footer>
  );
}
