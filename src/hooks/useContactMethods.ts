import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { ContactMethod, ServiceType } from '@/types/contactMethod';
import { toast } from 'sonner';

export function useContactMethods(userId?: string) {
  const { t } = useTranslation();
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContactMethods = useCallback(async () => {
    if (!userId) {
      setContactMethods([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contact_methods')
        .select('*')
        .eq('user_id', userId)
        .order('spontaneous_priority', { ascending: true });

      if (error) throw error;
      
      // Map database fields to our interface
      setContactMethods((data || []).map(d => ({
        ...d,
        service_type: d.service_type as ServiceType,
      })));
    } catch (error) {
      console.error('Error fetching contact methods:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchContactMethods();
  }, [fetchContactMethods]);

  const addContactMethod = async (
    serviceType: ServiceType,
    contactIdentifier: string,
    options: {
      forSpontaneous?: boolean;
      forScheduled?: boolean;
      label?: string;
    } = {}
  ) => {
    if (!userId) {
      toast.error(t('contactMethods.toasts.signInRequired'));
      return null;
    }

    const { forSpontaneous = true, forScheduled = true, label } = options;

    // Calculate next priority
    const spontaneousPriority = contactMethods.filter(m => m.for_spontaneous).length;
    const scheduledPriority = contactMethods.filter(m => m.for_scheduled).length;

    try {
      const { data, error } = await supabase
        .from('contact_methods')
        .insert({
          user_id: userId,
          service_type: serviceType,
          contact_identifier: contactIdentifier,
          for_spontaneous: forSpontaneous,
          for_scheduled: forScheduled,
          spontaneous_priority: forSpontaneous ? spontaneousPriority : 0,
          scheduled_priority: forScheduled ? scheduledPriority : 0,
          label,
        })
        .select()
        .single();

      if (error) throw error;

      const newMethod = { ...data, service_type: data.service_type as ServiceType };
      setContactMethods(prev => [...prev, newMethod]);
      toast.success(t('contactMethods.toasts.added'));
      return newMethod;
    } catch (error: any) {
      console.error('Error adding contact method:', error);
      toast.error(error.message || t('contactMethods.toasts.addFailed'));
      return null;
    }
  };

  const updateContactMethod = async (id: string, updates: Partial<ContactMethod>) => {
    try {
      const { error } = await supabase
        .from('contact_methods')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setContactMethods(prev =>
        prev.map(m => (m.id === id ? { ...m, ...updates } : m))
      );
      return true;
    } catch (error: any) {
      console.error('Error updating contact method:', error);
      toast.error(error.message || t('contactMethods.toasts.updateFailed'));
      return false;
    }
  };

  const removeContactMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContactMethods(prev => prev.filter(m => m.id !== id));
      toast.success(t('contactMethods.toasts.removed'));
      return true;
    } catch (error: any) {
      console.error('Error removing contact method:', error);
      toast.error(error.message || t('contactMethods.toasts.removeFailed'));
      return false;
    }
  };

  const reorderPriorities = async (
    orderedIds: string[],
    callType: 'spontaneous' | 'scheduled'
  ) => {
    const priorityField = callType === 'spontaneous' ? 'spontaneous_priority' : 'scheduled_priority';
    
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        [priorityField]: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('contact_methods')
          .update({ [priorityField]: update[priorityField] })
          .eq('id', update.id);
        if (error) throw error;
      }

      setContactMethods(prev =>
        prev.map(m => {
          const newIndex = orderedIds.indexOf(m.id);
          if (newIndex !== -1) {
            return { ...m, [priorityField]: newIndex };
          }
          return m;
        })
      );
      return true;
    } catch (error: any) {
      console.error('Error reordering priorities:', error);
      toast.error(t('contactMethods.toasts.reorderFailed'));
      return false;
    }
  };

  const getSpontaneousMethods = () =>
    contactMethods
      .filter(m => m.for_spontaneous)
      .sort((a, b) => a.spontaneous_priority - b.spontaneous_priority);

  const getScheduledMethods = () =>
    contactMethods
      .filter(m => m.for_scheduled)
      .sort((a, b) => a.scheduled_priority - b.scheduled_priority);

  return {
    contactMethods,
    isLoading,
    addContactMethod,
    updateContactMethod,
    removeContactMethod,
    reorderPriorities,
    getSpontaneousMethods,
    getScheduledMethods,
    refetch: fetchContactMethods,
  };
}

// Hook for fetching another user's contact methods (read-only)
export function useUserContactMethods(userId?: string) {
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!userId) {
        setContactMethods([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contact_methods')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setContactMethods((data || []).map(d => ({
          ...d,
          service_type: d.service_type as ServiceType,
        })));
      } catch (error) {
        console.error('Error fetching user contact methods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, [userId]);

  const getSpontaneousMethods = () =>
    contactMethods
      .filter(m => m.for_spontaneous)
      .sort((a, b) => a.spontaneous_priority - b.spontaneous_priority);

  const getScheduledMethods = () =>
    contactMethods
      .filter(m => m.for_scheduled)
      .sort((a, b) => a.scheduled_priority - b.scheduled_priority);

  return {
    contactMethods,
    isLoading,
    getSpontaneousMethods,
    getScheduledMethods,
  };
}
