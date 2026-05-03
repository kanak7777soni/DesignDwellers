'use client';

import type { CSSProperties, ReactNode } from 'react';
import SubmitButton from './SubmitButton';

type ConfirmSubmitButtonProps = {
  children: ReactNode;
  message: string;
  pendingLabel?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function ConfirmSubmitButton({
  children,
  message,
  pendingLabel,
  className,
  style,
}: ConfirmSubmitButtonProps) {
  return (
    <SubmitButton
      className={className}
      style={style}
      confirmMessage={message}
      pendingLabel={pendingLabel}
    >
      {children}
    </SubmitButton>
  );
}
