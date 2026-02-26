import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "tutor" | "admin";

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  changePassword: (email: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const USER_PROFILES_KEY = "user_profiles_v1";
const USER_PASSWORDS_KEY = "user_passwords_v1";
const CURRENT_USER_KEY = "user";

// Helper functions for profile storage
function getUserProfiles(): Record<string, User> {
  const stored = localStorage.getItem(USER_PROFILES_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveUserProfile(user: User) {
  const profiles = getUserProfiles();
  profiles[user.email] = user;
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
}

function getUserProfileByEmail(email: string): User | null {
  const profiles = getUserProfiles();
  return profiles[email] || null;
}

// Helper functions for password storage
function getUserPasswords(): Record<string, string> {
  const stored = localStorage.getItem(USER_PASSWORDS_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveUserPassword(email: string, password: string) {
  const passwords = getUserPasswords();
  passwords[email] = password;
  localStorage.setItem(USER_PASSWORDS_KEY, JSON.stringify(passwords));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user profile already exists
    const existingProfile = getUserProfileByEmail(email);
    
    if (existingProfile) {
      // Use existing profile data
      setUser(existingProfile);
    } else {
      // Create new user profile
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        role,
        avatar: role === "student" 
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      };

      setUser(newUser);
      saveUserProfile(newUser);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingProfile = getUserProfileByEmail(email);
    
    if (existingProfile) {
      // Use existing profile
      setUser(existingProfile);
    } else {
      // Create new user profile
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatar: role === "student"
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      };

      setUser(newUser);
      saveUserProfile(newUser);
      saveUserPassword(email, password);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUserProfile(updatedUser);
    }
  };

  const changePassword = async (email: string, newPassword: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update password
    saveUserPassword(email, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
        changePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}