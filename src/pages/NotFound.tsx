import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      {/* Header with Language Selector */}
      <header className="container mx-auto px-4 py-6 flex justify-end">
        <LanguageSelector variant="prominent" />
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center" role="main">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">{t('notFound.title')}</h1>
          <p className="mb-4 text-xl text-muted-foreground">{t('notFound.message')}</p>
          <a
            href="/"
            className="text-primary underline hover:text-primary/90"
            aria-label={t('notFound.returnHome')}
          >
            {t('notFound.returnHome')}
          </a>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
