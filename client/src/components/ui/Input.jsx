import './Input.css';

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    leftIcon,
    rightIcon,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className="input-container">
                {leftIcon && <span className="input-icon input-icon--left">{leftIcon}</span>}

                <input
                    type={type}
                    className={`input ${error ? 'input--error' : ''} ${leftIcon ? 'input--with-left-icon' : ''} ${rightIcon ? 'input--with-right-icon' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...props}
                />

                {rightIcon && <span className="input-icon input-icon--right">{rightIcon}</span>}
            </div>

            {error && <span className="input-error-message">{error}</span>}
            {!error && helperText && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
};

export default Input;
