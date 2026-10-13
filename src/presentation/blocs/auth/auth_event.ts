import { BlocEvent } from '../../../core/bloc/bloc.base';

export type AuthEventType =
  | 'CHECK_AUTH_STATUS'
  | 'LOGIN_REQUESTED'
  | 'REGISTER_REQUESTED'
  | 'LOGOUT_REQUESTED'
  | 'CLEAR_AUTH_ERROR';

export interface CheckAuthStatusEvent extends BlocEvent {
  type: 'CHECK_AUTH_STATUS';
}

export interface LoginRequestedEvent extends BlocEvent {
  type: 'LOGIN_REQUESTED';
  email: string;
  password: string;
}

export interface RegisterRequestedEvent extends BlocEvent {
  type: 'REGISTER_REQUESTED';
  email: string;
  password: string;
}

export interface LogoutRequestedEvent extends BlocEvent {
  type: 'LOGOUT_REQUESTED';
}

export interface ClearAuthErrorEvent extends BlocEvent {
  type: 'CLEAR_AUTH_ERROR';
}

export type AuthEvent =
  | CheckAuthStatusEvent
  | LoginRequestedEvent
  | RegisterRequestedEvent
  | LogoutRequestedEvent
  | ClearAuthErrorEvent;
