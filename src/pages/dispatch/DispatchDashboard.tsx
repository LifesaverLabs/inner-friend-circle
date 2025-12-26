/**
 * DispatchDashboard Page
 *
 * Main dashboard for verified emergency dispatch accounts.
 * Allows searching for residents and requesting Door Key Tree access.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  LogOut,
  Building2,
  Key,
  FileText,
  RefreshCw,
  User,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
} from '@/components/ui/responsive-dialog';
import { useDispatchAuth } from '@/hooks/useDispatchAuth';
import {
  ORGANIZATION_TYPES,
  VERIFICATION_STATUSES,
  LEGAL_BASES,
  DispatchLegalBasis,
} from '@/types/dispatch';
import { EMERGENCY_SCENARIOS, EmergencyScenario } from '@/types/keysShared';
import { toast } from 'sonner';

interface AccessRequest {
  id: string;
  address: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  emergencyScenario: string;
}

export default function DispatchDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, isAuthenticated, isLoading, signOut, canMakeRequests, refreshSession } = useDispatchAuth();

  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    userId: string;
    displayName: string | null;
    address: string;
    hasKeysShared: boolean;
  }>>([]);

  const [accessRequestDialogOpen, setAccessRequestDialogOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<typeof searchResults[0] | null>(null);
  const [recentRequests, setRecentRequests] = useState<AccessRequest[]>([]);

  // Access request form
  const [requestForm, setRequestForm] = useState({
    emergencyScenario: '' as EmergencyScenario | '',
    emergencyDescription: '',
    isLifeThreatening: false,
    legalBasis: '' as DispatchLegalBasis | '',
    caseNumber: '',
    requestingOfficerName: '',
    requestingOfficerBadge: '',
  });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/dispatch/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Refresh session periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, [refreshSession]);

  const handleSearch = async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    // Simulate search - in production, this would query the database
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock results for demo
    setSearchResults([
      {
        userId: '1',
        displayName: 'John Doe',
        address: searchAddress,
        hasKeysShared: true,
      },
    ]);
    setIsSearching(false);
  };

  const handleRequestAccess = (resident: typeof searchResults[0]) => {
    setSelectedResident(resident);
    setAccessRequestDialogOpen(true);
  };

  const handleSubmitAccessRequest = async () => {
    if (!selectedResident || !requestForm.emergencyScenario || !requestForm.legalBasis) {
      toast.error(t('dispatch.dashboard.errors.requiredFields'));
      return;
    }

    setIsSubmittingRequest(true);

    try {
      // In production, this would create a dispatch_access_request record
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(t('dispatch.dashboard.requestSubmitted'));
      setAccessRequestDialogOpen(false);
      setSelectedResident(null);
      setRequestForm({
        emergencyScenario: '',
        emergencyDescription: '',
        isLifeThreatening: false,
        legalBasis: '',
        caseNumber: '',
        requestingOfficerName: '',
        requestingOfficerBadge: '',
      });

      // Add to recent requests
      setRecentRequests(prev => [
        {
          id: crypto.randomUUID(),
          address: selectedResident.address,
          status: 'pending',
          createdAt: new Date().toISOString(),
          emergencyScenario: requestForm.emergencyScenario,
        },
        ...prev,
      ]);
    } catch {
      toast.error(t('dispatch.dashboard.errors.requestFailed'));
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/dispatch/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  const statusInfo = VERIFICATION_STATUSES[session.verificationStatus];
  const orgType = ORGANIZATION_TYPES[session.organizationType];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">{session.organizationName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{orgType.icon} {orgType.name}</span>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1 text-${statusInfo.color}-600`}>
                    {session.verificationStatus === 'verified' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {statusInfo.name}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('dispatch.dashboard.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Verification pending notice */}
        {session.verificationStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-700 dark:text-amber-400">
                  {t('dispatch.dashboard.verificationPending.title')}
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                  {t('dispatch.dashboard.verificationPending.description')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rejected notice */}
        {session.verificationStatus === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-medium text-destructive">
                  {t('dispatch.dashboard.verificationRejected.title')}
                </h3>
                <p className="text-sm text-destructive/80 mt-1">
                  {t('dispatch.dashboard.verificationRejected.description')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search card */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="font-bold">{t('dispatch.dashboard.search.title')}</h2>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="searchAddress" className="sr-only">
                    {t('dispatch.dashboard.search.addressLabel')}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="searchAddress"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder={t('dispatch.dashboard.search.placeholder')}
                      className="pl-10"
                      disabled={!canMakeRequests}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!canMakeRequests || isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      {t('dispatch.dashboard.search.button')}
                    </>
                  )}
                </Button>
              </div>

              {!canMakeRequests && (
                <p className="text-sm text-muted-foreground mt-2">
                  {t('dispatch.dashboard.search.verificationRequired')}
                </p>
              )}

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((result) => (
                    <div
                      key={result.userId}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-muted">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {result.displayName || t('dispatch.dashboard.search.anonymous')}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {result.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.hasKeysShared && (
                          <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            {t('dispatch.dashboard.search.keysAvailable')}
                          </span>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleRequestAccess(result)}
                          disabled={!result.hasKeysShared}
                        >
                          {t('dispatch.dashboard.search.requestAccess')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent requests */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h2 className="font-bold">{t('dispatch.dashboard.recentRequests.title')}</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={refreshSession}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>

              {recentRequests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t('dispatch.dashboard.recentRequests.empty')}
                </p>
              ) : (
                <div className="space-y-2">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{request.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {EMERGENCY_SCENARIOS[request.emergencyScenario as EmergencyScenario]?.icon}{' '}
                          {EMERGENCY_SCENARIOS[request.emergencyScenario as EmergencyScenario]?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.status === 'approved'
                            ? 'bg-green-500/10 text-green-600'
                            : request.status === 'denied'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {request.status === 'approved' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {request.status === 'denied' && <XCircle className="w-3 h-3 inline mr-1" />}
                          {request.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                          {t(`dispatch.dashboard.status.${request.status}`)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account info panel */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="font-bold">{t('dispatch.dashboard.accountInfo.title')}</h2>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">{t('dispatch.dashboard.accountInfo.organization')}</dt>
                  <dd className="font-medium">{session.organizationName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('dispatch.dashboard.accountInfo.type')}</dt>
                  <dd className="flex items-center gap-1">
                    <span>{orgType.icon}</span>
                    <span>{orgType.name}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('dispatch.dashboard.accountInfo.status')}</dt>
                  <dd className={`flex items-center gap-1 text-${statusInfo.color}-600`}>
                    {session.verificationStatus === 'verified' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    {statusInfo.name}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quick actions */}
            <div className="p-6 rounded-lg border bg-card">
              <h2 className="font-bold mb-4">{t('dispatch.dashboard.quickActions.title')}</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Key className="w-4 h-4 mr-2" />
                  {t('dispatch.dashboard.quickActions.apiKeys')}
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <FileText className="w-4 h-4 mr-2" />
                  {t('dispatch.dashboard.quickActions.accessLogs')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Access Request Dialog */}
      <ResponsiveDialog open={accessRequestDialogOpen} onOpenChange={setAccessRequestDialogOpen}>
        <ResponsiveDialogContent className="sm:max-w-lg">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              {t('dispatch.dashboard.requestDialog.title')}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {t('dispatch.dashboard.requestDialog.description')}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              {/* Target info */}
              {selectedResident && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium">{selectedResident.displayName || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedResident.address}
                  </p>
                </div>
              )}

              {/* Emergency scenario */}
              <div className="space-y-2">
                <Label>{t('dispatch.dashboard.requestDialog.emergencyScenario')}</Label>
                <Select
                  value={requestForm.emergencyScenario}
                  onValueChange={(v) => setRequestForm(prev => ({ ...prev, emergencyScenario: v as EmergencyScenario }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('dispatch.dashboard.requestDialog.selectScenario')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EMERGENCY_SCENARIOS).map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        <span className="flex items-center gap-2">
                          <span>{scenario.icon}</span>
                          <span>{scenario.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Emergency description */}
              <div className="space-y-2">
                <Label>{t('dispatch.dashboard.requestDialog.emergencyDescription')}</Label>
                <Textarea
                  value={requestForm.emergencyDescription}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, emergencyDescription: e.target.value }))}
                  placeholder={t('dispatch.dashboard.requestDialog.descriptionPlaceholder')}
                  rows={3}
                />
              </div>

              {/* Legal basis */}
              <div className="space-y-2">
                <Label>{t('dispatch.dashboard.requestDialog.legalBasis')}</Label>
                <Select
                  value={requestForm.legalBasis}
                  onValueChange={(v) => setRequestForm(prev => ({ ...prev, legalBasis: v as DispatchLegalBasis }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('dispatch.dashboard.requestDialog.selectLegalBasis')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LEGAL_BASES).map((basis) => (
                      <SelectItem key={basis.id} value={basis.id}>
                        <div>
                          <p>{basis.name}</p>
                          <p className="text-xs text-muted-foreground">{basis.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Case number */}
              <div className="space-y-2">
                <Label>{t('dispatch.dashboard.requestDialog.caseNumber')}</Label>
                <Input
                  value={requestForm.caseNumber}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, caseNumber: e.target.value }))}
                  placeholder={t('dispatch.dashboard.requestDialog.caseNumberPlaceholder')}
                />
              </div>

              {/* Officer info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('dispatch.dashboard.requestDialog.officerName')}</Label>
                  <Input
                    value={requestForm.requestingOfficerName}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requestingOfficerName: e.target.value }))}
                    placeholder={t('dispatch.dashboard.requestDialog.officerNamePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('dispatch.dashboard.requestDialog.badgeNumber')}</Label>
                  <Input
                    value={requestForm.requestingOfficerBadge}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requestingOfficerBadge: e.target.value }))}
                    placeholder={t('dispatch.dashboard.requestDialog.badgePlaceholder')}
                  />
                </div>
              </div>

              {/* Legal warning */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {t('dispatch.dashboard.requestDialog.legalWarning')}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          <ResponsiveDialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAccessRequestDialogOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button
              onClick={handleSubmitAccessRequest}
              disabled={isSubmittingRequest || !requestForm.emergencyScenario || !requestForm.legalBasis}
            >
              {isSubmittingRequest ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('dispatch.dashboard.requestDialog.submitting')}
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  {t('dispatch.dashboard.requestDialog.submit')}
                </>
              )}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
}
