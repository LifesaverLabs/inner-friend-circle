/**
 * DispatchRegistrationWizard
 *
 * Multi-step wizard for emergency dispatch organizations to register for
 * Door Key Tree access. Steps:
 * 1. Organization Info (name, type, jurisdictions)
 * 2. Legal Accountability (tax ID, insurance, registered agent)
 * 3. Primary Contact (name, email, phone)
 * 4. Account Setup (password, terms acceptance)
 * 5. Review & Submit
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Shield,
  User,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Plus,
  X,
} from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  DispatchOrganizationType,
  DispatchRegistrationFormData,
  ORGANIZATION_TYPES,
} from '@/types/dispatch';
import { supabase } from '@/integrations/supabase/client';

type WizardStep = 'organization' | 'legal' | 'contact' | 'account' | 'review';

const STEPS: WizardStep[] = ['organization', 'legal', 'contact', 'account', 'review'];

// Validation schemas
const organizationSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationType: z.enum(['police', 'fire', 'ems', 'combined', 'private_ems', 'hospital', 'crisis_center']),
  jurisdictions: z.array(z.string()).min(1, 'At least one jurisdiction is required'),
});

const legalSchema = z.object({
  taxId: z.string().min(9, 'Valid tax ID required'),
  insuranceCarrier: z.string().min(2, 'Insurance carrier required'),
  insurancePolicyNumber: z.string().min(1, 'Policy number required'),
  registeredAgentName: z.string().min(2, 'Registered agent name required'),
  registeredAgentContact: z.string().min(5, 'Registered agent contact required'),
});

const contactSchema = z.object({
  primaryContactName: z.string().min(2, 'Contact name required'),
  primaryContactEmail: z.string().email('Valid email required'),
  primaryContactPhone: z.string().min(10, 'Valid phone required'),
});

const accountSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

interface DispatchRegistrationWizardProps {
  onSuccess?: () => void;
}

export function DispatchRegistrationWizard({ onSuccess }: DispatchRegistrationWizardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>('organization');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<DispatchRegistrationFormData>({
    organizationName: '',
    organizationType: 'police',
    organizationCode: '',
    jurisdictions: [],
    taxId: '',
    insuranceCarrier: '',
    insurancePolicyNumber: '',
    registeredAgentName: '',
    registeredAgentContact: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    dispatchCenterPhone: '',
    dispatchCenterAddress: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  // Jurisdiction input
  const [newJurisdiction, setNewJurisdiction] = useState('');

  const updateFormData = <K extends keyof DispatchRegistrationFormData>(
    field: K,
    value: DispatchRegistrationFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addJurisdiction = () => {
    if (newJurisdiction.trim() && !formData.jurisdictions.includes(newJurisdiction.trim())) {
      updateFormData('jurisdictions', [...formData.jurisdictions, newJurisdiction.trim()]);
      setNewJurisdiction('');
    }
  };

  const removeJurisdiction = (jurisdiction: string) => {
    updateFormData('jurisdictions', formData.jurisdictions.filter(j => j !== jurisdiction));
  };

  const validateStep = (): boolean => {
    let result;
    let newErrors: Record<string, string> = {};

    switch (step) {
      case 'organization':
        result = organizationSchema.safeParse(formData);
        break;
      case 'legal':
        result = legalSchema.safeParse(formData);
        break;
      case 'contact':
        result = contactSchema.safeParse(formData);
        break;
      case 'account':
        result = accountSchema.safeParse(formData);
        break;
      default:
        return true;
    }

    if (!result.success) {
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    const currentIndex = STEPS.indexOf(step);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);

    try {
      // Hash password on client (in production, this should be done server-side)
      // For now, we'll send the plain password and let Supabase edge function handle it
      const { error } = await supabase
        .from('emergency_dispatch_accounts')
        .insert({
          organization_name: formData.organizationName,
          organization_type: formData.organizationType,
          organization_code: formData.organizationCode || null,
          jurisdictions: formData.jurisdictions,
          tax_id: formData.taxId,
          insurance_carrier: formData.insuranceCarrier,
          insurance_policy_number: formData.insurancePolicyNumber,
          registered_agent_name: formData.registeredAgentName,
          registered_agent_contact: formData.registeredAgentContact,
          primary_contact_name: formData.primaryContactName,
          primary_contact_email: formData.primaryContactEmail,
          primary_contact_phone: formData.primaryContactPhone,
          dispatch_center_phone: formData.dispatchCenterPhone || null,
          dispatch_center_address: formData.dispatchCenterAddress || null,
          // Note: In production, password should be hashed server-side
          password_hash: await hashPassword(formData.password),
        });

      if (error) {
        if (error.message.includes('unique constraint') || error.message.includes('already exists')) {
          toast.error(t('dispatch.registration.errors.emailExists'));
        } else {
          throw error;
        }
        return;
      }

      toast.success(t('dispatch.registration.success'));
      onSuccess?.();
      navigate('/dispatch/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(t('dispatch.registration.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple password hashing (in production, use bcrypt on server)
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const getStepIcon = (s: WizardStep) => {
    switch (s) {
      case 'organization': return <Building2 className="w-5 h-5" />;
      case 'legal': return <FileText className="w-5 h-5" />;
      case 'contact': return <User className="w-5 h-5" />;
      case 'account': return <Lock className="w-5 h-5" />;
      case 'review': return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'organization': return t('dispatch.registration.steps.organization.title');
      case 'legal': return t('dispatch.registration.steps.legal.title');
      case 'contact': return t('dispatch.registration.steps.contact.title');
      case 'account': return t('dispatch.registration.steps.account.title');
      case 'review': return t('dispatch.registration.steps.review.title');
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'organization': return t('dispatch.registration.steps.organization.description');
      case 'legal': return t('dispatch.registration.steps.legal.description');
      case 'contact': return t('dispatch.registration.steps.contact.description');
      case 'account': return t('dispatch.registration.steps.account.description');
      case 'review': return t('dispatch.registration.steps.review.description');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => {
          const isActive = STEPS.indexOf(step) >= i;
          const isCurrent = step === s;
          return (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {getStepIcon(s)}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-1 w-12 sm:w-20 transition-colors ${
                    STEPS.indexOf(step) > i ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">{getStepTitle()}</h2>
        <p className="text-muted-foreground text-sm mt-1">{getStepDescription()}</p>
      </div>

      {/* Step content */}
      <ScrollArea className="max-h-[60vh]">
        <AnimatePresence mode="wait">
          {/* Step 1: Organization Info */}
          {step === 'organization' && (
            <motion.div
              key="organization"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 px-1"
            >
              <div className="space-y-2">
                <Label htmlFor="orgName">{t('dispatch.registration.fields.organizationName')}</Label>
                <Input
                  id="orgName"
                  value={formData.organizationName}
                  onChange={(e) => updateFormData('organizationName', e.target.value)}
                  placeholder={t('dispatch.registration.placeholders.organizationName')}
                  className={errors.organizationName ? 'border-destructive' : ''}
                />
                {errors.organizationName && (
                  <p className="text-sm text-destructive">{errors.organizationName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgType">{t('dispatch.registration.fields.organizationType')}</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={(value) => updateFormData('organizationType', value as DispatchOrganizationType)}
                >
                  <SelectTrigger className={errors.organizationType ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ORGANIZATION_TYPES).map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgCode">{t('dispatch.registration.fields.organizationCode')}</Label>
                <Input
                  id="orgCode"
                  value={formData.organizationCode || ''}
                  onChange={(e) => updateFormData('organizationCode', e.target.value)}
                  placeholder={t('dispatch.registration.placeholders.organizationCode')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('dispatch.registration.hints.organizationCode')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t('dispatch.registration.fields.jurisdictions')}</Label>
                <div className="flex gap-2">
                  <Input
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.jurisdiction')}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addJurisdiction())}
                  />
                  <Button type="button" variant="outline" onClick={addJurisdiction}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.jurisdictions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.jurisdictions.map((j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm"
                      >
                        <MapPin className="w-3 h-3" />
                        {j}
                        <button
                          type="button"
                          onClick={() => removeJurisdiction(j)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.jurisdictions && (
                  <p className="text-sm text-destructive">{errors.jurisdictions}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Legal Accountability */}
          {step === 'legal' && (
            <motion.div
              key="legal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 px-1"
            >
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    {t('dispatch.registration.legalNotice')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">{t('dispatch.registration.fields.taxId')}</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => updateFormData('taxId', e.target.value)}
                  placeholder={t('dispatch.registration.placeholders.taxId')}
                  className={errors.taxId ? 'border-destructive' : ''}
                />
                {errors.taxId && <p className="text-sm text-destructive">{errors.taxId}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCarrier">{t('dispatch.registration.fields.insuranceCarrier')}</Label>
                  <Input
                    id="insuranceCarrier"
                    value={formData.insuranceCarrier}
                    onChange={(e) => updateFormData('insuranceCarrier', e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.insuranceCarrier')}
                    className={errors.insuranceCarrier ? 'border-destructive' : ''}
                  />
                  {errors.insuranceCarrier && (
                    <p className="text-sm text-destructive">{errors.insuranceCarrier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="policyNumber">{t('dispatch.registration.fields.policyNumber')}</Label>
                  <Input
                    id="policyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => updateFormData('insurancePolicyNumber', e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.policyNumber')}
                    className={errors.insurancePolicyNumber ? 'border-destructive' : ''}
                  />
                  {errors.insurancePolicyNumber && (
                    <p className="text-sm text-destructive">{errors.insurancePolicyNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agentName">{t('dispatch.registration.fields.registeredAgentName')}</Label>
                <Input
                  id="agentName"
                  value={formData.registeredAgentName}
                  onChange={(e) => updateFormData('registeredAgentName', e.target.value)}
                  placeholder={t('dispatch.registration.placeholders.registeredAgentName')}
                  className={errors.registeredAgentName ? 'border-destructive' : ''}
                />
                {errors.registeredAgentName && (
                  <p className="text-sm text-destructive">{errors.registeredAgentName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agentContact">{t('dispatch.registration.fields.registeredAgentContact')}</Label>
                <Input
                  id="agentContact"
                  value={formData.registeredAgentContact}
                  onChange={(e) => updateFormData('registeredAgentContact', e.target.value)}
                  placeholder={t('dispatch.registration.placeholders.registeredAgentContact')}
                  className={errors.registeredAgentContact ? 'border-destructive' : ''}
                />
                {errors.registeredAgentContact && (
                  <p className="text-sm text-destructive">{errors.registeredAgentContact}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Primary Contact */}
          {step === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 px-1"
            >
              <div className="space-y-2">
                <Label htmlFor="contactName">{t('dispatch.registration.fields.primaryContactName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contactName"
                    value={formData.primaryContactName}
                    onChange={(e) => updateFormData('primaryContactName', e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.primaryContactName')}
                    className={`pl-10 ${errors.primaryContactName ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.primaryContactName && (
                  <p className="text-sm text-destructive">{errors.primaryContactName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">{t('dispatch.registration.fields.primaryContactEmail')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.primaryContactEmail}
                    onChange={(e) => updateFormData('primaryContactEmail', e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.primaryContactEmail')}
                    className={`pl-10 ${errors.primaryContactEmail ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.primaryContactEmail && (
                  <p className="text-sm text-destructive">{errors.primaryContactEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">{t('dispatch.registration.fields.primaryContactPhone')}</Label>
                <PhoneInput
                  id="contactPhone"
                  value={formData.primaryContactPhone}
                  onChange={(e164) => updateFormData('primaryContactPhone', e164 || '')}
                />
                {errors.primaryContactPhone && (
                  <p className="text-sm text-destructive">{errors.primaryContactPhone}</p>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">{t('dispatch.registration.optionalFields')}</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dispatchPhone">{t('dispatch.registration.fields.dispatchCenterPhone')}</Label>
                    <PhoneInput
                      id="dispatchPhone"
                      value={formData.dispatchCenterPhone || ''}
                      onChange={(e164) => updateFormData('dispatchCenterPhone', e164 || '')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispatchAddress">{t('dispatch.registration.fields.dispatchCenterAddress')}</Label>
                    <Input
                      id="dispatchAddress"
                      value={formData.dispatchCenterAddress || ''}
                      onChange={(e) => updateFormData('dispatchCenterAddress', e.target.value)}
                      placeholder={t('dispatch.registration.placeholders.dispatchCenterAddress')}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Account Setup */}
          {step === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 px-1"
            >
              <div className="space-y-2">
                <Label htmlFor="password">{t('dispatch.registration.fields.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.password')}
                    className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                    minLength={8}
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                <p className="text-xs text-muted-foreground">
                  {t('dispatch.registration.hints.password')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('dispatch.registration.fields.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder={t('dispatch.registration.placeholders.confirmPassword')}
                    className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked) => updateFormData('acceptedTerms', !!checked)}
                    className={errors.acceptedTerms ? 'border-destructive' : ''}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer leading-relaxed">
                      {t('dispatch.registration.terms.agree')}{' '}
                      <a href="/dispatch/terms" className="text-primary hover:underline" target="_blank">
                        {t('dispatch.registration.terms.termsOfService')}
                      </a>{' '}
                      {t('dispatch.registration.terms.and')}{' '}
                      <a href="/dispatch/privacy" className="text-primary hover:underline" target="_blank">
                        {t('dispatch.registration.terms.privacyPolicy')}
                      </a>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('dispatch.registration.terms.dataProcessing')}
                    </p>
                  </div>
                </div>
                {errors.acceptedTerms && (
                  <p className="text-sm text-destructive mt-2">{errors.acceptedTerms}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 px-1"
            >
              {/* Organization summary */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="font-medium">{t('dispatch.registration.review.organization')}</span>
                </div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.organizationName')}:</dt>
                    <dd className="font-medium">{formData.organizationName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.organizationType')}:</dt>
                    <dd className="flex items-center gap-1">
                      <span>{ORGANIZATION_TYPES[formData.organizationType].icon}</span>
                      <span>{ORGANIZATION_TYPES[formData.organizationType].name}</span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.jurisdictions')}:</dt>
                    <dd>{formData.jurisdictions.join(', ')}</dd>
                  </div>
                </dl>
              </div>

              {/* Legal summary */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium">{t('dispatch.registration.review.legal')}</span>
                </div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.taxId')}:</dt>
                    <dd className="font-medium">{formData.taxId}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.insuranceCarrier')}:</dt>
                    <dd>{formData.insuranceCarrier}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.registeredAgentName')}:</dt>
                    <dd>{formData.registeredAgentName}</dd>
                  </div>
                </dl>
              </div>

              {/* Contact summary */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">{t('dispatch.registration.review.contact')}</span>
                </div>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.primaryContactName')}:</dt>
                    <dd className="font-medium">{formData.primaryContactName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.primaryContactEmail')}:</dt>
                    <dd>{formData.primaryContactEmail}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('dispatch.registration.fields.primaryContactPhone')}:</dt>
                    <dd>{formData.primaryContactPhone}</dd>
                  </div>
                </dl>
              </div>

              {/* Verification notice */}
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-700 dark:text-blue-400">
                      {t('dispatch.registration.review.verificationTitle')}
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 mt-1">
                      {t('dispatch.registration.review.verificationDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 'organization' || isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('actions.back')}
        </Button>

        {step !== 'review' ? (
          <Button type="button" onClick={handleNext}>
            {t('actions.next')}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('dispatch.registration.submitting')}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {t('dispatch.registration.submit')}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
