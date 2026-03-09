/**
 * HudFormElements - Complete Form Elements Collection
 * Based exactly on https://seantheme.com/hud/form_elements.html
 *
 * این فایل شامل تمام 14 بخش فرم از سایت مرجع است
 */

import React from 'react';

const COLOR = '#29F2DF';

// ============================================
// 1. FORM CONTROLS (Default Input, Textarea, Select)
// ============================================

interface HudInputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'default' | 'sm' | 'lg';
  plaintext?: boolean;
}

export const HudInput: React.FC<HudInputProps> = ({
  type = 'text',
  placeholder = 'Default input',
  value,
  onChange,
  disabled = false,
  readonly = false,
  size = 'default',
  plaintext = false,
}) => {
  const sizeStyles = {
    default: { padding: '0.375rem 0.75rem', fontSize: '1rem' },
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '1.25rem' },
  };

  const baseStyle: React.CSSProperties = plaintext
    ? {
        display: 'block',
        width: '100%',
        padding: '0.375rem 0',
        marginBottom: 0,
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#fff',
        backgroundColor: 'transparent',
        border: 'solid transparent',
        borderWidth: '1px 0',
      }
    : {
        display: 'block',
        width: '100%',
        ...sizeStyles[size],
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backgroundClip: 'padding-box',
        border: `1px solid ${COLOR}`,
        borderRadius: '0.25rem',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readonly}
      className={plaintext ? 'form-control-plaintext' : 'form-control'}
      style={{
        ...baseStyle,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : readonly ? 'default' : 'text',
        outline: 'none',
        fontFamily: 'inherit',
      }}
      onFocus={(e) => {
        if (!disabled && !readonly && !plaintext) {
          e.currentTarget.style.borderColor = COLOR;
          e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${COLOR}40`;
        }
      }}
      onBlur={(e) => {
        if (!plaintext) {
          e.currentTarget.style.borderColor = COLOR;
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    />
  );
};

// ============================================
// TEXTAREA
// ============================================

interface HudTextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
}

export const HudTextarea: React.FC<HudTextareaProps> = ({
  placeholder = 'Textarea',
  value,
  onChange,
  disabled = false,
  rows = 3,
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className="form-control"
      style={{
        display: 'block',
        width: '100%',
        padding: '0.375rem 0.75rem',
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backgroundClip: 'padding-box',
        border: `1px solid ${COLOR}`,
        borderRadius: '0.25rem',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        outline: 'none',
        fontFamily: 'inherit',
        resize: 'vertical',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = COLOR;
          e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${COLOR}40`;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLOR;
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
};

// ============================================
// SELECT
// ============================================

interface HudSelectProps {
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

export const HudSelect: React.FC<HudSelectProps> = ({
  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ],
  value,
  onChange,
  disabled = false,
  size = 'default',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sizeStyles = {
    default: { padding: '0.375rem 2.25rem 0.375rem 0.75rem', fontSize: '1rem' },
    sm: { padding: '0.25rem 2.25rem 0.25rem 0.5rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 2.25rem 0.5rem 1rem', fontSize: '1.25rem' },
  };

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '100%',
      }}
    >
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          display: 'block',
          width: '100%',
          ...sizeStyles[size],
          fontWeight: 400,
          lineHeight: 1.5,
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backgroundClip: 'padding-box',
          border: `1px solid ${COLOR}`,
          borderRadius: '0.25rem',
          transition: 'all 0.15s ease-in-out',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          textAlign: 'left',
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = COLOR;
            e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${COLOR}40`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = COLOR;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {selectedOption?.label || 'Select option'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: 'rgba(10, 18, 37, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `2px solid ${COLOR}`,
            borderRadius: '0px',
            boxShadow: `0 0 20px ${COLOR}40, 0 0 40px ${COLOR}20, inset 0 0 20px ${COLOR}15, inset 0 0 40px rgba(41, 242, 223, 0.05)`,
            zIndex: 1001,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange?.({ target: { value: option.value } } as any);
                setIsOpen(false);
              }}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                backgroundColor: value === option.value ? `${COLOR}20` : 'transparent',
                borderLeft: value === option.value ? `3px solid ${COLOR}` : '3px solid transparent',
                color: value === option.value ? COLOR : '#fff',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${COLOR}20`;
                e.currentTarget.style.boxShadow = `inset 0 0 15px ${COLOR}30, 0 0 10px ${COLOR}40`;
                e.currentTarget.style.borderLeft = `3px solid ${COLOR}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  value === option.value ? `${COLOR}20` : 'transparent';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderLeft =
                  value === option.value ? `3px solid ${COLOR}` : '3px solid transparent';
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 5. RANGE INPUT
// ============================================

interface HudRangeProps {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const HudRange: React.FC<HudRangeProps> = ({
  min = 0,
  max = 100,
  value = 50,
  onChange,
  disabled = false,
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="form-range"
      style={
        {
          width: '100%',
          height: '0.5rem',
          padding: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          outline: 'none',
          WebkitAppearance: 'none',
          appearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        } as any
      }
    />
  );
};

// ============================================
// 6. CHECKBOXES
// ============================================

interface HudCheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const HudCheckbox: React.FC<HudCheckboxProps> = ({
  label = 'Checkbox',
  checked = false,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      className="form-check"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-check-input"
        style={
          {
            width: '1rem',
            height: '1rem',
            marginTop: 0,
            verticalAlign: 'top',
            backgroundColor: checked ? COLOR : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${COLOR}`,
            borderRadius: '0.25rem',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease-in-out',
            opacity: disabled ? 0.5 : 1,
          } as any
        }
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${COLOR}40`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <label
        className="form-check-label"
        style={{
          color: '#fff',
          fontSize: '1rem',
          userSelect: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
      </label>
    </div>
  );
};

// ============================================
// 7. RADIOS
// ============================================

interface HudRadioProps {
  label?: string;
  name?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const HudRadio: React.FC<HudRadioProps> = ({
  label = 'Radio',
  name = 'radio',
  checked = false,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      className="form-check"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-check-input"
        style={
          {
            width: '1rem',
            height: '1rem',
            marginTop: 0,
            verticalAlign: 'top',
            backgroundColor: checked ? COLOR : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${COLOR}`,
            borderRadius: '50%',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease-in-out',
            opacity: disabled ? 0.5 : 1,
          } as any
        }
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${COLOR}40`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <label
        className="form-check-label"
        style={{
          color: '#fff',
          fontSize: '1rem',
          userSelect: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
      </label>
    </div>
  );
};

// ============================================
// 8. SWITCHES
// ============================================

interface HudSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const HudSwitch: React.FC<HudSwitchProps> = ({
  label = 'Toggle switch',
  checked = false,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      className="form-check form-switch"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
    >
      <div style={{ position: 'relative', display: 'inline-block', width: '2rem', height: '1rem' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="form-check-input"
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0,
          }}
        />
        <span
          style={{
            position: 'absolute',
            cursor: disabled ? 'not-allowed' : 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: checked ? COLOR : 'rgba(255, 255, 255, 0.25)',
            transition: 'all 0.15s ease-in-out',
            borderRadius: '2rem',
            border: `1px solid ${COLOR}`,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <span
            style={{
              position: 'absolute',
              content: '""',
              height: '0.75rem',
              width: '0.75rem',
              left: checked ? '1.125rem' : '0.125rem',
              bottom: '0.0625rem',
              backgroundColor: '#fff',
              transition: 'all 0.15s ease-in-out',
              borderRadius: '50%',
            }}
          />
        </span>
      </div>
      <label
        className="form-check-label"
        style={{
          color: '#fff',
          fontSize: '1rem',
          userSelect: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
      </label>
    </div>
  );
};

// ============================================
// 9. FILE BROWSER
// ============================================

interface HudFileProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  multiple?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

export const HudFile: React.FC<HudFileProps> = ({
  onChange,
  disabled = false,
  multiple = false,
  size = 'default',
}) => {
  const sizeStyles = {
    default: { padding: '0.375rem 0.75rem', fontSize: '1rem' },
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
    lg: { padding: '0.5rem 1rem', fontSize: '1.25rem' },
  };

  return (
    <input
      type="file"
      multiple={multiple}
      onChange={onChange}
      disabled={disabled}
      className="form-control"
      style={{
        display: 'block',
        width: '100%',
        ...sizeStyles[size],
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backgroundClip: 'padding-box',
        border: `1px solid ${COLOR}`,
        borderRadius: '0.25rem',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = COLOR;
          e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${COLOR}40`;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLOR;
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
};

