'use client';

import { ReactNode } from 'react';
import { StateMachineProvider, useAppMachine } from './StateMachineProvider';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <StateMachineProvider>
      {children}
    </StateMachineProvider>
  );
};

// Re-export hooks for convenience
export { useAppMachine };
