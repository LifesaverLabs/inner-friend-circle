import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Update contact information for {friend.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Friend's name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput
              id="phone"
              value={phone}
              onChange={(e164) => setPhone(e164 || '')}
            />
          </div>

          {phone && (
            <div className="space-y-2">
              <Label htmlFor="preferredContact">Preferred Contact Method</Label>
              <Select 
                value={preferredContact} 
                onValueChange={(val) => setPreferredContact(val as ContactMethod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose how to reach them" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(CONTACT_METHODS) as [ContactMethod, typeof CONTACT_METHODS[ContactMethod]][]).map(([key, method]) => (
                    <SelectItem key={key} value={key}>
                      {method.icon} {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this person..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
