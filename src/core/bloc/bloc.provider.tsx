import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Bloc, BlocEvent, BlocState } from './bloc.base';

interface BlocContextValue<B extends Bloc<any, any>> {
  bloc: B;
}

const BlocContext = createContext<any>(null);

interface BlocProviderProps<B extends Bloc<any, any>> {
  create: () => B;
  children: ReactNode;
  disposeOnUnmount?: boolean;
}

/**
 * Provides a BLoC instance down the React component tree.
 */
export function BlocProvider<B extends Bloc<any, any>>({
  create,
  children,
  disposeOnUnmount = false,
}: BlocProviderProps<B>) {
  const [bloc] = useState<B>(() => create());

  useEffect(() => {
    return () => {
      if (disposeOnUnmount) {
        bloc.close();
      }
    };
  }, [bloc, disposeOnUnmount]);

  return <BlocContext.Provider value={bloc}>{children}</BlocContext.Provider>;
}

/**
 * Hook to retrieve a BLoC from context
 */
export function useBloc<B extends Bloc<any, any>>(): B {
  const bloc = useContext(BlocContext);
  if (!bloc) {
    throw new Error('useBloc must be used within a BlocProvider');
  }
  return bloc as B;
}

/**
 * Hook to subscribe to a BLoC's reactive state stream
 */
export function useBlocState<E extends BlocEvent, S extends BlocState>(bloc: Bloc<E, S>): S {
  const [state, setState] = useState<S>(() => bloc.state);

  useEffect(() => {
    const subscription = bloc.state$.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [bloc]);

  return state;
}

interface BlocBuilderProps<E extends BlocEvent, S extends BlocState> {
  bloc: Bloc<E, S>;
  builder: (state: S) => React.ReactElement | null;
}

/**
 * Declarative component that rebuilds when the BLoC emits a new state
 */
export function BlocBuilder<E extends BlocEvent, S extends BlocState>({
  bloc,
  builder,
}: BlocBuilderProps<E, S>): React.ReactElement | null {
  const state = useBlocState(bloc);
  return builder(state);
}
