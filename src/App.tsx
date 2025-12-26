import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { CookieConsentBanner } from "@/components/gdpr/CookieConsentBanner";
import { useGDPR } from "@/hooks/useGDPR";

// Initialize i18n
import "./lib/i18n";

const queryClient = new QueryClient();

// Loading fallback for i18n Suspense
const I18nLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground">Loading...</div>
  </div>
);

// Inner component that uses the GDPR hook (must be inside Suspense for i18n)
const AppContent = () => {
  const {
    showCookieBanner,
    dismissBanner,
    acceptAllCookies,
    acceptEssentialOnly,
    updateCookieConsent,
  } = useGDPR();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/u/:handle" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* GDPR Cookie Consent Banner */}
      {showCookieBanner && (
        <CookieConsentBanner
          onAcceptAll={acceptAllCookies}
          onAcceptEssential={acceptEssentialOnly}
          onCustomize={(consent) => {
            updateCookieConsent(consent);
            dismissBanner();
          }}
          onDismiss={dismissBanner}
        />
      )}
    </>
  );
};

const App = () => (
  <Suspense fallback={<I18nLoadingFallback />}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Suspense>
);

export default App;
