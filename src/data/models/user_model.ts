import { User } from '../../domain/entities/user.entity';

export class UserModel implements User {
  id: string;
  email: string;
  displayName?: string;
  token?: string;
  createdAt?: string;

  constructor(params: {
    id: string;
    email: string;
    displayName?: string;
    token?: string;
    createdAt?: string;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.displayName = params.displayName;
    this.token = params.token;
    this.createdAt = params.createdAt;
  }

  static fromJson(json: any): UserModel {
    return new UserModel({
      id: json.id || json.localId || '',
      email: json.email || '',
      displayName: json.displayName || json.email?.split('@')[0] || 'Gig Worker',
      token: json.token || json.idToken || '',
      createdAt: json.createdAt || new Date().toISOString(),
    });
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      token: this.token,
      createdAt: this.createdAt,
    };
  }

  toEntity(): User {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      token: this.token,
      createdAt: this.createdAt,
    };
  }
}
