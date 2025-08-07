import { useState, useEffect } from "react";

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount and validate with server
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem("azam-user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Validate with server
          try {
            const response = await fetch("/api/auth/me", {
              credentials: "include",
            });
            
            if (response.ok) {
              const currentUser = await response.json();
              setUser(currentUser);
            } else {
              // Server says user is not authenticated, clear local storage
              localStorage.removeItem("azam-user");
              setUser(null);
            }
          } catch (error) {
            // Network error, keep local user but validate later
            console.warn("Could not validate user with server:", error);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("azam-user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("azam-user", JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        console.error("Login failed:", errorData.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate server session
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of server response
      setUser(null);
      localStorage.removeItem("azam-user");
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("azam-user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      return null;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };
}
