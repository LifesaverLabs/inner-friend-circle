import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CountryCode } from 'libphonenumber-js';
import {
  COUNTRY_OPTIONS,
  detectUserCountry,
  formatAsYouType,
  parsePhone,
  getCountryFlag,
  getExamplePhone,
  getDialCode,
} from '@/lib/phoneUtils';

interface PhoneInputProps {
  value?: string;
  onChange?: (e164Phone: string | undefined, displayPhone: string) => void;
  onBlur?: () => void;
  defaultCountry?: CountryCode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  error?: string;
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  defaultCountry,
  placeholder,
  disabled,
  className,
  id,
  name,
  required,
  error,
}: PhoneInputProps) {
  // Detect user's country on mount
  const detectedCountry = useMemo(() => defaultCountry || detectUserCountry(), [defaultCountry]);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(detectedCountry);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Initialize input value from prop
  useEffect(() => {
    if (value) {
      const parsed = parsePhone(value, selectedCountry);
      if (parsed.national) {
        setInputValue(parsed.national);
      } else {
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  }, [value, selectedCountry]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Format as user types
    const formatted = formatAsYouType(raw, selectedCountry);
    setInputValue(formatted);

    // Parse and notify parent with E.164 format
    const parsed = parsePhone(formatted, selectedCountry);
    onChange?.(parsed.e164 || undefined, formatted);
  }, [selectedCountry, onChange]);

  const handleCountryChange = useCallback((country: CountryCode) => {
    setSelectedCountry(country);
    setOpen(false);

    // Re-parse current input with new country
    if (inputValue) {
      const parsed = parsePhone(inputValue, country);
      onChange?.(parsed.e164 || undefined, inputValue);
    }
  }, [inputValue, onChange]);

  const examplePlaceholder = placeholder || getExamplePhone(selectedCountry);
  const currentCountryInfo = COUNTRY_OPTIONS.find(c => c.code === selectedCountry);

  return (
    <div className={cn('flex gap-1', className)}>
      {/* Country selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select country"
            disabled={disabled}
            className="w-[85px] justify-between px-2 shrink-0"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-base leading-none">{getCountryFlag(selectedCountry)}</span>
              <span className="text-xs text-muted-foreground">{getDialCode(selectedCountry)}</span>
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRY_OPTIONS.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.code} ${country.dialCode}`}
                    onSelect={() => handleCountryChange(country.code)}
                    className="flex items-center gap-2"
                  >
                    <span className="text-base">{getCountryFlag(country.code)}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-xs text-muted-foreground">{country.dialCode}</span>
                    {country.code === selectedCountry && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Phone input */}
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={examplePlaceholder}
        disabled={disabled}
        required={required}
        className={cn(
          'flex-1',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
      />
    </div>
  );
}

/**
 * Simplified phone display component
 * Shows phone in user's locale format with country flag
 */
interface PhoneDisplayProps {
  phone: string;
  viewerCountry?: CountryCode;
  className?: string;
  showFlag?: boolean;
}

export function PhoneDisplay({
  phone,
  viewerCountry,
  className,
  showFlag = true,
}: PhoneDisplayProps) {
  const country = viewerCountry || detectUserCountry();
  const parsed = parsePhone(phone, country);

  if (!parsed.isValid && !parsed.national) {
    // Show raw phone if can't parse
    return <span className={className}>{phone}</span>;
  }

  const phoneCountry = parsed.country;
  const displayPhone = phoneCountry === country
    ? parsed.national
    : parsed.international;

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {showFlag && phoneCountry && (
        <span className="text-sm">{getCountryFlag(phoneCountry)}</span>
      )}
      <span>{displayPhone || phone}</span>
    </span>
  );
}
