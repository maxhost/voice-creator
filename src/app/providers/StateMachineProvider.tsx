'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { appMachine } from '../model/app.machine';
import type { AppContext, AppEvents } from '../model/types';

type AppMachineState = ReturnType<typeof useMachine<typeof appMachine>>[0];
type AppMachineSend = ReturnType<typeof useMachine<typeof appMachine>>[1];

type StateMachineContextValue = {
  state: AppMachineState;
  send: AppMachineSend;
  context: AppContext;
};

const StateMachineContext = createContext<StateMachineContextValue | null>(null);

type StateMachineProviderProps = {
  children: ReactNode;
};

export const StateMachineProvider = ({ children }: StateMachineProviderProps) => {
  const [state, send] = useMachine(appMachine);

  const value: StateMachineContextValue = {
    state,
    send,
    context: state.context,
  };

  return (
    <StateMachineContext.Provider value={value}>
      {children}
    </StateMachineContext.Provider>
  );
};

export const useAppMachine = (): StateMachineContextValue => {
  const context = useContext(StateMachineContext);

  if (!context) {
    throw new Error('useAppMachine must be used within StateMachineProvider');
  }

  return context;
};
