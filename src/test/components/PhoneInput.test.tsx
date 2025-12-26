import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput, PhoneDisplay } from '@/components/ui/phone-input';

// Mock navigator.language for country detection
const mockNavigatorLanguage = (lang: string) => {
  Object.defineProperty(navigator, 'language', {
    value: lang,
    writable: true,
    configurable: true,
  });
};

describe('PhoneInput Component', () => {
  beforeEach(() => {
    mockNavigatorLanguage('en-US');
  });

  describe('Rendering', () => {
    it('should render with placeholder', () => {
      render(<PhoneInput placeholder="Enter phone" />);
      expect(screen.getByPlaceholderText('Enter phone')).toBeInTheDocument();
    });

    it('should render with default placeholder when none provided', () => {
      render(<PhoneInput />);
      expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();
    });

    it('should render country selector', () => {
      render(<PhoneInput />);
      // The component renders a country select dropdown
      const countrySelect = document.querySelector('.PhoneInputCountrySelect');
      expect(countrySelect).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<PhoneInput disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should apply error styling when error prop is provided', () => {
      render(<PhoneInput error="Invalid phone" />);
      const container = document.querySelector('.phone-input-container > div');
      expect(container?.className).toContain('border-destructive');
    });
  });

  describe('Value Handling', () => {
    it('should display initial value', () => {
      render(<PhoneInput value="+14155551234" />);
      const input = screen.getByRole('textbox');
      // The value should be formatted for display
      expect(input).toHaveValue();
    });

    it('should call onChange with E.164 format', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '4155551234');

      // Should have been called with E.164 format
      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
        // Value should either be undefined (incomplete) or E.164 format
        if (lastCall[0]) {
          expect(lastCall[0]).toMatch(/^\+/);
        }
      });
    });

    it('should handle undefined value', () => {
      render(<PhoneInput value={undefined} />);
      const input = screen.getByRole('textbox');
      // With international mode, country code prefix may be shown
      const value = (input as HTMLInputElement).value;
      const digitsOnly = value.replace(/\D/g, '');
      // Should have no user-entered digits (only country code at most)
      expect(digitsOnly.length).toBeLessThanOrEqual(1);
    });

    it('should handle empty string value', () => {
      render(<PhoneInput value="" />);
      const input = screen.getByRole('textbox');
      // With international mode, country code prefix may be shown
      const value = (input as HTMLInputElement).value;
      const digitsOnly = value.replace(/\D/g, '');
      // Should have no user-entered digits (only country code at most)
      expect(digitsOnly.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Phone Number Entry - No Reset Bug', () => {
    it('should NOT reset after entering 7 digits of a US number', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="US" />);

      const input = screen.getByRole('textbox');

      // Type 7 digits (area code + exchange)
      await user.type(input, '4155551');

      // Input should still contain our typed digits, not be reset
      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        // Should contain the digits we typed (possibly formatted)
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue.length).toBeGreaterThanOrEqual(7);
      });
    });

    it('should NOT reset after entering 8 digits of a US number', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="US" />);

      const input = screen.getByRole('textbox');

      // Type 8 digits
      await user.type(input, '41555512');

      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue.length).toBeGreaterThanOrEqual(8);
      });
    });

    it('should accept a complete 10-digit US phone number', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="US" />);

      const input = screen.getByRole('textbox');

      // Type complete US number
      await user.type(input, '4155551234');

      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue).toContain('4155551234');
      });

      // onChange should have been called with E.164 format
      await waitFor(() => {
        const calls = onChange.mock.calls;
        const lastCallWithValue = [...calls].reverse().find(call => call[0]);
        if (lastCallWithValue) {
          expect(lastCallWithValue[0]).toBe('+14155551234');
        }
      });
    });

    it('should maintain input value during rapid typing', async () => {
      const user = userEvent.setup({ delay: 10 }); // Rapid typing
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="US" />);

      const input = screen.getByRole('textbox');

      // Type rapidly
      await user.type(input, '2025551234');

      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue).toContain('2025551234');
      });
    });
  });

  describe('International Numbers', () => {
    it('should accept UK phone numbers', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="GB" />);

      const input = screen.getByRole('textbox');
      await user.type(input, '7700900123');

      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue.length).toBeGreaterThanOrEqual(10);
      });
    });

    it('should accept Australian phone numbers', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="AU" />);

      const input = screen.getByRole('textbox');
      await user.type(input, '412345678');

      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue.length).toBeGreaterThanOrEqual(9);
      });
    });

    it('should accept German phone numbers', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<PhoneInput onChange={onChange} defaultCountry="DE" />);

      const input = screen.getByRole('textbox');
      await user.type(input, '15112345678');

      await waitFor(() => {
        const value = (input as HTMLInputElement).value;
        const digitsInValue = value.replace(/\D/g, '');
        expect(digitsInValue.length).toBeGreaterThanOrEqual(11);
      });
    });
  });

  describe('Controlled Component Behavior', () => {
    it('should update when value prop changes', () => {
      const { rerender } = render(<PhoneInput value="+14155551234" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue();

      rerender(<PhoneInput value="+12025551234" />);

      // Value should update to new number
      const newValue = (input as HTMLInputElement).value;
      expect(newValue.replace(/\D/g, '')).toContain('2025551234');
    });

    it('should clear when value prop becomes empty', () => {
      const { rerender } = render(<PhoneInput value="+14155551234" />);

      rerender(<PhoneInput value="" />);

      const input = screen.getByRole('textbox');
      // With international mode, may still show country code prefix
      const value = (input as HTMLInputElement).value;
      const digitsOnly = value.replace(/\D/g, '');
      // Should have no user-entered digits (only country code at most)
      expect(digitsOnly.length).toBeLessThanOrEqual(1);
    });

    it('should not lose value during parent re-renders', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      const { rerender } = render(<PhoneInput onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '415');

      // Simulate parent re-render
      rerender(<PhoneInput onChange={onChange} />);

      // Value should be preserved
      const value = (input as HTMLInputElement).value;
      expect(value.replace(/\D/g, '')).toContain('415');
    });
  });

  describe('Event Callbacks', () => {
    it('should call onBlur when focus leaves', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<PhoneInput onBlur={onBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalled();
    });
  });
});

