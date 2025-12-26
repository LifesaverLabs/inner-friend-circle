import { forwardRef } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import type { Props as PhoneInputProps } from 'react-phone-number-input';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { cn } from '@/lib/utils';
import 'react-phone-number-input/style.css';

// Detect user's country from browser locale
function detectUserCountry(): CountryCode {
  const language = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
  const parts = language.split('-');
  if (parts.length >= 2) {
    const countryFromLocale = parts[1].toUpperCase();
    return countryFromLocale as CountryCode;
  }
  return 'US';
}

interface CustomPhoneInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
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

export const PhoneInput = forwardRef<HTMLInputElement, CustomPhoneInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      defaultCountry,
      placeholder = 'Phone number',
      disabled,
      className,
      id,
      name,
      error,
    },
    ref
  ) => {
    const country = defaultCountry || detectUserCountry();

    return (
      <div className={cn('phone-input-container', className)}>
        <PhoneInputWithCountry
          international
          countryCallingCodeEditable={false}
          defaultCountry={country}
          value={value || ''}
          onChange={(val) => onChange?.(val || undefined)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          id={id}
          name={name}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            error && 'border-destructive focus-within:ring-destructive',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        />
        <style>{`
          .phone-input-container .PhoneInput {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .phone-input-container .PhoneInputCountry {
            display: flex;
            align-items: center;
            padding-left: 0.75rem;
          }
          .phone-input-container .PhoneInputCountryIcon {
            width: 1.5rem;
            height: 1rem;
            border-radius: 2px;
            overflow: hidden;
          }
          .phone-input-container .PhoneInputCountryIcon--border {
            box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
          }
          .phone-input-container .PhoneInputCountrySelectArrow {
            margin-left: 0.25rem;
            width: 0.35rem;
            height: 0.35rem;
            border-style: solid;
            border-color: currentColor;
            border-width: 0 1px 1px 0;
            transform: rotate(45deg);
            opacity: 0.5;
          }
          .phone-input-container .PhoneInputCountrySelect {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
            border: 0;
            opacity: 0;
            cursor: pointer;
          }
          .phone-input-container .PhoneInputInput {
            flex: 1;
            min-width: 0;
            height: 100%;
            padding: 0.5rem 0.75rem;
            padding-left: 0;
            background: transparent;
            border: none;
            outline: none;
            font-size: inherit;
            font-family: inherit;
          }
          .phone-input-container .PhoneInputInput::placeholder {
            color: hsl(var(--muted-foreground));
          }
        `}</style>
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

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

  try {
    const parsed = parsePhoneNumberFromString(phone);
    if (!parsed) {
      return <span className={className}>{phone}</span>;
    }

    const phoneCountry = parsed.country;
    const displayPhone = phoneCountry === country
      ? parsed.formatNational()
      : parsed.formatInternational();

    // Get country flag emoji
    const getCountryFlag = (code: CountryCode): string => {
      const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    };

    return (
      <span className={cn('inline-flex items-center gap-1', className)}>
        {showFlag && phoneCountry && (
          <span className="text-sm">{getCountryFlag(phoneCountry)}</span>
        )}
        <span>{displayPhone || phone}</span>
      </span>
    );
  } catch {
    return <span className={className}>{phone}</span>;
  }
}
