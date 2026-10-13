import { BehaviorSubject, Subject, Subscription } from 'rxjs';

/**
 * Base Event class/interface for BLoC
 */
export interface BlocEvent {
  type: string;
}

/**
 * Base State class/interface for BLoC
 */
export interface BlocState {
  status?: string;
}

type EventHandler<E extends BlocEvent, S extends BlocState> = (
  event: E,
  emit: (state: S) => void
) => Promise<void> | void;

/**
 * BLoC (Business Logic Component) base class.
 * Provides canonical reactive event-driven state management inspired by flutter_bloc,
 * fully implemented in TypeScript using RxJS reactive streams.
 */
export abstract class Bloc<E extends BlocEvent, S extends BlocState> {
  private readonly _stateSubject: BehaviorSubject<S>;
  private readonly _eventSubject = new Subject<E>();
  private readonly _eventSubscription: Subscription;
  private readonly _handlers = new Map<string, EventHandler<any, S>>();
  private _isClosed = false;

  constructor(initialState: S) {
    this._stateSubject = new BehaviorSubject<S>(initialState);

    // Process events sequentially
    this._eventSubscription = this._eventSubject.subscribe(async (event) => {
      if (this._isClosed) return;
      const handler = this._handlers.get(event.type);
      if (handler) {
        try {
          await handler(event, (newState: S) => this.emit(newState));
        } catch (error) {
          console.error(`[Bloc Error in ${this.constructor.name}] Handler for ${event.type} failed:`, error);
        }
      } else {
        console.warn(`[Bloc Warning in ${this.constructor.name}] No handler registered for event: ${event.type}`);
      }
    });
  }

  /**
   * Current snapshot of the BLoC state
   */
  public get state(): S {
    return this._stateSubject.getValue();
  }

  /**
   * Observable stream of states
   */
  public get state$() {
    return this._stateSubject.asObservable();
  }

  /**
   * Register an event handler for a specific event type
   */
  protected on<T extends E>(eventType: string, handler: EventHandler<T, S>): void {
    this._handlers.set(eventType, handler as EventHandler<any, S>);
  }

  /**
   * Dispatch an event to the BLoC
   */
  public add(event: E): void {
    if (this._isClosed) {
      console.warn(`[Bloc Warning] Cannot add event ${event.type} to closed ${this.constructor.name}`);
      return;
    }
    this._eventSubject.next(event);
  }

  /**
   * Emits a new state to all listeners
   */
  protected emit(newState: S): void {
    if (this._isClosed) return;
    this._stateSubject.next(newState);
  }

  /**
   * Closes the BLoC and tears down subscriptions
   */
  public close(): void {
    this._isClosed = true;
    this._eventSubscription.unsubscribe();
    this._eventSubject.complete();
    this._stateSubject.complete();
  }
}
