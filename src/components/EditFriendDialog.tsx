import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import { Friend, ContactMethod, CONTACT_METHODS } from '@/types/friend';

interface EditFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: Friend;
  onSave: (id: string, updates: Partial<Friend>) => void;
}

export function EditFriendDialog({ open, onOpenChange, friend, onSave }: EditFriendDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(friend.name);
  const [email, setEmail] = useState(friend.email || '');
  const [phone, setPhone] = useState(friend.phone || '');
  const [preferredContact, setPreferredContact] = useState<ContactMethod | ''>(friend.preferredContact || '');
  const [notes, setNotes] = useState(friend.notes || '');

  // Reset form when friend changes
  useEffect(() => {
    setName(friend.name);
    setEmail(friend.email || '');
    setPhone(friend.phone || '');
    setPreferredContact(friend.preferredContact || '');
    setNotes(friend.notes || '');
  }, [friend]);

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave(friend.id, {
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      preferredContact: preferredContact || undefined,
      notes: notes.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{t('editFriend.title')}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {t('editFriend.description', { name: friend.name })}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('labels.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('editFriend.namePlaceholder')}
              className="text-base" // Prevent iOS zoom
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('labels.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('editFriend.emailPlaceholder')}
              className="text-base" // Prevent iOS zoom
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('labels.phone')}</Label>
            <PhoneInput
              id="phone"
              value={phone}
              onChange={(e164) => setPhone(e164 || '')}
            />
          </div>

          {phone && (
            <div className="space-y-2">
              <Label htmlFor="preferredContact">{t('editFriend.preferredContactMethod')}</Label>
              <Select
                value={preferredContact}
                onValueChange={(val) => setPreferredContact(val as ContactMethod)}
              >
                <SelectTrigger className="h-11"> {/* Touch-friendly height */}
                  <SelectValue placeholder={t('editFriend.selectContactMethod')} />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(CONTACT_METHODS) as [ContactMethod, typeof CONTACT_METHODS[ContactMethod]][]).map(([key, method]) => (
                    <SelectItem key={key} value={key} className="h-11"> {/* Touch-friendly height */}
                      {method.icon} {t(`contact.methods.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">{t('labels.notes')}</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('editFriend.notesPlaceholder')}
              className="text-base" // Prevent iOS zoom
            />
          </div>
        </div>

        <ResponsiveDialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-11">
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} className="h-11">
            {t('editFriend.saveChanges')}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
