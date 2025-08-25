import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, signInAdmin, signOutAdmin } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const user = await signInAdmin(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutAdmin();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
