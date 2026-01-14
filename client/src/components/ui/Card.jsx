import './Card.css';

const Card = ({
    children,
    variant = 'default',
    padding = 'medium',
    hover = false,
    className = '',
    onClick,
    ...props
}) => {
    const baseClass = 'card';
    const variantClass = `card--${variant}`;
    const paddingClass = `card--padding-${padding}`;
    const hoverClass = hover ? 'card--hover' : '';
    const clickableClass = onClick ? 'card--clickable' : '';

    const classes = [
        baseClass,
        variantClass,
        paddingClass,
        hoverClass,
        clickableClass,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick} {...props}>
            {children}
        </div>
    );
};

export default Card;
