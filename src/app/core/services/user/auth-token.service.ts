import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class authTokenService {
  private token: string | null = null;

  retrieveAuthToken(): string | null {
    return this.token;
  }

  storeAuthToken(token: string): void {
    this.token = token;
  }
  clearAuthToken(): void {
    this.token = null;
  }
}
