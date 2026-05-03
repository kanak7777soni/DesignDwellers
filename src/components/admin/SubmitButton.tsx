'use client';

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children: ReactNode;
  pendingLabel?: ReactNode;
  confirmMessage?: string;
};

export default function SubmitButton({
  children,
  pendingLabel,
  confirmMessage,
  disabled,
  style,
  onClick,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  const nextStyle: CSSProperties = {
    ...style,
    cursor: isDisabled ? 'wait' : style?.cursor,
    opacity: isDisabled ? 0.72 : style?.opacity,
  };

  return (
    <button
      {...props}
      type="submit"
      disabled={isDisabled}
      aria-busy={pending}
      style={nextStyle}
      onClick={(event) => {
        if (pending) {
          event.preventDefault();
          return;
        }

        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
    >
      {pending ? pendingLabel || 'Working...' : children}
    </button>
  );
}
