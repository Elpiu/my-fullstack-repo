import { Injectable, inject } from '@angular/core';
import { Account, OAuthProvider } from 'appwrite';
import { APPWRITE_CLIENT } from '../providers/appwrite.config';
import { UserType } from '../api/user.model';
import { AppRoutesNavigation } from '../data';
import { AppUserPrefs } from '../api/user-prefs.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client = inject(APPWRITE_CLIENT);
  private readonly account = new Account(this.client);

  getCurrentUser(): Promise<UserType> {
    return this.account.get();
  }

  async signInWithGoogle(): Promise<void> {
    const origin = window.location.origin;
    await this.account.createOAuth2Session(
      OAuthProvider.Google,
      `${origin}${AppRoutesNavigation.CALLBACK}`,
      `${origin}${AppRoutesNavigation.LOGIN}`,
      ['profile'],
    );
  }

  signOut(): Promise<any> {
    return this.account.deleteSession('current');
  }

  async updatePrefs(prefs: AppUserPrefs): Promise<AppUserPrefs> {
    return await this.account
      .updatePrefs<AppUserPrefs>({ prefs })
      .then((response) => response.prefs);
  }
}
