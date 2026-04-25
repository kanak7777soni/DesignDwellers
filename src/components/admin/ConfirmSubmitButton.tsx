'use client';

import type { CSSProperties, ReactNode } from 'react';

type ConfirmSubmitButtonProps = {
  children: ReactNode;
  message: string;
  className?: string;
  style?: CSSProperties;
};

export default function ConfirmSubmitButton({
  children,
  message,
  className,
  style,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      style={style}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
