/**
 * AdminDispatchPanel Page
 *
 * Admin panel for verifying, rejecting, or suspending dispatch accounts.
 * Accessible only to users with dispatch_verifier or super_admin roles.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  RefreshCw,
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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  EmergencyDispatchAccountRow,
  ORGANIZATION_TYPES,
  VERIFICATION_STATUSES,
  DispatchVerificationStatus,
} from '@/types/dispatch';
import { toast } from 'sonner';

export default function AdminDispatchPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<EmergencyDispatchAccountRow[]>([]);
  const [filter, setFilter] = useState<DispatchVerificationStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedAccount, setSelectedAccount] = useState<EmergencyDispatchAccountRow | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'verify' | 'reject' | 'suspend'>('verify');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check admin access
  useEffect(() => {
    async function checkAdminAccess() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(data.role === 'super_admin' || data.role === 'dispatch_verifier');
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      checkAdminAccess();
    }
  }, [user, authLoading]);

  // Fetch accounts
  useEffect(() => {
    if (isAdmin) {
      fetchAccounts();
    }
  }, [isAdmin, filter]);

  const fetchAccounts = async () => {
    try {
      let query = supabase
        .from('emergency_dispatch_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('verification_status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error(t('admin.dispatch.errors.fetchFailed'));
    }
  };

  const handleViewDetails = (account: EmergencyDispatchAccountRow) => {
    setSelectedAccount(account);
    setDetailDialogOpen(true);
  };

  const handleAction = (account: EmergencyDispatchAccountRow, action: 'verify' | 'reject' | 'suspend') => {
    setSelectedAccount(account);
    setActionType(action);
    setRejectionReason('');
    setActionDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAccount || !user) return;

    setIsSubmitting(true);

    try {
      const updates: Partial<EmergencyDispatchAccountRow> = {
        updated_at: new Date().toISOString(),
      };

      switch (actionType) {
        case 'verify':
          updates.verification_status = 'verified';
          updates.verified_at = new Date().toISOString();
          updates.verified_by = user.id;
          break;
        case 'reject':
          updates.verification_status = 'rejected';
          updates.rejection_reason = rejectionReason;
          break;
        case 'suspend':
          updates.verification_status = 'suspended';
          updates.suspended_at = new Date().toISOString();
          updates.suspended_by = user.id;
          updates.suspended_reason = rejectionReason;
          updates.is_active = false;
          break;
      }

      const { error } = await supabase
        .from('emergency_dispatch_accounts')
        .update(updates)
        .eq('id', selectedAccount.id);

      if (error) throw error;

      toast.success(t(`admin.dispatch.success.${actionType}`));
      setActionDialogOpen(false);
      setDetailDialogOpen(false);
      fetchAccounts();
    } catch (error) {
      console.error('Action error:', error);
      toast.error(t('admin.dispatch.errors.actionFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered accounts
  const filteredAccounts = accounts.filter(account => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      account.organization_name.toLowerCase().includes(query) ||
      account.primary_contact_email.toLowerCase().includes(query) ||
      account.primary_contact_name.toLowerCase().includes(query)
    );
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/auth', { replace: true });
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold mb-2">{t('admin.dispatch.accessDenied.title')}</h1>
          <p className="text-muted-foreground mb-4">
            {t('admin.dispatch.accessDenied.description')}
          </p>
          <Button onClick={() => navigate('/')}>
            {t('nav.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('nav.back')}
              </Button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="font-bold text-lg">{t('admin.dispatch.title')}</h1>
              </div>
            </div>
            <Button variant="outline" onClick={fetchAccounts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('actions.refresh')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['pending', 'verified', 'rejected', 'suspended'] as const).map((status) => {
            const count = accounts.filter(a => a.verification_status === status).length;
            const statusInfo = VERIFICATION_STATUSES[status];
            return (
              <motion.button
                key={status}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(status)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  filter === status
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-${statusInfo.color}-600`}>
                    {status === 'verified' && <CheckCircle2 className="w-5 h-5" />}
                    {status === 'pending' && <Clock className="w-5 h-5" />}
                    {status === 'rejected' && <XCircle className="w-5 h-5" />}
                    {status === 'suspended' && <AlertTriangle className="w-5 h-5" />}
                  </span>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm text-muted-foreground">{statusInfo.name}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.dispatch.searchPlaceholder')}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as DispatchVerificationStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.dispatch.filters.all')}</SelectItem>
              {Object.entries(VERIFICATION_STATUSES).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accounts list */}
        <div className="border rounded-lg overflow-hidden">
          {filteredAccounts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('admin.dispatch.noAccounts')}
            </div>
          ) : (
            <div className="divide-y">
              {filteredAccounts.map((account) => {
                const orgType = ORGANIZATION_TYPES[account.organization_type];
                const status = VERIFICATION_STATUSES[account.verification_status];
                return (
                  <div
                    key={account.id}
                    className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{account.organization_name}</h3>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {orgType.icon} {orgType.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {account.primary_contact_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {account.primary_contact_phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full bg-${status.color}-500/10 text-${status.color}-600 flex items-center gap-1`}>
                        {account.verification_status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                        {account.verification_status === 'pending' && <Clock className="w-3 h-3" />}
                        {account.verification_status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {account.verification_status === 'suspended' && <AlertTriangle className="w-3 h-3" />}
                        {status.name}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(account)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {account.verification_status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700 hover:bg-green-500/10"
                              onClick={() => handleAction(account, 'verify')}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-500/10"
                              onClick={() => handleAction(account, 'reject')}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {account.verification_status === 'verified' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                            onClick={() => handleAction(account, 'suspend')}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Detail Dialog */}
      <ResponsiveDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <ResponsiveDialogContent className="sm:max-w-2xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {selectedAccount?.organization_name}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {t('admin.dispatch.detail.description')}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          {selectedAccount && (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Organization info */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {t('admin.dispatch.detail.organization')}
                  </h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.name')}</dt>
                      <dd className="font-medium">{selectedAccount.organization_name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.type')}</dt>
                      <dd className="font-medium">
                        {ORGANIZATION_TYPES[selectedAccount.organization_type].icon}{' '}
                        {ORGANIZATION_TYPES[selectedAccount.organization_type].name}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.jurisdictions')}</dt>
                      <dd className="font-medium">{selectedAccount.jurisdictions.join(', ')}</dd>
                    </div>
                  </dl>
                </div>

                {/* Legal info */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t('admin.dispatch.detail.legal')}
                  </h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.taxId')}</dt>
                      <dd className="font-medium">{selectedAccount.tax_id}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.insurance')}</dt>
                      <dd className="font-medium">{selectedAccount.insurance_carrier}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.policyNumber')}</dt>
                      <dd className="font-medium">{selectedAccount.insurance_policy_number}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.registeredAgent')}</dt>
                      <dd className="font-medium">{selectedAccount.registered_agent_name}</dd>
                    </div>
                  </dl>
                </div>

                {/* Contact info */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('admin.dispatch.detail.contact')}
                  </h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.contactName')}</dt>
                      <dd className="font-medium">{selectedAccount.primary_contact_name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.contactEmail')}</dt>
                      <dd className="font-medium">{selectedAccount.primary_contact_email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.contactPhone')}</dt>
                      <dd className="font-medium">{selectedAccount.primary_contact_phone}</dd>
                    </div>
                  </dl>
                </div>

                {/* Status */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {t('admin.dispatch.detail.status')}
                  </h3>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.verificationStatus')}</dt>
                      <dd className="font-medium">
                        {VERIFICATION_STATUSES[selectedAccount.verification_status].name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">{t('admin.dispatch.detail.createdAt')}</dt>
                      <dd className="font-medium">
                        {new Date(selectedAccount.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                    {selectedAccount.rejection_reason && (
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">{t('admin.dispatch.detail.rejectionReason')}</dt>
                        <dd className="font-medium text-destructive">{selectedAccount.rejection_reason}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </ScrollArea>
          )}

          <ResponsiveDialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              {t('actions.close')}
            </Button>
            {selectedAccount?.verification_status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(selectedAccount, 'reject')}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('admin.dispatch.actions.reject')}
                </Button>
                <Button onClick={() => handleAction(selectedAccount, 'verify')}>
                  <Check className="w-4 h-4 mr-2" />
                  {t('admin.dispatch.actions.verify')}
                </Button>
              </>
            )}
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      {/* Action Confirmation Dialog */}
      <ResponsiveDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <ResponsiveDialogContent className="sm:max-w-md">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {actionType === 'verify' && t('admin.dispatch.confirm.verifyTitle')}
              {actionType === 'reject' && t('admin.dispatch.confirm.rejectTitle')}
              {actionType === 'suspend' && t('admin.dispatch.confirm.suspendTitle')}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {actionType === 'verify' && t('admin.dispatch.confirm.verifyDescription')}
              {actionType === 'reject' && t('admin.dispatch.confirm.rejectDescription')}
              {actionType === 'suspend' && t('admin.dispatch.confirm.suspendDescription')}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          {(actionType === 'reject' || actionType === 'suspend') && (
            <div className="space-y-2 my-4">
              <Label>{t('admin.dispatch.confirm.reason')}</Label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t('admin.dispatch.confirm.reasonPlaceholder')}
                rows={3}
              />
            </div>
          )}

          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isSubmitting || ((actionType === 'reject' || actionType === 'suspend') && !rejectionReason.trim())}
              className={actionType === 'verify' ? '' : 'bg-destructive hover:bg-destructive/90'}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('admin.dispatch.confirm.processing')}
                </>
              ) : (
                <>
                  {actionType === 'verify' && <Check className="w-4 h-4 mr-2" />}
                  {actionType === 'reject' && <X className="w-4 h-4 mr-2" />}
                  {actionType === 'suspend' && <AlertTriangle className="w-4 h-4 mr-2" />}
                  {t(`admin.dispatch.actions.${actionType}`)}
                </>
              )}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
}