// ============================================
// 10. FORM GRID
// ============================================

interface HudFormGridProps {
  children: React.ReactNode;
}

export const HudFormGrid: React.FC<HudFormGridProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// 11. HELP TEXT
// ============================================

interface HudFormHelpTextProps {
  children: React.ReactNode;
  muted?: boolean;
}

export const HudFormHelpText: React.FC<HudFormHelpTextProps> = ({ children, muted = true }) => {
  return (
    <div
      className="form-text"
      style={{
        marginTop: '0.25rem',
        fontSize: '0.875rem',
        color: muted ? 'rgba(255, 255, 255, 0.6)' : '#fff',
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// 12. INPUT GROUP
// ============================================

interface HudInputGroupProps {
  prepend?: string;
  append?: string;
  children: React.ReactNode;
}

export const HudInputGroup: React.FC<HudInputGroupProps> = ({ prepend, append, children }) => {
  const addonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.375rem 0.75rem',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#fff',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    backgroundColor: 'rgba(41, 242, 223, 0.1)',
    border: `1px solid ${COLOR}`,
    borderRadius: '0.25rem',
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {prepend && (
        <span
          style={{
            ...addonStyle,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 0,
          }}
        >
          {prepend}
        </span>
      )}
      <div style={{ flex: 1 }}>{children}</div>
      {append && (
        <span
          style={{
            ...addonStyle,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: 0,
          }}
        >
          {append}
        </span>
      )}
    </div>
  );
};

// ============================================
// 13. VALIDATION (Invalid Feedback)
// ============================================

interface HudFormFeedbackProps {
  children: React.ReactNode;
  type?: 'invalid' | 'valid';
  tooltip?: boolean;
}

export const HudFormFeedback: React.FC<HudFormFeedbackProps> = ({
  children,
  type = 'invalid',
  tooltip = false,
}) => {
  const color = type === 'invalid' ? '#EF3EF1' : '#1C7FA6';

  const baseStyle: React.CSSProperties = {
    width: '100%',
    marginTop: '0.25rem',
    fontSize: '0.875rem',
    color: color,
  };

  const tooltipStyle: React.CSSProperties = tooltip
    ? {
        position: 'absolute',
        top: '100%',
        zIndex: 5,
        display: 'block',
        maxWidth: '100%',
        padding: '0.25rem 0.5rem',
        marginTop: '0.1rem',
        fontSize: '0.875rem',
        color: '#fff',
        backgroundColor: color,
        borderRadius: '0.25rem',
      }
    : {};

  return (
    <div className={`${type}-feedback`} style={{ ...baseStyle, ...tooltipStyle }}>
      {children}
    </div>
  );
};

// ============================================
// VALIDATION INPUT (with validation state)
// ============================================

interface HudInputValidatedProps extends HudInputProps {
  isValid?: boolean;
  isInvalid?: boolean;
  feedback?: string;
  feedbackTooltip?: boolean;
  style?: React.CSSProperties;
}

export const HudInputValidated: React.FC<HudInputValidatedProps> = ({
  isValid,
  isInvalid,
  feedback,
  feedbackTooltip = false,
  style,
  size,
  plaintext,
  ...props
}) => {
  const borderColor = isInvalid ? '#EF3EF1' : isValid ? '#1C7FA6' : COLOR;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        {...props}
        type={props.type || 'text'}
        className={plaintext ? 'form-control-plaintext' : 'form-control'}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.375rem 0.75rem',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backgroundClip: 'padding-box',
          border: `1px solid ${borderColor}`,
          borderRadius: '0.25rem',
          transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
          outline: 'none',
          fontFamily: 'inherit',
          paddingRight: isValid || isInvalid ? '2.5rem' : undefined,
          ...style,
        }}
      />
      {feedback && (
        <HudFormFeedback type={isInvalid ? 'invalid' : 'valid'} tooltip={feedbackTooltip}>
          {feedback}
        </HudFormFeedback>
      )}
    </div>
  );
};

