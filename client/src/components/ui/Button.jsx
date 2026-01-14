import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const fullWidthClass = fullWidth ? 'btn--full-width' : '';
    const loadingClass = isLoading ? 'btn--loading' : '';

    const classes = [
        baseClass,
        variantClass,
        sizeClass,
        fullWidthClass,
        loadingClass,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="btn__spinner">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </span>
            )}
            {!isLoading && leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
            <span className="btn__text">{children}</span>
            {!isLoading && rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
        </button>
    );
};

export default Button;
