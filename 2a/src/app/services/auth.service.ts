import { Injectable } from '@angular/core';
import { User, UserRegistration } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersStorageKey = 'atharv-avhad-users';
  private readonly activeUserStorageKey = 'atharv-avhad-active-user';

  register(payload: UserRegistration): { success: boolean; message: string } {
    const users = this.getRegisteredUsers();
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === payload.email.toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: 'This email is already registered. Try logging in instead.'
      };
    }

    const nextUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...payload
    };

    localStorage.setItem(
      this.usersStorageKey,
      JSON.stringify([...users, nextUser])
    );

    return {
      success: true,
      message: 'Registration complete. You can now log in with the same details.'
    };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const user = this.getRegisteredUsers().find(
      (entry) =>
        entry.email.toLowerCase() === email.toLowerCase() &&
        entry.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password.'
      };
    }

    localStorage.setItem(this.activeUserStorageKey, JSON.stringify(user));

    return {
      success: true,
      message: `Welcome back, ${user.fullName}.`
    };
  }

  logout(): void {
    localStorage.removeItem(this.activeUserStorageKey);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  getCurrentUser(): User | null {
    const rawUser = localStorage.getItem(this.activeUserStorageKey);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  }

  getRegisteredUsers(): User[] {
    const rawUsers = localStorage.getItem(this.usersStorageKey);
    return rawUsers ? (JSON.parse(rawUsers) as User[]) : [];
  }
}
