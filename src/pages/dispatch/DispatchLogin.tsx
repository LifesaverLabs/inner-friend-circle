/**
 * DispatchLogin Page
 *
 * Login page for verified emergency dispatch accounts.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Mail, Lock, Loader2, Heart, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/i18n/LanguageSelector';
import { useDispatchAuth } from '@/hooks/useDispatchAuth';
import { toast } from 'sonner';

export default function DispatchLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, isAuthenticated, isLoading: authLoading, session } = useDispatchAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      navigate('/dispatch', { replace: true });
    }
  }, [isAuthenticated, session, navigate]);

  // Validation schemas
  const emailSchema = z.string().email(t('dispatch.login.validation.invalidEmail'));
  const passwordSchema = z.string().min(1, t('dispatch.login.validation.passwordRequired'));

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        toast.success(t('dispatch.login.success'));
        navigate('/dispatch', { replace: true });
      } else {
        if (result.error?.includes('suspended')) {
          toast.error(t('dispatch.login.errors.suspended'));
        } else {
          toast.error(t('dispatch.login.errors.invalidCredentials'));
        }
      }
    } catch {
      toast.error(t('dispatch.login.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
            aria-label={t('nav.back')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('nav.back')}
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Heart className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold">{t('app.name')}</span>
          </div>
        </div>
        <LanguageSelector variant="prominent" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-4 p-3 rounded-full bg-primary/10">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {t('dispatch.login.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('dispatch.login.subtitle')}
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('dispatch.login.fields.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder={t('dispatch.login.placeholders.email')}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('dispatch.login.fields.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder={t('dispatch.login.placeholders.password')}
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                  required
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('dispatch.login.submitting')}
                </>
              ) : (
                t('dispatch.login.button')
              )}
            </Button>
          </form>

          {/* Info about verification */}
          <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {t('dispatch.login.verificationNote')}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('dispatch.login.noAccount')}{' '}
              <Link to="/dispatch/register" className="text-primary hover:underline">
                {t('dispatch.login.register')}
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link to="/dispatch/forgot-password" className="text-primary hover:underline">
                {t('dispatch.login.forgotPassword')}
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