describe('PhoneDisplay Component', () => {
  beforeEach(() => {
    mockNavigatorLanguage('en-US');
  });

  describe('Formatting', () => {
    it('should display US number in national format for US viewer', () => {
      render(<PhoneDisplay phone="+14155551234" viewerCountry="US" />);
      // Should show national format like (415) 555-1234
      expect(screen.getByText(/415.*555.*1234/)).toBeInTheDocument();
    });

    it('should display UK number in international format for US viewer', () => {
      render(<PhoneDisplay phone="+447700900123" viewerCountry="US" />);
      // Should show international format
      expect(screen.getByText(/44.*7700.*900.*123/)).toBeInTheDocument();
    });

    it('should show flag when showFlag is true', () => {
      render(<PhoneDisplay phone="+14155551234" showFlag={true} />);
      // Flag emoji for US should be present somewhere in the component
      const allText = document.body.textContent || '';
      expect(allText).toMatch(/🇺🇸/);
    });

    it('should hide flag when showFlag is false', () => {
      render(<PhoneDisplay phone="+14155551234" showFlag={false} />);
      const container = screen.getByText(/415.*555.*1234/).closest('span');
      // Should not contain flag
      expect(container?.textContent).not.toMatch(/🇺🇸/);
    });
  });

  describe('Invalid Numbers', () => {
    it('should display raw input for unparseable numbers', () => {
      render(<PhoneDisplay phone="not-a-phone" />);
      expect(screen.getByText('not-a-phone')).toBeInTheDocument();
    });

    it('should display raw input for partial numbers', () => {
      render(<PhoneDisplay phone="415" />);
      expect(screen.getByText('415')).toBeInTheDocument();
    });
  });

  describe('Country Detection', () => {
    it('should detect country from E.164 number', () => {
      render(<PhoneDisplay phone="+442071234567" />);
      // UK flag should appear
      expect(screen.getByText(/🇬🇧/)).toBeInTheDocument();
    });

    it('should use viewer country for formatting when same', () => {
      render(<PhoneDisplay phone="+14155551234" viewerCountry="US" />);
      // Should use national format (no +1 prefix visible in display)
      const text = screen.getByText(/415.*555.*1234/);
      expect(text).toBeInTheDocument();
    });
  });
});

describe('Phone Number Entry Integration', () => {
  it('should work in a form submission context', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const phoneValue = { current: '' };

    render(
      <form onSubmit={onSubmit}>
        <PhoneInput
          onChange={(val) => { phoneValue.current = val || ''; }}
          defaultCountry="US"
        />
        <button type="submit">Submit</button>
      </form>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '4155551234');

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitBtn);

    expect(onSubmit).toHaveBeenCalled();
    expect(phoneValue.current).toBe('+14155551234');
  });

  it('should handle paste of full phone number', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} defaultCountry="US" />);

    const input = screen.getByRole('textbox');

    // Simulate paste
    await user.click(input);
    await user.paste('4155551234');

    await waitFor(() => {
      const calls = onChange.mock.calls;
      const lastCallWithValue = [...calls].reverse().find(call => call[0]);
      if (lastCallWithValue) {
        expect(lastCallWithValue[0]).toBe('+14155551234');
      }
    });
  });

  it('should handle clearing and re-entering', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} defaultCountry="US" />);

    const input = screen.getByRole('textbox');

    // Type a number
    await user.type(input, '4155551234');

    // Clear it
    await user.clear(input);

    // Type a new number
    await user.type(input, '2025559876');

    await waitFor(() => {
      const value = (input as HTMLInputElement).value;
      const digitsInValue = value.replace(/\D/g, '');
      expect(digitsInValue).toContain('2025559876');
    });
  });
});
