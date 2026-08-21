import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-[var(--text-primary)] text-[var(--surface-200)] hover:opacity-80',
    secondary: 'bg-[var(--surface-300)] text-[var(--text-primary)] hover:bg-[var(--surface-400)]',
    outline: 'border border-[var(--border-default)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-200)]',
    ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-200)] hover:text-[var(--text-primary)]',
    link: 'text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline',
};

const sizeClasses: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-11 px-6',
    icon: 'size-10',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

function buttonVariants({
    variant = 'default',
    size = 'default',
    className,
}: Pick<ButtonProps, 'variant' | 'size' | 'className'> = {}) {
    return cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-none text-[13px] font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-150 outline-none touch-manipulation focus-visible:ring-2 focus-visible:ring-[var(--border-medium)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-100)] disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
    );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { className, variant = 'default', size = 'default', type = 'button', ...props },
    ref,
) {
    return <button ref={ref} type={type} className={buttonVariants({ variant, size, className })} {...props} />;
});
