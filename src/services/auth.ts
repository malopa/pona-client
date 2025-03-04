import { jwtDecode } from 'jwt-decode';

interface Credentials {
  email: string;
  password: string;
}

interface AuthToken {
  exp: number;
  user: {
    id: string;
    email: string;
  };
}

class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly CREDENTIALS_KEY = 'saved_credentials';

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = jwtDecode<AuthToken>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Save authentication token
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get authentication token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove authentication token
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Save credentials for "Remember Me" functionality
  static saveCredentials(credentials: Credentials): void {
    const encrypted = btoa(JSON.stringify(credentials));
    localStorage.setItem(this.CREDENTIALS_KEY, encrypted);
  }

  // Get saved credentials
  static getSavedCredentials(): Credentials | null {
    const encrypted = localStorage.getItem(this.CREDENTIALS_KEY);
    if (!encrypted) return null;

    try {
      return JSON.parse(atob(encrypted));
    } catch {
      return null;
    }
  }

  // Remove saved credentials
  static removeSavedCredentials(): void {
    localStorage.removeItem(this.CREDENTIALS_KEY);
  }

  // Logout user
  static logout(): void {
    this.removeToken();
    // Optionally keep saved credentials for next login
    // this.removeSavedCredentials();
  }
}

export default AuthService;