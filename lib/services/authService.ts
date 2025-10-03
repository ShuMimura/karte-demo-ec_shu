import { User } from '../types';
import { storage } from '../utils/storage';

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'karte_demo_users';
const CURRENT_USER_KEY = 'karte_demo_current_user';

export class AuthService {
  async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get existing users
    const users: StoredUser[] = storage.get(USERS_KEY) || [];

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    // Create new user
    const newUser: StoredUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, this should be hashed
      name,
      createdAt: new Date()
    };

    // Save user
    users.push(newUser);
    storage.set(USERS_KEY, users);

    // Set as current user
    const { password: _, ...userWithoutPassword } = newUser;
    storage.set(CURRENT_USER_KEY, userWithoutPassword);

    return userWithoutPassword;
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get existing users
    const users: StoredUser[] = storage.get(USERS_KEY) || [];

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('メールアドレスまたはパスワードが間違っています');
    }

    // Set as current user
    const { password: _, ...userWithoutPassword } = user;
    storage.set(CURRENT_USER_KEY, userWithoutPassword);

    return userWithoutPassword;
  }

  logout(): void {
    storage.remove(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    return storage.get<User>(CURRENT_USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// Singleton instance
export const authService = new AuthService();