// ============================================
// VALIDATION SELECT
// ============================================

interface HudSelectValidatedProps extends HudSelectProps {
  isValid?: boolean;
  isInvalid?: boolean;
  feedback?: string;
  feedbackTooltip?: boolean;
  style?: React.CSSProperties;
}

export const HudSelectValidated: React.FC<HudSelectValidatedProps> = ({
  isValid,
  isInvalid,
  feedback,
  feedbackTooltip = false,
  style,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const borderColor = isInvalid ? '#EF3EF1' : isValid ? '#1C7FA6' : COLOR;

  const selectedOption = (props.options || []).find((opt) => opt.value === props.value);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '100%',
        }}
      >
        <button
          onClick={() => !props.disabled && setIsOpen(!isOpen)}
          disabled={props.disabled}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.375rem 2.25rem 0.375rem 0.75rem',
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backgroundClip: 'padding-box',
            border: `1px solid ${borderColor}`,
            borderRadius: '0.25rem',
            transition: 'all 0.15s ease-in-out',
            outline: 'none',
            fontFamily: 'inherit',
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            ...style,
          }}
          onFocus={(e) => {
            if (!props.disabled) {
              e.currentTarget.style.borderColor = borderColor;
              e.currentTarget.style.boxShadow = `0 0 0 0.2rem ${borderColor}40`;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {selectedOption?.label || 'Select option'}
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: 'rgba(10, 18, 37, 0.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `2px solid ${borderColor}`,
              borderRadius: '0px',
              boxShadow: `0 0 20px ${borderColor}40, 0 0 40px ${borderColor}20, inset 0 0 20px ${borderColor}15, inset 0 0 40px rgba(41, 242, 223, 0.05)`,
              zIndex: 1001,
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {(
              props.options || [
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
                { value: '3', label: 'Option 3' },
              ]
            ).map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  props.onChange?.({ target: { value: option.value } } as any);
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.75rem',
                  cursor: 'pointer',
                  backgroundColor:
                    props.value === option.value ? `${borderColor}20` : 'transparent',
                  borderLeft:
                    props.value === option.value
                      ? `3px solid ${borderColor}`
                      : '3px solid transparent',
                  color: props.value === option.value ? borderColor : '#fff',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${borderColor}20`;
                  e.currentTarget.style.boxShadow = `inset 0 0 15px ${borderColor}30, 0 0 10px ${borderColor}40`;
                  e.currentTarget.style.borderLeft = `3px solid ${borderColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    props.value === option.value ? `${borderColor}20` : 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderLeft =
                    props.value === option.value
                      ? `3px solid ${borderColor}`
                      : '3px solid transparent';
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {feedback && (
        <HudFormFeedback type={isInvalid ? 'invalid' : 'valid'} tooltip={feedbackTooltip}>
          {feedback}
        </HudFormFeedback>
      )}
    </div>
  );
};

// ============================================
// VALIDATION TEXTAREA
// ============================================

interface HudTextareaValidatedProps extends HudTextareaProps {
  isValid?: boolean;
  isInvalid?: boolean;
  feedback?: string;
  feedbackTooltip?: boolean;
  style?: React.CSSProperties;
}

export const HudTextareaValidated: React.FC<HudTextareaValidatedProps> = ({
  isValid,
  isInvalid,
  feedback,
  feedbackTooltip = false,
  style,
  ...props
}) => {
  const borderColor = isInvalid ? '#EF3EF1' : isValid ? '#1C7FA6' : COLOR;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <textarea
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        rows={props.rows || 3}
        className="form-control"
        style={{
          display: 'block',
          width: '100%',
          padding: '0.375rem 0.75rem',
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backgroundClip: 'padding-box',
          border: `1px solid ${borderColor}`,
          borderRadius: '0.25rem',
          transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
          outline: 'none',
          fontFamily: 'inherit',
          resize: 'vertical',
          ...style,
        }}
      />
      {feedback && (
        <HudFormFeedback type={isInvalid ? 'invalid' : 'valid'} tooltip={feedbackTooltip}>
          {feedback}
        </HudFormFeedback>
      )}
    </div>
  );
};
